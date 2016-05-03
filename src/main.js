require('./libs/extJs/resources/css/ext-all.css');

const app = require('./app');

var bootstrap = function() {
    app.common();
    app.renderWindow();
};

Ext.onReady(bootstrap);
