import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import { defineDocs, defineConfig } from "fumadocs-mdx/config";

export const react = defineDocs({
  dir: "content/react",
});

export const css = defineDocs({
  dir: "content/css",
});

export const deeplearnning = defineDocs({
  dir: "content/deeplearnning",
});

export const blog = defineDocs({
  dir: "content/blog",
});

export default defineConfig({
  mdxOptions: {
    remarkPlugins: [remarkMath],
    // Place it at first so that it won't be changed by syntax highlighter
    rehypePlugins: (v) => [rehypeKatex, ...v],
  },
});
