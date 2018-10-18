/**
 * User: utku
 * Date: 14.06.2018
 * Time: 20:28
 * Web : http://www.utkukutlu.com
 */


$.fn.bsTable = function (params) {

    this.id = "";

    this.ajax = "";
    this.columns = "";
    this.lengthMenu = "";

    this.bodyData = "";
    this.trData = [];
    this.dataLength = 20;
    this.theadCount = 0;
    this.totalData = 0;
    this.sortType = 1;
    this.buttons = "";

    var _this = this;


    if (typeof params !== "undefined") {

        if (typeof params.data !== "undefined") {
            this.bodyData = params.data;
        }
        if (typeof params.columns !== "undefined") {
            this.columns = params.columns;
        }
        if (typeof params.ajax !== "undefined") {
            this.ajax = params.ajax;
        }
        if (typeof params.lengthMenu !== "undefined") {
            this.lengthMenu = params.lengthMenu;
        }
        if (typeof params.dataLength !== "undefined") {
            this.dataLength = params.dataLength;
        }
        if (typeof params.buttons !== "undefined") {
            this.buttons = params.buttons;
        }

    }

    this.container = $('<div/>', {
        class: "bs-table-container"

    });
    this.container.append(this.clone());
    this.replaceWith(this.container);

    this.html(this.container.html());

    this.table = "";
    this.thead = $('<thead/>', {});
    this.tbody = $('<tbody/>', {});
    this.tr = $('<tr/>', {});
    this.th = $('<th/>', {});
    this.td = $('<td/>', {});

    this.table = this.container.find("table");

    if (this.table.find("tbody").length <= 0) {
        _this.table.append(_this.tbody);
    } else {
        _this.tbody = _this.table.find("tbody");
    }


    this.searchBox = $('<input/>', {
        type: "text",
        class: "bs-table-searchbox",
        placeholder: "Search"
    });
    this.lengthSelect = $('<select/>', {
        class: "bs-table-length-select",
    });
    if (this.lengthMenu !== "") {
        for (var i = 0; i < this.lengthMenu[0].length; i++) {
            var isSelected = this.lengthMenu[0][i] == _this.dataLength ? true : false;
            var option = $('<option/>', {
                html: this.lengthMenu[1][i],
                value: this.lengthMenu[0][i],
                selected: isSelected
            });
            this.lengthSelect.append(option);
        }
    }

    this.lengthSelect.change(function (e) {
        _this.dataLength = _this.lengthSelect.val();
        for (var i = 0; i < _this.tbody.find("tr").length; i++) {
            if (i >= _this.lengthSelect.val()) {
                _this.tbody.find("tr").eq(i).hide();
            } else {
                _this.tbody.find("tr").eq(i).show();
            }
            if (_this.lengthSelect.val() == -1) {
                _this.tbody.find("tr").eq(i).show();
            }
        }
        rePage();
    });

    function rePage() {
        var pageLength = Math.round(_this.totalData / _this.dataLength);
        var pagination = $('<ul/>', {
            class: "bs-table-pagination"
        });

        _this.container.find(".bs-table-pagination").remove();

        for (var i = 1; i <= pageLength; i++) {
            var pagesLi = $('<li/>', {
                class: "bs-table-pagination-li",
            });
            var pagesA = $('<a/>', {
                class: "bs-table-pagination-a" + (i == 1 ? " bs-table-pagination-a-active" : ""),
                text: i,
                href: "#",
                page: i
            });
            pagesA.click(function () {
                _this.container.find(".bs-table-pagination-a").removeClass("bs-table-pagination-a-active");
                _this.container.find(".bs-table-pagination-a-active").removeClass("bs-table-pagination-a-active");
                $(this).addClass("bs-table-pagination-a-active");

                var page = $(this).attr("page");
                for (var i = 0; i < _this.totalData; i++) {
                    if (i >= (page * _this.dataLength - _this.dataLength) && i < page * _this.dataLength) {
                        _this.container.find("tbody tr").eq(i).show();
                    } else {
                        _this.container.find("tbody tr").eq(i).hide();
                    }
                }
            });
            pagesLi.append(pagesA);
            pagination.append(pagesLi);

        }
        _this.container.find(".bs-clear-pagination").remove();
        _this.container.append(pagination);
        _this.container.append("<div class='bs-clear bs-clear-pagination'></div>");

    }

    this.searchBox.keyup(function () {
        var val = _this.searchBox.val();
        if (val.trim() !== "") {
            _this.container.find("tbody tr").filter(function () {
                if ($(this).html().toLowerCase().indexOf(val) > -1) {
                    if (_this.container.find("tbody tr:visible").length < _this.dataLength) {
                        $(this).show();
                    }
                } else {
                    $(this).hide();
                }

            });
        } else {
            _this.container.find("tbody tr").hide();
            for (var i = 0; i <= _this.dataLength; i++) {
                _this.container.find("tbody tr:nth-child(" + i + ")").show();
            }
        }
        if (!_this.container.find("tbody tr").is(":visible")) {
            if (_this.container.find("tbody div").length <= 0) {
                _this.tbody.append("<div>Veri Bulunamadı</div>");
            }
        } else {
            _this.tbody.find("div").remove();
        }
    });


    _this.container.prepend(this.searchBox);
    _this.searchBox.after("<div class='bs-clear'></div>");

    _this.container.append(this.lengthSelect);
    _this.lengthSelect.before("<div class='bs-clear'></div>");


    if (_this.container.find("tbody").length <= 0) {
        _this.table.append(this.tbody);
    }


    _this.container.on("click", "tbody td", function () {
        var tr;
        if ($(this)[0] == 'tr' && false) {
            tr = $(this);
        } else {
            tr = $(this).parents("tr");
        }
        if (tr.hasClass("selected")) {
            tr.removeClass("selected");
            _this.container.find("tbody tr").removeClass("selected");
        } else {
            _this.container.find("tbody tr").removeClass("selected");
            tr.addClass("selected");
        }

    });

    _this.container.find("thead tr th").click(function () {

        if (typeof _this.columns[this.cellIndex].sortable === "undefined" || _this.columns[this.cellIndex].sortable !== false) {
            _this.sortType = _this.sortType * -1;
            _this.container.find(".bs-table-sor-type").remove();
            $(this).append("<div class='bs-table-sor-type'>" + (_this.sortType === 1 ? "&#9652;" : "&#9662;") + "</div>");
            var data = [];

            for (var i = 0; i < _this.container.find("tbody tr").length; i++) {
                var a = _this.container.find("tbody tr:nth-child(" + i + ") td:nth-child(" + (this.cellIndex + 1) + ")").text();
                if (a !== "") {
                    data.push(a);
                }
            }
            data.sort(function (a, b) {
                if (isNaN(a) === false && isNaN(b) === false) {
                    return _this.sortType === -1 ? parseFloat(b) - parseFloat(a) : parseFloat(a) - parseFloat(b);
                } else {
                    return _this.sortType === -1 ? a < b : a > b;
                }
            });

            for (var i = 0; i < data.length; i++) {
                var a = _this.container.find("tbody tr td:nth-child(" + (this.cellIndex + 1) + "):contains('" + data[i] + "')").parents("tr");
                _this.container.find("tbody tr td:nth-child(" + (this.cellIndex + 1) + "):contains('" + data[i] + "')").parents("tr").remove();
                _this.container.find("tbody").append(a);
            }

        }
    });

    this.buttonsDiv = $('<div/>', {
        class: "bs-table-buttons"
    });

    if (this.buttons !== "") {

        for (let i = 0; i < this.buttons.length; i++) {
            let button = $('<button/>', {
                class: "bs-table-button " + this.buttons[i].className,
                text: this.buttons[i].text
            });
            button.click(function () {
                if (typeof _this.buttons[i].action === "function") {
                    _this.buttons[i].action();
                }

            });
            this.buttonsDiv.append(button);
        }

    }

    _this.container.prepend(this.buttonsDiv);


    /* this.theadCount = this.find("thead tr th").length;*/


    function request() {
        $.ajax({
            type: _this.ajax.type,
            url: _this.ajax.url,
            data: _this.ajax.data,
            success: function (response) {
                if (typeof  response === "string") {
                    response = JSON.parse(response);
                    if (typeof response.data === "undefined") {
                        response.data = response;
                    }
                } else if (typeof  response === "object") {
                    if (typeof response.data === "undefined") {
                        response.data = response;
                    }
                }
                if (_this.columns === "") {
                    _this.columns = response.columns;
                }

                _this.totalData = response.data.length;
                for (let i = 0; i < response.data.length; i++) {
                    let tr = $('<tr/>', {});
                    for (let k = 0; k < _this.columns.length; k++) {
                        let td = $('<td/>', {
                            html: response.data[i][_this.columns[k].data],
                            column: _this.columns[k].data,
                            "data-value": response.data[i][_this.columns[k].data]
                        });
                        tr.append(td);

                    }
                    _this.tbody.append(tr);
                    if (i >= _this.dataLength) {
                        tr.hide();
                    }
                }
                if (_this.container.find("thead").length > 0) {
                    _this.container.find("thead tr th").css({});
                }
                if (response.data.length <= 0) {
                    _this.tbody.html("Tabloda Veri Yok");
                    return;
                }

                rePage();


            },
            error: function (e) {

            }
        });
    }

    request();

    // this.refresh = function () {
    //     request();
    // };

    this.getSelectedRow = function () {

        var obj = {};

        var row = _this.container.find("tbody tr.selected");

        if (row.length > 0) {

            row.find("td").each(function (index) {
                var el = $(this);
                obj[el.attr("column")] = el.attr("data-value");
            });

            return obj;
        } else {
            return null;
        }


    };

    this.getRow = function (index) {

        var obj = {};

        var row = _this.container.find("tbody tr").eq(index);

        if (row.length > 0) {

            row.find("td").each(function (index) {
                var el = $(this);
                obj[el.attr("column")] = el.attr("data-value");
            });

            return obj;
        } else {
            return null;
        }


    };

    this.getRows = function () {
        var arr = [];
        var rows = _this.container.find("tbody tr");
        if (rows.length > 0) {
            rows.each(function (index) {
                var row = $(this);
                var obj = {};
                row.find("td").each(function (index) {
                    var el = $(this);
                    obj[el.attr("column")] = el.attr("data-value");

                });
                arr.push(obj);
            });
            return arr;
        } else {
            return null;
        }

    };


    return this;
};

$.bsAlert = function (params, callback) {


    this.title = "";
    this.content = "";
    this.type = "success";
    this.showConfirmButton = false;
    this.confirmButtonText = "";
    this.confirmButtonBackground = "blue";
    this.confirmButtonTextColor = "white";
    this.closable = true;
    this.disableClose = false;
    this.buttons = "";

    var _this = this;


    if (typeof params !== "undefined") {


        if (typeof params.type !== "undefined") {
            _this.type = params.type;
        }

        if (typeof params.title !== "undefined") {
            _this.title = params.title;
        }

        if (typeof params.content !== "undefined") {
            _this.content = params.content;
        }

        if (typeof  params.showConfirmButton !== "undefined") {
            _this.showConfirmButton = params.showConfirmButton;
        }

        if (typeof params.confirmButtonText !== "undefined") {
            _this.confirmButtonText = params.confirmButtonText;
        }

        if (typeof params.confirmButtonBackground !== "undefined") {
            _this.confirmButtonBackground = params.confirmButtonBackground;
        }

        if (typeof params.confirmButtonTextColor !== "undefined") {
            _this.confirmButtonTextColor = params.confirmButtonTextColor;
        }

        if (typeof params.closable !== "undefined") {
            _this.closable = params.closable;
        }

        if (typeof params.disableClose !== "undefined") {
            _this.disableClose = params.disableClose;
        }

        if (typeof params.buttons !== "undefined") {
            _this.buttons = params.buttons;
        }

    }

    this.container = $('<div/>', {
        class: "bs-alert-container bs-alert-" + _this.type
    });
    this.body = $('<div/>', {
        class: "bs-alert-body"
    });

    if (_this.closable === true) {
        _this.container.click(function () {
            _this.close();
        });
    }


    this.iconContainer = $('<div/>', {
        class: "bs-alert-icon-container",
    });

    this.iconContent = $('<div/>', {
        class: "bs-alert-icon-content",
        htmls: _this.type === "success" ? "&#10004;" : _this.type === "danger" ? "&#x274C;" : ""
    });
    this.iconContainer.append(this.iconContent);


    this.titleContainer = $('<div/>', {
        class: "bs-alert-title-container",
    });
    this.titleContent = $('<div/>', {
        class: "bs-alert-title-content",
        html: _this.title
    });
    this.titleContainer.append(this.titleContent);


    this.contentContainer = $('<div/>', {
        class: "bs-alert-content-container",
    });
    this.contentContent = $('<div/>', {
        class: "bs-alert-content-content",
        html: _this.content
    });
    this.contentContainer.append(this.contentContent);


    this.buttonsContainer = $('<div/>', {
        class: "bs-alert-buttons-container"
    });


    if (typeof _this.buttons === "object") {
        _this.buttons.forEach(function (e) {
            var btn = $('<button/>', {
                class: "bs-alert-button",
                type: "button",
                html: e.text,
                style: "background:" + e.background + ";color:" + e.color,
                "btn-val": e.value
            });
            if (typeof e.show === "undefined" || e.show !== true) {
                _this.buttonsContainer.append(btn);
            }
            btn.click(function () {
                if (typeof callback === "function") {
                    callback($(this).attr("btn-val"));
                    if (_this.disableClose !== true) {
                        _this.close();
                    }
                }
            });
        });
    }


    this.body.append(this.iconContainer);
    this.body.append(this.titleContainer);
    this.body.append(this.contentContainer);
    this.body.append(this.buttonsContainer);

    this.container.append(this.body);


    $("body").append(_this.container);

    this.close = function () {
        _this.body.css("animation-name", "zoomOut");
        setTimeout(function () {
            _this.container.remove();
        }, 300);
    };

    this.updateTitle = function (title) {
        _this.container.find(".bs-alert-title-content").html(title);
    };

    this.updateContent = function (content) {
        _this.container.find(".bs-alert-content-content").html(content);
    };

    return this;
};


$.bsNotification = function (params, callback) {

    this.type = "success";
    this.content = "";
    this.showSingle = false;
    this.duration = 2000;
    var _this = this;

    if (typeof params !== "undefined") {


        if (typeof params.type !== "undefined") {
            this.type = params.type;
        }
        if (typeof params.content !== "undefined") {
            this.content = params.content;
        }
        if (typeof params.showSingle !== "undefined") {
            this.showSingle = params.showSingle;
        }

        if (typeof params.duration !== "undefined") {
            this.duration = params.duration;
        }

    }
    if (_this.showSingle === true) {
        $(".bs-notification").remove();
    }
    let notificationsCount = $(".bs-notification").length;

    this.div = $('<div/>', {
        class: "bs-notification bs-notification-" + _this.type,
        style: "top:" + notificationsCount * 40 + "px;",
        text: _this.content
    });

    this.div.click(function () {
        if (typeof callback === "function") {
            callback();
        }
        this.remove();
        checkRemove();
    });

    $("body").append(this.div);
    this.div.fadeIn("fast", function () {
        setTimeout(function () {
            checkRemove();
        }, _this.duration);
    });

    function checkRemove() {
        notificationsCount = $(".bs-notification").length;
        let item = $(".bs-notification").eq(0);
        $(".bs-notification").eq(0).css({"top": 0});
        item.fadeOut(function () {
            item.remove();
            for (let i = 0; i < notificationsCount; i++) {
                $(".bs-notification").eq(i).css({"top": i * 40});
            }
            if (notificationsCount > 0) {
                checkRemove();
            }
        });
    }

    return this;
};

$.bsWindow = function (params) {
    this.id = "bs-window";
    this.class = "bs-window";
    this.title = "bs Window";

    this.width = "500px";
    this.height = "500px";
    this.background = "#dfe8f6";
    this.visible = true;
    this.content = "";
    this.resizable = true;
    this.draggable = true;
    this.xPosition = "center";
    this.yPosition = "center";
    this.src = "";
    this.closeButtonContent = "X";

    this.isFullScreen = false;

    var _this = this;

    this.show = function () {
        _this.visible = true;
        _this.bsContainer.show();
    };
    this.hide = function () {
        _this.visible = false;
        _this.bsContainer.hide();
    };
    if (typeof params !== "undefined") {

        if (typeof params.resizable !== "undefined") {
            this.resizable = params.resizable;
        }

        if (typeof params.width !== "undefined") {
            this.width = params.width;
        }

        if (typeof params.height !== "undefined") {
            this.height = params.height;
        }

        if (typeof params.show !== "undefined") {
            this.visible = params.show;
        }

        if (typeof params.background !== "undefined") {
            this.background = params.background;
        }

        if (typeof params.title !== "undefined") {
            this.title = params.title;
        }

        if (typeof params.content !== "undefined") {
            this.content = params.content;
        }
        if (typeof params.draggable !== "undefined") {
            this.draggable = params.draggable;
        }
        if (typeof params.xPosition !== "undefined") {
            this.xPosition = params.xPosition;
        }
        if (typeof params.yPosition !== "undefined") {
            this.yPosition = params.yPosition;
        }
        if (typeof params.src !== "undefined") {
            this.src = params.src;
        }
        if (typeof params.closeButtonContent !== "undefined") {
            this.closeButtonContent = params.closeButtonContent;
        }

    }


    this.bsContainer = $('<div/>', {
        id: this.id,
        class: "bs-window-container",
        style: "width:" + this.width + ";" + "height:" + this.height + ";" + "background:" + this.background + ";"
    });


    this.bsWindowDiv = $('<div/>', {
        class: "bs-window"
    });

    this.bsHeader = $('<div/>', {
        class: "bs-window-header"
    });

    this.bsTitle = $('<div/>', {
        class: "bs-window-title",
        html: this.title
    });

    this.bsBody = $('<div/>', {
        class: "bs-window-body",
        html: this.content
    });

    this.bsFooter = $('<div/>', {
        class: "bs-window-footer",
    });

    this.closeButton = $('<div/>', {
        class: "bs-window-close-btn",
        html: this.closeButtonContent
    });

    this.iframe = $('<iframe/>', {
        class: "bs-window-iframe",
        src: this.src
    });


    this.bsContainer.append(this.bsWindowDiv);

    this.bsContainer.append(this.bsWindowDiv);

    this.bsWindowDiv.append(this.bsHeader);

    this.bsHeader.append(this.closeButton);


    this.bsHeader.append(this.bsTitle);


    this.bsWindowDiv.append(this.bsBody);


    this.bsWindowDiv.append(this.bsFooter);

    // this.html(this.bsContainer);

    this.bsBody.append(this.iframe);


    if (this.draggable === true) {


        var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
        var element = this.bsContainer;
        this.bsHeader.on("mousedown", function (e) {
            e = e || window.event;
            pos3 = e.clientX;
            pos4 = e.clientY;
            $(document).on("mouseup", function () {
                element.css("opacity", "1");
                $(document).off("mouseup");
                $(document).off("mousemove");
            });
            $(document).on("mousemove", function (e) {
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.css("top", (element.offset().top - pos2));
                element.css("left", (element.offset().left - pos1));
                element.css("opacity", "0.5");
            });
        });

        this.bsFooter.on("mousedown", function (e) {
            e = e || window.event;
            pos3 = e.clientX;
            pos4 = e.clientY;
            $(document).on("mouseup", function () {
                element.css("opacity", "1");
                $(document).off("mouseup");
                $(document).off("mousemove");
            });
            $(document).on("mousemove", function (e) {
                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;
                element.css("top", (element.offset().top - pos2));
                element.css("left", (element.offset().left - pos1));
                element.css("opacity", "0.5");
            });
        });
    }

    this.bsHeader.dblclick(function () {
        if (_this.isFullScreen === true) {
            _this.restore();
        } else {
            _this.maximize();
        }
    });

    this.closeButton.click(function () {

        _this.bsContainer.remove();

    });


    this.maximize = function () {
        _this.isFullScreen = true;
        _this.bsContainer.css({
            "left": "0",
            "right": "0",
            "top": "0",
            "bottom": "0",
            "width": "calc(100% - 5px)",
            "height": "calc(100% - 5px)",
        });

    };

    this.restore = function () {
        _this.isFullScreen = false;
        _this.bsContainer.width(_this.width);
        _this.bsContainer.height(_this.height);
        _this.bsContainer.css({
            "top": Math.max(0, ($(window).height() - this.bsContainer.outerHeight()) / 2),
            "left": Math.max(0, ($(window).width() - this.bsContainer.outerHeight()) / 2)
        });
    };

    this.close = function () {
        this.bsContainer.remove();
    };

    if (this.show === false) {
        $(_this.bsContainer).hide();
    }
    if (this.xPosition === "left") {
        this.bsContainer.css({
            "left": "0"
        });
    } else if (this.xPosition === "center") {
        this.bsContainer.css({
            "left": Math.max(0, ($(window).width() - this.bsContainer.outerHeight()) / 2)
        });
    } else if (this.xPosition === "right") {
        this.bsContainer.css({
            "right": "0",
        });
    }

    if (this.yPosition === "top") {
        this.bsContainer.css({
            "top": "0"
        });
    } else if (this.yPosition === "center") {
        this.bsContainer.css({
            "top": Math.max(0, ($(window).height() - this.bsContainer.outerHeight()) / 2)

        });
    } else if (this.yPosition === "bottom") {
        this.bsContainer.css({
            "bottom": "0"
        });
    }

    $("body").append(this.bsContainer);
    return this;
};


$.fn.bsValidate = function () {
    let form = this;
    let r = true;
    form.find(":input").each(function () {
        if ($(this).attr("type") === "text") {
            if (($(this).val() === null || $(this).val() === "") && ($(this).attr("required") !== undefined || $(this).attr("required") !== false)) {
                r = false;
            }
        } else if ($(this).attr("type") === "password") {
            if (($(this).val() === null || $(this).val() === "") && ($(this).attr("required") !== undefined || $(this).attr("required") !== false)) {
                r = false;
            }
        } else if ($(this).attr("type") === "radio") {
            if (form.find("input[type='radio'][name='" + $(this).attr("name") + "']:checked").length === 0) {
                r = false;
            }
        } else if ($(this).attr("type") === "checkbox") {
            if (form.find("input[type='checkbox'][name='" + $(this).attr("name") + "']:checked").length === 0) {
                r = false;
            }
        }

    });

    return r;

};


$.fn.bsDatePicker = function (params) {


    this.format = "d-m-y";
    this.dateParam = null;

    var _this = this;

    var _params = null;

    if (typeof params !== "undefined") {
        _params = params;
        if (typeof params.format !== "undefined") {
            _this.format = params.format;
        }
    }

    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

    var currentDate = new Date();

    this.currentDay = currentDate.getDate();
    this.currentMonth = currentDate.getMonth() + 1;
    this.currentYear = currentDate.getFullYear();
    this.currentDayOfWeek = currentDate.getDay();

    this.container = $('<div/>', {
        class: "bs-datepicker-container"
    });

    this.body = $('<div/>', {
        class: "bs-datepicker-body"
    });

    this.top = $('<div/>', {
        class: "bs-datepicker-top"
    });

    this.middle = $('<div/>', {
        class: "bs-datepicker-middle"
    });

    this.bottom = $('<div/>', {
        class: "bs-datepicker-bottom"
    });

    this.topLeftArrow = $('<div/>', {
        class: "bs-datepicker-top-leftArrow",
        html: "<"
    });

    this.topRightArrow = $('<div/>', {
        class: "bs-datepicker-top-rightArrow",
        html: ">"
    });

    this.topCenter = $('<div/>', {
        class: "bs-datepicker-top-center",
        html: getMonth(_this.currentMonth - 1) + " " + _this.currentYear,
        month: _this.currentMonth,
        year: _this.currentYear
    });

    _this.topLeftArrow.click(function () {
        var el = _this.next(".bs-datepicker-container").find(".bs-datepicker-top-center");
        var newMonth = parseInt(el.attr("month")) - 1;
        if (newMonth < 1) {
            newMonth = 12;
            el.attr("year", parseInt(el.attr("year")) - 1);
        }
        el.attr("month", newMonth);
        changeDate();
        el.html(getMonth(el.attr("month") - 1) + " " + el.attr("year"));
    });

    _this.topRightArrow.click(function () {
        var el = _this.next(".bs-datepicker-container").find(".bs-datepicker-top-center");
        var newMonth = parseInt(el.attr("month")) + 1;
        if (newMonth > 12) {
            newMonth = 1;
            el.attr("year", parseInt(el.attr("year")) + 1);
        }
        el.attr("month", newMonth);
        changeDate();
        el.html(getMonth(el.attr("month") - 1) + " " + el.attr("year"));
    });


    this.table = $('<table/>', {
        class: "bs-datepicker-middle-table",
    });
    this.thead = $('<thead/>', {});
    this.tbody = $('<tbody/>', {});


    // var tr = $('<tr/>', {});
    // for (var i = 0; i < 7; i++) {
    //
    //     var td = $('<th/>', {
    //         html: getDay(i)
    //     });
    //     tr.append(td);
    // }
    // _this.thead.append(tr);

    _this.table.append(_this.thead);
    _this.table.append(_this.tbody);

    _this.top.append(_this.topLeftArrow);
    _this.top.append(_this.topCenter);
    _this.top.append(_this.topRightArrow);


    _this.middle.append(_this.table);

    _this.body.append(_this.top);
    _this.body.append(_this.middle);
    _this.body.append(_this.bottom);

    _this.container.append(_this.body);

    _this.click(function () {
        getContainer().show();
    });


    // _this.focus(function () {
    //     getContainer().show();
    // });

    _this.blur(function () {
        if (getContainer().length > 0 && !getContainer().is(":active")) {
            _this.close();
        }
    });


    function changeDate(withDateParam) {
        getContainer().find("table tbody").html("");

        if (typeof withDateParam === "undefined") {
            withDateParam = false;
        }


        // if (_this.dateParam !== null && !isNaN(new Date(_this.dateParam)) && withDateParam === true) {
        //     date = new Date(_this.dateParam);
        //     month = date.getMonth() + 1;
        //     year = date.getFullYear();
        //     getContainer().find(".bs-datepicker-top-center").html(getMonth(month - 1) + " " + year);
        //     getContainer().find(".bs-datepicker-top-center").attr("month", month);
        //     getContainer().find(".bs-datepicker-top-center").attr("year", year);
        // }

        for (var i = 1; i <= 31; i++) {
            if (i % 7 == 0 || i === 1) {
                var tr = $('<tr/>', {});
            }


            var day = i;
            var month = getContainer().find(".bs-datepicker-top-center").attr("month");
            var year = getContainer().find(".bs-datepicker-top-center").attr("year");
            var date = new Date(year + "-" + month + "-" + day);

            var selectedDay = _this.currentDay;

            // if (withDateParam === true && !isNaN(new Date(_this.dateParam))) {
            //     var date2 = new Date(_this.dateParam);
            //     // day = date.getDate();
            //     month = date2.getMonth() + 1;
            //     year = date2.getFullYear();
            //     selectedDay = date2.getDate();
            // }


            // if (i === 1) {
            // alert(getDay(date.getDay()));
            // if (date.getDay() === 0) {
            //     alert("asd");
            // }
            // }


            var td = $('<td/>', {
                class: "bs-datepicker-middle-table-td " + ((!isNaN(new Date(_this.dateParam)) && withDateParam === true && false ? (i === selectedDay) : (i === selectedDay)) ? "bs-datepicker-selected-day" : ""),
                html: i + "<br>" + getDay(date.getDay()),
                day: date.getDate(),
                month: month,
                year: year,
                dayOfWeek: getDay(date.getDay())
            });

            td.click(function () {
                _this.tbody.find(".bs-datepicker-middle-table-td").removeClass("bs-datepicker-selected-day");
                $(this).addClass("bs-datepicker-selected-day");
                var dateStr = (_this.format.replace("d", $(this).attr("day")).replace("m", $(this).attr("month")).replace("y", $(this).attr("year")));
                _this.val(dateStr);
                setTimeout(function () {
                    _this.close();
                }, 50);
            });
            tr.append(td);
            getContainer().find("table tbody").append(tr);

        }

    }


    _this.after(_this.container);
    changeDate();


    function getMonth(index) {
        if (index < 0) {
            index = 0;
        }
        if (index > 12) {
            index = 12;
        }
        return months[index];
    }

    function getDay(index) {
        // --index;
        if (index < 0) {
            index = 0;
        }
        if (index > 7) {
            index = 7;
        }
        return days[index];
    }

    function getContainer() {
        return _this.next(".bs-datepicker-container");
    }

    this.close = function () {
        getContainer().hide();
    };

    this.setDate = function (date) {
        _this.dateParam = date;
        changeDate(true);
    };


    return this;
};
$.bsRedirect = function (url, time) {

    if (typeof time === "undefined") {
        time = 0;
    }
    setTimeout(function () {
        window.location.href = url;
    }, parseInt(time));

};


$.bsLightBox = function () {


};