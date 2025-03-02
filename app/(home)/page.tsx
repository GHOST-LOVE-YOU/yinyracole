import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex flex-1 flex-col justify-center text-center">
      <h1 className="mb-4 text-2xl font-bold">Hello World</h1>
      <p className="text-fd-muted-foreground">
        You can open{" "}
        <Link
          href="/docs/react"
          className="text-fd-foreground font-semibold underline"
        >
          /docs/react
        </Link>{" "}
        and see the documentation.
      </p>
      <p className="text-fd-muted-foreground">
        This site contains translated content from paid sources for personal
        study only. We don{"'"}t promote it publicly and plan to remove content
        after completion. Due to public deployment without authentication, if
        you find your rights have been infringed, please contact
        kamado@nezuko.me for immediate removal. We respect intellectual property
        rights and will handle any concerns promptly.
      </p>
    </main>
  );
}
