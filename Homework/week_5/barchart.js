
        // set title and descriptive paragraph
        d3.select("head").append("title")
          .text("Barchart obesity among children");
        d3.select("body").append("h1")
          .text("Obesity rates among girls aged 5 - 19 (%).");
        d3.select("body").append("p")
          .text("World Health Organization in 2016.")
          .attr("class", "link")
          .on("click", function() {
            window.open("http://apps.who.int/gho/data/view.main.BMIPLUS2C05-19v?lang=en");
          })
        d3.select("body").append("p")
          .text("This barchart shows what percentage of girls living in a certain country have obesity.");
        d3.select("body").append("p")
          .text("By Ellemijke Donner (10734198).")


        // set width and height of graph, of svg, set margins, set max value
        var w = 400;
        var h = 250;
        var barPadding = 4;
        var heightMargin = 75;
        var widthMargin = 50;
        var svgW = 400 + widthMargin;
        var svgH = 250 + (2 * heightMargin);
        var maxValue = 25;

        // open the json file (first array)
        d3.json("obesitas.json", function(data){
          var dataset = Object.values(data)[0]

          // get country values
          var country = dataset.map(function(d){
            return d["Country"];
          });

          // get obesity rates for girls
          var girl = dataset.map(function (d){
            return d["Girl"];
          });

          // get interactivity(label), give label
          var tip = d3.tip()
            .attr("class", "d3-tip")
            .offset([-20,0])
            .html (function (d, i) {
              return "<strong>Obesity in %:</strong> <span style='color:black'>" + girl[i] + "</span>"
          })

          // make the svg
          var svg = d3.select("body").append("svg")
                      .attr("width", svgW)
                      .attr("height", svgH);

          // show tips
          svg.call(tip);

          // make x scale (domain is values (0 to 17), range is where x axis begins and ends)
          var xScale = d3.scale.linear()
                        .domain([0, country.length])
                        .range([widthMargin, svgW]);

          // make y scale (domain is values of obesity, range is where y axis begins and ends)
          var yScale = d3.scale.linear()
                        .domain([0, maxValue])
                        .range([0, h]);

          // scale the values correctly
          var axisScale = d3.scale.linear()
                            .domain([0, maxValue])
                            .range([h, 0]);

          // set x axis according to xScale
          var xAxis = d3.svg.axis()
                        .scale(xScale)
                        .orient("bottom")
                        .ticks(country.length)
                        .tickFormat(function(d, i){
                                  return country[i]
                        });

          // set y axis accoring to axisScale
          var yAxis = d3.svg.axis()
                        .scale(axisScale)
                        .orient("left")
                        .ticks(5);


          // create SVG Barchart
          svg.selectAll(".bar")
               .data(girl)
               .enter()
               .append("rect")
               .attr("class", "bar")
               .attr("x", function(d, i) {
                 return i * (w / girl.length) + widthMargin;
               })
               .attr("y", function (d){
                 return h + heightMargin - yScale(d);
               })
               .attr("width", w / girl.length - barPadding)
               .attr("height", function(d) {
                 return yScale(d);
               })
               .attr("fill", function(d) {
                 return "rgb(255, 100, " + (d * 10) + ")";
               })
               .on("mouseover", tip.show)
               .on("mouseout", tip.hide);


            // create X axis
            svg.append("g")
                .attr("class","axis")
                .attr("transform", "translate(0," + (h + heightMargin) + ")")
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
        });
