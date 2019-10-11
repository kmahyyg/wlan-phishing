(function () {
    //设置main的最小高度
    var winHeight = document.documentElement.clientHeight;//window.innerHeight;
    var windowDiff = 12 * 2;
    var main = document.querySelector('.main');
    if (main != null && main != 'undefined'){
        var mainMinHeight = winHeight - windowDiff;
        main.style.minHeight = mainMinHeight + 'px';
    }
})();

// 定义为根据id查找元素的方法
var getObj = function (obj) {
    return document.getElementById(obj);
}
/**
 * 使用举例
 * ajax({
        url: "./TestXHR.do",              //请求地址
        type: "POST",                       //请求方式
        data: { "name": "super", "age": "20" },        //请求参数
        dataType: "json",
        success: function (response) {
            // 此处放成功后执行的代码
        },
        fail: function (status) {
            // 此处放失败后执行的代码
        }
    });
 * @param options
 */
function ajax(options) {
    options = options || {};
    options.type = (options.type || "GET").toUpperCase();
    options.dataType = options.dataType || "json";
    var params = formatParams(options.data);

    //创建 - 非IE6 - 第一步
    if (window.XMLHttpRequest) {
        var xhr = new XMLHttpRequest();
    } else { //IE6及其以下版本浏览器
        var xhr = new ActiveXObject('Microsoft.XMLHTTP');
    }

    //接收 - 第三步
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
            var status = xhr.status;
            if (status >= 200 && status < 300) {
                options.success && options.success(xhr.responseText);
            } else {
                options.fail && options.fail(status);
            }
        }
    }

    //连接 和 发送 - 第二步
    if (options.type == "GET") {
        xhr.open("GET", options.url + "?" + params, true);
        xhr.send(null);
    } else if (options.type == "POST") {
        xhr.open("POST", options.url, true);
        //设置表单提交时的内容类型
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        xhr.send(params);
    }
}

//格式化参数
function formatParams(data) {
    var arr = [];
    for (var name in data) {
        arr.push(encodeURIComponent(name) + "=" + encodeURIComponent(data[name]));
    }
    arr.push(("v=" + Math.random()).replace(".", ""));
    return arr.join("&");
}

/**
 * 展示提示语
 * @param msg  提示语内容
 */
function showTips(msg) {
    alertBox({
        'time': '2000',
        'content': msg
    });
}

// 显示提示的方法
function alertBox(opts) {
    // 防止连续点击造成的多个提示框
    if(document.querySelector(".bh-alert-box")){
        document.body.removeChild(document.querySelector(".bh-alert-box"));
    }
    var node = document.createElement("div");
    node.classList.add("bh-alert-box");
    node.innerHTML = opts.content;
    document.body.appendChild(node);
    var bhAlertBox = document.querySelector(".bh-alert-box");
    var hig = bhAlertBox.clientHeight;
    var top = parseInt((document.body.clientHeight - hig) / 3);
    bhAlertBox.style.top = top + "px";
    setTimeout(function () {
        // 防止前面提示框丢弃之后导致js报错
        if(bhAlertBox.parentNode != null){
            document.body.removeChild(bhAlertBox);
        }
    }, opts.time)
}

