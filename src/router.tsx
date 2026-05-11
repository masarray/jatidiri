import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

function getGithubPagesBasepath() {
  const baseUrl = import.meta.env.BASE_URL;

  if (!baseUrl || baseUrl === "/" || baseUrl === "./") {
    return undefined;
  }

  return baseUrl.replace(/\/$/, "");
}

export const getRouter = () =>
  createRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: false,
    defaultPreloadStaleTime: 0,
    basepath: getGithubPagesBasepath(),
  });
