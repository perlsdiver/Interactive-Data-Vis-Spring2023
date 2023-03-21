## NOTES

-----------
INSTRUCTIONS:
Use this markdown file to keep track of open questions/challenges from this week's assignment.

- What did you have trouble solving?

I had a hard time with importing and figuring out the area chart.

- What went easier than expected?

Making a basic line chart. I used the same data set, as I did for 2_2, which was easier to represent than the data used in the demo code. My data set is too simple for a stacked area chart, though.

- What, if anything, is currently blocking you?

Getting stuck on area charts. I do not understand why I could not import d3-shape, and thus could not call the function area().

From the documentation in the d3-shape documentation, this seemed like it would work, but it did not:

import * as d3 from 'd3-shape';

I also tried to import the code from Obervable (with the code snippet copied from the notebook; it's in my JS code here but I will not repost the whole thing). But it I could not solve how to make it work, and thus this code, which I adapted for my data, did not work:

   chart = AreaChart(data, {
      x: d => d.Year,
      y: d => d.Estimate,
      yLabel: "Estimated Homeless Population (in the US",
      width,
      height: 500,
      color: "steelblue"
    })





Sometimes it helps to formulate what you understood and where you got stuck in order to move forward. Feel free to include `code snippets`, `screenshots`, and `error message text` here as well.

If you find you're not able complete this week's assignment, reflecting on where you are getting stuck here will help you get full credit for this week's tutorial

------------
