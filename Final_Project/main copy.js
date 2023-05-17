/// Going to annotate this more so I break it apart and make it more legible for me
///
///

/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

/////////////
/// TABS ///
////////////

// Set the starting tab
document.getElementById("Introduction").style.display = "block";
document.querySelector(".tab button:first-child").classList.add("active");

  function openTab(evt, tabName) {

    // Get all elements with class="tabcontent" and hide them
    const tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
      tabcontent[i].style.display = "none";
    }
  
    // Get all elements with class="tablinks" and remove the class "active"
    const tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
      tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
  
    // Show the current tab, and add an "active" class to the button that opened the tab
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
  }

/** these variables allow us to access anything we manipulate in
* init() but need access to in draw().
* All these variables are empty before we assign something to them.*/
// let barsvg;
// let mapsvg;

//////////////////////////
/// APPLICATION STATE ////
/////////////////////////

// let state = {
//   NYC_tracts: null,
//   plumbingData: null,
//   barDat: null,
//   hover:{
//   },
// };

////////////////////////////////////  
// loading data - multiple sets (from first map attempt) ////
////////////////////////////////////

// Promise.all([
//   d3.json("../data/final/CensusTracts.json"), // json file taken from NYC Open Data
//   d3.csv("../data/final/CensusData.csv"), // census data, wrangled to be easier to read
//   d3.csv("../data/final/CensusDataBarChartSum.csv", d3.autType), // seperate file made of borough-level summary data, making it easier to render bar charts
// ]).then(([NYC_tracts, plumbingData, barData]) => {

// ////////////////  
// // BAR CHART (not working - commented out for now ///
// ///////////////

// // append the svg object to the body of the page
// var barsvg = d3.select("#bar-chart")
//   .append("barsvg")
//     .attr("width", width + margin.left + margin.right)
//     .attr("height", height + margin.top + margin.bottom)
//   .append("g")
//     .attr("transform",
//           "translate(" + margin.left + "," + margin.top + ")");

// // Parse the Data (not sure if I'm doing this right)
// d3.csv(barData, function(data) {

//   // List of subgroups = header of the csv files = soil condition here
//   var subgroups = data.columns.slice(1)

//   // List of groups = species here = value of the first column called group -> I show them on the X axis
//   var groups = d3.map(data, function(d){return(d.group)}).keys()

//   // Add X axis
//   var x = d3.scaleBand()
//       .domain(groups)
//       .range([0, width])
//       .padding([0.2])
//   barsvg.append("g")
//     .attr("transform", "translate(0," + height + ")")
//     .call(d3.axisBottom(x).tickSize(0));

//   // Add Y axis
//   var y = d3.scaleLinear()
//     .domain([0, 250])
//     .range([ height, 0 ]);
//   barsvg.append("g")
//     .call(d3.axisLeft(y));

//   // Another scale for subgroup position?
//   var xSubgroup = d3.scaleBand()
//     .domain(subgroups)
//     .range([0, x.bandwidth()])
//     .padding([0.05])

//   // color palette = one color per subgroup
//   var color = d3.scaleOrdinal()
//     .domain(subgroups)
//     .range(['#e41a1c','#377eb8'])

//   // Show the bars
//   barsvg.append("g")
//     .selectAll("g")
//     // Enter in data = loop group per group
//     .data(barData)
//     .enter()
//     .append("g")
//       .attr("transform", function(d) { return "translate(" + x(d.group) + ",0)"; })
//     .selectAll("rect")
//     .data(function(d) { return subgroups.map(function(key) { return {key: key, value: d[key]}; }); })
//     .enter().append("rect")
//       .attr("x", function(d) { return xSubgroup(d.key); })
//       .attr("y", function(d) { return y(d.value); })
//       .attr("width", xSubgroup.bandwidth())
//       .attr("height", function(d) { return height - y(d.value); })
//       .attr("fill", function(d) { return color(d.key); });

// })

/////////////////////
// SECOND MAP ATTEMPT: CHOROPLETH
////////////////////


const projection = d3.geoMercator()
  .scale(50000)
  .center([-73.94, 40.70])
  .translate([width / 2, height / 2]);
  
Promise.all([
  d3.json("../data/final/CensusTracts.json"),
  d3.csv("../data/final/CensuData.csv", function(d) {
    data.set(d.GEOID, {
      Total_owner: +d.Total_owner,
      Owner_plumbing: +d.Owner_plumbing,
      Owner_no_plumbing: +d.Owner_no_plumbing,
      Total_renter: +d.Total_renter,
      Renter_plumbing: +d.Renter_plumbing,
      Renter_no_plumbing: +d.Renter_no_plumbing
    });
  })
]).then(function(loadData) {
  let topo = loadData[0];

// The svg
const svg = d3.select("#map"),
  width = +svg.attr("width"),
  height = +svg.attr("height");

// Data and color scale
const data = new Map();
const colorScale = d3.scaleThreshold()
  .domain([100000, 1000000, 10000000, 30000000, 100000000, 500000000])
  .range(d3.schemeBlues[7]);

// Select the tooltip div
var tooltip = d3.select("#tooltip");

let mouseOver = function(d) {

  function ready(error, topo) {
    let mouseOver = function(d) {
      d3.selectAll(".GEOID")
        .transition()
        .duration(200)
        .style("opacity", .5)
      d3.select(this)
        .transition()
        .duration(200)
        .style("opacity", 1)
        .style("stroke", "black")

  // Show the tooltip
  tooltip.style("display", "inline");

  // Update the tooltip content
  let tractData = data.get(d.GEOID) || {};
  tooltip.html(`
    <strong>Total Owner:</strong> ${tractData.Total_owner || 0}<br>
    <strong>Owner with plumbing:</strong> ${tractData.Owner_plumbing || 0}<br>
    <strong>Owner without plumbing:</strong> ${tractData.Owner_no_plumbing || 0}<br>
    <strong>Total Renter:</strong> ${tractData.Total_renter || 0}<br>
    <strong>Renter with plumbing:</strong> ${tractData.Renter_plumbing || 0}<br>
    <strong>Renter without plumbing:</strong> ${tractData.Renter_no_plumbing || 0}
  `);
}

let mouseLeave = function(d) {

  // Hide the tooltip
  tooltip.style("display", "none");
}

.on("mouseover", mouseOver)
.on("mousemove", function(d) {
  // Move the tooltip to the current mouse position
  tooltip.style("left", (d3.event.pageX + 15) + "px")
         .style("top", (d3.event.pageY - 28) + "px");
})
.on("mouseleave", mouseLeave)

/// ORIGINAL MAP VERSION
/// COMMENTED THIS OUT; static map worked but could not make it dynamic nor effectively toggle data
///

/////////
// MAP //
/////////

// // Creating the SVG and the map projection
// const mapsvg = d3.select("#map")
//   .attr("width", width)
//   .attr("height", height);

// // Add a framing border around the map
// mapsvg.append("rect")
// .attr("width", width)
// .attr("height", height)
// .attr("stroke", "black") // Border color
// .attr("stroke-width", "2px") // Border width
// .attr("fill", "none");

//  // creating 'g' for the map image
//   const g = mapsvg.append("g");

//    // Adding ability to zoom
//   const zoom = d3.zoom()
//     .scaleExtent([0.75, 10])
//     .on('zoom', (event) => {
//       g.attr('transform', event.transform);
//     });
  
//   mapsvg.call(zoom);

// // Add a dropdown to the page for selecting map options
// const mapOptions = [
//   { value: "none", label: "No Data" },
//   { value: "Owner occupied: Lacking plumbing facilities", label: "Owner Occupied: Lacking Plumbing" },
//   { value: "Renter occupied: Lacking plumbing facilities", label: "Renter Occupied: Lacking Plumbing" },
// ];

// const dropdown = d3.select("#dropdown-container")
//   .append("select")
//   .attr("id", "map-option");

// dropdown.selectAll("option")
//   .data(mapOptions)
//   .enter()
//   .append("option")
//   .attr("value", d => d.value)
//   .text(d => d.label);

// // Defining the projection and path generator
// const projection = d3.geoMercator().fitSize([width, height], NYC_tracts);
// const pathGenerator = d3.geoPath().projection(projection);

//   // Render the map
//   g.selectAll("path")
//     .data(NYC_tracts.features)
//     .enter()
//     .append("path")
//       .attr("d", pathGenerator)
//       .attr("stroke", "black")
//       .attr("fill", "#F5F5DC");
/////
});