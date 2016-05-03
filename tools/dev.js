const express = require('express');
const app = express();
const webpackConfig = require('./webpack.config');
const webpack = require("webpack");
const mocks = require('./mocks');
const PORT = 3000;
const fs = require('fs');
const path = require('path');
const webpackMiddleware = require('webpack-dev-middleware');
const compiler = webpack(webpackConfig);


app.use(webpackMiddleware(compiler, {
    stats: {
       colors: true
   },
   publicPath: webpackConfig.output.publicPath
}));

app.use(require("webpack-hot-middleware")(compiler, {
    log: console.log, path: '/__webpack_hmr'
}));

for (var url in mocks) {
    if (mocks.hasOwnProperty(url)) {
        app.get(url, mocks[url]);
    }
}

app.get('*', function(req, res) {
    fs.readFile(
        path.join(__dirname, req.path),
        { encoding: 'utf8' },
        (err, content) => {
            if (err) {
                throw err;
            }
            res.send(content);
        }
    )
});

app.listen(PORT, () => {
    console.log(`app listen on port ${PORT}`);
});
