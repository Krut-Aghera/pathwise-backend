import js from "@eslint/js";
import globals from "globals";
import eslintConfigPrettier from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

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
            "no-undef": "error",
            "no-unreachable": "error",
            "no-unreachable-loop": "error",

            "no-unused-vars": [
                "warn",
                {
                    argsIgnorePattern: "^next$",
                    ignoreRestSiblings: true,
                },
            ],

            "prefer-const": "error",
            "no-var": "error",

            eqeqeq: ["error", "always"],
            curly: ["error", "all"],

            "no-return-await": "error",
            "no-console": "off",
        },
    },

    eslintConfigPrettier,
]);
