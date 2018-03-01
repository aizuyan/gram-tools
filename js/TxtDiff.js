var JsDiff = require("diff");
import Tools from "./Tools.js";
const tools = new Tools();
function handleLine(leftTxt, rightTxt, resultObj) {
    let diff = JsDiff.diffLines(leftTxt, rightTxt, {
      ignoreWhitespace: false
    });
    let lineLeft = 0, lineRight = 0;
    let lines = [];
    let element = "";
    let parts;
    console.log(diff);
    for (let i=0 ; i < diff.length; i++) {
      if (diff[i].value[diff[i].value.length - 1] == "\n") {
        diff[i].value = diff[i].value.substr(0, diff[i].value.length - 1);
      }
    }

    diff.forEach(function(part){
      parts = part.value.split("\n");
      if (part.added) {
        parts.forEach(function(item) {
          item = tools.htmlEntities(item);
          lineRight++;
          element = "<div class='level-line line-add'><div class='line-header'><div class='line-num'></div><div class='line-num'>"+lineRight+"</div><div class='line-flag'>+</div></div><div class='line-info'>"+item+"</div></div>";
          lines.push(element);
        });
      } else if (part.removed) {
        parts.forEach(function(item) {
          item = tools.htmlEntities(item);
          lineLeft++;
          element = "<div class='level-line line-delete'><div class='line-header'><div class='line-num'>"+lineLeft+"</div><div class='line-num'></div><div class='line-flag'>-</div></div><div class='line-info'>"+item+"</div></div>";
          lines.push(element);
        });
      } else {
        parts.forEach(function(item) {
          item = tools.htmlEntities(item);
          lineLeft++;
          lineRight++;
          element = "<div class='level-line'><div class='line-header'><div  class='line-num'>"+lineLeft+"</div><div  class='line-num'>"+lineRight+"</div><div class='line-flag'></div></div><div class='line-info'>"+item+"</div></div>";
          lines.push(element);
        });
      }
    });
    let html = lines.join("");
    $(resultObj).html("");
    $(resultObj).append(html);
}

function handleChar(leftTxt, rightTxt, resultObj) {
    let diff = JsDiff.diffChars(leftTxt, rightTxt);
    console.log(diff);
    let lines = [], line = 0, partValue, charAtPos;
    let element = "", changed = 0, last;
    let isOnlyEnter = function(str) {
      let ret = true;
      for (let i=0; i<str.length; i++) {
        if (str.charAt(i) != "\n") {
          ret = false;
          break;
        }
      }
      return ret;
    };
    diff.forEach(function(part){
      partValue = part.value;
      for (let i=0; i<partValue.length; i++) {
        charAtPos = partValue.charAt(i);
        last = charAtPos;
        //if (charAtPos == "\n" && last == charAtPos && !isOnlyEnter(partValue)) {
        if (charAtPos == "\n") {
        } else {
          if (part.added) {
            changed = changed | 1;
          }
          if (part.removed) {
            changed = changed | 2;
          }
        }

        if (!element) {
          line++;
          element = "<div class='level-char'>"
                  + "<div class='char-header'>"
                  + "<div class='char-num'>" + line
                  + "</div>"
                  + "<div class='char-flag'>{CHARFLAG}</div>"
                  + "</div>"
                  + "<div class='char-info {CHANGED}'>";
        }

        if (charAtPos == "\n") {
          element += "</div></div>";
          element = tools.formatString(element, {
            "CHANGED": (changed==1) ? "changed-add" : 
                      ((changed == 2) ? "changed-delete" : 
                      ((changed == 3) ? "changed" : "")),
            "CHARFLAG": (changed==1) ? "+" : 
                      ((changed == 2) ? "-" : 
                      ((changed == 3) ? "+-" : "")),
          });
          changed = 0;
          lines.push(element);
          element = "";
          continue;
        }

        charAtPos = tools.htmlEntities(charAtPos);
        if (part.added) {
          element += "<span class='char-add'>"+charAtPos+"</span>";
        } else if (part.removed) {
          element += "<span class='char-delete'>"+charAtPos+"</span>";
        } else {
          element += "<span>"+charAtPos+"</span>";
        }
      }
    });

    if (element) {
        element += "</div></div>";
        element = tools.formatString(element, {
          "CHANGED": (changed==1) ? "changed-add" : 
                    ((changed == 2) ? "changed-delete" : 
                    ((changed == 3) ? "changed" : "")),
          "CHARFLAG": (changed==1) ? "+" : 
                    ((changed == 2) ? "-" : 
                    ((changed == 3) ? "+-" : "")),
        });
        changed = 0;
        lines.push(element);
    }
    let html = lines.join("");
    $(resultObj).html("");
    $(resultObj).append(html);    
};

export default () => {
  let leftTxt, rightTxt, diffLevel, txtDiffResult, handleFunc;
  handleFunc = function() {
    leftTxt = $("#code-diff-left").val();
    rightTxt = $("#code-diff-right").val();
    diffLevel = $("#txt-diff input[name=diffLevel]:checked").val();
    txtDiffResult = $("#txt-diff .txt-diff-result");

    switch (diffLevel) {
      case "char":
        handleChar(leftTxt, rightTxt, txtDiffResult);
        break;
      case "word":
        handleLine(leftTxt, rightTxt, txtDiffResult);
        break;
      case "line":
        handleLine(leftTxt, rightTxt, txtDiffResult);
        break;
    }
  };
  // 初始化点击比较级别事件
  $("#txt-diff").on("click", ".diff-level-type", function() {
    let me = $(this);
    me.siblings(".diff-level-type")
      .removeClass("active")
      .find("input[name=diffLevel]")
      .removeAttr("checked");
    me.addClass("active")
      .find("input[name=diffLevel]")
      .attr("checked", "checked");
    handleFunc();
  });

  // 处理diff
  $("#txt-diff").on("change, keyup", "#code-diff-left, #code-diff-right", function() {
    handleFunc();
  });
};