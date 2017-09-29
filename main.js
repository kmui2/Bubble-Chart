$('#submit').on("click",function(e){
    e.preventDefault();
 
    $('#files').parse({
        config: {
            delimiter: ",",
            header: true,
            dynamicTyping: true,
            complete: plotBubbleChart,
        },
        before: function(file, inputElem)
        {
            console.log("Parsing file...", file);
        },
        error: function(err, file)
        {
            console.log("ERROR:", err, file);
        },
        complete: function()
        {
            console.log("Done with all files");
        }
    });
});

function plotBubbleChart(results) {
    let maleData = [];
    let femaleData = [];

    for (let pt of results.data){
        if (pt.sex == 'male')
            maleData.push(pt);
        else if (pt.sex == 'female')
            femaleData.push(pt);
    }

    console.log(maleData);
    console.log(femaleData);
    var male = {
        x: _.map(maleData, (pt) => {
            let arr = pt.ageinterval10.split(' ');
            let start = parseInt(arr[0]);
            let end = parseInt(arr[2]);
            return (start+end+1)/2;
        }),
        y: _.map(maleData, (pt) => {
            return 'Male';
        }),
        text: _.map(maleData, (pt) => {
            let line = '';
            for (let attr in pt)
                line += attr+': '+pt[attr]+'<br>';
            return line
        }),
        mode: 'markers',
        marker: {
          size: _.map(maleData, (pt) => {
              return pt.total_survived;
          }),
          color: _.map(maleData, (pt) => {
                if (pt.mean_survived < 0.5)
                    return 'rgb(255,165,0)';
                else if (pt.mean_survived >= 0.5)
                    return 'rgb(135,206,250)';
          })  
        },
        name: 'Male'
    };

    var female = {
        x: _.map(maleData, (pt) => {
            let arr = pt.ageinterval10.split(' ');
            let start = parseInt(arr[0]);
            let end = parseInt(arr[2]);
            return (start+end+1)/2;
        }),
        y: _.map(femaleData, (pt) => {
            return 'Female';
        }),
        text: _.map(maleData, (pt) => {
            let line = '';
            for (let attr in pt)
                line += attr+': '+pt[attr]+'<br>';
            return line
        }),
        mode: 'markers',
        marker: {
          size: _.map(femaleData, (pt) => {
              return pt.total_survived;
          }),
          color: _.map(femaleData, (pt) => {
                if (pt.mean_survived < 0.5)
                    return 'rgb(255,165,0)';
                else if (pt.mean_survived >= 0.5)
                    return 'rgb(135,206,250)';
          })  
        },
        name: 'Female'
    };

      
      var data = [male, female];
      
      var layout = {
        title: 'Marker Size',
        showlegend: true,
        height: 600,
        width: 600
      };
      
      Plotly.newPlot('myDiv', data, layout);

    let maleDataAbove = [];
    let maleDataBelow = [];
    
    _.map(maleData, (pt) => {
        if (pt.mean_survived >= 0.5)
            maleDataAbove.push(pt);
        else if (pt.mean_survived < 0.5)
            maleDataBelow.push(pt);
    });

    let femaleDataAbove = [];
    let femaleDataBelow = [];
    
    _.map(femaleData, (pt) => {
        if (pt.mean_survived >= 0.5)
            femaleDataAbove.push(pt);
        else if (pt.mean_survived < 0.5)
            femaleDataBelow.push(pt);
    });

    var ctx = $("#myChart");
    let chartData = {
        datasets: [{
            label: ['Female <0.5'],
            data: _.map(femaleDataBelow, (pt) => {
                let arr = pt.ageinterval10.split(' ');
                let start = parseInt(arr[0]);
                let end = parseInt(arr[2]);
                let x = (start+end+1)/2;
                return {
                    x: x,
                    y: 1,
                    r: pt.total_survived
                }
            }),
            backgroundColor: "#FF9966"
        },
        {
            label: ['Female >=0.5'],
            data: _.map(femaleDataAbove, (pt) => {
                let arr = pt.ageinterval10.split(' ');
                let start = parseInt(arr[0]);
                let end = parseInt(arr[2]);
                let x = (start+end+1)/2;
                return {
                    x: x,
                    y: 1,
                    r: pt.total_survived
                }
            }),
            backgroundColor: "#87CEFA"
        },
        {
            label: ['Male <0.5'],
            data: _.map(maleDataBelow, (pt) => {
                let arr = pt.ageinterval10.split(' ');
                let start = parseInt(arr[0]);
                let end = parseInt(arr[2]);
                let x = (start+end+1)/2;
                return {
                    x: x,
                    y: 0,
                    r: pt.total_survived
                }
            }),
            backgroundColor: "#FF9966"
        },
        {
            label: ['Male >=0.5'],
            data: _.map(maleDataAbove, (pt) => {
                let arr = pt.ageinterval10.split(' ');
                let start = parseInt(arr[0]);
                let end = parseInt(arr[2]);
                let x = (start+end+1)/2;
                return {
                    x: x,
                    y: 0,
                    r: pt.total_survived
                }
            }),
            backgroundColor: "#87CEFA"
        }]
    }
    console.log(chartData);
    // For a bubble chart
    var myBubbleChart = new Chart(ctx,{
        type: 'bubble',
        data:chartData,
        options: {
            scales: {
                yAxes: [{
                    ticks: {
                        min: -1,
                        max: 3,
                        // Include a dollar sign in the ticks
                        callback: function(value, index, values) {
                            if (value == 0)
                                return 'Male';
                            if (value == 1)
                                return 'Female'
                        }
                    }
                }]
            },
            responsive: true,
            maintainAspectRatio: false
        }
    });

}