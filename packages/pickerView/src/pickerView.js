(function () {
    var util = {
        extend: function (target) {
            for (var i = 1, len = arguments.length; i < len; i++) {
                for (var prop in arguments[i]) {
                    if (arguments[i].hasOwnProperty(prop)) {
                        target[prop] = arguments[i][prop];
                    }
                }
            }
            return target;
        },
        indexOf: function (array, item) {
            var result = -1;
            for (var i = 0, len = array.length; i < len; i++) {
                if (array[i] === item) {
                    result = i;
                    break;
                }
            }
            return result;
        },
        css: function (elem, obj) {
            for (var i in obj) {
                elem.style[i] = obj[i];
            }
        },
        addClass: function (element, className) {
            var classNames = element.className.split(/\s+/);
            if (util.indexOf(classNames, className) == -1) {
                classNames.push(className);
            }
            element.className = classNames.join(' ');
        },
        removeClass: function (element, className) {
            var classNames = element.className.split(/\s+/);
            var index = util.indexOf(classNames, className);
            if (index !== -1) {
                classNames.splice(index, 1);
            }
            element.className = classNames.join(' ');
        },
        hasClass: function (element, className) {
            if (!element || !element.className) return false;
            var classNames = element.className.split(/\s+/);
            return util.indexOf(classNames, className) != -1;
        },
        parents: function (elem, pClass) { // 递归函数通过父亲的classname获取元素
            if (!elem) return null;
            var parent = elem.parentNode;
            if (parent === document) return null;
            if (!this.hasClass(parent, pClass)) parent = this.parents(parent, pClass);
            return parent;
        },
        isObject: function (o) {
            return Object.prototype.toString.call(o) == "[object Object]";
        },
        isArray: function (o) {
            return Object.prototype.toString.call(o) == "[object Array]";
        }
    };

    function PickerView(opt) {

        var _this = this;

        this.Opt = {
            title: '标题',
            leftText: '取消',
            rightText: '确定',
            pickTouchSpeed: '0.3s',
            saveFn: function (selectArr) {

            }
        };

        // 同步参数
        for (var i in opt) {
            if (opt[i]) this.Opt[i] = opt[i];
        }

        this._y_start = "";
        this._y_move = "";
        this._y_end = "";
        this.top_start = 0; // 移动起始点
        this.isMove = false; // 是否是移动聊天框

        this.elem_wrap = null; // 最外层的容器
        this.elem_leftBtn = null; // 左按钮元素
        this.elem_rightBtn = null; // 右按钮元素
        this.elem_contents = null; // items容器
        this.elem_mask = null; // 黑色背景

        var selectcache = this.Opt.bindElem.getAttribute("selectcache");
        this.selectcache = selectcache ? selectcache.split(",") : [];
        this.selectArr = []; // 选项对应的元素序列号 如：[0,0,0]
        this.fleeIndex = null; //
        this.init();

    }

    PickerView.VERSION = '1.0.0';

    PickerView.defaultOpt = {
        headerHeight: 45, // 头部默认高度
        itemHeight: 34, // 每个item的默认高度
    };

    PickerView.prototype = {
        constructor: PickerView,
        getItemTpl: function (keys) {
            var item_html = "";
            for (var i = 0; i < keys.length; i++) {
                // style="fornt-size:' + 16 + 'px;"
                item_html += '<div class="content-item">' + keys[i] + '</div>';
            }
            return item_html;
        },
        getItemsTpl: function (keys) {
            var fieldIndex = this.selectcache[this.selectArr.length] ? this.selectcache[this.selectArr.length] : 0;
            this.fleeIndex = fieldIndex;
            console.log(this.fleeIndex);
            this.selectArr.push(fieldIndex);
            var html = "",
                item_html = this.getItemTpl(keys);


            html += '<div index="' + (this.selectArr.length - 1) + '" class="ns-pickerView-box__content">' +
                '<div style="background-size:100% ' + this.padding + 'px;" class="content-mask"></div>' +
                '<div style="top:' + this.padding + 'px;" class="content-indicator"></div>' +
                '<div style="padding:' + this.padding + 'px 0;transform:translate3d(0,' + this.fleeIndex + 'px,0)" fieldIndex="0" class="content-items">' +
                item_html +
                '</div>' +
                '</div>';

            return html;
        },
        renderItems: function (obj) {
            var _this = this,
                html = "",
                arr = obj,
                isObj = util.isObject(obj);

            if (isObj) arr = Object.keys(obj);
            html += this.getItemsTpl(arr);
            var fieldIndex = this.selectArr[this.selectArr.length - 1];
            if (isObj) html += this.renderItems(obj[arr[fieldIndex]]);

            return html;
        },
        getTpl: function () {
            var html = '<div class="ns-pickerView-mask"></div><div class="ns-pickerView-box">' +
                '<div class="ns-pickerView-box__header">' +
                '<div class="ns-pickerView-box__header-btn left">' + this.Opt.leftText + '</div>' +
                '<div class="ns-pickerView-box__header-title">' + this.Opt.title + '</div>' +
                '<div class="ns-pickerView-box__header-btn right">' + this.Opt.rightText + '</div>' +
                '</div>' +
                '<div class="ns-pickerView-box__content-wrap">';

            html += this.renderItems(this.Opt.data);
            html += '</div></div>';

            return html;
        },
        init: function () {
            var _this = this,
                body = document.getElementsByTagName("body")[0],
                div = document.createElement("div");

            div.className = "ns-pickerView";
            this.elem_wrap = div;
            this.padding = (document.documentElement.clientHeight * 0.4 - PickerView.defaultOpt.headerHeight - PickerView.defaultOpt.itemHeight) / 2;
            div.innerHTML = this.getTpl();
            body.appendChild(div);

            this.elem_mask = this.elem_wrap.getElementsByClassName("ns-pickerView-mask")[0];
            this.elem_contents = this.elem_wrap.getElementsByClassName("ns-pickerView-box__content-wrap")[0];
            this.elem_leftBtn = this.elem_wrap.getElementsByClassName("left")[0];
            this.elem_rightBtn = this.elem_wrap.getElementsByClassName("right")[0];

            this.elem_contents.addEventListener("touchstart", function (e) {
                _this.moveObj = util.parents(e.target, "ns-pickerView-box__content").children[2];
                _this.touchstart(e);
                e.stopPropagation();
            }, false);
            this.elem_contents.addEventListener("touchmove", function (e) {
                _this.touchmove(e);
                e.stopPropagation();
                e.preventDefault();
            }, false);
            this.elem_contents.addEventListener("touchend", function (e) {
                _this.touchend(e);
                e.stopPropagation();
            }, false);
            this.elem_mask.addEventListener("touchend", function (e) {
                _this.closeComponent();
                e.stopPropagation();
                e.preventDefault()
            }, false);
            this.elem_leftBtn.addEventListener("touchend", function (e) {
                _this.closeComponent();
                e.stopPropagation();
                e.preventDefault()
            }, false);
            this.elem_rightBtn.addEventListener("touchend", function (e) {
                var selectArr = [];
                for (var i = 0; i < _this.elem_contents.children.length; i++) {
                    var items = _this.elem_contents.children[i].children[2],
                        field = items.children.length > 0 ? items.children[_this.selectArr[i]].innerText : "";

                    selectArr.push(field);
                }
                _this.Opt.rightBtnFn(selectArr);
                _this.closeComponent();
                // 绑定元素
                _this.Opt.bindElem.setAttribute("selectcache", _this.selectArr);
                e.stopPropagation();
                e.preventDefault()
            }, false);

        },
        touchstart: function (e) {
            this._y_start = e.touches[0].pageY;
            this.isMove = false;
            this.top_start = parseInt(this.moveObj.style.transform.split(",")[1]);
        },
        touchmove: function (e) {
            var _this = this;
            this.isMove = true;
            this._y_move = e.touches[0].pageY;
            var len = parseFloat(this._y_move) - parseFloat(this._y_start) + parseFloat(this.top_start);
            util.css(_this.moveObj, {
                "transform": 'translate3d(0,' + len + 'px,0)'
            });
            this.top_end = len;
        },
        touchend: function (e) {
            if (!this.isMove) return;
            this.isMove = false;

            var _this = this,
                itemHeight = PickerView.defaultOpt.itemHeight,
                sign = this.top_end >= 0 ? 1 : -1,
                index = this.moveObj.parentNode.getAttribute("index"),
                fieldIndex = Math.round(Math.abs(this.top_end) / itemHeight),
                len = sign * (fieldIndex * itemHeight);

            if (len > 0) {
                len = 0;
                fieldIndex = 0;
            } else if (len < -(this.moveObj.children.length - 1) * itemHeight) {
                len = -(this.moveObj.children.length - 1) * itemHeight;
                fieldIndex = this.moveObj.children.length - 1;
            }


            this.selectArr[index] = fieldIndex;
            this.moveObj.setAttribute("fieldIndex", fieldIndex);

            this.moveObj.style.transition = this.Opt.pickTouchSpeed + " cubic-bezier(0,0,0.2,1.15)";
            util.css(_this.moveObj, {
                "transform": 'translate3d(0,' + len + 'px,0)'
            });
            _this.changeNext(index);
            _this.moveObj.addEventListener("transitionend", function (event) {
                _this.moveObj.style.transition = "";
            }, false);
            _this.moveObj.addEventListener("webkitTransitionEnd", function (event) {
                _this.moveObj.style.transition = "";
            }, false);

        },
        changeNext: function (index) {
            var data = this.Opt.data,
                arr = [];

            for (var i = 0; i < this.selectArr.length; i++) {
                var elem_items = this.elem_contents.children[i].children[2];

                if (i > index) {
                    util.css(elem_items, {
                        "transform": 'translate3d(0,0,0)'
                    });
                    this.selectArr[i] = 0;
                    arr = util.isObject(data) ? Object.keys(data) : data;
                    elem_items.innerHTML = this.getItemTpl(arr);
                    var field = arr[0];
                    data = data[field];
                } else {
                    var field = elem_items.children[this.selectArr[i]].innerText;
                    data = data[field];
                }
            }
        },
        closeComponent: function () {
            var body = document.getElementsByTagName("body")[0];
            body.removeChild(this.elem_wrap);
        }
    };

    window.PickerView = PickerView;

})();
