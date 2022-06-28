// --- DROPdown MENU --- //
// Use `d3.json` to fetch the sample data for the plots
d3.json("samples.json").then((data) => {
    // console.log(data.names)
    
    let dropdown = d3.select("#selDataset");
    data.names.forEach((id) => {
        //console.log(id)
        dropdown.append('option').text(id).property("value", id)
    })
    BuildCharts(data.names[0])
})

function optionChanged(selected) {
    BuildCharts(selected)
}

function BuildCharts(selected) {
    d3.json("samples.json").then((data) => {
        // console.log(data)
        // You need to filter by selected
        let results = data.samples.filter(obj => obj.id == selected);

        console.log(results);
        // console.log(results[0].otu_ids);
        let id = results[0].otu_ids;
        // console.log(results[0].otu_labels);
        let label = results[0].otu_labels;
        // console.log(results[0].sample_values);
        let sample = results[0].sample_values;
    
        // --- BAR DATA --- //
        // Prepend OTU to the id because out_ids is an array:
        // Need an array of "OTU" and out_ids
        // use .map, id, `OTU `, .slice(0,10)
        let trace1 = {
            x: sample.slice(0,10).reverse(),
            y: id.slice(0, 10).map(id => `OTU: ${id}`).reverse(),
            text: label.slice(0,10).reverse().map(a => a.replaceAll(";", ",  ")),
            orientation: "h",
            marker: {
              color: sample.slice(0,10).reverse(),
              colorscale: 'Portland',
            },
            type: "bar",
            
        }

        let barchart_data = [trace1]

        let bar_layout = {
            title: `Top 10 OTU's <br> for Test Subject ${selected}`,
            width: 450, 
            height: 400,
            xaxis: {
                title: {
                    text: 'Microbial Count',
                }
            },
        }
        Plotly.newPlot("bar", barchart_data, bar_layout);

        // --- BUBBLE DATA --- //
        // Display each sample
        let desired_maximum_marker_size = 100;
        let trace2 = {
            x: id,
            y: sample,
            text: label.map(a => a.replaceAll(";", ", ")),
            mode: 'markers',
            marker: {
                size: sample,
                sizeref: 2.0 * Math.max(...sample) / (desired_maximum_marker_size**2),
                sizemode: 'area',
                color: id,
            },
        }

        let bubble_data = [trace2]

        let bubble_layout = {
            //title: "Operational Taxonomic Unit Values",
            xaxis: {
                title: {
                    text: "Microbial Species ID",
                }
            },
            yaxis: {
                title: {
                    text: "Microbial Count",
                }
            },
        }
        Plotly.newPlot('bubble', bubble_data, bubble_layout);
    
        // --- Demographics --- //
        // Display metadata
        // Display each key-value pair from the metadata JSON 
        let metaresult = data.metadata.filter(obj => obj.id == selected);
        // console.log(meta[0]);
    
        let demographics = d3.select("#sample-metadata")
        demographics.html("")
        
        Object.entries(metaresult[0]).forEach(([key, value]) => {
                demographics.append("h5").text(toTitleCase(key) + ": " + value)

        });
        
        function toTitleCase(str) {
            return str.replace(
              /\w\S*/g,
              function(txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
              }
            );
        }
    
        var bonus = [
            {
              domain: { x: [0, 1], y: [0, 1] },
              value: metaresult[0].wfreq,
              title: { text: `Belly Button<br>Weekly Washing Frequency<br> for Test Subject ${selected}` },
              type: "indicator",
              mode: "gauge+number+delta",
              delta: { reference: 0 },
              gauge: {
                axis: { range: [null, 9] },
                steps: [
                  { range: [0, 3], color: "gray" },
                  { range: [3, 7], color: "lightgray" }
                ],
                threshold: {
                  line: { color: "red", width: 2 },
                  thickness: 0.75,
                  value: 8.9
                }
              }
            }
        ];
          
          var layout = { 
            width: 450, 
            height: 400, 
            margin: { t: 80, b: 0 } 
          };
          
        Plotly.newPlot('gauge2', bonus, layout);
    })     
}