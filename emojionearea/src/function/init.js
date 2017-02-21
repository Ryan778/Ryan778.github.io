define([
    'jquery',
    'var/emojione',
    'var/blankImg',
    'var/slice',
    'var/css_class',
    'var/emojioneSupportMode',
    'var/invisibleChar',
    'function/trigger',
    'function/attach',
    'function/shortnameTo',
    'function/pasteHtmlAtCaret',
    'function/getOptions',
    'function/saveSelection',
    'function/restoreSelection',
    'function/htmlFromText',
    'function/textFromHtml',
    'function/isObject',
    'function/calcButtonPosition',
    'function/lazyLoading',
    'function/selector',
    'function/div',
    'function/updateRecent',
    'function/getRecent',
    'function/setRecent',
    'function/supportsLocalStorage'
    //'function/calcElapsedTime', // debug only
],
function($, emojione, blankImg, slice, css_class, emojioneSupportMode, invisibleChar, trigger, attach, shortnameTo,
         pasteHtmlAtCaret, getOptions, saveSelection, restoreSelection, htmlFromText, textFromHtml, isObject,
         calcButtonPosition, lazyLoading, selector, div, updateRecent, getRecent, setRecent, supportsLocalStorage)
{
    return function(self, source, options) {
        //calcElapsedTime('init', function() {
        options = getOptions(options);
        self.sprite = options.sprite && emojioneSupportMode < 3;
        self.inline = options.inline === null ? source.is("INPUT") : options.inline;
        self.shortnames = options.shortnames;
        self.saveEmojisAs = options.saveEmojisAs;
        self.standalone = options.standalone;
        self.emojiTemplate = '<img alt="{alt}" class="emojione' + (self.sprite ? '-{uni}" src="' + blankImg + '"/>' : 'emoji" src="{img}"/>');
        self.emojiTemplateAlt = self.sprite ? '<i class="emojione-{uni}"/>' : '<img class="emojioneemoji" src="{img}"/>';
        self.emojiBtnTemplate = '<i class="emojibtn" role="button" data-name="{name}">' + self.emojiTemplateAlt + '</i>';
        self.recentEmojis = options.recentEmojis && supportsLocalStorage();

        var pickerPosition = options.pickerPosition;
        self.floatingPicker = pickerPosition === 'top' || pickerPosition === 'bottom';

        var sourceValFunc = source.is("TEXTAREA") || source.is("INPUT") ? "val" : "text",
            editor, button, picker, tones, filters, filtersBtns, emojisList, categories, scrollArea,
            app = div({
                "class" : css_class + ((self.standalone) ? " " + css_class + "-standalone " : " ") + (source.attr("class") || ""),
                role: "application"
            },
            editor = self.editor = div("editor").attr({
                contenteditable: (self.standalone) ? false : true,
                placeholder: options["placeholder"] || source.data("placeholder") || source.attr("placeholder") || "",
                tabindex: 0
            }),
            button = self.button = div('button',
                div('button-open'),
                div('button-close')
            ).attr('title', options.buttonTitle),
            picker = self.picker = div('picker',
                div('wrapper',
                    filters = div('filters'),
                    scrollArea = div('scroll-area',
                        emojisList = div('emojis-list'),
                        tones = div('tones',
                            function() {
                                if (options.tones) {
                                    this.addClass(selector('tones-' + options.tonesStyle, true));
                                    for (var i = 0; i <= 5; i++) {
                                        this.append($("<i/>", {
                                            "class": "btn-tone btn-tone-" + i + (!i ? " active" : ""),
                                            "data-skin": i,
                                            role: "button"
                                        }));
                                    }
                                }
                            }
                        )
                    )
                )
            ).addClass(selector('picker-position-' + options.pickerPosition, true))
             .addClass(selector('filters-position-' + options.filtersPosition, true))
             .addClass('hidden')
        );

        editor.data(source.data());

        $.each(options.attributes, function(attr, value) {
            editor.attr(attr, value);
        });

        $.each(options.filters, function(filter, params) {
            var skin = 0;
            if (filter === 'recent' && !self.recentEmojis) {
                return;
            }
            if (filter !== 'tones') {
                $("<i/>", {
                    "class": selector("filter", true) + " " + selector("filter-" + filter, true),
                    "data-filter": filter,
                    title: params.title
                })
                .wrapInner(shortnameTo(params.icon, self.emojiTemplateAlt))
                .appendTo(filters);
            } else if (options.tones) {
                skin = 5;
            } else {
                return;
            }
            do {
                var category = div('category').attr({name: filter, "data-tone": skin}).appendTo(emojisList),
                    items = params.emoji.replace(/[\s,;]+/g, '|');
                if (skin > 0) {
                    category.hide();
                    items = items.split('|').join('_tone' + skin + '|') + '_tone' + skin;
                }

                if (filter === 'recent') {
                    items = getRecent();
                }

                items = shortnameTo(items,
                    self.sprite ?
                        '<i class="emojibtn" role="button" data-name="{name}"><i class="emojione-{uni}"></i></i>' :
                        '<i class="emojibtn" role="button" data-name="{name}"><img class="emojioneemoji lazy-emoji" data-src="{img}"/></i>',
                    true).split('|').join('');

                category.html(items);
                $('<h1/>').text(params.title).prependTo(category);
            } while (--skin > 0);
        });

        options.filters = null;
        if (!self.sprite) {
            self.lasyEmoji = emojisList.find(".lazy-emoji");
        }

        filtersBtns = filters.find(selector("filter"));
        filtersBtns.eq(0).addClass("active");
        categories = emojisList.find(selector("category"));

        self.recentFilter = filtersBtns.filter('[data-filter="recent"]');
        self.recentCategory = categories.filter("[name=recent]");

        self.scrollArea = scrollArea;

        if (options.container) {
            $(options.container).wrapInner(app);
        } else {
            app.insertAfter(source);
        }

        if (options.hideSource) {
            source.hide();
        }

        self.setText(source[sourceValFunc]());
        source[sourceValFunc](self.getText());
        calcButtonPosition.apply(self);

        // if in standalone mode and no value is set, initialise with a placeholder
        if (self.standalone && !self.getText().length) {
            var placeholder = $(source).data("emoji-placeholder") || options.emojiPlaceholder;
            self.setText(placeholder);
            editor.addClass("has-placeholder");
        }

        // attach() must be called before any .on() methods !!!
        // 1) attach() stores events into possibleEvents{},
        // 2) .on() calls bindEvent() and stores handlers into eventStorage{},
        // 3) bindEvent() finds events in possibleEvents{} and bind founded via jQuery.on()
        // 4) attached events via jQuery.on() calls trigger()
        // 5) trigger() calls handlers stored into eventStorage{}

        attach(self, emojisList.find(".emojibtn"), {click: "emojibtn.click"});
        attach(self, window, {resize: "!resize"});
        attach(self, tones.children(), {click: "tone.click"});
        attach(self, [picker, button], {mousedown: "!mousedown"}, editor);
        attach(self, button, {click: "button.click"});
        attach(self, editor, {paste :"!paste"}, editor);
        attach(self, editor, ["focus", "blur"], function() { return self.stayFocused ? false : editor; });
        attach(self, picker, {mousedown: "picker.mousedown", mouseup: "picker.mouseup", click: "picker.click",
            keyup: "picker.keyup", keydown: "picker.keydown", keypress: "picker.keypress"});
        attach(self, editor, ["mousedown", "mouseup", "click", "keyup", "keydown", "keypress"]);
        attach(self, picker.find(".emojionearea-filter"), {click: "filter.click"});

        var noListenScroll = false;
        scrollArea.on('scroll', function () {
            if (!noListenScroll) {
                lazyLoading.call(self);
                if (scrollArea.is(":not(.skinnable)")) {
                    var item = categories.eq(0), scrollTop = scrollArea.offset().top;
                    categories.each(function (i, e) {
                        if ($(e).offset().top - scrollTop >= 10) {
                            return false;
                        }
                        item = $(e);
                    });
                    var filter = filtersBtns.filter('[data-filter="' + item.attr("name") + '"]');
                    if (filter[0] && !filter.is(".active")) {
                        filtersBtns.removeClass("active");
                        filter.addClass("active");
                    }
                }
            }
        });

        self.on("@filter.click", function(filter) {
            var isActive = filter.is(".active");
            if (scrollArea.is(".skinnable")) {
                if (isActive) return;
                tones.children().eq(0).click();
            }
            noListenScroll = true;
            if (!isActive) {
                filtersBtns.filter(".active").removeClass("active");
                filter.addClass("active");
            }
            var headerOffset = categories.filter('[name="' + filter.data('filter') + '"]').offset().top,
                scroll = scrollArea.scrollTop(),
                offsetTop = scrollArea.offset().top;
            scrollArea.stop().animate({
                scrollTop: headerOffset + scroll - offsetTop - 2
            }, 200, 'swing', function () {
                lazyLoading.call(self);
                noListenScroll = false;
            });
        })

        .on("@picker.show", function() {
            if (self.recentEmojis) {
                updateRecent(self);
            }
            lazyLoading.call(self);
        })

        .on("@tone.click", function(tone) {
            tones.children().removeClass("active");
            var skin = tone.addClass("active").data("skin");
            if (skin) {
                scrollArea.addClass("skinnable");
                categories.hide().filter("[data-tone=" + skin + "]").show();
                if (filtersBtns.eq(0).is('.active[data-filter="recent"]')) {
                    filtersBtns.eq(0).removeClass("active").next().addClass("active");
                }
            } else {
                scrollArea.removeClass("skinnable");
                categories.hide().filter("[data-tone=0]").show();
                filtersBtns.eq(0).click();
            }
            lazyLoading.call(self);
        })

        .on("@button.click", function(button) {
            if (button.is(".active")) {
                self.hidePicker();
            } else {
                self.showPicker();
            }
        })

        .on("@!paste", function(editor, event) {

            var pasteText = function(text) {
                var caretID = "caret-" + (new Date()).getTime();
                var html = htmlFromText(text, self);
                pasteHtmlAtCaret(html);
                pasteHtmlAtCaret('<i id="' + caretID +'"></i>');
                editor.scrollTop(editorScrollTop);
                var caret = $("#" + caretID),
                    top = caret.offset().top - editor.offset().top,
                    height = editor.height();
                if (editorScrollTop + top >= height || editorScrollTop > top) {
                    editor.scrollTop(editorScrollTop + top - 2 * height/3);
                }
                caret.remove();
                self.stayFocused = false;
                calcButtonPosition.apply(self);
                trigger(self, 'paste', [editor, text, html]);
            }

            if (event.originalEvent.clipboardData) {
                var text = event.originalEvent.clipboardData.getData('text/plain');
                pasteText(text);

                if (event.preventDefault){
                    event.preventDefault();
                } else {
                    event.stop();
                };

                event.returnValue = false;
                event.stopPropagation();
                return false;
            }

            self.stayFocused = true;
            // insert invisible character for fix caret position
            pasteHtmlAtCaret('<span>' + invisibleChar + '</span>');

            var sel = saveSelection(editor[0]),
                editorScrollTop = editor.scrollTop(),
                clipboard = $("<div/>", {contenteditable: true})
                    .css({position: "fixed", left: "-999px", width: "1px", height: "1px", top: "20px", overflow: "hidden"})
                    .appendTo($("BODY"))
                    .focus();

            window.setTimeout(function() {
                editor.focus();
                restoreSelection(editor[0], sel);
                var text = textFromHtml(clipboard.html().replace(/\r\n|\n|\r/g, '<br>'), self);
                clipboard.remove();
                pasteText(text);
            }, 200);
        })

        .on("@emojibtn.click", function(emojibtn) {
            editor.removeClass("has-placeholder");
            if (!app.is(".focused")) {
                editor.focus();
            }
            if (self.standalone) {
                editor.html(shortnameTo(emojibtn.data("name"), self.emojiTemplate));
                self.trigger("blur");
            } else {
                saveSelection(editor[0]);
                pasteHtmlAtCaret(shortnameTo(emojibtn.data("name"), self.emojiTemplate));
            }

            if (self.recentEmojis) {
                setRecent(self, emojibtn.data("name"));
            }
        })

        .on("@!resize @keyup @emojibtn.click", calcButtonPosition)

        .on("@!mousedown", function(editor, event) {
            if (!app.is(".focused")) {
                editor.focus();
            }
            event.preventDefault();
            return false;
        })

        .on("@change", function() {
            var html = self.editor.html().replace(/<\/?(?:div|span|p)[^>]*>/ig, '');
            // clear input: chrome adds <br> when contenteditable is empty
            if (!html.length || /^<br[^>]*>$/i.test(html)) {
                self.editor.html(self.content = '');
            }
            source[sourceValFunc](self.getText());
        })

        .on("@focus", function() {
            app.addClass("focused");
        })

        .on("@blur", function() {
            app.removeClass("focused");

            if (options.hidePickerOnBlur) {
                self.hidePicker();
            }

            var content = self.editor.html();
            if (self.content !== content) {
                self.content = content;
                trigger(self, 'change', [self.editor]);
                source.blur().trigger("change");
            } else {
                source.blur();
            }
        });

        if (options.shortcuts) {
            self.on("@keydown", function(_, e) {
                if (!e.ctrlKey) {
                    if (e.which == 9) {
                        e.preventDefault();
                        button.click();
                    }
                    else if (e.which == 27) {
                        e.preventDefault();
                        if (button.is(".active")) {
                            self.hidePicker();
                        }
                    }
                }
            });
        }

        if (isObject(options.events) && !$.isEmptyObject(options.events)) {
            $.each(options.events, function(event, handler) {
                self.on(event.replace(/_/g, '.'), handler);
            });
        }

        if (options.autocomplete) {
            var autocomplete = function() {
                var textcompleteOptions = {
                    maxCount: options.textcomplete.maxCount,
                    placement: options.textcomplete.placement
                };

                if (options.shortcuts) {
                    textcompleteOptions.onKeydown = function (e, commands) {
                        if (!e.ctrlKey && e.which == 13) {
                            return commands.KEY_ENTER;
                        }
                    };
                }

                var map = $.map(emojione.emojioneList, function (_, emoji) {
                    return !options.autocompleteTones ? /_tone[12345]/.test(emoji) ? null : emoji : emoji;
                });
                map.sort();
                editor.textcomplete([
                    {
                        id: css_class,
                        match: /\B(:[\-+\w]*)$/,
                        search: function (term, callback) {
                            callback($.map(map, function (emoji) {
                                return emoji.indexOf(term) === 0 ? emoji : null;
                            }));
                        },
                        template: function (value) {
                            return shortnameTo(value, self.emojiTemplate) + " " + value.replace(/:/g, '');
                        },
                        replace: function (value) {
                            return shortnameTo(value, self.emojiTemplate);
                        },
                        cache: true,
                        index: 1
                    }
                ], textcompleteOptions);

                if (options.textcomplete.placement) {
                    // Enable correct positioning for textcomplete
                    if ($(editor.data('textComplete').option.appendTo).css("position") == "static") {
                        $(editor.data('textComplete').option.appendTo).css("position", "relative");
                    }
                }
            };
            if ($.fn.textcomplete) {
                autocomplete();
            } else {
                $.getScript("https://cdn.rawgit.com/yuku-t/jquery-textcomplete/v1.3.4/dist/jquery.textcomplete.js",
                    autocomplete);
            }
        }

        if (self.inline) {
            app.addClass(selector('inline', true));
            self.on("@keydown", function(_, e) {
                if (e.which == 13) {
                    e.preventDefault();
                }
            });
        }

        if (/firefox/i.test(navigator.userAgent)) {
            // disabling resize images on Firefox
            document.execCommand("enableObjectResizing", false, false);
        }

        //}, self.id === 1); // calcElapsedTime()
    };
});