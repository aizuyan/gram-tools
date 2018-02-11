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
    console.log(diff);

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

export default () => {
  let leftTxt, rightTxt, diffLevel, txtDiffResult;
  $("#txt-diff").on("click", ".do-diff>button", function() {
    leftTxt = $("#code-diff-left").val();
    rightTxt = $("#code-diff-right").val();
    diffLevel = $("#txt-diff input[name=diffLevel]").val();
    txtDiffResult = $("#txt-diff .txt-diff-result");

    switch (diffLevel) {
      case "char":
        handleLine(leftTxt, rightTxt, txtDiffResult);
        break;
      case "word":
        handleLine(leftTxt, rightTxt, txtDiffResult);
        break;
      case "line":
        handleLine(leftTxt, rightTxt, txtDiffResult);
        break;
    }
  });
};