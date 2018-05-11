// code for making two interactive datachars, by Ellemijke Donner, 10734198


window.onload = function()
{

  queue()
    .defer(d3.json, 'obesityfiltered.json')
    .defer(d3.json, 'drinkingwatersimple.json')
    .await(makeMap);


  function makeMap(error, obesitySimple, waterSimple) {
      if (error) throw error;

      // set needed variables
      var countriesLength = 13;
      var data = [];

      // put data in array
      for (var i = 0; i < countriesLength; i++)
       {
         var countryName = obesitySimple["fact"][i]["dims"]["COUNTRY"];
         console.log(countryName);
         var obesityValue = obesitySimple["fact"][i]["Value"];
         var waterValue = waterSimple["fact"][i]["Value"];

         data.push(
             {
               country: countryName,
               obesity: obesityValue.slice(0, 4),
               water: waterValue,
             });
       }

    // var palletteScale = d3.scale.linear()
    //                       .domain([90, 100])
    //                       .range(["#CC0000", "#FFCCCC"]);


    var map = new Datamap({
      element: document.getElementById("container"),
      scope: 'world',
      // zoom in on North America
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
        // NorthAmerica: 'rgba(255, 105, 180, 0.8)',
        LOW: 'rgb(255, 102, 102)',
        MEDIUM: 'rgb(153, 204, 255)',
        HIGH: 'rgb(153, 153, 255)',
      },
      data: {
        // nu gehardcode omdat ik het niet werkend kreeg anders
        // wil ook nog opzoek naar andere data, dit zegt niet zoveel
        PER: { fillKey: 'LOW',
                numberOfThings: 90},
        ARG: { fillKey: 'HIGH',
                numberOfThings: 100},
        BOL: { fillKey: 'LOW',
                numberOfThings: 93},
        BRA: { fillKey: 'HIGH',
                numberOfThings: 97},
        CHL: { fillKey: 'HIGH',
                numberOfThings: 100},
        COL: { fillKey: 'HIGH',
                numberOfThings: 97},
        ECU: { fillKey: 'LOW',
                numberOfThings: 93},
        GUY: { fillKey: 'MEDIUM',
                numberOfThings: 95},
        VEN: { fillKey: 'HIGH',
                numberOfThings: 97},
        URY: { fillKey: 'HIGH',
                numberOfThings: 99},
        SUR: { fillKey: 'MEDIUM',
                numberOfThings: 95},
        GUF: { fillKey: 'defaultFill'},
        PRY: { fillKey: 'HIGH',
                numberOfThings: 99},
        PAN: { fillKey: 'MEDIUM',
                numberOfThings: 95},

      },
      geographyConfig: {
            highlightOnHover: false,
            popupTemplate: function(geo, data) {
              return ['<div class="tooltip"><strong>',
                        'Access to clean water in ' + geo.properties.name,
                        ': ' + data.numberOfThings,
                        '</strong></div>'].join('');
            }
        }
    });

    map.legend();

// close makeMap
};
//close window onload
};
