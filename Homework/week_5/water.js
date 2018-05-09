// code for making two interactive datachars, by Ellemijke Donner, 10734198


window.onload = function()
{

  d3.queue()
    .defer(d3.json, 'obesityfiltered.json')
    .defer(d3.json, 'drinkingwatersimple.json')
    .awaitAll(makeMap);


  function makeMap(error, response) {
      if (error) throw error;

      // set needed variables
      var countriesLength = 13;
      var data = [];

      // put data in array
      for (var i = 0; i < countriesLength; i++)
       {
         var countryName = response[0]["fact"][i]["dims"]["COUNTRY"];
         var obesityValue = response[0]["fact"][i]["Value"];
         var waterValue = response[1]["fact"][i]["Value"];

         data.push(
             {
               country: countryName,
               obesity: obesityValue.slice(0, 4),
               water: waterValue,
             });
       }

       // open map of South America
       var map = d3.xml("southAmerica.svg").mimeType("image/svg+xml").get(function(error, xml) {
         if (error) throw error;
         document.body.appendChild(xml.documentElement);
       });

    var peru = document.getElementById("Peru")
                        .fill("red");



// close doFunction
};
//close window onload
};
