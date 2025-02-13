import { dirname } from "path";
import { fileURLToPath } from "url";

import { FlatCompat } from "@eslint/eslintrc";
import nextPlugin from "@next/eslint-plugin-next";
import prettierConfig from "eslint-config-prettier";
import importPlugin from "eslint-plugin-import";
import tailwindPlugin from "eslint-plugin-tailwindcss";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  {
    ignores: ["components/ui/**/*"],
  },
  // Next.js 配置
  ...compat.config(nextPlugin.configs["core-web-vitals"]),
  ...compat.config(nextPlugin.configs.recommended),
  // Tailwind CSS 配置
  ...compat.config(tailwindPlugin.configs.recommended),
  // Prettier 配置
  ...compat.config(prettierConfig),
  // 通用规则
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "import/order": [
        "error",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            ["parent", "sibling"],
            "index",
            "object",
          ],
          "newlines-between": "always",
          pathGroups: [
            {
              pattern: "@app/**",
              group: "external",
              position: "after",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  // 针对 MDX 文件的配置
  ...compat.extends("plugin:mdx/recommended"),
  {
    files: ["**/*.mdx"],
    languageOptions: {
      globals: {
        Sandpack: true, // 正确添加 Sandpack 为全局变量
      },
    },
  },
];

export default eslintConfig;
