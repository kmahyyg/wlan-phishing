$(function() {
	var host = location.protocol + "//" + (portal.AuthIP||location.hostname);
	if (location.protocol == "https:") {
		window.location.href="http:" + "//" + window.location.host;
	}
	//show error
	function showErrorMessage(error, success, redirect) {
		var icon = 2;
		if (typeof success != "undefined" || success) {
			icon = 1
		}
		var message = error;
		if (typeof(translate[error]) != "undefined") {
			message = translate[error];
		}
		if (typeof redirect != "undefined" && redirect) {
			layer.alert(message, { icon: icon, skin: 'layui-layer-molv' }, function(){
				location.href = "./";
			});
			return;
		}
		layer.alert(message, { icon: icon, skin: 'layui-layer-molv' });
	}
	//Change Language
	$("#language").click(function() {
		var language = $(this).text();
		var l = "zh-CN";
		if (typeof language != "undefined" && language == "English") {
			l = "en-US";
		} else {
			if (typeof lang != "undefined") {
				l = lang == "zh-CN" ? "en-US" : "zh-CN";
			}
		}
		$.Language(l);
	});
	//Message
	$.Message("./v1/srun_portal_message", {}, function(data) {
		if (data.Code == 0) {
            if (data.Data.length > 0) {
            	$("#notice-title").text(data.Data[0].Title)
                $("#notice-content").html(data.Data[0].Content);
            }
        }
	});
	//Keydown
    // username 回车/tab 焦点下移动
    $("#username").keydown(function (e) {
        if(e.keyCode == 108||e.keyCode == 13||e.keyCode == 9){
            // 阻止冒泡
            e.preventDefault();
            $("#password").focus();
        }
    });

    // password 回车触发提交
   //  $("#password").keydown(function (e) {
   //      if(e.keyCode == 108||e.keyCode == 13){
    //         $("#login").click();
   //          $("#password").blur();
   //          $("#login").addClass("hover");
   //      }
  //   });

    // 全局 回车触发提交
    $("body").keydown(function (e) {
        if(document.getElementById("username") != document.activeElement && document.getElementById("password") != document.activeElement){
            if(e.keyCode == 108||e.keyCode == 13){
                $("#login").click();
                $("#password").blur();
                $("#login").addClass("hover");
            }
        }
    });
	//Login
	$("#login").click(function() {
		setTimeout(function () {
            $("#login").removeClass("hover");
        },100)
		//username is empty
		var username = $("#username").val();
		if (username == "") {
			$("#username").focus();
			return;
		}
		//password is empty
		var password = $("#password").val();
		if (password == "") {
			$("#password").focus();
			return;
		}
		var params = {
			username:username,
			domain:"",
			password:password,
			ac_id:$("#ac_id").val(),
			ip:$("#user_ip").val()
		};
		if ($("#domain").val() != undefined) {
			params.domain = $("#domain").val();
		}
		$.Login(host, params, function(data) {
			if (data.error == "ok") {
				var sUserAgent = navigator.userAgent.toLowerCase();
			      var bIsIpad = sUserAgent.match(/ipad/i) == 'ipad';
			      var bIsIphone = sUserAgent.match(/iphone os/i) == 'iphone os';
			      var bIsMidp = sUserAgent.match(/midp/i) == 'midp';
			      var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == 'rv:1.2.3.4';
			      var bIsUc = sUserAgent.match(/ucweb/i) == 'web';
			      var bIsCE = sUserAgent.match(/windows ce/i) == 'windows ce';
			      var bIsWM = sUserAgent.match(/windows mobile/i) == 'windows mobile';
			      var bIsAndroid = sUserAgent.match(/android/i) == 'android';
			      if(bIsIpad || bIsIphone || bIsMidp || bIsUc7 || bIsUc || bIsCE || bIsWM || bIsAndroid ){
			    	  window.location.href = "http://202.203.208.5/srun_portal_success"+location.search + "&srun_domain=" + params.domain, "","width=450,height=350,left=0,top=0,resizable=1";//弹出小窗口
			      } else {
			    	  window.open("http://202.203.208.5/srun_portal_success"+location.search + "&srun_domain=" + params.domain, "","width=450,height=350,left=0,top=0,resizable=1");
			        }
				//Redirect Success Page
	            //location.href = "./srun_portal_success"+location.search;
			} else {
				//Show Error Message
				showErrorMessage(data.message);
				/*var message = data.message;
				$.get("/v1/srun_portal_log", {username:username}, function(response) {
					if (response.Code == 0){
						if (response.Message.indexOf("E") == 0) {
							if(response.Message.substr(0,5)=='E0000'){
								window.open("http://202.203.208.5/srun_portal_success"+location.search + "&srun_domain=" + params.domain, "","width=450,height=350,left=0,top=0,resizable=1");//弹出小窗口
							}else{
								showErrorMessage(response.Message.substr(0,5));
							}
						} else {
							showErrorMessage(response.Message);
						}
					} else {
						showErrorMessage(message);
					}
				});*/
			}
		});
	});
	//Logout DM
	$("#logout-dm").click(function() {
		//username is empty
		var username = $("#username").val();
		if (username == "") {
			$("#username").focus();
			return;
		} 
		//password is empty
		var password = $("#password").val();
		if (password == "") {
			$("#password").focus();
			return;
		}
		var params = {
			username:username,
			domain:"",
			password:password,
			ac_id:$("#ac_id").val(),
			ip:$("#user_ip").val()
		};
		if ($("#domain").val() != undefined) {
			params.domain = $("#domain").val();
		}
		$.DM(host, params, function(data) {
			if (data.error == "ok") {
				//Show DM Logout OK!
				showErrorMessage("LogoutOK", true);
			} else {
				//Show Error Message
				showErrorMessage(data.message);
			}
		});
	});
	//Logout
	$("#logout").click(function() {
		var params = {
			username:$("#username").val(),
			ac_id:$("#ac_id").val(),
			ip:$("#user_ip").val()
		};
		$.Logout(host, params, function(data) {
			if (data.error == "ok") {
				isLogin = false;
				//Redirect Login Page
				window.close();
                location.href="./";
			} else {
				//Show Error Message
				showErrorMessage(data.message);
			}
		});
	});
	//Get Verify Code
	//clearTimeout(loading);//停止倒计时
	$("#code").click(function() {
		$this = $(this);
		if ($this.hasClass("disabled")) {
			return false;
		}
		//phone is phone?
		var phone = $("#username").val();
		if (phone == "") {
			$("#username").focus();
			return;
		}
		var ip = $("#user_ip").val();
		var mac = $("#user_mac").val();
		var wait = 60, loading;
        function time(t) {
            if (t == 1) {
            	$this.text(translate["GetVerifyCode"]||"获取验证码");
            	$this.removeClass("disabled");
            } else {
                t--;
                $this.text(t+(translate["S"]||"秒"));
                loading = setTimeout(function(){time(t)}, 1000);
            }
        }
        $this.addClass("disabled");
        time(wait);
        var params = {
        	phone: phone,
        	ip: ip,
        	mac: mac
        };
        $.GetVerifyCode(host, params, function(data) {
        	if (data.error == "ok") {
        		//Show Success Message
        		showErrorMessage("SendVerifyCodeOK", true);
        	} else {
        		//Stop
        		clearTimeout(loading);
        		$this.text(translate["GetVerifyCode"]||"获取验证码");
        		$this.removeClass("disabled");
        		//Show Error Message
				showErrorMessage(data.message);
        	}
        });
	});
	//SMS Auth
	$("#sms-login").click(function() {
		//phone is phone?
		var phone = $("#username").val();
		if (phone == "") {
			$("#username").focus();
			return;
		}
		//vcode is empty
		var vcode = $("#vcode").val();
		if (vcode == "") {
			$("#vcode").focus();
			return;
		}
		var ip = $("#user_ip").val();
		var mac = $("#user_mac").val();
		var ac_id = $("#ac_id").val();
		var params = {
        	phone:phone,
        	ip:ip,
        	mac:mac,
        	vcode:vcode,
        	ac_id:ac_id
        };
		$.SmsAuth(host, params, function(data) {
			if (data.error == "ok") {
				//Redirect Success Page
	            location.href = "http://202.203.208.5/srun_portal_success"+location.search;
			} else {
				//Show Error Message
				showErrorMessage(data.message);
			}
		});
	});
	//Success Page
	if (typeof(success) != "undefined" && success) {
		$.Info(host, {}, function(data) {
			if (data.error == "ok") {
				$.Detect(function(response) {
					if (response.Redirect) {
						if ($.isMobile() && response.Mobile != "") {
							location.href = response.Mobile;
						} else if (response.Pc != "") {
							location.href = response.Pc;
						}
					}
				});
				$("#username").val(data.user_name);
				$("#user_name").html(data.user_name);
				$("#used_flow").html(data.used_flow);
				$("#used_time").html(data.used_time);
				$("#balance").html(data.balance);
				$("#ip").html(data.ip);
				var domain = getQueryString("srun_domain");
				if (domain != "" && data.domain != "" && data.user_name.indexOf(data.domain) == -1) {
					$("#domain").val("@"+data.domain);
				}
			} else {
				//show error message
				showErrorMessage(data.message, false, true);
			}
		});
	}
	//Qrcode Page
	if (typeof qrcode != "undefined" && qrcode) {
		var params = {
			key:$("#key").val(),
			username:$("#username").val(),
			ac_id:$("#ac_id").val()
		};
		$.Qrcode(host, params, function(data){
			if (data.error == "ok") {
				//Redirect Success Page
				location.href = "http://202.203.208.5/srun_portal_success?ac_id="+params.ac_id+"&theme="+theme;
			} else {
				//Show Error Message
				showErrorMessage(data.message);
			}
		});
	}
	//Wechat
	if (typeof wechat != "undefined" && wechat) {
		var ua = navigator.userAgent;
		var isIOS = false;
		if (ua.indexOf("iPhone") != -1 || ua.indexOf("iPod") !=- 1 || ua.indexOf("iPad") != -1) {   //iPhone|iPod|iPad            
			isIOS = true;
		}
		var wifiConfig = "";
		if (isIOS) { //now request provisional release
			var params = { ac_id:acid, ip:ip };
			$.Release(host, params, function(data) {
				if (data.error == "ok") {
					wifiConfig = data.wifiConfig;
					return;
				}
				//show error message
				showErrorMessage(data.message);
				//disabled
				$("#call").addClass("disabled");
			});
		}
		$("#call").click(function() {
			if ($(this).hasClass("disabled")) {
				showErrorMessage("IsEvokingWeChat");
				return false;
			}
			$("#call").addClass("disabled");
			if (!isIOS) {//no ios,request provisional release and auth
				var params = { ac_id:acid, ip:ip, ssid:ssid };
				$.WeixinRelease(host, params, function(data) {
					if (data.error == "ok") {
						config = data.wifiConfig;
						Wechat_GotoRedirect(
							config.appid,
                            config.extend,
                            config.timestamp,
                            config.sign,
                            config.shop_id,
                            config.authUrl,
                            config.mac,
                            config.ssid,
                            config.bssid
						);
						return;
					}
					//show error message
					showErrorMessage(data.message);
				});
			} else {
				//weixin auth
				var params = {
		            ac_id:acid,
		            ip:ip,
		            ssid:ssid,
					bssid:wifiConfig.bssid||"",
		            mac:wifiConfig.mac||"",
		            token:wifiConfig.token||""
		        };
		        $.WeiXinCall(host, params, function(data) {
		        	if (data.error == "ok") {
		        		config = data.wifiConfig;
						Wechat_GotoRedirect(
							config.appid,
                            config.extend,
                            config.timestamp,
                            config.sign,
                            config.shop_id,
                            config.authUrl,
                            config.mac,
                            config.ssid,
                            config.bssid
						);
						return;
		        	}
		        	//show error message
					showErrorMessage(data.message);
		        });
			}
		});
	}
	//Cas
	if (typeof cas != "undefined" && cas) {
		$.CAS(function(data) {
			if (data.error == "ok") {
				//Redirect success page
				location.href = "http://202.203.208.5/srun_portal_success?ac_id="+data.ac_id;
			} else {
				if (data.code == 301) {
					location.href = data.redirect;
				}
				//Show Error Message
				showErrorMessage(data.message);
			}
		});
	}
});
