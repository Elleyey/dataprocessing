// code for making two interactive datachars, by Ellemijke Donner, 10734198

// function to determine color of country
function checkBucket(n){
  if (n < 94) {
    return "90 - 93 %"
  }
  if (n > 94 && n < 96) {
    return "94 - 96 %"
  }
  if (n > 96) {
    return "97 - 100 %"
  }
}

function giveColor(n){
  if ( n < 6)
  {
    return "rgba(255, 0, 0, 0.8)"
  }
  if ( n > 6 && n < 10)
  {
    return "rgb(255, 204, 204)"
  }
  if (n > 10 && n < 15)
  {
    return "rgb(255, 153, 153)"
  }
  if (n > 16)
  {
    return "rgb(255, 102, 102)"
  }
}

window.onload = function()
{

  queue()
    .defer(d3.json, 'obesityfiltered.json')
    .defer(d3.json, 'drinkingwatersimple.json')
    .awaitAll(getData)
    // .await(makeMap);
    //.await(makeBarchart);

  function getData(error, response) {
    var obesitySimple = response[0]
    var waterSimple = response[1]
    if (error) throw error;
    // set needed variables
    var countriesLength = 13;
    var data = [];
    var obj = {};
    // put data in array

    for (var i = 0; i < countriesLength; i++)
     {
       var countryName = obesitySimple["fact"][i]["dims"]["COUNTRY"];
       var obesityValue = obesitySimple["fact"][i]["Value"];
       var waterValue = waterSimple["fact"][i]["Value"];
       var countryISOlist = { "Argentina" : "ARG",
                              "Bolivia (Plurinational State of)" : "BOL",
                              "Brazil" : "BRA",
                              "Chile" : "CHL",
                              "Colombia" : "COL",
                              "Ecuador" : "ECU",
                              "Guyana" : "GUY",
                              "Panama" : "PAN",
                              "Paraguay" : "PRY",
                              "Peru" : "PER",
                              "Suriname" : "SUR",
                              "Uruguay" : "URY",
                              "Venezuela (Bolivarian Republic of)" : "VEN"};

       data.push(
           {
             // console.log(data)
             country: countryName,
             countryISO: countryISOlist[countryName],
             obesity: obesityValue.slice(0, 4),
             //water: waterValue,
           });

      // make object list with data
      obj[countryISOlist[countryName]] = {
        water: waterValue,
        obesity: obesityValue.slice(0,4),
        fillKey: checkBucket(waterValue)
      }
     }
     makeMap(obj);
     makeBars(data);
  };


function makeMap(data) {

    var map = new Datamap({
      element: document.getElementById("container"),
      scope: 'world',
      // zoom in on South America
      setProjection: function(element) {
        var projection = d3.geo.equirectangular()
                            .center([-50, -25])
                            .rotate([4.4, 0])
                            .scale(400)
                            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
                      .projection(projection);
        return {path: path, projection: projection};
      },
      fills: {
        defaultFill: 'rgb(255, 255, 255)',
        '90 - 93 %': 'rgb(255, 102, 102)',
        '94 - 96 %': 'rgb(153, 204, 255)',
        '97 - 100 %': 'rgb(153, 153, 255)',
      },
      data: data,
      geographyConfig: {
            highlightOnHover: false,
            popupTemplate: function(geo, data) {
              return ['<div class="tooltip"><strong>',
                        'Access to clean water in %, ' + geo.properties.name,
                        ': ' + data.water,
                        '</strong></div>'].join('');
            }
        }
    });

    map.legend();

// close makeMap
};

function makeBars(data) {

  var countries = [];
  var dataArray = data;

  for (var i = 0; i < 13; i++) {
    var temp = dataArray[i]["country"];
    countries.push(temp.slice(0, 10));
  }

  // set width and height of graph, of svg, set margins, set max value
  var width = 400;
  var height = 250;
  var barPadding = 4;
  var heightMargin = 75;
  var widthMargin = 50;
  var maxValue = 20;

  // get interactivity(label), give label
  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-20,0])
    .html (function (d, i) {
      return "<strong>Obesity in %:</strong> <span style='color:black'>" + d.obesity + "</span>"
  })

  // make the svg
  var svg = d3.select("body")
              .append("svg")
              .attr("width", width + widthMargin)
              .attr("height", height + (2 * heightMargin))
              .append("g");

  // show tip
  svg.call(tip);

  // make x scale (domain is values (0 to 17), range is where x axis begins and ends)
  var x = d3.scale.linear()
                .domain([0, 13])
                .range([widthMargin, width + widthMargin]);

  // make y scale (domain is values of obesity, range is where y axis begins and ends)
  var y = d3.scale.linear()
            .domain([0, maxValue])
            .range([0, height]);

  var axisScale = d3.scale.linear()
                    .domain([0, maxValue])
                    .range([height, 0]);

  // set x axis according to xScale
  var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(13)
                .tickFormat(function(d, i) {
                   return countries[i];
                 });

  var yAxis = d3.svg.axis()
                .scale(axisScale)
                .orient("left")
                .ticks(5);



  // create SVG Barchart
  svg.selectAll(".bar")
       .data(dataArray)
       .enter()
       .append("rect")
       .attr("class", "bar")
       .attr("x", function(d, i) {
         return i * (width / 13) + widthMargin;
       })
       .attr("y", function (d){
         return height + heightMargin - y(+d.obesity);
       })
       .attr("width", width / 13 - barPadding)
       .attr("height", function(d) {
         return y(+d.obesity);
       })
       // .attr("fill", function(d, i) {
       //   console.log(i);
       //  return "rgba(255, 100, " + (i * 10) + ", 0.6)";
       // })
       .attr("fill", function(d){
         return giveColor(+d.obesity)
       })
       .on("mouseover", tip.show)
       .on("mouseout", tip.hide);


    // create X axis
    svg.append("g")
        .attr("class","axis")
        .attr("transform", "translate(0," + (height + heightMargin) + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("transform", "rotate(-50)")

    // create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + widthMargin + "," +
               heightMargin + ")")
        .call(yAxis);


        // append yAxis title
        svg.append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 10)
            .attr("x", - 185)
            .attr("dy", "1em")
            .style("text-anchor", "middle")
            .style("font-size", "12px")
            .style("font-family", "calibri")
            .style("font-weight", "bold")
            .text("Obesity prevelance under children");

        // append xAxis title
        svg.append("text")
              .attr("transform", "translate(" + (width / 2) + "," + (height + 145) + ")")
              .style("font-size", "12px")
              .style("font-weight", "bold")
              .style("font-family", "calibri")
              .style("text-anchor", "middle")
              .text("Countries in South America");

};

//close window onload
};
