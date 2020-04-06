window.onload = function () {
  console.log("Hello");
  main();
};

async function main() {
  const data = await d3.csv("./data/listings.csv");
  data.forEach((d) => {
    d.price = +d.price;
    d.bed = +d.bed;
    d.bath = +d.bath;
    d.area = +d.area;
  });
  console.log(data);

  const scatterplot = new Scatter(
    ".vis",
    400,
    300,
    { top: 50, bottom: 60, left: 70, right: 40 },
    data.filter((d) => d.price > 0 && d.area > 5)
  );
}

// Base Visualization class
class Visualization {
  constructor(el, width, height, margins, data) {
    this.el = document.querySelector(el);
    this.width = width;
    this.height = height;
    this.margins = margins;
    this.data = data;

    [this.g, this.svg] = this.initVis(this.el, width, height, margins);
    this.draw = this.draw.bind(this);
  }

  initVis(el, width, height, margins) {
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

  draw() {
  }
}

const titleMixin = (Base) => class extends Base {
  draw() {
    // draw title
    this.svg
      .append("text")
      .text(this.title)
      .attr("class", "title-text")
      .attr("transform", "translate(10, 10)")
      .attr("alignment-baseline", "hanging");
  }
}

// Scatterplot Class
class Scatter extends titleMixin(Visualization) {
  constructor(el, width, height, margins, data) {
    super(el, width, height, margins, data);
    this.title = "Bigger Houses Cost More. Who'da thunk it?"

    this.xscale = d3
      .scaleLog()
      .domain(d3.extent(data.map((x) => x.area + 1)))
      .range([0, width])
      .nice();
    this.yscale = d3
      .scaleLog()
      .domain(d3.extent(data.map((x) => x.price + 1)))
      .range([height, 0])
      .nice();

    this.xaxis = d3.axisBottom(this.xscale).ticks(3);
    this.yaxis = d3.axisLeft(this.yscale).ticks(5);
    this.draw();
  }

  draw() {
    // draw points
    super.draw();
    this.g
      .selectAll("circle")
      .data(this.data)
      .enter()
      .append("circle")
      .attr("r", d => d.bed)
      .attr("cx", (d) => (d.area <= 0 ? 0 : this.xscale(d.area)))
      .attr("cy", (d) => (d.price <= 0 ? 0 : this.yscale(d.price)))
      .attr("opacity", 0.2)
      .attr("fill", "#374567");

    // draw axes
    this.g
      .append("g")
      .attr("transform", `translate(0, ${this.height})`)
      .call(this.xaxis);

    this.svg.append("text")
      .attr("y", this.height + this.margins.top + this.margins.bottom - 20)
      .attr("x", this.width / 2 + this.margins.left)
      .attr("text-anchor", "middle")
      .attr("class", "label-text")
      .text("Area (sq ft)");

    this.g.append("g").call(this.yaxis);
    this.svg.append("text")
      .attr("y", 20)
      .attr("x", 0 - (this.height / 2 + this.margins.top))
      .attr("transform", "rotate(-90)")
      .attr("text-anchor", "middle")
      .attr("alignment-baseline", "hanging")
      .attr("class", "label-text")
      .text("Price ($)");
  }
}
