var Movies = function() {
    var _body;
    var _cache = {};

    return {
        showHelp: function(item) {
            Movies.doLoad(item.helpfile);
        },
        doSearch: function(item, keyEvent) {
            if (keyEvent.getKey() === Ext.EventObject.ENTER) {
                Movies.doLoad(item.getValue());
            }
        },
        doLoad: function(filename) {
            if (_cache[filename]) {
                Movies.setBody(_cache[filename]);
            } else {
                Ext.Ajax.request({
                    url: `http://localhost:3030/mocks/${filename}.txt`,
                    success: function({responseText}) {
                        Movies.setBody(responseText);
                        _cache[filename] = responseText;
                    }
                });
            }
        },
        setBody: function(content) {
            Movies.getBody().dom.innerHTML = content;
        },
        getBody: function() {
            if (!_body) {
                _body = Ext.getBody().createChild({tag: 'div'});
            }
            return _body;
        }
    };
}();

module.exports = Movies;
