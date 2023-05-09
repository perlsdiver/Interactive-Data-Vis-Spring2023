/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.9,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };

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

// loading data - multiple sets
Promise.all([
  d3.json("../data/final/CensusTracts.json"),
  d3.csv("../data/final/CensusData.csv"),
  d3.csv("../data/final/CensusDataBarChartSum.csv", d3.autType),
]).then(([NYC_tracts, plumbingData, barData]) => {

// Creating the SVG and the map projection
const svg = d3.select("#map")
  .attr("width", width)
  .attr("height", height);

// Add a framing border around the map
svg.append("rect")
.attr("width", width)
.attr("height", height)
.attr("stroke", "black") // Border color
.attr("stroke-width", "2px") // Border width
.attr("fill", "none");

  // Adding ability to zoom
  const g = svg.append("g");

  const zoom = d3.zoom()
    .scaleExtent([0.75, 10])
    .on('zoom', (event) => {
      g.attr('transform', event.transform);
    });
  
  svg.call(zoom);

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

// Update the map colors when the selected option changes
dropdown.on("change", updateMapColors);

// Defining the projection and path generator
const projection = d3.geoMercator().fitSize([width, height], NYC_tracts);
const pathGenerator = d3.geoPath().projection(projection);

  // Render the map
  g.selectAll("path")
    .data(NYC_tracts.features)
    .enter()
    .append("path")
      .attr("d", pathGenerator)
      .attr("stroke", "black")
      .attr("fill", "#F5F5DC");

});

function updateMapColors(plumbingData) {
  const selectedOption = d3.select("#map-option").node().value;

  const maxValue = d3.max(plumbingData.features, d => {
   // return some value....
  return d['Owner occupied: Lacking plumbing facilities']

});

// creating threshold for ranges
const rangeThresholds = [0, 3, 9, 33, 64, 100, 250];

// set the dimensions and margins of the bar chart
const margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const barsvg = d3.select("#bar-chart")
  .append("svg")
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
const yAxis = svg.append("g")
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


}

