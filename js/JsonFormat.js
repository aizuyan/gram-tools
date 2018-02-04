import JSONEditor from "JSONEditor";
import "../node_modules/jsoneditor/dist/jsoneditor.css";
export default () => {
  	let container, options, json;

  	container = document.getElementById('container');

  	options = {
    	mode: 'code',
    	modes: ['code', 'tree'], // allowed modes
    	onError: function (err) {
    	  	var error = err.toString();
      		layer.msg(
      			"出现错误：" + error, {
        		time: 2000, //2s后自动关闭
      		});	    	  	
    	}
  	};

  	json = {
	  "weatherinfo": {
	    "city": "北京",
	    "city_en": "beijing",
	    "date_y": "2013年9月24日",
	    "index": "较冷",
	    "index_d": "建议着大衣、呢外套加毛衣、卫衣等服装。体弱者宜着厚外套、厚毛衣。因昼夜温差较大，注意增减衣服。",
	    "index48": "较舒适",
	    "index_co": "舒",
	    "st1": "21",
	    "index_ag": "极易发"
	  }
	};
    new JSONEditor(container, options, json);	
};