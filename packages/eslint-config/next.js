module.exports = {
  extends: ["next/core-web-vitals", "eslint:recommended"],
  rules: {
    "@next/next/no-img-element": "off",
    "no-unused-vars": "warn",
    "no-console": ["warn", { allow: ["warn", "error"] }]
  }
};
