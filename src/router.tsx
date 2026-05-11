import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function getGithubPagesBasepath() {
  const baseUrl = import.meta.env.BASE_URL;

  if (!baseUrl || baseUrl === "/" || baseUrl === "./") {
    return undefined;
  }

  return baseUrl.replace(/\/$/, "");
}

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    basepath: getGithubPagesBasepath(),
  });

  return router;
};
