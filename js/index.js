import "velocity-animate";
import "../node_modules/velocity-animate/velocity.ui.js";
//import "bootstrap";
import "bootstrap";
import "../node_modules/bootstrap/dist/css/bootstrap.css";

// import layer
import "../node_modules/layui-layer/dist/layer.js";

import JsonFromat from "./JsonFormat.js";
import TxtDiff from "./TxtDiff.js";

	
var pageObj = {
	system: {},	// app系统级别的变量
	sectionIndex: {},	// 各个section的index
	nowSectionIndex: 1,	// 当前的section索引
	sectionCache: {},	// 各个section内容的缓存
};

pageObj.initLoading = function() {
	$("#loading").velocity("transition.whirlOut", { duration: 650 });
	$("#loading").remove();
};

pageObj.initMenu = function() {
	let zIndexStart = 1000;
	$("#index>.right>.section:eq(0)").css("z-index", zIndexStart++);
	$("#index>.right>.section:gt(0)").css("top", "-100%");
	$("#index>.left").on("click", ".item", function(e){
		let me = $(this);
		let index = $("#index>.left>.item").index(this);
		let lastIndex = $("#index>.left>.item").index($("#index>.left>.item.active"));
		// 判断是否当前元素
		if (index == lastIndex) {
			return true;
		}
		let topGap = lastIndex > index ? "-100%" : "100%";
		let lastTopGap = lastIndex > index ? "100%" : "-100%";

		let section = $("#index>.right>.section:eq("+index+")");
		let lastSection = $("#index>.right>.section:eq("+lastIndex+")");
		me.siblings(".item").removeClass("active");
		section.css({
			"top": topGap,
			"z-index": zIndexStart++
		});
		setTimeout(function (argument) {
			lastSection.velocity(
				{
					top: lastTopGap
				},
				{
					duration: 300,
					easing: "ease-in"
				}
			);
			section.velocity(
				{
					top: 0
				},
				{
					duration: 300,
					queue: false,
					easing: "ease-in"
				}
			);
			me.addClass("active");
		}, 100);
	});	
};

pageObj.init = function(){
	// 初始化各个模块
	$(function() {
		pageObj.initLoading();
		pageObj.initMenu();
		JsonFromat();
		TxtDiff();
	});
};
pageObj.init();



