import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
    {
        files: ["**/*.{js,mjs,cjs}"],

        plugins: {
            js,
        },

        extends: ["js/recommended"],

        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",

            globals: {
                ...globals.node,
            },
        },

        rules: {
            "no-unused-vars": "warn",
            "no-console": "off",
            "no-undef": "error",
            "no-var": "error",
            "prefer-const": "warn",
            eqeqeq: ["error", "always"],
        },
    },
    eslintConfigPrettier,
]);
