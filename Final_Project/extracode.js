// this is a file for extra code
// some programmer friends helped me create the script below to wrangle my data


const csv = require("csvtojson");
const fs = require("fs");

const csvFilePath = "/Users/ian/Documents/GitHub/Interactive-Data-Vis-Spring2023/data/final/CensusData.csv";

const sourceGeoJSON = require('../data/final/CensusTracts.json');


(async () => {
    // const sourceGeoJSON = JSON.parse(fs.readFileSync(sourceGeoJSONFile))
    const plumbingDataCollection = await csv({checkType:true}).fromFile(csvFilePath);
    sourceGeoJSON.features.map(feature => {
        const plumbingData = plumbingDataCollection.find(data => data.GEOID.toString() === feature.properties.GEOID.toString())
        console.log(plumbingData)
        feature.properties = { ...feature.properties, ...plumbingData }
        return feature
    })
    fs.writeFileSync('/Users/ian/Documents/GitHub/Interactive-Data-Vis-Spring2023/data/final/CensusMerged.json', JSON.stringify(sourceGeoJSON, null, 2))

})()