module.exports = function() {
    var win = new Ext.Window({
        title: 'Help',
        renderTo: Ext.getBody(),
        id: 'helpwin',
        width: 300,
        height: 300,
        items: [{
            xtype: 'button',
            text: 'Close',
            handler: function() {
                win.close();
            }
        }]
    }).show();

    setTimeout(() => {
        win.load('mocks/director.txt');
    }, 50);
};
