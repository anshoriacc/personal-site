import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  globalIgnores([
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  // {
  //   files: ["**/*.ts", "**/*.tsx"],
  //   rules: {
  //     "@typescript-eslint/no-explicit-any": "off",
  //     "@typescript-eslint/no-unused-vars": [
  //       "warn",
  //       {
  //         args: "after-used",
  //         argsIgnorePattern: "^_",
  //         varsIgnorePattern: "^_",
  //       },
  //     ],
  //   },
  // },
]);

export default eslintConfig;
