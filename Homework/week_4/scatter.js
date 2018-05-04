// Ellemijke Donner, 10734198, scatterplot javascript

// load data
window.onload = function()
{
  var data = "https://stats.oecd.org/SDMX-JSON/data/RWB/CAN+CHL+FIN+DEU+ISL+ISR+ITA+JPN+KOR+MEX+NLD+NZL+NOR+PRT+SVN+ESP+SWE+GBR.LIFE_EXP+VOTERS_SH+SUBJ_SOC_SUPP+SUBJ_LIFE_SAT.VALUE/all?startTime=2014&endTime=2014&dimensionAtObservation=allDimensions";

  d3.queue()
  .defer(d3.request, data)
  .await(doFunction);

  // check for error
  function doFunction(error, response)
  {
    if (error) throw error;

    // save data
    var obj = JSON.parse(response.responseText);
    console.log(obj);
    var array = [];
    var countries = obj.structure.dimensions.observation[0].values;
    var countriesLength = countries.length;

    // get right info for needed data
    for (var i = 0; i < countriesLength; i++)
    {
      var expectancyPosition = i + ":0:0:0"
      var turnoutPosition = i + ":1:0:0"
      var satisfactionPosition = i + ":2:0:0"
      var networkPosition = i + ":3:0:0"

      // put data in array
      array.push(
        {
          country: countries[i].name,
          lifeExpectancy: obj.dataSets[0].observations[expectancyPosition][0],
          voterTurnout: obj.dataSets[0].observations[turnoutPosition][0],
          lifeSatisfaction: (obj.dataSets[0].observations[satisfactionPosition][0]) * 10,
          socialNetwork: obj.dataSets[0].observations[networkPosition][0],
        });
      }


      // set title and descriptive paragraph
      d3.select("head").append("title")
        .text("Well-being per country.");
      d3.select("body").append("h1")
        .text("Well-being in different countries.");
      d3.select("body").append("p")
        .text("OECD (2014).")
        .attr("class", "link")
        .on("click", function() {
          window.open("https://www.oecd-ilibrary.org/urban-rural-and-regional-development/data/oecd-regional-statistics/regional-well-being_data-00707-en");
        })
      d3.select("body").append("p")
        .text("This scatterplot shows information about regional well-being, referenced by life satisfaction on the y-axis.");
      d3.select("body").append("p")
        .text("Inspired by Putnam's famous political science book: 'Bowling Alone'.")
      d3.select("body").append("p")
        .text("By Ellemijke Donner (10734198).")

      // make a default scatterplot
      var selectedValue = 'life expectancy';

      // set button (working)
      var select = d3.select("body").append('select')
        .attr('class','select')
        .on('change', onchange);

      // set button (options)
      var variables = ['life expectancy', 'voter turnout', 'social network'];

      // set button (working)
      var options = select
          .selectAll('option')
          .data(variables)
          .enter()
          .append('option')
          .text(function (d) {
              return d;
            });

        // put button on right location
        d3.select("body").append('h1')
        .text(" ")

        // start making scatterplot
        function onchange() {
           var selectedValue = d3.select('select').property('value')
            d3.select('body').selectAll('circle')
              .remove()
            d3.select('body').selectAll('svg')
              .remove()
            makePlot(selectedValue)
           }

       // set a default plot
       makePlot(selectedValue)
       function makePlot(selectedValue) {

       // set variables needed for making the SVG
       var dataset = array;
       var margin = {top: 100, right: 100, bottom: 60, left: 100},
          width = 700 - margin.left - margin.right,
          height = 600 - margin.top - margin.bottom;

       // create SVG element
       var svg = d3.select("body")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

       // make yScale
       var y = d3.scaleLinear()
                  .domain([d3.min(dataset, function(d) {
                      return (d.lifeSatisfaction - 1);
                  }),
                  d3.max(dataset, function(d) {
                    return (d.lifeSatisfaction + 1);
                  })])
                    .range([height, 0]);

      // set values for option chosen by user
      if ('life expectancy' == selectedValue)
      {
          var x = d3.scaleLinear()
                    .domain([d3.min(dataset, function(d) {
                      return (d.lifeExpectancy - 1);
                    }),
                    d3.max(dataset, function(d) {
                      return (d.lifeExpectancy + 2);
                    })])
                    .range([0, width]);
        };
       if ('voter turnout' == selectedValue)
       {
           var x = d3.scaleLinear()
                     .domain([d3.min(dataset, function(d) {
                       return (d.voterTurnout - 1);
                      }),
                      d3.max(dataset, function(d) {
                         return (d.voterTurnout + 2);
                      })])
                     .range([0, width]);
        };
        if ('social network' == selectedValue)
        {
            var x = d3.scaleLinear()
                    .domain([d3.min(dataset, function(d) {
                      return (d.socialNetwork - 1);
                    }),
                    d3.max(dataset, function(d) {
                        return (d.socialNetwork + 2);
                    })])
                  .range([0, width]);
        };

      // make xAxis and yAxis
      var xAxis = d3.axisBottom(x);
      var yAxis = d3.axisLeft(y);

      // change color of circles
      var color = d3.scaleSequential(d3.interpolateRainbow)
                        .domain([0, countriesLength]);

      // make points on svg for option chosen by user
      if ('life expectancy' == selectedValue)
      {
      svg.selectAll("circle")
          .data(dataset)
          .enter()
          .append("circle")
          .attr("cx", function(d) {
            return x(d.lifeExpectancy);
          })
          .attr("cy", function(d) {
            return y(d.lifeSatisfaction);
          })
          .attr("fill", function(d, i) {
              return color(i);
          })
          .attr("r", 7);
        }
        if ('voter turnout' == selectedValue)
        {
        svg.selectAll("circle")
            .data(dataset)
            .enter()
            .append("circle")
            .attr("cx", function(d) {
              return x(d.voterTurnout);
            })
            .attr("cy", function(d) {
              return y(d.lifeSatisfaction);
            })
            .attr("fill", function(d, i) {
                return color(i);
            })
            .attr("r", 7);
          }
          if ('social network' == selectedValue)
          {
          svg.selectAll("circle")
              .data(dataset)
              .enter()
              .append("circle")
              .attr("cx", function(d) {
                return x(d.socialNetwork);
              })
              .attr("cy", function(d) {
                return y(d.lifeSatisfaction);
              })
              .attr("fill", function(d, i) {
                  return color(i);
              })
              .attr("r", 7);
            }

      // make xAxis
      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      // set title xAxis with right text
      if ('life expectancy' == selectedValue)
      {
      svg.append("text")
          .attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")")
          .style("font-size", "14px")
          .style("font-family", "calibri")
          .style("text-anchor", "middle")
          .text("Life expectancy in years (by birth)");
      }
      if ('voter turnout' == selectedValue)
      {
      svg.append("text")
          .attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")")
          .style("font-size", "14px")
          .style("font-family", "calibri")
          .style("text-anchor", "middle")
          .text("Voter turnout (%)");
      }
      if ('social network' == selectedValue)
      {
      svg.append("text")
          .attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")")
          .style("font-size", "14px")
          .style("font-family", "calibri")
          .style("text-anchor", "middle")
          .text("Social network (according to self, scale 0 to 10)");
      }

      // append yAxis
      svg.append("g")
            .attr("class", "axis")
            .call(yAxis);

      // append yAxis title
      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - (margin.left - 20))
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .style("font-family", "calibri")
          .text("Life satisfaction (scale 0 - 100)");


       // set legend
       var legend = svg.selectAll(".legend")
                      .data(countries)
                      .enter()
                      .append("g")
                      .attr("transform", function(d, i) { return "translate(0," + i * 12 + ")"; });

       legend.append("rect")
          .attr("x", width + 20)
          .attr("y", height - 215)
          .attr("width", 7)
          .attr("height", 7)
          .attr("fill", function(d, i) {
              return color(i);
          });

       legend.append("text")
          .attr("x", width + 30)
          .attr("y", height - 211)
          .attr("dy", ".35em")
          .style("text-anchor", "begin")
          .style("font-family", "calibri")
          .style("font-size", "12px")
          .style("fill", "grey")
          .text(function(d, i) { return countries[i].name;
          });
        };
      };
}
