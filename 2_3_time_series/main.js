// fixing areachart
//import * as d3 from 'd3-shape';

// const d3 = await import("d3")

/*
// Copyright 2021 Observable, Inc.
// Released under the ISC license.
// https://observablehq.com/@d3/area-chart
function AreaChart(data, {
  x = ([x]) => x, // given d in data, returns the (temporal) x-value
  y = ([, y]) => y, // given d in data, returns the (quantitative) y-value
  defined, // given d in data, returns true if defined (for gaps)
  curve = d3.curveLinear, // method of interpolation between points
  marginTop = 20, // top margin, in pixels
  marginRight = 30, // right margin, in pixels
  marginBottom = 30, // bottom margin, in pixels
  marginLeft = 40, // left margin, in pixels
  width = 640, // outer width, in pixels
  height = 400, // outer height, in pixels
  xType = d3.scaleUtc, // type of x-scale
  xDomain, // [xmin, xmax]
  xRange = [marginLeft, width - marginRight], // [left, right]
  yType = d3.scaleLinear, // type of y-scale
  yDomain, // [ymin, ymax]
  yRange = [height - marginBottom, marginTop], // [bottom, top]
  yFormat, // a format specifier string for the y-axis
  yLabel, // a label for the y-axis
  color = "currentColor" // fill color of area
} = {}) {
  // Compute values.
  const X = d3.map(data, x);
  const Y = d3.map(data, y);
  const I = d3.range(X.length);

  // Compute which data points are considered defined.
  if (defined === undefined) defined = (d, i) => !isNaN(X[i]) && !isNaN(Y[i]);
  const D = d3.map(data, defined);

  // Compute default domains.
  if (xDomain === undefined) xDomain = d3.extent(X);
  if (yDomain === undefined) yDomain = [0, d3.max(Y)];

  // Construct scales and axes.
  const xScale = xType(xDomain, xRange);
  const yScale = yType(yDomain, yRange);
  const xAxis = d3.axisBottom(xScale).ticks(width / 80).tickSizeOuter(0);
  const yAxis = d3.axisLeft(yScale).ticks(height / 40, yFormat);

  // Construct an area generator.
  const area = d3.area()
      .defined(i => D[i])
      .curve(curve)
      .x(i => xScale(X[i]))
      .y0(yScale(0))
      .y1(i => yScale(Y[i]));

  const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

  svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(yAxis)
      .call(g => g.select(".domain").remove())
      .call(g => g.selectAll(".tick line").clone()
          .attr("x2", width - marginLeft - marginRight)
          .attr("stroke-opacity", 0.1))
      .call(g => g.append("text")
          .attr("x", -marginLeft)
          .attr("y", 10)
          .attr("fill", "currentColor")
          .attr("text-anchor", "start")
          .text(yLabel));

  svg.append("path")
      .attr("fill", color)
      .attr("d", area(I));

  svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(xAxis);

  return svg.node();
} */


/* CONSTANTS AND GLOBALS */
 const width = window.innerWidth * 0.7,
 height = window.innerHeight * 0.7,
 margin = { top: 20, bottom: 80, left: 120, right: 60 }


/* LOAD DATA */
d3.csv("../data/us_homeless_estimate.csv", d3.autoType).then((data) => {
  console.log(data);

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


 // line
 const sizeScale = d3
 .scaleSqrt()
 .domain([525000, d3.max(data, (d) => +d.Estimate)+100000])
 .range([2, 25]);


  // LINE GENERATOR FUNCTION
  const lineGen = d3.line()
    .x(d => xScale(d.Year))
    .y(d => yScale(d.Estimate))

    
  // DRAW LINE
  svg.selectAll(".line")
    .data([data]) // data needs to take an []
    .join("path")
    .attr("class", 'line')
    .attr("fill", "none")
    .attr("stroke", "maroon")
    .attr("d", d => lineGen(d))

    // I could not solve the area chart import, but am keeping the code here
   /* chart = AreaChart(data, {
      x: d => d.Year,
      y: d => d.Estimate,
      yLabel: "Estimated Homeless Population (in the US",
      width,
      height: 500,
      color: "steelblue"
    }) */ 

});