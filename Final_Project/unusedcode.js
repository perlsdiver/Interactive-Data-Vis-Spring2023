// unused code I could not get to work


// tooltip


//creating tooltip
const tooltip = d3.select("#tooltip")
  .attr("class", "tooltip")
  .style("opacity", 0);
  const colorScale = d3.scaleSequential(d3.interpolateBlues)
  .domain([10, 20, 50, 100]) // **** Need to modify these values based on the data range
  .range(["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"]); // *** Modify these colors


  // Add event listeners (for tooltip - need to add tooltip)
  g.selectAll("path")
  .on("mouseover", (event, d) => showTooltip(event, d))
  .on("mouseout", (event, d) => hideTooltip(event, d));

  // Update the map colors when the selected option changes
  // d3.select("#map-option").on("change", updateMapColors);
  // updateMapColors(censusPlumbing);



colorScale.domain([0, maxValue]);


g.selectAll("path")
  .attr("fill", d => {
    const censusPlumbing = d.properties.censusPlumbing;

    if (!censusPlumbing) {
      return "white";
    }

    // if (selectedOption === "owner") {
       return colorScale(censusPlumbing['B25049_003E']);
    // } else if (selectedOption === "renter") {
    //   return colorScale(censusPlumbing['B25049_007E']);
    // } else {
    //   return "white";
    // }
  });


// adding the tooltip
function showTooltip(event, d) {
const selectedOption = d3.select("#map-option").node().value;
const censusPlumbing = d.properties.censusPlumbing;
tooltip.html(text)
.style("left", (event.pageX + 10) + "px")
.style("top", (event.pageY - 28) + "px");

if (!censusPlumbing) {
  return;
}

let text;
// if (selectedOption === "owner") {
  text = `Owner occupied lacking plumbing: ${censusPlumbing['']} households`;
// } else if (selectedOption === "renter") {
//   text = `Renter occupied lacking plumbing: ${censusPlumbing['B25049_007E']} households`;
// } else {
//   text = `Census Tract: ${censusPlumbing['NAME']}`;
// }

tooltip.transition()
  .duration(200)
  .style("opacity", .9);

tooltip.html(text)
  .style("left", (event.pageX + 10) + "px")
  .style("top", (event.pageY - 28) + "px");
}

function hideTooltip() {
tooltip.transition()
  .duration(500)
  .style("opacity", 0);
}


// Update the map colors when the selected option changes
dropdown.on("change", updateMapColors);



// trying to update the map colors
function updateMapColors(plumbingData) {
    const selectedOption = d3.select("#map-option").node().value;
  
    const maxValue = d3.max(plumbingData.features, d => {
     // return some value....
    return d['Owner_no_plumbing']
  
  });



// creating the barchart svg
const barChartContainer = d3.select("#bar-chart");

const barChartSvg = barChartContainer.append("svg")
  .attr("width", width)
  .attr("height", height);

//loading data for bar chart
d3.csv("..data/final/CensusDatBarChartSum.csv")
  .then(barData => {
    // Convert numeric values from strings to numbers
    barData.forEach(d => {
      d["Total Owner occupied"] = +d["Total Owner occupied"];
      d["Owner occupied: Complete plumbing facilities"] = +d["Owner occupied: Complete plumbing facilities"];
      d["Owner occupied: Lacking plumbing facilities"] = +d["Owner occupied: Lacking plumbing facilities"];
      d["Total Renter occupied"] = +d["Total Renter occupied"];
      d["Renter occupied: Complete plumbing facilities"] = +d["Renter occupied: Complete plumbing facilities"];
      d["Renter occupied: Lacking plumbing facilities"] = +d["Renter occupied: Lacking plumbing facilities"];
    });

    // Call the createBarChart function with the imported data
    createBarChart(barData);
  })
  .catch(error => {
    console.error("Error loading CSV data:", error);
  });


const stack = d3.stack()
  .keys(["Owner occupied: Lacking plumbing facilities", "Renter occupied: Lacking plumbing facilities"]);

const stackedData = stack(barData);

const y = d3.scaleLinear()
  .domain([0, d3.max(stackedData, d => d3.max(d, d => d[1]))])
  .range([height - margin.bottom, margin.top]);

// Create groups for each series
const groups = svg.selectAll("g.series")
  .data(stackedData)
  .enter()
  .append("g")
  .attr("class", "series")
  .attr("fill", (d, i) => color(i));

// Create the stacked bars
groups.selectAll("rect")
  .data(d => d)
  .enter()
  .append("rect")
  .attr("x", (d, i) => x(data[i].County))
  .attr("y", d => y(d[1]))
  .attr("height", d => y(d[0]) - y(d[1]))
  .attr("width", x.bandwidth());

  const legend = svg.append("g")
  .attr("transform", `translate(${width - margin.right}, ${margin.top})`)
  .attr("font-family", "sans-serif")
  .attr("font-size", 10);

const categories = ["Owner occupied", "Renter occupied"];
const legendRectSize = 15;
const legendSpacing = 4;

categories.forEach((category, i) => {
  const legendGroup = legend.append("g")
    .attr("transform", `translate(0, ${i * (legendRectSize + legendSpacing)})`);

  legendGroup.append("rect")
    .attr("width", legendRectSize)
    .attr("height", legendRectSize)
    .attr("fill", color(i));

  legendGroup.append("text")
    .attr("x", legendRectSize + legendSpacing)
    .attr("y", legendRectSize - legendSpacing)
    .text(category);
});




// creating threshold for ranges
const rangeThresholds = [0, 3, 9, 33, 64, 100, 250];


// append the svg object to the body of the page
const barsvg = d3.select("#bar-chart")
  .append("barsvg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Initialize the X axis
const x = d3.scaleBand()
  .range([ 0, width ])
  .padding(0.2);
const xAxis = barsvg.append("g")
  .attr("transform", `translate(0,${height})`)

// Initialize the Y axis
const y = d3.scaleLinear()
  .range([ height, 0]);
const yAxis = barsvg.append("g")
  .attr("class", "myYaxis")

// A function that create / update the plot for a given variable:
function update(data) {

  // Update the X axis
  x.domain(data.map(d => d.group))
  xAxis.call(d3.axisBottom(x))

  // Update the Y axis
  y.domain([0, d3.max(data, d => d.value) ]);
  yAxis.transition().duration(1000).call(d3.axisLeft(y));

  // Create the u variable
  var u = barsvg.selectAll("rect")
    .data(data)

  u
    .join("rect") // Add a new rect for each new elements
    .transition()
    .duration(1000)
      .attr("x", d => x(d.group))
      .attr("y", d => y(d.value))
      .attr("width", x.bandwidth())
      .attr("height", d => height - y(d.value))
      .attr("fill", "#69b3a2")
}

// Initialize the plot with the first dataset#
update(barData)




