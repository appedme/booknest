import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),{
    rules : {
      "no-unused-vars": "off", // Disable no-unused-vars rule
      "@typescript-eslint/no-unused-vars": "off", // Disable TypeScript's no-unused-vars
      "@typescript-eslint/no-explicit-any": "off", // Allow explicit any types
      "@typescript-eslint/no-require-imports": "off", // Allow require imports
      "react/no-unescaped-entities": "off", // Allow unescaped entities in JSX
      "@next/next/no-img-element": "off", // Allow img elements instead of Next.js Image
    }
  }
];

export default eslintConfig;
