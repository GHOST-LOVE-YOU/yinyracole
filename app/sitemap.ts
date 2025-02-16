import { getBlogPosts } from "@/lib/searchPost/utils";

export const baseUrl =
  process.env.NEXT_PUBLIC_BASEURL || "http://localhost:3000";

export default async function sitemap() {
  const blogs = getBlogPosts().map(
    (post): { url: string; lastModified: any } => ({
      url: `${baseUrl}/blog/${post.slug}`,
      lastModified: post.metadata.publishedAt,
    }),
  );

  const routes = ["", "/blog"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString().split("T")[0],
  }));

  return [...routes, ...blogs];
}
