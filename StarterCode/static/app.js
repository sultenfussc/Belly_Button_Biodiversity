// --- DROPdown MENU --- //
// Use `d3.json` to fetch the sample data for the plots
d3.json("samples.json").then((data) => {
    // console.log(data.names)
    
    let dropdown = d3.select("#selDataset")
    data.names.forEach((id) => {
        //console.log(id)
        dropdown.append('option').text(id).property("value", id)
    })
    BuildCharts(data.names[0])
}),

function optionChanged(test_subject) {
    BuildCharts(test_subject)
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
            text: label.slice(0,10).reverse(),
            orientation: "h",
            type: "bar",
        }

        let barchart_data = [trace1]

        let bar_layout = {
            title: `Top 10 OTU's for Individual Test Subject`,
            xaxis: {
                title: {
                    text: 'Counts Present',
                }
            },
        }
        Plotly.newPlot("bar", barchart_data, bar_layout);

    // --- BUBBLE DATA --- //
        // Display each sample
        let desired_maximum_marker_size = 75;
        //let size = [400, 600, 800, 1000];
        let trace2 = {
            x: id,
            y: sample,
            text: label,
            mode: 'markers',
            marker: {
                size: sample,
                //set 'sizeref' to an 'ideal' size given by the formula sizeref = 2. * max
                //(array_of_size_values) / (desired_maximum_marker_size ** 2)
                sizeref: 2.0 * Math.max(...sample) / (desired_maximum_marker_size**2),
                sizemode: 'area',
                color: id,
            },
        }

        let bubble_data = [trace2]

        let bubble_layout = {
            title: "Operational Taxonomic Unit Values",
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
        let meta = data.metadata.filter(obj => obj.id == selected);
        console.log(meta[0]);
    
        let demographics = d3.select("#sample-metadata")
        demographics.html("")
        
        Object.entries(meta[0]).forEach(([key, value]) => {
                demographics.append("div").text(key + ": " + value)

        });
    
    })     
};