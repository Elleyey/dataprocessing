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
  if (n > 10 && n < 16)
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
    .defer(d3.json, 'obesityfinal.json')
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
    var dataArray = [];
    //var dataArrayMale = [];
    //var dataArrayFemale = [];
    var obj = {};
    // put data in array

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

       dataArray.push(
           {
             // console.log(data)
             country: countryName,
             countryISO: countryISOlist[countryName],
             obesityBoth: obesityBothP.slice(0, 4),
             obesityMale: obesityMaleP.slice(0, 4),
             obesityFemale: obesityFemaleP.slice(0, 4)
             //water: waterValue,
           });
      // dataArrayMale.push(
      //        {
      //          // console.log(data)
      //          country: countryName,
      //          countryISO: countryISOlist[countryName],
      //          //obesityBoth: obesityBothP.slice(0, 4),
      //          obesityMale: obesityMaleP.slice(0, 4),
      //          //obesityFemale: obesityFemaleP.slice(0, 4)
      //          //water: waterValue,
      //          });
      // dataArrayFemale.push(
      //             {
      //              // console.log(data)
      //              country: countryName,
      //              countryISO: countryISOlist[countryName],
      //              //obesityBoth: obesityBothP.slice(0, 4),
      //              //obesityMale: obesityMaleP.slice(0, 4),
      //              obesityFemale: obesityFemaleP.slice(0, 4)
      //              //water: waterValue,
      //            });

      // make object list with data
      obj[countryISOlist[countryName]] = {
        water: waterValue,
        obesityBoth: obesityBothP.slice(0,4),
      //  obesityMale: obesityMaleP.slice(0, 4),
        //obesityFemale: obesityFemaleP.slice(0, 4),
        fillKey: checkBucket(waterValue)
      }
     }

     // function checkGender(gender) {
     //   return gender == 'obesityMale';
     // }
     // console.log(dataArray.filter(checkGender));
     makeMap(obj, dataArray);
     //makeBars(data);
  };


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
      fills: {
        defaultFill: 'rgb(255, 255, 255)',
        '90 - 93 %': 'rgb(255, 102, 102)',
        '94 - 96 %': 'rgb(153, 204, 255)',
        '97 - 100 %': 'rgb(153, 153, 255)',
      },
      data: obj,
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
      done: function(datamap) {
        datamap.svg
        .selectAll('.datamaps-subunit')
        .on('click', function(d) {
          var land = d.id;
          var obesityLand = obj[land]["obesity"];
          //console.log(obesityLand);
          //makeBars(dataArray);
          makeButton(dataArray);
        });
      }
    });

    map.legend();

// close makeMap
};

function highlightBar (iso, data) {

  d3.select("#" + iso)
    // .transition()
    // .duration(750)
    .attr("fill", "grey")
    .transition(0)
    //.delay(1000)
    .attr("fill", function(d){
       return giveColor(+d.obesityBoth)
     });
}


function makeButton(dataArray) {

  // delete existing button
  d3.select('#button').selectAll('select')
    .remove();

    var selectedValue = 'Both Sexes';
    // make button
    var select = d3.select("#button").append('select')
      .attr('class','select')
      .on('change', onchange);

      // set button (options)
      var variables = ['Both Sexes', 'Male', 'Female'];

      // set button (working)
      var options = select
        .selectAll('option')
        .data(variables)
        .enter()
        .append('option')
        .text(function (d) {
            return d;
          });


          function onchange() {
            selectedValue = d3.select('select').property('value');

            makeBars(dataArray, selectedValue)
          }

          makeBars(dataArray, selectedValue);
      };


function makeBars(dataArray, selectedValue) {


  var countries = [];
  var dataArrays = dataArray;
  var selectedValue = selectedValue;


  for (var i = 0; i < 13; i++) {
    var temp = dataArrays[i]["country"];
    countries.push(temp.slice(0, 10));
  }


  // set width and height of graph, of svg, set margins, set max value
  var width = 300;
  var height = 200;
  var barPadding = 4;
  var heightMargin = 75;
  var widthMargin = 50;
  var maxValue = 25;

  // get interactivity(label), give label
  var tip = d3.tip()
    .attr("class", "d3-tip")
    .offset([-20,0])
    .html (function (d, i) {
      if ('Both Sexes' == selectedValue){
      return "<strong>Obesity in %:</strong> <span style='color:black'>" + d.obesityBoth + "</span>"
    }
    if ('Male' == selectedValue) {
      return "<strong>Obesity in %:</strong> <span style='color:black'>" + d.obesityMale + "</span>"
    }
    if ('Female' == selectedValue) {
      return "<strong>Obesity in %:</strong> <span style='color:black'>" + d.obesityFemale + "</span>"
    }
  })

  d3.select("#container-bar").selectAll("svg")
    .remove();

  // make the svg
  var svg = d3.select("#container-bar")
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
       .attr("id", function(d){
         return d.countryISO;
       })
       .attr("x", function(d, i) {
         return i * (width / 13) + widthMargin;
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
       .attr("width", width / 13 - barPadding)
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
