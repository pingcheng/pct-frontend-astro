export default {
    "printWidth": 80,
    "semi": true,
    "singleQuote": false,
    "tabWidth": 4,
    "useTabs": false,
    "plugins": ["prettier-plugin-astro"],
    "overrides": [
        {
            "files": "*.astro",
            "options": {
                "parser": "astro"
            }
        }
    ]
}
