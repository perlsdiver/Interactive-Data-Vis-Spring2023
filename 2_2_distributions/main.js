/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.7,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 100, left: 120, right: 40 },
  radius = 5;

/* LOAD DATA */
d3.csv("../data/us_homeless_estimate.csv", d3.autoType).then((data) => {
  console.log(data);

  /* SCALES */

  // x scale - linear, year
  const xScale = d3
    .scaleLinear()
    .domain([2006, 2023])
    .range([margin.left, width - margin.right]);

  // y scale - linear, count
  const yScale = d3
    .scaleLinear()
    .domain([500000, d3.max(data, (d) => +d.Estimate)])
    .range([height - margin.bottom, margin.top]);

  const colorScale = d3
    .scaleSequential()
    .domain([2006, 2023, 1])
    .interpolator(d3.interpolatePlasma);

  /* HTML ELEMENTS */

  // svg
  const svg = d3
    .select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

  // x axis scales and labels
  const xAxis = d3.axisBottom(xScale)
    .tickValues(d3.range(2007, 2023, 1))
    .tickFormat(d3.format("d"));
  svg
    .append("g")
    .attr("transform", `translate(0,${height - margin.bottom})`)
    .call(xAxis);

  svg
  .append("text")
  .attr("x", width/2)
  .attr("y", height - margin.bottom/3)
  .attr("text-anchor", "middle")
  .attr("font-weight", "bold")
  .text("Year");

svg.selectAll(".tick text")
  .attr("transform", "rotate(-90)")
  .attr("text-anchor", "end")
  .attr("dx", "-0.8em")
  .attr("dy", "0.15em");

  // y axis scales and labels
  const yAxis = d3.axisLeft(yScale).ticks(5, "s");
  const yAxisGroup = svg
    .append("g")
    .attr("transform", `translate(${margin.left},0)`)
    .call(yAxis);

  svg
    .append("text")
    .attr("x", -height / 2)
    .attr("y", margin.left / 2)
    .attr("text-anchor", "middle")
    .attr("transform", "rotate(-90)")
    .attr("dy", "1em")
    .text("Estimated Homeless Population (in the US)");

  // circles
const sizeScale = d3
  .scaleSqrt()
  .domain([525000, d3.max(data, (d) => +d.Estimate)+100000])
  .range([2, 25]);

  const dot = svg
    .selectAll("circle")
    .data(data)
    .join("circle")
    .attr("cx", (d) => xScale(d.Year))
    .attr("cy", (d) => yScale(+d.Estimate))
    .attr("r", (d) => sizeScale(+d.Estimate))
    .attr("fill", (d) => colorScale(+d.Year));

/* still debugging and figuring this one out; i could be completely off about how to make this work */

// finding max value, creating variable
const maxVal = d3.max(data, (d) => d.value);

// creating variable xAxisLabels
const xAxisLabels = svg.selectAll(".xAxisLabel")
  .data(data)
  .enter()
  .append("text")
  .attr("class", "xAxisLabel")
  .attr("x", (d) => xScale(d.xValue))
  .attr("y", height - margin.bottom + 20)
  .attr("text-anchor", "middle")
  .text((d) => d.xValue);

// bold variable, x axis label with max value
const boldx = xAxisLabels.filter((d) => d.value === maxVal)
  .attr("class", "xAxisLabel bold");

});
