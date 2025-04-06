import { react, deeplearnning, blog } from "@/.source";
import { loader } from "fumadocs-core/source";

export const reactSource = loader({
  baseUrl: "/docs/react",
  source: react.toFumadocsSource(),
});

export const deeplearnningSource = loader({
  baseUrl: "/docs/deeplearnning",
  source: deeplearnning.toFumadocsSource(),
});

export const blogSource = loader({
  baseUrl: "/docs/blog",
  source: blog.toFumadocsSource(),
});
