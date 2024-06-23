module.exports = {
  extends: ["plugin:@typescript-eslint/recommended", "prettier"],
  overrides: [],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
  },
  plugins: ["@typescript-eslint", "import"],
  rules: {
    "prefer-arrow-callback": ["error"],
    "linebreak-style": ["error", "unix"],
    "@typescript-eslint/no-unused-vars": ["error"],
    "no-console": "off",
    "import/newline-after-import": ["error", { count: 1 }],
    "import/no-anonymous-default-export": [
      "error",
      {
        allowArray: false,
        allowArrowFunction: false,
        allowAnonymousClass: false,
        allowAnonymousFunction: false,
        allowCallExpression: true, // The true value here is for backward compatibility
        allowNew: false,
        allowLiteral: false,
        allowObject: true,
      },
    ],
    "no-return-assign": ["error", "except-parens"],
    "import/no-extraneous-dependencies": ["off"],
    "import/no-unresolved": "off",
    "import/prefer-default-export": "off",
  },
};
