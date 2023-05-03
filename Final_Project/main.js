/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
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

// Create the SVG and the map projection
const svg = d3.select("#map")
  .attr("width", width)
  .attr("height", height);
const tooltip = d3.select("#tooltip")
  .append("div")
  .attr("class", "tooltip")
  .style("opacity", 0);
  const colorScale = d3.scaleThreshold()
  .domain([10, 20, 50, 100]) // Need to modify these values based on the data range
  .range(["#fee5d9", "#fcae91", "#fb6a4a", "#de2d26", "#a50f15"]); // Modify these colors as desired

/**
 * LOAD DATA
 * Using a Promise.all([]), we can load more than one dataset at a time
 * */
 Promise.all([
  d3.json("../data/final/NYC_census_tracts_no_water.json"),
  d3.csv("../data/final/ACSDT5Y2020.B25049-Data_Cleaned.csv", d3.autoType),
]).then(([nycGeoJSON, censusPlumbing]) => {
// Create a lookup table for CSV data using GEO_ID as key
const csvLookup = new Map(censusPlumbing.map(d => [d.GEO_ID, d]));

// Iterate over the GeoJSON features and adding census data as a property
nycGeoJSON.features.forEach(feature => {
  const geoId = feature.properties.GEO_ID;
  feature.properties.censusPlumbing = csvLookup.get(geoId);
});

// Defining the projection and path generator
const projection = d3.geoMercator().fitSize([width, height], nycGeoJSON);
const pathGenerator = d3.geoPath().projection(projection);

  // Render the map
  svg.selectAll("path")
    .data(nycGeoJSON.features)
    .enter()
    .append("path")
      .attr("d", pathGenerator)
      .attr("stroke", "black")
      .attr("fill", "white"); 

  // Add event listeners
  svg.selectAll("path")
    .on("mouseover", showTooltip)
    .on("mouseout", hideTooltip);

  // Update the map colors when the selected option changes
  d3.select("#map-option").on("change", updateMapColors);
});

function updateMapColors() {
  const selectedOption = d3.select("#map-option").node().value;

  svg.selectAll("path")
    .attr("fill", d => {
      const censusPlumbing = d.properties.censusPlumbing;

      if (!censusPlumbing) {
        return "white";
      }

      if (selectedOption === "owner") {
        return colorScale(censusPlumbing['B25049_003E']);
      } else if (selectedOption === "renter") {
        return colorScale(censusPlumbing['B25049_007E']);
      } else {
        return "white";
      }
    });
}

// adding the tooltip
function showTooltip(d) {
  const selectedOption = d3.select("#map-option").node().value;
  const censusPlumbing = d.properties.censusPlumbing;

  if (!censusPlumbing) {
    return;
  }

  let text;
  if (selectedOption === "owner") {
    text = `Owner occupied lacking plumbing: ${censusPlumbing['B25049_003E']} households`;
  } else if (selectedOption === "renter") {
    text = `Renter occupied lacking plumbing: ${censusPlumbing['B25049_007E']} households`;
  } else {
    text = `Census Tract: ${censusPlumbing['NAME']}`;
  }

  tooltip.transition()
    .duration(200)
    .style("opacity", .9);

  tooltip.html(text)
    .style("left", (d3.event.pageX + 10) + "px")
    .style("top", (d3.event.pageY - 28) + "px");
}

function hideTooltip() {
  tooltip.transition()
    .duration(500)
    .style("opacity", 0);
}