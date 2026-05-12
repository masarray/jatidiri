import React, { useEffect, useMemo, useState } from "react";

type Params = Record<string, string | number | boolean | undefined>;

type RouteConfig = {
  component?: React.ComponentType<any>;
  notFoundComponent?: React.ComponentType<any>;
  errorComponent?: React.ComponentType<any>;
  head?: () => unknown;
  [key: string]: unknown;
};

type SimpleRoute = {
  id?: string;
  path?: string;
  fullPath?: string;
  options: RouteConfig;
  children?: Record<string, SimpleRoute>;
  update: (meta: Record<string, unknown>) => SimpleRoute;
  _addFileChildren: (children: Record<string, SimpleRoute>) => SimpleRoute;
  _addFileTypes: <T>() => SimpleRoute;
};

type SimpleRouter = {
  routeTree: SimpleRoute;
  scrollRestoration?: boolean;
  basepath?: string;
  invalidate: () => void;
};

function makeRoute(path: string, options: RouteConfig): SimpleRoute {
  const route: SimpleRoute = {
    path,
    options,
    update(meta) {
      Object.assign(route, meta);
      return route;
    },
    _addFileChildren(children) {
      route.children = children;
      return route;
    },
    _addFileTypes<T>() {
      return route;
    },
  };

  return route;
}

function basePath() {
  const base = import.meta.env.BASE_URL || "/";
  if (base === "/" || base === "./") return "";
  return base.replace(/\/$/, "");
}

function stripBase(pathname: string) {
  const base = basePath();
  let path = pathname;

  if (base && path.startsWith(base)) {
    path = path.slice(base.length) || "/";
  }

  if (!path.startsWith("/")) path = `/${path}`;
  if (path.endsWith("/index.html")) path = path.replace(/\/index\.html$/, "/");
  return path || "/";
}

function withBase(path: string) {
  const base = basePath();
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${base}${normalized}` || "/";
}

function buildPath(to: string, params?: Params) {
  let path = to;

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      path = path.replace(`$${key}`, encodeURIComponent(String(value ?? "")));
    }
  }

  return path;
}

function navigateTo(path: string) {
  const finalPath = withBase(path);
  window.history.pushState({}, "", finalPath);
  window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
  window.dispatchEvent(new PopStateEvent("popstate"));
}

function currentRoutePath() {
  return stripBase(window.location.pathname);
}

function routeByPath(children: Record<string, SimpleRoute> | undefined, path: string) {
  if (!children) return undefined;

  if (path === "/") return children.IndexRoute;
  if (path === "/identity") return children.IdentityRoute;
  if (path === "/completion") return children.CompletionRoute;
  if (path === "/result") return children.ResultRoute;
  if (path === "/transition") return children.TransitionRoute;
  if (path.startsWith("/assessment/")) return children.AssessmentSessionRoute;
  if (path.startsWith("/instruction/")) return children.InstructionSessionRoute;

  return undefined;
}

export function createFileRoute(path: string) {
  return (options: RouteConfig) => makeRoute(path, options);
}

export function createRootRoute(options: RouteConfig) {
  return makeRoute("__root__", options);
}

export function createRouter(options: { routeTree: SimpleRoute; scrollRestoration?: boolean; basepath?: string; [key: string]: unknown }) {
  const router: SimpleRouter = {
    ...options,
    invalidate() {
      window.dispatchEvent(new PopStateEvent("popstate"));
    },
  };

  return router;
}

export function RouterProvider({ router }: { router: SimpleRouter }) {
  const [path, setPath] = useState(() => currentRoutePath());

  useEffect(() => {
    const onPopState = () => setPath(currentRoutePath());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const route = useMemo(() => routeByPath(router.routeTree.children, path), [router.routeTree.children, path]);
  const Component = route?.options.component;
  const NotFound = router.routeTree.options.notFoundComponent;

  if (Component) return <Component />;
  if (NotFound) return <NotFound />;

  return (
    <main className="grid min-h-dvh place-items-center px-5 text-center">
      <div>
        <h1 className="text-2xl font-semibold">Halaman tidak ditemukan</h1>
        <button
          type="button"
          onClick={() => navigateTo("/")}
          className="mt-5 rounded-xl bg-primary px-4 py-2 text-sm font-medium text-primary-foreground"
        >
          Kembali ke beranda
        </button>
      </div>
    </main>
  );
}

export function useNavigate() {
  return (target: { to: string; params?: Params } | string) => {
    if (typeof target === "string") {
      navigateTo(target);
      return;
    }

    navigateTo(buildPath(target.to, target.params));
  };
}

export function useParams(_options?: { from?: string }) {
  const path = currentRoutePath();
  const parts = path.split("/").filter(Boolean);

  if ((parts[0] === "assessment" || parts[0] === "instruction") && parts[1]) {
    return { session: decodeURIComponent(parts[1]) };
  }

  return {};
}

export function useRouter() {
  return {
    invalidate() {
      window.dispatchEvent(new PopStateEvent("popstate"));
    },
  };
}

export function Outlet() {
  return null;
}

type LinkProps = Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & {
  to: string;
  params?: Params;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { to, params, onClick, children, ...props },
  ref,
) {
  const path = buildPath(to, params);
  const href = withBase(path);

  return (
    <a
      ref={ref}
      href={href}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.altKey ||
          event.ctrlKey ||
          event.shiftKey ||
          props.target === "_blank"
        ) {
          return;
        }

        event.preventDefault();
        navigateTo(path);
      }}
      {...props}
    >
      {children}
    </a>
  );
});
