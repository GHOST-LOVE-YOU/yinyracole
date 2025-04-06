import { blogSource } from "@/lib/source";
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from "fumadocs-ui/page";
import { getGithubLastEdit } from "fumadocs-core/server";
import { notFound } from "next/navigation";
import defaultMdxComponents from "fumadocs-ui/mdx";

import { Accordion, Accordions } from "fumadocs-ui/components/accordion";
import { Sandpack } from "@codesandbox/sandpack-react";
import PdfViewer from "@/components/pdf-viewer";

export default async function Page(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);
  if (!page) notFound();

  const MDX = page.data.body;

  const time = await getGithubLastEdit({
    owner: "GHOST-LOVE-YOU",
    repo: "yinyracole",
    path: `content/blog/${page.file.path}`,
  });

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
      {...(time ? { lastUpdate: new Date(time) } : {})}
      footer={{enabled: false} }
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX
          components={{
            ...defaultMdxComponents,
            Accordions,
            Accordion,
            Sandpack,
            PdfViewer,
          }}
        />
      </DocsBody>
    </DocsPage>
  );
}

export async function generateStaticParams() {
  return blogSource.generateParams();
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[] }>;
}) {
  const params = await props.params;
  const page = blogSource.getPage(params.slug);
  if (!page) notFound();

  return {
    title: page.data.title,
    description: page.data.description,
  };
}
