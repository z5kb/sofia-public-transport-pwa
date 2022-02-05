// vue.config.js
// module.exports = {
//     devServer: {
//         proxy: {
//             "/api": {
//                 target: "https://api.sofiatransport.com",
//                 pathRewrite: {"^/api" : ""},
//             },
//             "/routes-changes": {
//                 target: "https://www.sofiatraffic.bg",
//                 pathRewrite: {"^/routes-changes" : ""},
//             }
//         },
//     },
//     runtimeCompiler: true
// }

module.exports = {
    devServer: {
        proxy: {
            "/one": {
                target: "https://api.sofiatransport.com",
                pathRewrite: {"^/one": ""},
            },
            "/two": {
                target: "https://sofiatraffic.bg",
                pathRewrite: {"^/two": ""},
            },
        },
    },
    runtimeCompiler: true
}
