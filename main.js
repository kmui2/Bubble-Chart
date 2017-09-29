$('#submit').on("click",function(e){
    e.preventDefault();
 
    $('#files').parse({
        config: {
            delimiter: ",",
            header: true,
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
}