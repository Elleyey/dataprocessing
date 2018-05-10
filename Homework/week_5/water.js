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
         var obesityValue = obesitySimple["fact"][i]["Value"];
         var waterValue = waterSimple["fact"][i]["Value"];

         data.push(
             {
               country: countryName,
               obesity: obesityValue.slice(0, 4),
               water: waterValue,
             });
       }

       // open map of South America
    //    var map = d3.xml("southAmerica.svg").mimeType("image/svg+xml").get(function(error, xml) {
    //      if (error) throw error;
    //      document.body.appendChild(xml.documentElement);
    //    });
    //
    // var peru = document.getElementById("Peru")
    //                     .fill("red");

    var map = new Datamap({element: document.getElementById('container')});




// close doFunction
};
//close window onload
};
