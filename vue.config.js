// vue.config.js
module.exports = {
    devServer: {
        proxy: {
            "/api/": {
                target: "https://api.sofiatransport.com",
                pathRewrite: {"^/api/" : "/"}
            },
            "/changes-in-routes-api/": {
                target: "https://www.sofiatraffic.bg",
                pathRewrite: {"^/changes-in-routes-api/" : "/bg/api/v1/cms/route-changes/"}
            }
        }
    }
}