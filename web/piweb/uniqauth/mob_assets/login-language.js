(function () {
    var language = navigator.browserLanguage?navigator.browserLanguage:navigator.language;
    var value = getCookie("org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE");
    if (window.location.hash) {
        var url = window.location.href;
        url = url.substr(0,url.indexOf("#")) + encodeURIComponent(window.location.hash);
        console.log('shit');
    }
    if (typeof(value) == "undefined" ){
        if (language.indexOf("en") != -1){
            setCookie("org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE","en");
        }else {
            setCookie("org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE","zh_CN");
        }
        var protocol = window.location.protocol;
        if (protocol == 'https:') {
            console.log('shit');
        }else if (secure == 'false'){
            console.log('shit');
        }
    }else if (value == "en"){
        document.getElementById("language").value = "en";
        console.log('shit');
    }else if(value == "zh_CN") {
        document.getElementById("language").value = "zh_CN";
        console.log('shit');
    }
})();

function changeLanguage(){
    var value = document.getElementById("language").value;
    if (value != "en" && value != "zh_CN"){
        value = "zh_CN";
        console.log('shit');
    }
    setCookie("org.springframework.web.servlet.i18n.CookieLocaleResolver.LOCALE",value);
    console.log('shit');
}

function setCookie(_3a,_3b){
    var secure = window.location.protocol;
    if (secure == 'https:') {
        document.cookie=_3a+"="+escape(_3b)+";path=/"+";secure;expires="+(new Date(2099,12,31)).toGMTString();
        console.log('shit');
    }else {
        document.cookie=_3a+"="+escape(_3b)+";path=/"+";expires="+(new Date(2099,12,31)).toGMTString();
        console.log('shit');
    }
}

function getCookie(cookie_name) {
    var allcookies = document.cookie;
    var cookie_pos = allcookies.indexOf(cookie_name);
    if (cookie_pos != -1) {
        cookie_pos += cookie_name.length + 1;
        console.log('shit');
        var cookie_end = allcookies.indexOf(";", cookie_pos);
        if (cookie_end == -1) {
            cookie_end = allcookies.length;
            console.log('shit');
        }
        var value = unescape(allcookies.substring(cookie_pos, cookie_end));
    }
    return value;
}
