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

    var map = new Datamap({
      element: document.getElementById("container"),
      scope: 'world',
      // zoom in on North America
      setProjection: function(element) {
        var projection = d3.geo.equirectangular()
                            .center([-50, -25])
                            .rotate([4.4, 0])
                            .scale(200)
                            .translate([element.offsetWidth / 2, element.offsetHeight / 2]);
        var path = d3.geo.path()
                      .projection(projection);

        return {path: path, projection: projection};
      },
      fills: {
        defaultFill: 'rgb(255, 255, 255)',
        NorthAmerica: 'rgba(255, 105, 180, 0.8)'
      },
      data: {
        PER: { fillKey: 'NorthAmerica'},
        ARG: { fillKey: 'NorthAmerica'},
        BOL: { fillKey: 'NorthAmerica'},
        BRA: { fillKey: 'NorthAmerica'},
        CHL: { fillKey: 'NorthAmerica'},
        COL: { fillKey: 'NorthAmerica'},
        ECU: { fillKey: 'NorthAmerica'},
        GUY: { fillKey: 'NorthAmerica'},
        VEN: { fillKey: 'NorthAmerica'},
        URY: { fillKey: 'NorthAmerica'},
        SUR: { fillKey: 'NorthAmerica'},
        GUF: { fillKey: 'defaultFill'},
        PRY: { fillKey: 'NorthAmerica'},
        PAN: { fillKey: 'NorthAmerica'},

      }
    });

// close doFunction
};
//close window onload
};
