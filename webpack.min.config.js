var path = require("path");
var webpack = require("webpack");
module.exports = {
    entry: {
        script: "./src/index.js"
    },
    output: {
        path: path.resolve("./build"),
        filename: "vim.min.js",
        publicPath: "/build"
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};