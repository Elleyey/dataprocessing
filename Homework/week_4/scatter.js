// Ellemijke Donner, 10734198, scatterplot javascript

window.onload = function()
{
  var data = "http://stats.oecd.org/SDMX-JSON/data/RWB/CAN+CHL+FIN+DEU+ISL+ISR+ITA+JPN+KOR+MEX+NLD+NZL+NOR+PRT+SVN+ESP+SWE+GBR.LIFE_EXP+VOTERS_SH+SUBJ_SOC_SUPP+SUBJ_LIFE_SAT.VALUE/all?startTime=2014&endTime=2014&dimensionAtObservation=allDimensions";

  d3.queue()
  .defer(d3.request, data)
  .await(doFunction);

  function doFunction(error, response)
  {
    if (error) throw error;

    var obj = JSON.parse(response.responseText);
    var array = [];
    var countries = obj.structure.dimensions.observation[0].values;
    //console.log(countries[0].name);
    var countriesLength = countries.length;

    for (var i = 0; i < countriesLength; i++)
    {
      var expectancyPosition = i + ":0:0:0"
      var turnoutPosition = i + ":1:0:0"
      var satisfactionPosition = i + ":2:0:0"
      var networkPosition = i + ":3:0:0"

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
        .text("Regional well-being.");
      d3.select("body").append("h1")
        .text("Regional Well-being.");
      d3.select("body").append("p")
        .text("OECD (2014).")
        .attr("class", "link")
        .on("click", function() {
          window.open("https://www.oecd-ilibrary.org/urban-rural-and-regional-development/data/oecd-regional-statistics/regional-well-being_data-00707-en");
        })
      d3.select("body").append("p")
        .text("This scatterplot shows information about regional well-being.");
      d3.select("body").append("p")
        .text("By Ellemijke Donner (10734198).")


      // set variables needed for making the SVG
      var dataset = array;
      var margin = {top: 100, right: 50, bottom: 60, left: 80},
          width = 600 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

      var tip = d3.tip()
                  .attr("class", "d3-tip")
                  .offset([-10, 0])
                  .html(function (d, i) {
                      console.log(countries[i].name);
                      return "<strong>Country: </strong> <div style='color:white'>" + countries[i].name + "</div>";
                  });

      // create SVG element
      var svg = d3.select("body")
              .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
              .append("g")
              .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

      svg.call(tip);

      // make yScale
      var y = d3.scaleLinear()
                  .domain([d3.min(dataset, function(d) {
                      return (d.lifeSatisfaction - 1);
                  }),
                  d3.max(dataset, function(d) {
                    return (d.lifeSatisfaction + 1);
                  })])
                    .range([height, 0]);
                  
      // make xScale
      var x = d3.scaleLinear()
                .domain([d3.min(dataset, function(d) {
                    return (d.lifeExpectancy - 1);
              }),
                    d3.max(dataset, function(d) {
                      return (d.lifeExpectancy + 2);
                    })])
                .range([0, width]);

      // make xAxis and yAxis
      var xAxis = d3.axisBottom(x);
      var yAxis = d3.axisLeft(y);

    //  var color = d3.scaleLinear()
      //              .domain([d3.min(dataset, function(d) {
        //                return (d.lifeSatisfaction);
          //          }),
            //        d3.max(dataset, function(d) {
              //        return (d.lifeSatisfaction);
                //    })])
                  //  .interpolate(d3.interpolateHcL)
                    //.range([d3.rgb("#ece7f2"), d3.rgb("#2b8cbe")]);

      // make points on svg (lifeExpectancy x lifeSatisfaction)
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
              return "rgb(" + 50 * i + ", 0, 100)"
          })
          .attr("r", 7)
          .on("moseover", tip.show)
          .on("mouseout", tip.hide);

      svg.append("g")
          .attr("class", "axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis);

      svg.append("text")
          .attr("transform", "translate(" + (width / 2) + "," + (height + 40) + ")")
          .style("font-size", "14px")
          .style("font-family", "calibri")
          .style("text-anchor", "middle")
          .text("Life expectancy in years (by birth)");

      svg.append("g")
            .attr("class", "axis")
            //.attr("transform", "translate(" + widthMargin + "," + heightMargin + ")")
            .call(yAxis);

      svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 0 - (margin.left - 20))
          .attr("x", 0 - (height / 2))
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "14px")
          .style("font-family", "calibri")
          .text("Life satisfaction (scale 0 - 100)");

        };

      };
