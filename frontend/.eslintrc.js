module.exports = {
    extends: [
        "eslint:recommended",
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:prettier/recommended",
    ],
    parser: "@typescript-eslint/parser",
    plugins: ["@typescript-eslint"],
    env: {
        browser: true,
        es2021: true,
    },
    settings: {
        react: {
            version: "detect",
        },
    },
    ignorePatterns: [".eslintrc.js"],
    rules: {
        "@typescript-eslint/interface-name-prefix": "off",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/explicit-module-boundary-types": "off",
        "@typescript-eslint/no-explicit-any": "warn",
        "@typescript-eslint/no-empty-function": "off",
        "react/prop-types": "off",
        "@typescript-eslint/no-unused-vars": ["warn", {varsIgnorePattern: "_.*", argsIgnorePattern: "_.*", caughtErrorsIgnorePattern: "_.*", "destructuredArrayIgnorePattern": "_.*"} ],
        "prettier/prettier": ["warn", require("./prettier.config")],
    },
};
