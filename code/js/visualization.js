window.onload = function () {
  console.log("Hello");
};

class Scatter {
  constructor(el, width, height, margins, data) {
    this.el = document.querySelector(el);
    this.width = width;
    this.height = height;
    this.margins = margins;
    this.data = data;

    [this.g, this.svg] = initVis(this.el, width, height, margins);
  }

  draw() {
  }
}


function initVis(el, width, height, margins) {
  // Calculate total size of figure
  const trueWidth = width + margins.left + margins.right;
  const trueHeight = height + margins.top + margins.bottom;
  // Add SVG element
  const svg = d3
    .select(el)
    .append("svg")
    .attr("viewBox", `0 0 ${trueWidth} ${trueHeight}`);
  // Add g element (this is like our "canvas")
  const g = svg
    .append("g")
    .attr("transform", `translate(${margins.left}, ${margins.top})`);
  return [g, svg];
}
