/*
Code for making a web page, containing linked views.
By Ellemijke Donner, 10734198.
This file: Watertest.js containing the javascript code.
Other files needed:
  - index.html for webpage design.
  - stylesheet.css for style of webpage.
  - obesityfinal.json for data concerning obesity.
  - drinkingwatersimple.json for data concerning drinking water.
*/

/* checkBucket function gives color to the map, according to accessability of
drinking water. Gets called in getData.
*/
function checkBucket(n){
  // give specific color accordingly to percentages
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

/* giveColor gives color to the barchart, according to the obesity rates in
a certain country. Gets called in highlightBar and makeBars.
*/
function giveColor(n){
  // give specific color accordingly to obesity percentages
  if ( n < 6)
  {
    return "rgba(255, 0, 0, 0.8)"
  }
  if ( n > 6 && n < 10)
  {
    return "rgb(255, 204, 204)"
  }
  if (n > 10 && n < 16)
  {
    return "rgb(255, 153, 153)"
  }
  if (n > 16)
  {
    return "rgb(255, 102, 102)"
  }
}

/* window onload gets the data before making the map of South America,
then start showing page.
*/
window.onload = function()
{

  queue()
    .defer(d3.json, 'obesityfinal.json')
    .defer(d3.json, 'drinkingwatersimple.json')
    .awaitAll(getData);

/* getData gets the data form obesityfinal.json and drinkingwatersimple.json.
Puts the data in an array for the Barchart, and in an object for the map. Gets
called in window.onload.
*/
function getData(error, response) {
    var obesitySimple = response[0];
    var waterSimple = response[1];
    if (error) throw error;
    var countriesLength = 13;
    var dataArray = [];
    var obj = {};

    // iterate over data, with three steps at a time, to add the right data to
    // a certain country.
    for (var i = 0; i < 39; i = i + 3)
     {
       var countryName = obesitySimple["fact"][i]["dims"]["COUNTRY"];
       if (i < 35) {
         var obesityBothP = obesitySimple["fact"][i]["Value"];
         var obesityMaleP = obesitySimple["fact"][i + 1]["Value"];
         var obesityFemaleP = obesitySimple["fact"][i + 2]["Value"];
       }
       else {
         var obesityBothP = obesitySimple["fact"]["36"]["Value"];
         var obesityMaleP = obesitySimple["fact"]["37"]["Value"];
         var obesityFemaleP = obesitySimple["fact"]["38"]["Value"];
       }
       var waterValue = waterSimple["fact"][Math.floor(i / 3)]["Value"];
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

      // put the data in dataArray
       dataArray.push(
           {
             country: countryName,
             countryISO: countryISOlist[countryName],
             obesityBoth: obesityBothP.slice(0, 4),
             obesityMale: obesityMaleP.slice(0, 4),
             obesityFemale: obesityFemaleP.slice(0, 4)
           });

      // make an object list with the data
      obj[countryISOlist[countryName]] = {
        water: waterValue,
        fillKey: checkBucket(waterValue)
      }
     }

     // call function makeMap
     makeMap(obj, dataArray);
  };

/* makeMap makes the map with d3 geo, zooms in on South America and scales it.
Gets called in getData.
*/
function makeMap(obj, dataArray) {

    var map = new Datamap({
      element: document.getElementById("container-map"),
      scope: 'world',

      // zoom in on South America
      setProjection: function(element) {
        var projection = d3.geo.equirectangular()
                            .center([-50, -25])
                            .rotate([4.4, 0])
                            .scale(350)
                            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
                      .projection(projection);
        return {path: path, projection: projection};
      },

      // give colors to countries
      fills: {
        defaultFill: 'rgb(255, 255, 255)',
        '90 - 93 %': 'rgb(255, 102, 102)',
        '94 - 96 %': 'rgb(153, 204, 255)',
        '97 - 100 %': 'rgb(153, 153, 255)',
      },

      // use the object data
      data: obj,

      // set tooltip
      geographyConfig: {
            highlightOnHover: false,
            popupTemplate: function(geo, data) {
              highlightBar(geo.id, data);
              return ['<div class="tooltip"><strong>',
                        'Access to clean water in %, ' + geo.properties.name,
                        ': ' + data.water,
                        '</strong></div>'].join('');
            }
        },

      // on click, make button
      done: function(datamap) {
        datamap.svg
        .selectAll('.datamaps-subunit')
        .on('click', function(d) {
          makeButton(dataArray);
        });
      }
    });

    // set legend
    map.legend();
  };

/* highlightBar highlights the bar of the country that is hooverd on on the map.
Gets called in makemap*/
function highlightBar (iso, data) {

  // fill grey, return original color
  d3.select("#" + iso)
    .attr("fill", "grey")
    .transition(0)
    .attr("fill", function(d){
       return giveColor(+d.obesityBoth)
     });
}

/* makeButton makes the button where you can choose which gender to visualize in
the barchart. Gets called in makeMap when clicked on a country. */
function makeButton(dataArray) {

  // delete existing button
  d3.select('#button').selectAll('select')
    .remove();

  // set default barchart (through default selectedValue)
  var selectedValue = 'Both Sexes';

  // make new button
  var select = d3.select("#button").append('select')
      .attr('class','select')
      .on('change', onChange);

  // set button variables
  var variables = ['Both Sexes', 'Male', 'Female'];

  // make button options
  var options = select
        .selectAll('option')
        .data(variables)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
          });

  /* onChange gives the selectedValue and calls makeBars with this value.
  Gets called when any given option is clicked on.*/
  function onChange() {

      selectedValue = d3.select('select').property('value');
      makeBars(dataArray, selectedValue)
  }

  // make bars, also when button is not yet clicked on.
  makeBars(dataArray, selectedValue);
  };

/* makeBars makes the barchart. Gets called in makeButton. */
function makeBars(dataArray, selectedValue) {

  // remove previous existing barchart
  d3.select("#container-bar").selectAll("svg")
    .remove();

  // make an extra array of the different countries (to filter out extra text)
  var countries = [];
  var dataArrays = dataArray;
  var selectedValue = selectedValue;

  for (var i = 0; i < 13; i++) {
    if (i == 1){
      var temp = dataArrays[i]["country"];
      countries.push(temp.slice(0, 7));
    }
    else {
    var temp = dataArrays[i]["country"];
    countries.push(temp.slice(0, 10));
  }
  };

  // set width and height of chart, of svg, set margins, set max value
  var width = 300;
  var height = 200;
  var barPadding = 4;
  var heightMargin = 75;
  var widthMargin = 50;
  var maxValue = 25;
  var countriesLength = countries.length;

  // get interactivity(label), give label
  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-20,0])
    .html (function (d, i) {
      if ('Both Sexes' == selectedValue){
      return "<strong>Obesityrate in %:</strong> <span style='color:black'>" + d.obesityBoth + "</span>"
    }
    if ('Male' == selectedValue) {
      return "<strong>Obesityrate in %:</strong> <span style='color:black'>" + d.obesityMale + "</span>"
    }
    if ('Female' == selectedValue) {
      return "<strong>Obesityrate in %:</strong> <span style='color:black'>" + d.obesityFemale + "</span>"
    }
  });

  // make the svg
  var svg = d3.select("#container-bar")
              .append("svg")
              .attr("width", width + widthMargin)
              .attr("height", height + (2 * heightMargin))
              .append("g");

  // show tip
  svg.call(tip);

  // make x scale
  var x = d3.scale.linear()
                .domain([0, countriesLength])
                .range([widthMargin, width + widthMargin]);

  // make y scale
  var y = d3.scale.linear()
            .domain([0, maxValue])
            .range([0, height]);

  // scale axis to make sure bars start at the bottom
  var axisScale = d3.scale.linear()
                    .domain([0, maxValue])
                    .range([height, 0]);

  // set x axis according to xScale
  var xAxis = d3.svg.axis()
                .scale(x)
                .orient("bottom")
                .ticks(countriesLength)
                .tickFormat(function(d, i) {
                   return countries[i];
                 });

  // set y axis according to axisScale
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
       .attr("id", function(d){
         return d.countryISO;
       })
       .attr("x", function(d, i) {
         return i * (width / countriesLength) + widthMargin;
       })
       .attr("y", function (d){
         if ('Both Sexes' == selectedValue){
         return height + heightMargin - y(+d.obesityBoth);
       }
       if ('Male' == selectedValue) {
         return height + heightMargin - y(+d.obesityMale);
       }
       if ('Female' == selectedValue) {
         return height + heightMargin - y(+d.obesityFemale);
       }
       })
       .attr("width", width / countriesLength - barPadding)
       .attr("height", function(d) {
         if ('Both Sexes' == selectedValue){
          return y(+d.obesityBoth);
         }
         if ('Male' == selectedValue){
          return y(+d.obesityMale);
         }
         if ('Female' == selectedValue){
          return y(+d.obesityFemale);
         }
       })
       .attr("fill", function(d){
         if ('Both Sexes' == selectedValue){
          return giveColor(+d.obesityBoth);
         }
         if ('Male' == selectedValue){
          return giveColor(+d.obesityMale);
         }
         if ('Female' == selectedValue){
          return giveColor(+d.obesityFemale);
         }
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
        .attr("transform", "rotate(-50)");

    // create Y axis
    svg.append("g")
        .attr("class", "axis")
        .attr("transform", "translate(" + widthMargin + "," +
               heightMargin + ")")
        .call(yAxis);


    // append yAxis title
    svg.append("text")
          .attr("transform", "rotate(-90)")
          .attr("y", 7)
          .attr("x", - 170)
          .attr("dy", "1em")
          .style("text-anchor", "middle")
          .style("font-size", "12px")
          .style("font-family", "calibri")
          .style("font-weight", "bold")
          .text( function (d) {
            if (selectedValue == 'Both Sexes') {
              return "Obesity prevelance under children in %"
            }
            if (selectedValue == 'Male') {
              return "Obesity prevelance under boys in %"
            }
            if (selectedValue == 'Female') {
              return "Obesity prevelance under girls in %"
            }
          });

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
