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

    var parent = this;


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
        parent.table.append(parent.tbody);
    } else {
        parent.tbody = parent.table.find("tbody");
    }


    this.searchBox = $('<input/>', {
        type: "text",
        class: "bs-table-searchbox",
        placeholder: "Arama"
    });
    this.lengthSelect = $('<select/>', {
        class: "bs-table-length-select",
    });
    if (this.lengthMenu !== "") {
        for (var i = 0; i < this.lengthMenu[0].length; i++) {
            var isSelected = this.lengthMenu[0][i] == parent.dataLength ? true : false;
            var option = $('<option/>', {
                html: this.lengthMenu[1][i],
                value: this.lengthMenu[0][i],
                selected: isSelected
            });
            this.lengthSelect.append(option);
        }
    }

    this.lengthSelect.change(function (e) {
        parent.dataLength = parent.lengthSelect.val();
        for (var i = 0; i < parent.tbody.find("tr").length; i++) {
            if (i >= parent.lengthSelect.val()) {
                parent.tbody.find("tr").eq(i).hide();
            } else {
                parent.tbody.find("tr").eq(i).show();
            }
            if (parent.lengthSelect.val() == -1) {
                parent.tbody.find("tr").eq(i).show();
            }
        }
        rePage();
    });

    function rePage() {
        var pageLength = Math.round(parent.totalData / parent.dataLength);
        var pagination = $('<ul/>', {
            class: "bs-table-pagination"
        });

        parent.container.find(".bs-table-pagination").remove();

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
                parent.container.find(".bs-table-pagination-a").removeClass("bs-table-pagination-a-active");
                parent.container.find(".bs-table-pagination-a-active").removeClass("bs-table-pagination-a-active");
                $(this).addClass("bs-table-pagination-a-active");

                var page = $(this).attr("page");
                for (var i = 0; i < parent.totalData; i++) {
                    if (i >= (page * parent.dataLength - parent.dataLength) && i < page * parent.dataLength) {
                        parent.container.find("tbody tr").eq(i).show();
                    } else {
                        parent.container.find("tbody tr").eq(i).hide();
                    }
                }
            });
            pagesLi.append(pagesA);
            pagination.append(pagesLi);

        }
        parent.container.find(".bs-clear-pagination").remove();
        parent.container.append(pagination);
        parent.container.append("<div class='bs-clear bs-clear-pagination'></div>");

    }

    this.searchBox.keyup(function () {
        var val = parent.searchBox.val();
        if (val.trim() !== "") {
            parent.container.find("tbody tr").filter(function () {
                if ($(this).html().toLowerCase().indexOf(val) > -1) {
                    if (parent.container.find("tbody tr:visible").length < parent.dataLength) {
                        $(this).show();
                    }
                } else {
                    $(this).hide();
                }

            });
        } else {
            parent.container.find("tbody tr").hide();
            for (var i = 0; i <= parent.dataLength; i++) {
                parent.container.find("tbody tr:nth-child(" + i + ")").show();
            }
        }
        if (!parent.container.find("tbody tr").is(":visible")) {
            if (parent.container.find("tbody div").length <= 0) {
                parent.tbody.append("<div>Veri Bulunamadı</div>");
            }
        } else {
            parent.tbody.find("div").remove();
        }
    });


    parent.container.prepend(this.searchBox);
    parent.searchBox.after("<div class='bs-clear'></div>");

    parent.container.append(this.lengthSelect);
    parent.lengthSelect.before("<div class='bs-clear'></div>");


    if (parent.container.find("tbody").length <= 0) {
        parent.table.append(this.tbody);
    }


    parent.container.on("click", "tbody td", function () {
        var tr;
        if ($(this)[0] == 'tr' && false) {
            tr = $(this);
        } else {
            tr = $(this).parents("tr");
        }
        if (tr.hasClass("selected")) {
            tr.removeClass("selected");
            parent.container.find("tbody tr").removeClass("selected");
        } else {
            parent.container.find("tbody tr").removeClass("selected");
            tr.addClass("selected");
        }

    });

    parent.container.find("thead tr th").click(function () {

        if (typeof parent.columns[this.cellIndex].sortable === "undefined" || parent.columns[this.cellIndex].sortable !== false) {
            parent.sortType = parent.sortType * -1;
            parent.container.find(".bs-table-sor-type").remove();
            $(this).append("<div class='bs-table-sor-type'>" + (parent.sortType === 1 ? "&#9652;" : "&#9662;") + "</div>");
            var data = [];

            for (var i = 0; i < parent.container.find("tbody tr").length; i++) {
                var a = parent.container.find("tbody tr:nth-child(" + i + ") td:nth-child(" + (this.cellIndex + 1) + ")").text();
                if (a !== "") {
                    data.push(a);
                }
            }
            data.sort(function (a, b) {
                if (isNaN(a) === false && isNaN(b) === false) {
                    return parent.sortType === -1 ? parseFloat(b) - parseFloat(a) : parseFloat(a) - parseFloat(b);
                } else {
                    return parent.sortType === -1 ? a < b : a > b;
                }
            });

            for (var i = 0; i < data.length; i++) {
                var a = parent.container.find("tbody tr td:nth-child(" + (this.cellIndex + 1) + "):contains('" + data[i] + "')").parents("tr");
                parent.container.find("tbody tr td:nth-child(" + (this.cellIndex + 1) + "):contains('" + data[i] + "')").parents("tr").remove();
                parent.container.find("tbody").append(a);
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
                if (typeof parent.buttons[i].action === "function") {
                    parent.buttons[i].action();
                }

            });
            this.buttonsDiv.append(button);
        }

    }

    parent.container.prepend(this.buttonsDiv);


    /* this.theadCount = this.find("thead tr th").length;*/


    $.ajax({
        type: parent.ajax.type,
        url: parent.ajax.url,
        data: parent.ajax.data,
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
            if (parent.columns === "") {
                parent.columns = response.columns;
            }

            parent.totalData = response.data.length;
            for (let i = 0; i < response.data.length; i++) {
                let tr = $('<tr/>', {});
                for (let k = 0; k < parent.columns.length; k++) {
                    let td = $('<td/>', {
                        html: response.data[i][parent.columns[k].data],
                        column: parent.columns[k].data,
                        "data-value": response.data[i][parent.columns[k].data]
                    });
                    tr.append(td);

                }
                parent.tbody.append(tr);
                if (i >= parent.dataLength) {
                    tr.hide();
                }
            }
            if (parent.container.find("thead").length > 0) {
                parent.container.find("thead tr th").css({});
            }
            if (response.data.length <= 0) {
                parent.tbody.html("Tabloda Veri Yok");
                return;
            }

            rePage();


        },
        error: function (e) {

        }
    });

    this.getSelectedRow = function () {

        var obj = {};

        var row = parent.container.find("tbody tr.selected");

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

        var row = parent.container.find("tbody tr").eq(index);

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
        var rows = parent.container.find("tbody tr");
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

    var parent = this;


    if (typeof params !== "undefined") {


        if (typeof params.type !== "undefined") {
            parent.type = params.type;
        }

        if (typeof params.title !== "undefined") {
            parent.title = params.title;
        }

        if (typeof params.content !== "undefined") {
            parent.content = params.content;
        }

        if (typeof  params.showConfirmButton !== "undefined") {
            parent.showConfirmButton = params.showConfirmButton;
        }

        if (typeof params.confirmButtonText !== "undefined") {
            parent.confirmButtonText = params.confirmButtonText;
        }

        if (typeof params.confirmButtonBackground !== "undefined") {
            parent.confirmButtonBackground = params.confirmButtonBackground;
        }

        if (typeof params.confirmButtonTextColor !== "undefined") {
            parent.confirmButtonTextColor = params.confirmButtonTextColor;
        }

        if (typeof params.closable !== "undefined") {
            parent.closable = params.closable;
        }

        if (typeof params.disableClose !== "undefined") {
            parent.disableClose = params.disableClose;
        }

        if (typeof params.buttons !== "undefined") {
            parent.buttons = params.buttons;
        }

    }

    this.container = $('<div/>', {
        class: "bs-alert-container"
    });
    this.body = $('<div/>', {
        class: "bs-alert-body"
    });

    if (parent.closable === true) {
        parent.container.click(function () {
            parent.close();
        });
    }


    this.iconContainer = $('<div/>', {
        class: "bs-alert-icon-container",
    });

    this.iconContent = $('<div/>', {
        class: "bs-alert-icon-content",
        html: parent.type === "success" ? "&#10004;" : parent.type === "danger" ? "&#x274C;" : ""
    });
    this.iconContainer.append(this.iconContent);


    this.titleContainer = $('<div/>', {
        class: "bs-alert-title-container",
    });
    this.titleContent = $('<div/>', {
        class: "bs-alert-title-content",
        html: parent.title
    });
    this.titleContainer.append(this.titleContent);


    this.contentContainer = $('<div/>', {
        class: "bs-alert-content-container",
    });
    this.contentContent = $('<div/>', {
        class: "bs-alert-content-content",
        html: parent.content
    });
    this.contentContainer.append(this.contentContent);


    this.buttonsContainer = $('<div/>', {
        class: "bs-alert-buttons-container"
    });


    if (typeof parent.buttons === "object") {
        parent.buttons.forEach(function (e) {
            var btn = $('<button/>', {
                class: "bs-alert-button",
                type: "button",
                html: e.text,
                style: "background:" + e.background + ";color:" + e.color,
                "btn-val": e.value
            });
            if (typeof e.show === "undefined" || e.show !== true) {
                parent.buttonsContainer.append(btn);
            }
            btn.click(function () {
                if (typeof callback === "function") {
                    callback($(this).attr("btn-val"));
                    if (parent.disableClose !== true) {
                        parent.close();
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


    $("body").append(parent.container);

    this.close = function () {
        parent.body.css("animation-name", "zoomOut");
        setTimeout(function () {
            parent.container.remove();
        }, 300);
    };

    this.updateTitle = function (title) {
        parent.container.find(".bs-alert-title-content").html(title);
    };

    this.updateContent = function (content) {
        parent.container.find(".bs-alert-content-content").html(content);
    };

    return this;
};


$.bsNotification = function (params, callback) {

    this.type = "success";
    this.content = "";
    this.showSingle = false;
    this.duration = 2000;
    var parent = this;

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
    if (parent.showSingle === true) {
        $(".bs-notification").remove();
    }
    let notificationsCount = $(".bs-notification").length;

    this.div = $('<div/>', {
        class: "bs-notification bs-notification-" + parent.type,
        style: "top:" + notificationsCount * 40 + "px;",
        text: parent.content
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
        }, parent.duration);
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
