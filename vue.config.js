// vue.config.js
module.exports = {
    devServer: {
        proxy: {
            "/api": {
                target: "https://api.sofiatransport.com",
                pathRewrite: {"^/api" : ""},
            },
            "/routes-changes": {
                target: "https://www.sofiatraffic.bg",
                pathRewrite: {"^/routes-changes" : ""},
            }
        },
    },
    runtimeCompiler: true
}