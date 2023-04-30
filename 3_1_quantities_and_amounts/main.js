/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 },
  radius = 10;

 // Color scale for the bars
const colorScale = d3.scaleOrdinal(d3.schemeCategory10); 

// // since we use our scales in multiple functions, they need global scope
let xScale, yScale;

/* APPLICATION STATE */
let state = {
  data: [],
};

/* LOAD DATA */
d3.csv("[../data/tigerdeaths.csv]", d3.autoType).then(raw_data => {
  console.log("raw_data", raw_data);
  // save our data to application state
  state.data = raw_data;
  init();
});

/* INITIALIZING FUNCTION */
// this will be run *one time* when the data finishes loading in
function init() {
  /* SCALES */
  xScale = d3.scaleBand()
    .domain(state.data.map(d => d.year))
    .range([margin.left, width - margin.right])
    .paddingInner(0.2)

  yScale = d3.scaleLinear()
    .domain([0, d3.max(state.data, d => d.deaths)])
    .range([height - margin.bottom, margin.top])

// define svg
const svg = d3.select("#container")
  .append("svg")
  .attr("width", width)
  .attr("height", height)

  // Add bars with entering transition
  svg.selectAll("rect.bar")
    .data(state.data)
    .enter()
    .append("rect")
    .attr("class", "bar")
    .attr("width", 0)
    .attr("x", d => xScale(d.activity))
    .attr("y", height - margin.bottom)
    .attr("height", 0)
    .style("fill", (d, i) => colorScale(i))
    .transition()
    .duration(800)
    .attr("width", xScale.bandwidth())
    .attr("y", d => yScale(d.count))
    .attr("height", d => height - margin.bottom - yScale(d.count));

  // Add x-axis
  svg.append("g")
    .attr("class", "x-axis")
    .attr("transform", `translate(0, ${height - margin.bottom})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("y", 10)
    .attr("x", -10)
    .attr("transform", "rotate(-45)")
    .attr("text-anchor", "end");

  // Add y-axis
  svg.append("g")
    .attr("class", "y-axis")
    .attr("transform", `translate(${margin.left}, 0)`)
    .call(d3.axisLeft(yScale));

  // Add x-axis label
  svg.append("text")
    .attr("class", "x-axis-label")
    .attr("x", width / 2)
    .attr("y", height - margin.bottom / 2)
    .attr("text-anchor", "middle")
    .text("Year");

  // Add y-axis label
  svg.append("text")
    .attr("class", "y-axis-label")
    .attr("x", -height / 2)
    .attr("y", margin.left / 2)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .text("Tiger Deaths");

  draw(); // calls the draw function
}

/* DRAW FUNCTION */
// we call this every time there is an update to the data/state
function draw() {
  /* HTML ELEMENTS */
  const svg = d3.select("#container")
  .attr("width", width)
  .attr("height", height)

  const rect = svg
    .selectAll("rect.bar")
    .data(state.data)
    .join("rect")
    .attr("width", xScale.bandwidth())
    .attr("x", d => xScale(d.year))
    .attr("y", d => yScale(d.deaths))
    .attr("height", d => height - yScale(d.count))



}