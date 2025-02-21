import { defineDocs, defineConfig } from "fumadocs-mdx/config";

export const react = defineDocs({
  dir: "content/react",
});

export const css = defineDocs({
  dir: "content/css",
});

export default defineConfig({
  mdxOptions: {
    // MDX options
  },
});
