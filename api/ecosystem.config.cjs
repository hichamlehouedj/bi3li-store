module.exports = {
    apps : [
        {
            name: "GoldenCageApi",
            script: "./dist/index.js",
            watch: true,
            env: {
                "NODE_ENV": "production",
                "PORT": 7029
            },
            production_env: {
                "NODE_ENV": "production",
                "PORT": 7029
            },
        }
    ]
}