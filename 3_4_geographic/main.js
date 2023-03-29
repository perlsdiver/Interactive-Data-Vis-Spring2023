/**
 * CONSTANTS AND GLOBALS
 * */
const width = window.innerWidth * 0.9,
  height = window.innerHeight * 0.7,
  margin = { top: 20, bottom: 50, left: 60, right: 40 };


/**
* APPLICATION STATE
* */
let svg
let state = {
    geojson: [] // define with an emptry array
    hover: {
        latitutde: null,
        longitude: null,
        state: null,
    }
};

/**
* LOAD DATA
* Using a Promise.all([]), we can load more than one dataset at a time
* */
Promise.all([
 d3.json("../data/usState.json")
]).then(([geojson]) => {
 state.geojson = geojson;
 console.log("state:", state);
 // console.log("state: ", state);
 init();
});

/**
* INITIALIZING FUNCTION
* this will be run *one time* when the data finishes loading in
* */
function init() {
    // reassign svg
d3.select("#containter")
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .style("background-color", "aqua")
 draw(); // calls the draw function
}

// create projection
const projection = d3.geoAlbersUsa().fitSize([width, height],
    state.geojson)

// create geopath
const geopath = d3.geoPath(projection)

console.log(geojson.features)
// draw the map
svg.selectAll(".state")
    .data(geojson.features)
    .join("path")
    .attr("class", "state") // remember the 4th jonas brother...
    .attr("d", d => geoPath(d))
    .attri("fill", "transparent")
    .on("mouseover", (event, d) => {
        console.log('event', event)
    

        state.hover.state = d.propeties.NAME

        console.log('data properties', d.properties)
    })
    .on("mousemove", (event) => {
        console.log('event', event)
        // const mx = dr.pointer(event)[0]
        // const my = d3.pointer(event) [1]
        const [mx, my] = d3.pointer(event)
        // use projection invert method to get latitude and longitude
        const [projX, projY] = projection.invert([mx, my])
        state.hover.latitude = projX
        state.hover.longitude = projY
    })

draw(); // calls the draw function

/**
* DRAW FUNCTION
* we call this every time there is an update to the data/state
* */
function draw() {
    const hoverBox = d3.select('#hover-content')
    console.log('hover data', state.hover)
    const hoverData = Object.entries(state.hover)
    hoverBox.selectAll("div.row")
        .data(hoverData)
        .join("div")
        .attr("class", "row")
        .html(d => d)
 

}