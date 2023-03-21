/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
 Promise.all([
  d3.json("../data/usState.json"),
  d3.csv("../data/usHeatExtremes.csv", d3.autoType),
]).then(([geojson, heat]) => {
  
  // INSPECT DATA
  console.log('geojson', geojson)
  console.log('heat', heat)

// APPEND SVG
  const svg = d3.select("#container")
    .append("svg")
    .attr("width", width)
    .attr("height", height)

  // SPECIFY PROJECTION
  const projection = d3.geoAlbersUsa()
  .fitSize([width, height], geojson)

  // DEFINE PATH FUNCTION
  const pathGen = d3.geoPath(projection)

  // APPEND GEOJSON PATH  
  const states = svg.selectAll("path.states")
  .data(geojson.features)
  .join("path")
  .attr("class", "states")
  .attr("d", coords => pathGen(coords))
  .attr("fill", "transparent")
  .attr("stroke", "black")

// addded a lengend
const legend = svg.append("g")
  .attr("class", "legend")
  .attr("transform", `translate(${width - margin.right - 120}, ${height - margin.bottom + 10})`);

legend.append("circle")
  .attr("cx", 0)
  .attr("cy", 0)
  .attr("r", 4)
  .attr("fill", "red");

legend.append("text")
  .attr("x", 10)
  .attr("y", 5)
  .text("Temperature increase\n");

legend.append("circle")
  .attr("cx", 0)
  .attr("cy", 25)
  .attr("r", 4)
  .attr("fill", "blue");

legend.append("text")
  .attr("x", 10)
  .attr("y", 30)
  .text("Temperature decrease\n");

// APPEND DATA AS SHAPE

// Made a linear scale to shrink circle size (after initial circles being way too big)
  const radiusScale = d3.scaleLinear()
    .domain(d3.extent(heat, d => Math.abs(d.Change_in_95_percent_Days)))
    .range([1, Math.min(width, height) / 100]);


// added the shape, with if else functions to sort the data
// positive values as red, negative values as blue, others as tranparent (ie: value of 0)
const heatCircles = svg.selectAll("circle.heat")
.data(heat)
.join("circle")
.attr("class", "heat")
.attr("r", d => {
  const change = d.Change_in_95_percent_Days;
  if (change > 0) {
    return radiusScale(change);
  } else if (change < 0) {
    return radiusScale(-change);
  } else {
    return 0;
  }
})
.attr("fill", d => {
  const change = d.Change_in_95_percent_Days;
  if (change > 0) {
    return "red";
  } else if (change < 0) {
    return "blue";
  } else {
    return "transparent";
  }
})
.attr("stroke", "black")
.attr("transform", d => {
  const [x, y] = projection([d.Long, d.Lat]);
  return `translate(${x}, ${y})`;
});

});