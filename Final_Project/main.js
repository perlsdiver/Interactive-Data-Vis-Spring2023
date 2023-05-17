/// Going to annotate this more so I break it apart and make it more legible for me
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

let barsvg;
let mapsvg;
let colorScale;
// let projection;

//////////////////////////
/// APPLICATION STATE ////
/////////////////////////

let state = {
    NYC_tracts: null,
    plumbingData: null,
    barData: null,
    hover:{

    },
  };

//////////////////////////////////// ////////////////// 
// loading data - multiple sets ////
///////////////////////////////////////////////////////

Promise.all([
  d3.json("finaldata/CensusTracts.json"), // json file taken from NYC Open Data
  d3.csv("finaldata/CensusData.csv"), // census data, wrangled to be easier to read
  d3.csv("finaldata/CensusDataBarChartSum.csv", d3.autType), // seperate file made of borough-level summary data, making it easier to render bar charts
]).then(([NYCtracts, plumbingData, barData]) => {

  state.NYCtracts = tracts;
  state.plumbingData;
  init();
});
  
/// Initializing function

function init(){

  const projection = d3.geoMercator().fitSize([width, height], state.NYCtracts);
  const path = d3.geoPath().projection(projection);

console.log(state.NYCtracts.map(d => d.properties.GEOID)

(NYCtracts, plumbingData, barData));

  // Calculating the density for both "Owner_no_plumbing" and "Renter_no_plumbing" variables
  // Will use this for map distribution
  state.plumbingData.forEach(row => {
    const totalOwner = row.Total_Owner;
    const totalRenter = row.Total_Renter;
    row.Owner_density = (row.Owner_no_plumbing / totalOwner) * 100;
    row.Renter_density = (row.Renter_no_plumbing / totalRenter) * 100;
  });

  // Create color scales for both Owner and Renter density
  const colorScaleOwner = d3.scaleSequential()
    .domain(d3.extent(state.plumbingData, d => +d.Owner_density))
    .interpolator(d3.interpolateBlues);

  const colorScaleRenter = d3.scaleSequential()
    .domain(d3.extent(state.plumbingData, d => +d.Renter_density))
    .interpolator(d3.interpolateReds);

  // Update the tracts data to include the plumbing data
  state.tracts.features.forEach(feature => {
    const tractId = feature.properties.GEOID;
    const plumbingRow = state.plumbingData.find(d => d.GEOID === tractId);
    if (plumbingRow) {
      feature.properties.Owner_density = plumbingRow.Owner_density;
      feature.properties.Renter_density = plumbingRow.Renter_density;
    }
  });


// draw function
function draw() {
  // define svg
  const mapsvg = d3.select("#map")
    .append("mapsvg")
    .attr("width", width)
    .attr("height", height);

  // const rect

  // Add a framing border around the map
  mapsvg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .attr("stroke", "black") // Border color
    .attr("stroke-width", "2px") // Border width
    .attr("fill", "none");

}






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



/// ORIGINAL MAP VERSION
/// static map worked but could not make it dynamic nor effectively toggle data
///

/////////
// MAP //
/////////

// Creating the SVG and the map projection
const mapsvg = d3.select("#map")
  .attr("width", width)
  .attr("height", height);

// Add a framing border around the map
mapsvg.append("rect")
.attr("width", width)
.attr("height", height)
.attr("stroke", "black") // Border color
.attr("stroke-width", "2px") // Border width
.attr("fill", "none");

 // creating 'g' for the map image
  const g = mapsvg.append("g");

   // Adding ability to zoom
  const zoom = d3.zoom()
    .scaleExtent([0.75, 10])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
  
  mapsvg.call(zoom);

// Add a dropdown to the page for selecting map options
const mapOptions = [
  { value: "none", label: "No Data" },
  { value: "Owner occupied: Lacking plumbing facilities", label: "Owner Occupied: Lacking Plumbing" },
  { value: "Renter occupied: Lacking plumbing facilities", label: "Renter Occupied: Lacking Plumbing" },
];

const dropdown = d3.select("#dropdown-container")
  .append("select")
  .attr("id", "map-option");

dropdown.selectAll("option")
  .data(mapOptions)
  .enter()
  .append("option")
  .attr("value", d => d.value)
  .text(d => d.label);

// Defining the projection and path generator
// const projection = d3.geoMercator().fitSize([width, height], NYCtracts);
// const pathGenerator = d3.geoPath().projection(projection);

  // Render the map
  g.selectAll("path")
    .data(NYC_tracts.features)
    .enter()
    .append("path")
      .attr("d", pathGenerator)
      .attr("stroke", "black")
      .attr("fill", "#F5F5DC");
/////
};