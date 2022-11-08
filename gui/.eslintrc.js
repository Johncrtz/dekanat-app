module.exports = {
    rules: {
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",
    },
    extends: [
        "../.eslintrc.js",
        "next/core-web-vitals",
        "next",
    ]
}
