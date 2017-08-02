// require("./lib/social");
// require("./lib/ads");
// var track = require("./lib/tracking");

require("component-responsive-frame/child");

var $ = require("./lib/qsa");

var form = $.one(".inputs");
var incomeInput = $.one(".own-income");
var modeInput = $(`input[name="mode"]`);

var graph = $.one(".graph");
var report = $.one(".report");

var lookup = {};
window.incomeData.forEach(r => lookup[r.income] = r);

var render = function() {
  var set = window.incomeData;
  var income = incomeInput.value;
  var mode = modeInput.filter(m => m.checked).pop();
  if (!mode || !income) return;
  mode = mode.id;
  var max = Math.max.apply(null, set.map(d => d[mode]));
  var total = set.reduce((p, v) => p + v[mode], 0);
  var html = [];
  set.forEach(function(item) {
    var value = item[mode];
    var percent = value / max;
    html.push(`
      <div
        class="bar"
        data-income="${item.income}"
        data-percentage="${percent}"
        style="height: ${(percent * 100).toFixed(1)}%"
      ></div>`);
  });
  graph.classList.add("activated");
  graph.innerHTML = html.join("\n");

  //add the report
  var selected = lookup[incomeInput.value];
  var bar = $.one(`[data-income="${selected.income}"]`);
  bar.classList.add("selected");
  var percentage = (selected[mode] / total * 100).toFixed(1);
  var unit = mode == "joint" ? "joint filers" : "single filers";
  var reportHTML = `
There are ${selected[mode].toLocaleString()} ${unit} at your income level ("${selected.label}") in Seattle, making up about ${percentage}% of ${unit} in the city.
  `;
  report.innerHTML = reportHTML;
};

// render();

form.addEventListener("change", render);