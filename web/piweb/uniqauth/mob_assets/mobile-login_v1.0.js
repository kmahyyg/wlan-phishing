
// 全局参数，是否需要验证码
var needCaptcha = false;

(function () {
    if(getObj("errorMsg")){
        showTips(getObj("errorMsg").innerHTML);
    }
    }
})();

// 统一校验必填和展示错误信息的方法
function checkRequired(obj, msg) {
    if (obj.value == "") {
        showTips(msg);
        return false;
    } else {
        return true;
    }
}


