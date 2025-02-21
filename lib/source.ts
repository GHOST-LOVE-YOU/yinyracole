import { react } from "@/.source";
import { loader } from "fumadocs-core/source";

export const source = loader({
  baseUrl: "/docs/react",
  source: react.toFumadocsSource(),
});
