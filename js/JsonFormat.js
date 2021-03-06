import JSONEditor from "JSONEditor";
import "../node_modules/jsoneditor/dist/jsoneditor.css";
import utilMine from "../node_modules/jsoneditor/src/js/util";
JSONEditor.prototype.setMode = function (mode) {
  var container = this.container;
  var options = utilMine.extend({}, this.options);
  var oldMode = options.mode;
  var data;
  var name;

  options.mode = mode;
  var config = JSONEditor.modes[mode];
  if (config) {
    try {
      var asText = (config.data == 'text');
      name = this.getName();
      data = this[asText ? 'getText' : 'get'](); // get text or json

      this.destroy();
      utilMine.clear(this);
      utilMine.extend(this, config.mixin);
      this.create(container, options);

      this.setName(name);
      this[asText ? 'setText' : 'set'](data); // set text or json

      if (typeof config.load === 'function') {
        try {
          config.load.call(this);
        }
        catch (err) {
          console.error(err);
        }
      }

      if (typeof options.onModeChange === 'function') {
        try {
          options.onModeChange(mode, oldMode);
        }
        catch (err) {
          console.error(err);
        }
      }
    }
    catch (err) {
      this._onError(err);
    }
  }
  else {
    throw new Error('Unknown mode "' + options.mode + '"');
  }
};

export default () => {
  	let container, options, json,
      nowFontSize = 13,
      containerId = "json-format-container";

    function changeEditorFontSize(fontSize, duration) {
      duration = typeof(duration) != "undefined" ? duration : 0;
      $("#json-format #json-format-container .jsoneditor .ace_editor.ace-jsoneditor").velocity({
        "font-size": fontSize
      }, {
        duration: duration,
      });
    }

    function formatMenuInfo() {
      $("button[type=button].jsoneditor-repair").remove();
      $("a.jsoneditor-poweredBy").remove();

      $("button.jsoneditor-type-modes.jsoneditor-selected").attr("disabled", "disabled");

      // 增加历史记录按钮
      //$(".jsoneditor-menu > .jsoneditor-modes").after('<button type="button" class="jsoneditor-history" disabled=""></button>');
    };

  	container = document.getElementById(containerId);

  	options = {
    	mode: 'code',
    	modes: ['code', 'tree'], // allowed modes
    	onError: function (err) {
    	  	var error = err.toString();
      		layer.msg(
      			"出现错误：" + error, {
        		time: 2000, //2s后自动关闭
      		});	    	  	
    	},
      onModeChange: function(newMode, oldMode) {
        formatMenuInfo();
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
    var editor = new JSONEditor(container, options, json);	



    (function() {
      formatMenuInfo();
    })();
};