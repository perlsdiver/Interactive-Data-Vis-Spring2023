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

// loading data
 d3.json("../data/final/CensusMerged.json")
  .then(plumbingData => {

// Add a dropdown to the page for selecting map options
const mapOptions = [
  { value: "none", label: "No Data" },
  { value: "owner", label: "Owner Occupied: Lacking Plumbing" },
  { value: "renter", label: "Renter Occupied: Lacking Plumbing" },
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
const projection = d3.geoMercator().fitSize([width, height], plumbingData);
const pathGenerator = d3.geoPath().projection(projection);

  // Render the map
  g.selectAll("path")
    .data(plumbingData.features)
    .enter()
    .append("path")
      .attr("d", pathGenerator)
      .attr("stroke", "black")
      .attr("fill", "#F5F5DC");

  // Add event listeners (for tooltip)
  g.selectAll("path")
  .on("mouseover", (event, d) => showTooltip(event, d))
  .on("mouseout", (event, d) => hideTooltip(event, d));

  // Update the map colors when the selected option changes
  // d3.select("#map-option").on("change", updateMapColors);
  // updateMapColors(censusPlumbing);
});

function updateMapColors(plumbingData) {
  const selectedOption = d3.select("#map-option").node().value;

  const maxValue = d3.max(plumbingData.features, d => {
    debugger;
   // return some value....
  return d['B25049_003E']

});

// creating threshold for ranges
const rangeThresholds = [0, 3, 9, 33, 64, 100, 250];





}

