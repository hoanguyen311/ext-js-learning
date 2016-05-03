const renderWindow = require('./helpers/renderWindow');

var app = {
    renderWindow,
    common: function() {
        Ext.apply(Ext.form.VTypes, {
            nameVal: /^((?:[A-Z][a-z]*\s)*[A-Z][a-z]*)$/,
            nameMask: /[A-Za-z\s]/,
            nameText: 'Invalid Name, should be Nguyen Van An for instance',
            name: function(val) {
                return this.nameVal.test(val.trim())
            }
        });
        Ext.QuickTips.init();
    },
    showMessage: function() {
        Ext.Msg.show({
            title: 'Thai Hoa',
            msg: 'How are you today ?',
            buttons: {
                cancel: true,
                no: true,
                yes: 'Maybe !'
            },
            icon: 'cart-icon',
            fn: function(btn) {
                switch (btn) {
                    case 'yes':
                        Ext.Msg.prompt(
                            'Hoa',
                            'Great to hear what, where are you ?',
                            function(btn, text) {
                                if (text.toLowerCase() ===
                                    'the office') {
                                    Ext.get('content').dom
                                        .innerHTML =
                                        'Dull Work';
                                } else {
                                    Ext.get('content').dom
                                        .innerHTML =
                                        text;
                                }
                                Ext.DomHelper.applyStyles(
                                    'content', {
                                        background: '#00F',
                                        color: '#FFF'
                                    });
                            }
                        );
                        break;
                    case 'no':
                        Ext.Msg.alert('Hoa', 'Oh sorry',
                            function() {
                                var content = Ext.fly(
                                    'content');
                                Ext.fly('content_2');
                                content.highlight(
                                    '000000', {
                                        endColor: 'FFFFFF',
                                        duration: 2
                                    });
                            });
                        break;
                    case 'cancel':
                        Ext.Msg.wait('Saving...',
                            'File copy');
                        break;
                    default:
                }
            }
        });
    },
    renderPanel: function() {
        return new Ext.Panel({
            title: 'Panel with content',
            height: 200,
            width: 300,
            cls: 'my-panel',
            items: new Ext.BoxComponent({
                el: 'main-content'
            })
        });
    },
    getGenresStore: function() {
        return new Ext.data.Store({
            reader: new Ext.data.JsonReader({
                fields: ['id', 'genre_name'],
                root: 'rows'
            }),
            proxy: new Ext.data.HttpProxy({
                url: '/genres'
            }),
            autoLoad: true
        });
    },
    renderFormPanel: function() {

        var items = [{
            xtype: 'textfield',
            fieldLabel: 'Title',
            name: 'title',
            allowBlank: false,
            listeners: {
                specialkey: function(field, e) {
                    if (e.getKey() === Ext.EventObject.ENTER) {
                        movieForm.getForm()
                            .submit();
                    }
                }
            }
        }, {
            xtype: 'textfield',
            fieldLabel: 'Director',
            name: 'director',
            vtype: 'name',

            listeners: {

            }
        }, {
            xtype: 'datefield',
            fieldLabel: 'Released',
            name: 'released',
            enableKeyEvents: true,
            listeners: {
                keypress: function(component, e) {
                    console.log(component);
                },
                select: function(component, date) {
                    console.log('Selected: ', date);
                },
                render: function(component) {
                    console.log(component.menu);
                },
                change: function(component) {
                    console.log('change', component.menu);
                }
            }
        }, {
            xtype: 'radiogroup',
            fieldLabel: 'Filmed In',
            name: 'filmed_in',
            columns: 1,
            items: [{
                name: 'filmed_in',
                boxLabel: 'Color',
                inputValue: 'color'
            }, {
                name: 'filmed_in',
                boxLabel: 'Black and White',
                inputValue: 'b&w'
            }],
            listeners: {
                change: function(field, checked) {
                    if (checked) {
                        console.log(checked.getGroupValue());
                    }
                }
            }
        }, {
            xtype: 'checkbox',
            fieldLabel: 'Bad Movie',
            name: 'bad_movie',
            checked: false
        }, {
            xtype: 'combo',
            hiddenName: 'genre',
            fieldLabel: 'Genre',
            mode: 'local',
            store: this.getGenresStore(),
            displayField: 'genre_name',
            valueField: 'id',
            width: 100,
            getListParent: function() {
                return this.el.up('.x-menu');
            },
            listeners: {
                select: function(field, record,index) {
                    if (index === 0) {
                        Ext.Msg.prompt(
                            'New Genre',
                            'Name',
                            Ext.emptyFn
                        );
                    }
                }
            }
        }, {
            xtype: 'textarea',
            name: 'description',
            hideLabel: true,
            height: 100,
            anchor: '100%'
        }];
        var that = this;
        var movieForm = new Ext.FormPanel({
            //renderTo: Ext.getBody(),
            url: 'movies/add',
            border: false,
            title: 'Movie form',
            width: '100%',
            stopEvent: true,
            items: items,
            bodyStyle: 'background:transparent;padding:5px',
            defaults: {
                stopEvent: true
            },
            listeners: {
                render: function(component) {
                    component.form.load({
                        url: '/movies'
                    });
                    component.header.addListener({
                        click: function(e, el) {
                            Ext.Msg.alert('You have clicked ' + el.id);

                        }
                    });
                }
            },
            buttons: [{
                text: 'Save',
                handler: function() {
                    movieForm.getForm().submit({
                        success: function(form, action) {
                            Ext.Msg.alert('Success', 'It worked');
                        },
                        failure: function(form, action) {
                            var failureType = action.failureType;
                            that.alertFailure(failureType, action);
                        }
                    })
                }
            }, {
                text: 'Reset',
                handler: function() {
                    movieForm.getForm().reset();
                }
            }]
        });

        // movieForm.getForm().load({
        //     url: '/movies'
        // });

        return movieForm;
    },
    alertFailure: function(failureType, action) {
        var msg = '', title = '';

        switch (failureType) {
            case Ext.form.Action.CLIENT_INVALID:
                title = 'Can not submit';
                msg = 'Please check invalid fields';
                break;
            case Ext.form.Action.CONNECT_FAILURE:
                title = 'Failed';
                msg = 'Can not connect to server (' +
                    action.response.status +
                    ' ' +
                    action.response.statusText + ')';
                break;
            case Ext.form.Action.SERVER_INVALID:
                title = 'Warning';
                msg = action.result.errorMsg;
                break;
            default:
        }
        Ext.Msg.alert(title, msg);
    },
    getMenuItemsConfig: function() {
        return [{
            icon: 'http://vn-live-02.slatic.net/p/cap-nam-goldlion-gd001-nau-9765-558862-2-webp-gallery.jpg',
            //iconCls: 'flag-a',
            text: 'Menu Options 1',
            handler: function(item) {
                item.setText('ABC');
            },
            menu: {
                plain: true,
                width: 300,
                border: false,
                items: [
                    this.renderFormPanel()
                ]
            }
        }, {

            icon: 'http://vn-live-01.slatic.net/p/cap-nam-goldlion-gd006-den-1742-3895621-1-webp-gallery.jpg',
            text: 'Menu Options 2',
            menu: [
                {
                    text: 'Menu Option 2 - 1'
                },
                {
                    text: 'Menu Option 2 - 2'
                }
            ]
        }, {
            icon: 'http://vn-live-02.slatic.net/p/cap-nam-goldlion-gd001-nau-9765-558862-2-webp-gallery.jpg',
            //iconCls: 'flag-b',
            text: 'Menu Options 3',
            menu: {
                plain: true,
                items: [
                    this.renderPanel()
                ]
            }
        }, {
            text: 'show form',
            menu: {
                plain: true,

                items: {
                    width: 300,
                    xtype: 'form',
                    border: false,
                    bodyStyle: 'background: transparent;',
                    defaults: {
                        anchor: '100%'
                    },
                    items: [{
                        fieldLabel: 'Select',
                        xtype: 'combo',
                        store: [ [0, 'One or...'], [1 ,'The other']],
                        value: 0,
                        getListParent: function() {
                            return this.el.up('.x-menu');
                        }

                    }, {
                        fieldLabel: 'Title',
                        name: 'title',
                        xtype: 'textfield'
                    }],
                    fbar: [{
                        text: 'Submit',
                        handler: function() {
                            console.log('abc');
                            return true;
                        }
                    }]
                }
            }
        }];
    },
    renderStaticMenu() {
        return new Ext.menu.Menu({
            plain: true,
            width: 200,
            items: this.getMenuItemsConfig()
        });
    },
    renderPopupMenu() {
        var menu = new Ext.menu.Menu({
            items: this.getMenuItemsConfig(),
            plain: true
        });
        Ext.getDoc().on({
            contextmenu: function(e) {
                console.log(e.getXY());
                menu.showAt(e.getXY());
            },
            stopEvent: true
        });
    },
    renderToolbar() {
        return new Ext.Toolbar({
            renderTo: Ext.getBody(),
            items: ['->',
            {
                text: 'Button',
                xtype: 'button',
                handler: function(button) {
                    button.disable();
                }
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Button 2',
                xtype: 'button',
                menu: this.renderStaticMenu()
            }, {
                xtype: 'tbseparator'
            }, {
                text: 'Plit button',
                xtype: 'splitbutton',
                menu: [{
                    text: 'Bad'
                }, {
                    text: 'Better'
                }, {
                    text: 'Good'
                }]
            }, {
                xtype: 'tbseparator'
            },{
                xtype: 'cycle',
                showText: true,
                minWidth: 100,
                prependText: 'Quality ',
                handler: function() {
                    Ext.Msg.alert('Hoa', 'How are you ?');
                },
                items: [{
                    text: 'Bad'

                }, {
                    text: 'Better'
                }, {
                    text: 'Good',
                    checked: true
                }]
            },
            {
                text: 'Horizontal',
                //enableToggle: true,
                pressed: true,
                toggleGroup: 'orientation-selector'
            },
            '-',
            {
                text: 'Vertical',
                toggleGroup: 'orientation-selector'
            }]
        });
    },
    renderHelpToolbar(Movies) {
        return new Ext.Toolbar({
            renderTo: Ext.getBody(),
            items: [{
                xtype: 'splitbutton',
                text: 'Help',
                menu: [{
                    text: 'Genre',
                    helpfile: 'genre',
                    handler: Movies.showHelp
                }, {
                    text: 'Director',
                    helpfile: 'director',
                    handler: Movies.showHelp
                }, {
                    text: 'Title',
                    helpfile: 'title',
                    handler: Movies.showHelp
                }]
            }, {
                xtype: 'textfield',
                listeners: {
                    specialkey: Movies.doSearch
                }
            }]
        });
    }
};

module.exports = app;
