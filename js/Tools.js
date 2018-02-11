/**
 * mcn垂直业务前段基本组件
 *
 *  1. 遮罩层+弹窗提示：
	var maskId = tools.mask("", "opacity:0.3;");
	tools.showInfo(res.msg, 2000, "z-index:1000;top:300px;", (function(){
	    return function() {
	        $("#"+maskId).remove();
	    };
	})()); 
 */
"use strict";
function Tools(){
	this.timers = {};
};

/**
 * 将字符串html中的<>& "替换为html实体
 * 
 * @param  {[type]} html [description]
 * @return {[type]}      [description]
 */
Tools.prototype.htmlEntities = function(html) {
	if (!this.isString(html)) {
		throw "转换html实体，参数必须是字符串";
	}
	// 替换的顺序很重要
	html = this.regA2B(html, [
		[/\t/gm, "    "],
		[/&/gm, "&amp;"],
		[/ /gm, "&nbsp;"],
		[/</gm, "&lt;"],
		[/>/gm, "&gt;"],
		[/"/gm, "&quot;"],
		[/'/gm, "&#39;"]
	]);

	return html;
};

/**
 * 从浏览器链接参数中获取参数值
 * 
 * @param  {[type]} name [description]
 * @return {[type]}      [description]
 */
Tools.prototype.getQueryString = function(name, url) { 
	url = typeof(url) != "string" ? window.location.search : url;
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); 
	var r = url.substr(1).match(reg); 
	if (r != null) {
		return decodeURIComponent(r[2]);
	} else {
		return null;
	}
}; 

/**
 * 节流器
 * 使用场景举例：
 * 		滚动条滚动事件
 * 
 * @param  {function} func    执行的函数
 * @param  {int} gap     定时器毫秒，可为空，默认0.3s
 * @param  {string} 使用的定时器id，可为空，默认为函数.toString()
 * @param  {object} context 函数执行的上下文，可为空
 * @return {}         [description]
 */
Tools.prototype.throttler = function(func, gap, timerId, context) {
	gap = gap || 300;
	timerId = timerId || func.toString();
	// 清除之前的定时器
	clearTimeout(this.timers[timerId]);
	this.timers[timerId] = setTimeout(function(){
		func.call(context);
	}, gap);
	return this.timers[timerId];
};

/**
 * 字符串变量替换
 * var str = "你好{name},我今年{age}岁";
 * var format = tools.formatString(str, {
 * 	name: "燕睿涛",
 * 	age: 26
 * });
 *
 * format 为 你好燕睿涛,我今年26岁
 * 
 * @param  {[type]} str     [description]
 * @param  {[type]} formats [description]
 * @return {[type]}         [description]
 */
Tools.prototype.formatString = function(str, formats) {
    var i, re;
    for (i in formats) {
    	re = new RegExp("\\{" + i + "\\}", "gm");
    	str = str.replace(re, formats[i]);
    }
    return str;
};

/**
 * 正则批量替换字符串
 * var str = " 你好 		；‘’“”（）——，    
 * 
 * ";
 * var format = tools.regA2B(str, [
 *  [/^\s+|\s+$/gm, ""],
 *  [/(\r\n)|(\t)/gm, ""],
 *  [/（/gm, "("],
 *  [/）/gm, ")"],
 *  [/“|”/gm, "\""],
 *  [/‘|’/gm, "'"],
 *  [/，/gm, ","],
 *  [/；/gm, ";"],
 *  [/：/gm, ":"],
 *  [/——/gm, "-"]
 * ]);
 * format 为 你好 ;''""()-,
 *
 * 
 * @param  {[type]} str   [description]
 * @param  {[type]} trans [description]
 * @return {[type]}       [description]
 */
Tools.prototype.regA2B = function(str, trans) {
	var i, re, to;
	for (i in trans) {
		re = trans[i][0];
		to = trans[i][1];
		str = str.replace(re, to);
	}
	return str;
};

/**
 * 转半角字符
 * var str = "你好，Ｉ＇ｍ　Ｙａｎ　Ｒｕｉｔａｏ．　（）［］";
 * var format = tools.toHalfWidth(str);
 * format 为 你好,I'm Yan Ruitao. ()[]
 * 
 * @param  {[type]} str [description]
 * @return {[type]}     [description]
 */
Tools.prototype.toHalfWidth = function(str) {
	var result = "",
		cCode;
    var len = str.length;
    for(var i=0; i<len; i++)
    {
        var cCode = str.charCodeAt(i);
        //全角与半角相差（除空格外）：65248（十进制）
        cCode = (cCode>=0xFF01 && cCode<=0xFF5E)?(cCode - 65248) : cCode;
        //处理空格
        cCode = (cCode==0x03000)?0x0020:cCode;
        result += String.fromCharCode(cCode);
    }
    return result;
};
	
Tools.prototype.formatNum = function(num, decimal, preciseDecimal) {
	if (typeof(num) == "undefined") {
		num = 0;
	}
	decimal = typeof(decimal) == "undefined" ? 1 : decimal;
	if (num <= 9999) {
		preciseDecimal = typeof(preciseDecimal) == "undefined" ? 0 : preciseDecimal;
		num = this.numberFormat(num, preciseDecimal);
	} else if (num <= 99999999) {
		num = num / 10000;
		num = this.numberFormat(num, decimal);
		num = num + "万";
	} else {
		num = num / 100000000;
		num = this.numberFormat(num, decimal);
		num = num + "亿";
	}
	return num;
};

Tools.prototype.numberFormat = function(number, decimals, dec_point, thousands_sep,roundtag) {
    /*
    * 参数说明：
    * number：要格式化的数字
    * decimals：保留几位小数
    * dec_point：小数点符号
    * thousands_sep：千分位符号
    * roundtag:舍入参数，默认 "ceil" 向上取,"floor"向下取,"round" 四舍五入
    * */
    number = (number + '').replace(/[^0-9+-Ee.]/g, '');
    roundtag = roundtag || "round"; //"ceil","floor","round"
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
        s = '',
        toFixedFix = function (n, prec) {
 
            var k = Math.pow(10, prec);
            console.log();
 
            return '' + parseFloat(Math[roundtag](parseFloat((n * k).toFixed(prec*2))).toFixed(prec*2)) / k;
        };
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
    var re = /(-?\d+)(\d{3})/;
    while (re.test(s[0])) {
        s[0] = s[0].replace(re, "$1" + sep + "$2");
    }
 
    if ((s[1] || '').length < prec) {
        s[1] = s[1] || '';
        s[1] += new Array(prec - s[1].length + 1).join('0');
    }
    return s.join(dec);
};

/**
 * 判断一个参数是不是对象
 * 
 * @param  {[type]}  object [description]
 * @return {Boolean}        [description]
 */
Tools.prototype.isObject = function(object) {
	var flag = false;
	flag = toString.apply(object) == "[object Object]";
	return flag;
};

/**
 * 格式化，可以加参数，修改参数
 * var url = "https://weibo.com/u/5824742984/home?wvr=5#where";
 * url = formatUrlParams(url, {
 * 	age: 26,
 * 	name: "燕睿涛",
 * 	where: "homepage",
 * 	wvr: 123
 * });
 * url的新值为 "https://weibo.com/u/5824742984/home?wvr=123&age=26&name=燕睿涛&where=homepage#where"
 * 
 * @param  {[type]} url    [description]
 * @param  {[type]} params [description]
 * @param  {bool} isEncode 是否使用encodeURIComponent对参数进行编码
 * @return {[type]}        [description]
 */
Tools.prototype.formatUrlParams = function(url, params, isEncode) {
	var splitByHash, pureUrl, hashInfo = ""
	, i, reg;
	if(typeof(isEncode) == "undefined") {
		isEncode = true;
	}
	// 参数校验
	if (typeof(url) != "string") {
		throw "要格式化的url必须是字符串";
	}
	if (!this.isObject(params)) {
		throw "参数必须为对象，里面是键值对";
	}
	splitByHash = url.split("#");
	if (splitByHash.length > 2) {
		throw "要格式化的url中最多有一个#hash";
	}
	pureUrl = splitByHash[0];
	if (splitByHash.length == 2) {
		hashInfo = "#" + splitByHash[1];
	}

	for (i in params) {
		reg =  new RegExp("(^|)"+ i +"=([^&]*)(|$)");
		if (pureUrl.match(reg) != null) {
			pureUrl = pureUrl.replace(
				reg, 
				i+"="+ (isEncode ? encodeURIComponent(params[i]) : params[i])
			);
		} else {
			if (pureUrl.match(/\?/g) != null) {
				pureUrl = pureUrl + "&" + i + "=" + (isEncode ? encodeURIComponent(params[i]) : params[i]);
			} else {
				pureUrl = pureUrl + "?" + i + "=" + (isEncode ? encodeURIComponent(params[i]) : params[i]);
			}
		}
	}

	pureUrl += hashInfo;

	return pureUrl;
};

/**
 * 产生随机数，包含最大最小数
 * @param  int min 
 * @param  int max [description]
 * @return int     [description]
 */
Tools.prototype.random = function(min, max) {
      var range = max - min;
      var rand = Math.random();
      var num =  min + Math.round(rand * range);
      return num;
};


Tools.prototype.isString = function(text) {
	return (typeof(text)=='string') && text.constructor == String; 
};

Tools.prototype.isNumber = function(num) {
	return (typeof(num)=='number') && num.constructor == Number; 
}

/**
 * 匹配字符串中的字符是否全是给定的选择类型
 * 	zh: 表示汉子，
 * 	en: 表示大小写字母
 * 	*: 其他的用户传入的会加入字符串匹配中
 *
 * ex:
 * 	checkChar("燕睿涛"); true
 * 	checkChar("我asdsAC"); true
 * 	checkChar("我们的_哈哈", "[-_!]"); true
 * 	要匹配-要注意转义
 * 	checkChar("燕睿涛a   sdASS ", ["zh", "en", "[_\- ]"]); true
 * 	匹配\
 * 	checkChar("燕睿涛a   \\sdASS ", ["zh", "en", "[_\- ]", "[\\\\]"]); true
 * 	
 * @param  {[type]} text  [description]
 * @param  {[type]} types [description]
 * @return {[type]}       [description]
 */
Tools.prototype.checkChar = function(text, types, min, max) {
	var typeRegs, i, reg, regObj, ret, scope;
	if (!this.isString(text)) {
		throw "要校验的对象不是字符串";
	}

	if ("undefined" == typeof(min)) {
		scope = "+";
	} else {
		if (
			!this.isNumber(min) || parseInt(min) < 0
		) {
			throw "字符串长度最小值应该是大于等于0的整数";
		}
		min = parseInt(min);
		scope = "{"+min+",";
		if ("undefined" == typeof(max)) {
			scope += "}";
		} else {
			if(
				!this.isNumber(max) || parseInt(max) < 0 ||
				parseInt(max) < min
			) {
				throw "字符串长度最小值应该是大于等于0的整数，且应该大于等于最小长度";
			}
			max = parseInt(max);
			scope += max + "}";
		}
	}

	var typeRegs = {
		"zh": "[\u4e00-\u9fa5]",
		"en": "[a-zA-Z]"
	},
	i, reg, regObj, ret;

	types = types ? types : ["zh", "en"];
	reg = "^("
	for (i=0; i<types.length; i++) {
		if (!typeRegs[types[i]]) {
			reg += types[i] + "|";
		} else {
			reg += typeRegs[types[i]] + "|";
		}
	}
	reg = reg.substr(0, reg.length - 1);
	reg += ")"+scope+"$";
	console.log(reg);
	regObj = new RegExp(reg);

	ret = regObj.test(text);

	return ret ? true : false;
};

Tools.prototype.checkPhone = function(phone) {
	phone = phone.toString();
	var reg = "^1[3|4|5|7|8][0-9]{9}$",
		regObj = new RegExp(reg);
	var ret = regObj.test(phone);

	return ret ? true : false;
};

Tools.prototype.checkEmail = function(email) {
	email = email.toString()
	var reg = "^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$",
		regObj = new RegExp(reg),
		ret = false;
	ret = regObj.test(email);
	return ret ? true : false;
};

Tools.prototype.mask = function(cls, style) {
	var html = "",
		id;
    style = "background:rgb(0,0,0);opacity:0.7;z-index:999;position:fixed;width: 100%; height: 100%; top:0;bottom:0;left:0;right:0;" + style;
	id = "mask_id_" + this.random(100000, 900000);
	html += "<div id='"
		+ id 
		+ "' class=' "
		+ cls
		+ "' style='"
		+ style
		+ "'>"
		+ '</div>';
	$('body').append(html);
	return id;
};

export default Tools;