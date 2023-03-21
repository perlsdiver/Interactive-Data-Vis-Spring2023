
// need to debug axis labels

/* CONSTANTS AND GLOBALS */
const width = window.innerWidth * 0.8;
const height = 500;
margin = { top: 20, bottom: 100, left: 120, right: 40 },

/* LOAD DATA */
d3.csv('../data/squirrelActivities.csv', d3.autoType)
  .then(data => {
    console.log('data', data);

    /* SCALES */
    // yscale - categorical, activity
    const yScale = d3
      .scaleBand()
      .domain(data.map(d => d.activity))
      .range([height, 0]) // visual variable
      .paddingInner(0.2);

    // xscale - linear, count
    const xScale = d3
      .scaleLinear()
      .domain([0, d3.max(data, d => d.count)])
      .range([0, width]);

    /* HTML ELEMENTS */
    // svg
    const svg = d3
      .select('#container')
      .append('svg')
      .attr('width', width)
      .attr('height', height);

    // bars
    svg
      .selectAll('rect')
      .data(data)
      .join('rect')
      .attr('width', d => xScale(d.count))
      .attr('height', yScale.bandwidth())
      .attr('x', 0)
      .attr('y', d => yScale(d.activity));

    // x axis
    const xAxis = d3.axisBottom(xScale);
    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(xAxis);

    // y axis
    const yAxis = d3.axisLeft(yScale);
    svg.append('g').call(yAxis);

 // axis labels

 // still debugging these
 svg
 .append('text')
 .attr('class', 'x label')
 .attr('text-anchor', 'middle')
 .attr('x', width)
 .attr('y', height + 30)
 .text('Count');

svg
 .append('text')
 .attr('class', 'y label')
 .attr('text-anchor', 'middle')
 .attr('x', -height/2)
 .attr('y', -50)
 .attr('dy', '.75em')
 .attr('transform', 'rotate(-90)')
 .text('Activity');
  });