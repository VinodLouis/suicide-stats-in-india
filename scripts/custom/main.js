(function() {
    var masterData, aggData, statesJson, topoJson = null;
    var context = {
        year: null,
        state: null,
        code: null,
    }


    function formatNumber(n) {
        var x = n.toString();
        var lastThree = x.substring(x.length - 3);
        var otherNumbers = x.substring(0, x.length - 3);
        if (otherNumbers != '')
            lastThree = ',' + lastThree;
        var res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
        return res;
    }




    function drawCollapsible(data) {
        $("#collapsible").html("");

        var margin = {
                top: 20,
                right: 120,
                bottom: 20,
                left: 120
            },
            width = 800 - margin.right - margin.left,
            height = 600 - margin.top - margin.bottom;

        var i = 0,
            duration = 750,
            root;

        var tree = d3.layout.tree()
            .size([height, width]);

        var diagonal = d3.svg.diagonal()
            .projection(function(d) {
                return [d.y, d.x];
            });

        var svg = d3.select("#collapsible").append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        function update(source) {

            // Compute the new tree layout.
            var nodes = tree.nodes(root).reverse(),
                links = tree.links(nodes);

            // Normalize for fixed-depth.
            nodes.forEach(function(d) {
                d.y = d.depth * 180;
            });

            // Update the nodes…
            var node = svg.selectAll("g.node")
                .data(nodes, function(d) {
                    return d.id || (d.id = ++i);
                });

            // Enter any new nodes at the parent's previous position.
            var nodeEnter = node.enter().append("g")
                .attr("class", "node")
                .attr("transform", function(d) {
                    return "translate(" + source.y0 + "," + source.x0 + ")";
                })
                .on("click", click);

            nodeEnter.append("circle")
                .attr("r", 1e-6)
                .style("fill", function(d) {
                    return d._children ? "#ff6962" : "#fff";
                });

            nodeEnter.append("text")
                .attr("x", function(d) {
                    return d.children || d._children ? -10 : 10;
                })
                .attr("dy", ".35em")
                .attr("text-anchor", function(d) {
                    return d.children || d._children ? "end" : "start";
                })
                .text(function(d) {
                    return d.name;
                })
                .style("fill-opacity", 1e-6)
                .style("font-size", "12px")

            // Transition nodes to their new position.
            var nodeUpdate = node.transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + d.y + "," + d.x + ")";
                });

            nodeUpdate.select("circle")
                .attr("r", 4.5)
                .style("fill", function(d) {
                    return d._children ? "#ff6962" : "#fff";
                });

            nodeUpdate.select("text")
                .style("fill-opacity", 1);

            // Transition exiting nodes to the parent's new position.
            var nodeExit = node.exit().transition()
                .duration(duration)
                .attr("transform", function(d) {
                    return "translate(" + source.y + "," + source.x + ")";
                })
                .remove();

            nodeExit.select("circle")
                .attr("r", 1e-6);

            nodeExit.select("text")
                .style("fill-opacity", 1e-6);

            // Update the links…
            var link = svg.selectAll("path.link")
                .data(links, function(d) {
                    return d.target.id;
                });

            // Enter any new links at the parent's previous position.
            link.enter().insert("path", "g")
                .attr("class", "link")
                .attr("d", function(d) {
                    var o = {
                        x: source.x0,
                        y: source.y0
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                });

            // Transition links to their new position.
            link.transition()
                .duration(duration)
                .attr("d", diagonal);

            // Transition exiting nodes to the parent's new position.
            link.exit().transition()
                .duration(duration)
                .attr("d", function(d) {
                    var o = {
                        x: source.x,
                        y: source.y
                    };
                    return diagonal({
                        source: o,
                        target: o
                    });
                })
                .remove();

            // Stash the old positions for transition.
            nodes.forEach(function(d) {
                d.x0 = d.x;
                d.y0 = d.y;
            });
        }

        // Toggle children on click.
        function click(d) {
            if (d.children) {
                d._children = d.children;
                d.children = null;
            } else {
                d.children = d._children;
                d._children = null;
            }
            update(d);
        }


        root = data;
        root.x0 = height / 2;
        root.y0 = 0;

        function collapse(d) {
            if (d.children) {
                d._children = d.children;
                d._children.forEach(collapse);
                d.children = null;
            }
        }

        root.children.forEach(collapse);
        update(root);


        d3.select(self.frameElement).style("height", "600px");
    }

    function drawGuage(n, t, ele) {
        $("#" + ele).html("");

        var width = 200;
        var height = width;

        var svg = d3.select("#" + ele).append("svg")
            .attr("width", width)
            .attr("height", height)

        var pi = Math.PI;

        var arc = d3.svg.arc()
            .innerRadius(50)
            .outerRadius(80)
            .startAngle(-3 * pi / 4);

        //svg.append("text").text(this.name).attr("fill","#999999").attr("x",width/2).attr("y",height/7).attr("text-anchor","middle");
        g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        g.append("text").text(n + "%").attr("fill", "#999999").attr("x", 0).attr("y", 0).attr("text-anchor", "middle").style("font-size", "25px");
        g.append("text").text("Male").attr("fill", "#666666").attr("x", 0).attr("y", 20).attr("text-anchor", "middle").style("font-size", "20px");
        // Add the background arc, from 0 to 100% (tau).
        var background = g.append("path")
            .datum({
                endAngle: -3 * pi / 4
            })
            .style("fill", "#ff4874")
            .attr("d", arc);

        var y = d3.scale.linear()
            .rangeRound([-3 * pi / 4, 3 * pi / 4]);

        y.domain([0, 100]);

        var foreground = g.append("path")
            .datum({
                endAngle: -3 * pi / 4
            })
            .style("fill", "#6492a3")
            .attr("d", arc);

        background.transition()
            .duration(1000)
            .attrTween("d", arcTween(3 * pi / 4, true))
            .each(function() {
                foreground.transition()
                    .duration(1000)
                    .attrTween("d", arcTween(y(67), false));
            })


        //d3.interval(function() {

        //}, 1500);
        var maxText = g.append("text").attr("fill", "#000000").attr("y", 20).attr("text-anchor", "middle").text(formatNumber(t));

        function arcTween(newAngle, text) {
            return function(d) {
                var interpolate = d3.interpolate(d.endAngle, newAngle);
                return function(t) {
                    d.endAngle = interpolate(t);
                    var path = arc(d);
                    var coords = path.split("L")[1].split("A")[0]; //<-- this is the position of the end of the line connecting the two arcs
                    if (text)
                        maxText.attr('transform', 'translate(' + coords + ')'); //<-- position text and rotate it
                    return arc(d);
                };
            };
        }
    }

    function drawPieChart(data, ele) {
        $("#" + ele).html("");

        var svg = d3.select("#" + ele)
            .append("svg")
            .attr("class", "pie")
            .append("g")

        svg.append("g")
            .attr("class", "slices");

        svg.append("g")
            .attr("class", "labelName");

        svg.append("g")
            .attr("class", "labelValue");

        svg.append("g")
            .attr("class", "lines");

        var width = 250,
            height = 250,
            radius = Math.min(width, height) / 2;

        var pie = d3.layout.pie()
            .sort(null)
            .value(function(d) {
                return d.value;
            });

        var arc = d3.svg.arc()
            .outerRadius(radius * 0.9)
            .innerRadius(radius * 0.6);

        var outerArc = d3.svg.arc()
            .innerRadius(radius * 0.5)
            .outerRadius(radius * 0.95);

        var legendRectSize = (radius * 0.05);
        var legendSpacing = radius * 0.04;




        //var div = d3.select("body").append("div").attr("class", "toolTip");

        svg.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

        var colorRange = d3.scale.category20();

        var colorPie = d3.scale.ordinal()
            .range(colorRange.range());

        /* ------- PIE SLICES -------*/
        var slice = svg.select(".slices").selectAll("path.slice")
            .data(pie(data), function(d) {
                return d.data.label
            });

        slice.enter()
            .insert("path")
            .style("fill", function(d) {
                return colorPie(d.data.label);
            })
            .attr("class", "slice");

        slice
            .transition().duration(1000)
            .attrTween("d", function(d) {
                this._current = Object.assign({}, d, {
                    startAngle: d.endAngle
                });
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    return arc(interpolate(t));
                };
            }).each(function(d) {
                //console.log(d);
                d3.select(this).append("title").text("<table cellspacing='1' cellpadding='1'><tr><td colspan='2'>" + d.data.label.split("(")[0].replace("Activity", "").replace("Undertaking", "") + " (" + formatNumber(d.data.value) + ")</td></tr><tr><td>Male (" + formatNumber(d.data.male) + ")</td><td>Female (" + formatNumber(d.data.female) + ")</td></tr></table>");
                $(this).tipsy({
                    html: true
                });
            })

        slice
            .on("mouseenter", function(d) {
                d3.select(this)
                    .transition()
                    .duration(1000)
                    .attr("d", outerArc)

                //div.style("left", d3.event.pageX+10+"px");
                //div.style("top", d3.event.pageY-25+"px");
                //div.style("display", "inline-block");
                //div.html((d.data.label)+"<br>"+(d.data.value)+"%");

            });
        slice
            .on("mouseleave", function(d) {
                //div.style("display", "none");
                d3.select(this)
                    .transition()
                    .duration(500)
                    .attr("d", arc)
            });

        svg.selectAll("text")
            .data(pie(data))
            .enter()
            .append("text")
            .attr("transform", function(d) {
                return "translate(" + arc.centroid(d) + ")";
            })
            .attr("dy", ".35em")
            .text(function(d) {
                return ((d.endAngle - d.startAngle) / (2 * Math.PI) * 100).toFixed(1) + " %";
            });

        slice.exit()
            .remove();

        var legend = svg.selectAll('.legend')
            .data(colorPie.domain())
            .enter()
            .append('g')
            .attr('class', 'legend')
            .attr('transform', function(d, i) {
                var height = legendRectSize + legendSpacing;
                var offset = height * colorPie.domain().length / 2;
                var horz = -6 * legendRectSize;
                var vert = i * height - offset;
                return 'translate(' + horz + ',' + vert + ')';
            });

        legend.append('rect')
            .attr('width', legendRectSize)
            .attr('height', legendRectSize)
            .style('fill', colorPie)
            .style('stroke', colorPie);

        legend.append('text')
            .attr('x', legendRectSize + legendSpacing)
            .attr('y', legendRectSize)
            .text(function(d) {
                return d.split("(")[0].replace("Activity", "").replace("Undertaking", "");
            });

        /* ------- TEXT LABELS -------*/

        /*var text = svg.select(".labelName").selectAll("text")
            .data(pie(data), function(d){ return d.data.label });

        text.enter()
            .append("text")
            .attr("dy", ".35em")
            .text(function(d) {
                return (d.data.label+": "+d.value+"%");
            });*/

        function midAngle(d) {
            return d.startAngle + (d.endAngle - d.startAngle) / 2;
        }

        /*text
            .transition().duration(1000)
            .attrTween("transform", function(d) {
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * (midAngle(d2) < Math.PI ? 1 : -1);
                    return "translate("+ pos +")";
                };
            })
            .styleTween("text-anchor", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    return midAngle(d2) < Math.PI ? "start":"end";
                };
            })
            .text(function(d) {
                return (d.data.label+": "+d.value+"%");
            });


        text.exit()
            .remove();*/

        /* ------- SLICE TO TEXT POLYLINES -------*/

        /*var polyline = svg.select(".lines").selectAll("polyline")
            .data(pie(data), function(d){ return d.data.label });

        polyline.enter()
            .append("polyline");

        polyline.transition().duration(1000)
            .attrTween("points", function(d){
                this._current = this._current || d;
                var interpolate = d3.interpolate(this._current, d);
                this._current = interpolate(0);
                return function(t) {
                    var d2 = interpolate(t);
                    var pos = outerArc.centroid(d2);
                    pos[0] = radius * 0.95 * (midAngle(d2) < Math.PI ? 1 : -1);
                    return [arc.centroid(d2), outerArc.centroid(d2), pos];
                };
            });

        polyline.exit()
            .remove();*/
    }

    function getCauseData(data) {
        return data.filter(function(el) {
            return (el["CAUSE"] != "Total Self-employed" && el["CAUSE"] != "Total" && el["CAUSE"] != "Total Salaried")
        }).map(function(el) {
            return ({
                label: el["CAUSE"],
                value: el["Grand Total"],
                male: el["Total Male"],
                female: el["Total Female"]
            });
        });
    }

    function getAgeData(data) {
        var dataAge = [];
        var dataAgeMock = {};

        data.forEach(function(el) {
            for (var pro in el) {
                if (pro.startsWith("Male") || pro.startsWith("Female")) {
                    if (dataAgeMock[pro]) {
                        dataAgeMock[pro] += el[pro];
                    } else {
                        dataAgeMock[pro] = el[pro]
                    }
                }
            }
        });
        //console.log(dataAgeMock);
        var dataAgeMockAgg = {};

        for (var prop in dataAgeMock) {
            var entity = prop.trim().split(" ").reverse().pop();
            var key = prop.replace(entity, "").trim();

            if (dataAgeMockAgg[key]) {
                dataAgeMockAgg[key]["value"] += dataAgeMock[prop];
            } else {
                dataAgeMockAgg[key] = {
                    value: dataAgeMock[prop]
                }
            }
            dataAgeMockAgg[key][entity] = dataAgeMock[prop];
        }

        //console.log(dataAgeMockAgg);

        Object.keys(dataAgeMockAgg).forEach(function(el) {
            dataAge.push({
                label: el,
                value: dataAgeMockAgg[el]["value"],
                male: dataAgeMockAgg[el]["Male"],
                female: dataAgeMockAgg[el]["Female"]
            })
        });

        return dataAge;
    }

    function getInsightsData(data) {
        var fd = data.filter(function(el) {
            return (el["CAUSE"] != "Total Self-employed" && el["CAUSE"] != "Total" && el["CAUSE"] != "Total Salaried")
        });

        var root, male, female = null;
        var ttl = data.find(function(el) {
            return (el["CAUSE"] == "Total");
        });

        root = {
            name: "Total (" + formatNumber(ttl["Grand Total"]) + ")",
            children: [],
            size: ttl["Grand Total"]
        };


        if (ttl["Total Male"] !== 0) {
            male = {
                name: "Male (" + formatNumber(ttl["Total Male"]) + ")",
                children: [],
                size: ttl["Total Male"]
            }
        }

        if (ttl["Total Female"] !== 0) {
            female = {
                name: "Female (" + formatNumber(ttl["Total Female"]) + ")",
                children: [],
                size: ttl["Total Female"]
            }
        }

        fd.forEach(function(el) {
            var cauM, cauF = null;
            if (el["Total Male"] !== 0) {
                cauM = {
                    name: el["CAUSE"].split("(")[0].replace("Activity", "").replace("Undertaking", "") + " (" + formatNumber(el["Total Male"]) + ")",
                    children: [],
                    size: el["Total Male"]
                }

                var keysMC = Object.keys(el).filter(function(e) {
                    return e.startsWith("Male");
                });

                keysMC.forEach(function(d) {
                    if (el[d] !== 0) {
                        cauM.children.push({
                            name: d.replace("Male", "").trim() + " (" + el[d] + ")",
                            size: el[d]
                        });
                    }
                });

            }

            if (el["Total Female"] !== 0) {
                cauF = {
                    name: el["CAUSE"].split("(")[0].replace("Activity", "").replace("Undertaking", "") + " (" + formatNumber(el["Total Female"]) + ")",
                    children: [],
                    size: el["Total Female"]
                }

                var keysFC = Object.keys(el).filter(function(e) {
                    return e.startsWith("Female");
                });

                keysFC.forEach(function(d) {
                    if (el[d] !== 0) {
                        cauF.children.push({
                            name: d.replace("Female", "").trim() + " (" + el[d] + ")",
                            size: el[d]
                        });
                    }
                });
            }

            if (cauM) {
                male.children.push(cauM);
            }

            if (cauF) {
                female.children.push(cauF);
            }
        });

        root.children.push(male);
        root.children.push(female);

        return root;
    }

    function updateCharts() {
        var filterData = masterData.filter(function(el) {
            return (el.shortCode == context.code && el.Year == context.year);
        });

        var causeData = getCauseData(filterData);
        var ageData = getAgeData(filterData);
        var insightsData = getInsightsData(filterData);
        var totalRecord = filterData.find(function(el) {
            return (el["CAUSE"] == "Total");
        });

        var malePer = Math.round((totalRecord["Total Male"] / totalRecord["Grand Total"]) * 100);
        //console.log(causeData,ageData);
        drawPieChart(causeData, "pieChart1");
        drawPieChart(ageData, "pieChart2");
        drawGuage(malePer, totalRecord["Grand Total"], "guageChart1");
        //console.log(JSON.stringify(insightsData));
        drawCollapsible(insightsData);
    }

    function setConText(code, state, year) {
        context.year = year;
        context.code = code;
        context.state = state;

        $("#currSeletion").html("<b>Current Selection</b> :" + state + " in " + year + " (<small class='note-sec'>Map section might load late</small>)");
    }

    function setConTextUpdateCharts() {
        updateCharts();
    }

    function drawMap() {
        $("#map").html("");

        function drawIndia(data) {
            var subunits = topojson.object(data, data.objects.subunits);

            india.selectAll("path.subpath")
                .data(subunits.geometries)
                .enter().append("path")
                .attr('class', function(d) {
                    return 'subunit ' + d.id;
                })
                .attr('id', function(d) {
                    return d.id;
                })
                .attr("d", path);
        }

        function drawIndiaPlaces() {
            var arrDeaths = aggData.map(function(el) {
                return el[context.year.toString()]
            });
            var deathScale = d3.scale.linear()
                .domain([Math.min(...arrDeaths), Math.max(...arrDeaths)])
                .range([2, 12]);
            svg.selectAll("circle.place")
                .data(aggData)
                .enter().append("circle")
                .attr("cx", function(d) {
                    return projection([d.position[1], d.position[0]])[0]
                })
                .attr("cy", function(d) {
                    return projection([d.position[1], d.position[0]])[1]
                })
                .attr("r", function(d) {
                    return deathScale(d[context.year.toString()])
                })
                .attr("class", function(d) {
                    return ((d.code == context.code) ? "place place-active" : "place");
                })
                .on("click", function() {
                    //console.log(this.__data__);
                    setConText(this.__data__.code, this.__data__.state, context.year);
                    $(".place").removeClass("place-active");
                    $(this).addClass("place-active");
                    updateCharts();
                })
                .each(function(d) {

                    d3.select(this).append("title").text("<div>" + d.state + " : " + formatNumber(d[context.year.toString()]) + "</div><div> *Click to see insights</div>");
                    $(this).tipsy({
                        html: true
                    });
                })
            /*  
            indiaPlaces.selectAll("text.place")
                .data(data.objects.places.geometries)
                .enter().append("text")
                .attr("x", function(d){ return projection(d.position)[1]+3})
              .attr("y", function(d){ return projection(d.position)[0]+3})
              .text(function(d){ return d.properties.name})
                .attr("class", function(d){ return "air-" + d.properties.name});
            */
            /*indiaPlaces.append("circle")
              .attr("stroke-width", 5)
              .attr("r", 2)
              .attr("cx", projection(suratPos)[0])
              .attr("cy", projection(suratPos)[1])
              .attr("id","sur-ant")*/
        }

        // Code from D3 United States Example at http://bl.ocks.org/4150951
        function drawNaturalEarth() {
            var tiles = tile();

            india.selectAll('.subunit')
                .classed('natural-earth', true);

            var clips = defs.append("clipPath")
                .attr("id", "clip");
            clips.append("use")
                .attr("xlink:href", "#INX");
            clips.append("use")
                .attr("xlink:href", "#INA");
            clips.append("use")
                .attr("xlink:href", "#INN");
            clips.append("use")
                .attr("xlink:href", "#INL");

            ne.attr("clip-path", "url(#clip)")
                .selectAll("image")
                .data(tiles)
                .enter().append("image")
                .attr("xlink:href", function(d) {
                    return "http://" + ["a", "b", "c", "d"][Math.random() * 4 | 0] + ".tiles.mapbox.com/v3/mapbox.natural-earth-2/" + d[2] + "/" + d[0] + "/" + d[1] + ".png";
                })
                .attr("width", Math.round(tiles.scale))
                .attr("height", Math.round(tiles.scale))
                .attr("x", function(d) {
                    return Math.round((d[0] + tiles.translate[0]) * tiles.scale);
                })
                .attr("y", function(d) {
                    return Math.round((d[1] + tiles.translate[1]) * tiles.scale);
                });
        }

        function drawStates(data, callback) {
            states.selectAll("path")
                .data(topojson.object(data, data.objects.states).geometries)
                .enter().append("path")
                .attr('class', "state")
                .attr("title", function(d) {
                    return d.properties.name;
                })
                .attr("d", path)

            callback();

        }


        var width = 400,
            height = 400;

        var projection = d3.geo.mercator()
            .center([83, 23.5])
            .translate([width / 2, height / 2])
            .scale(690);

        var path = d3.geo.path()
            .projection(projection)
            .pointRadius(2);

        var tile = d3.geo.tile()
            .scale(projection.scale() * 2 * Math.PI)
            .translate(projection([0, 0]))
            .zoomDelta((window.devicePixelRatio || 1) - .5);

        var svg = d3.select("#map")
            .append("svg")
            .attr("width", width)
            .attr("height", height);



        var defs = svg.append("defs");

        var ne = svg.append("g")
            .attr("id", "natural-earth");

        var india = svg.append("g")
            .attr("id", "india");

        var indiaPlaces = svg.append("g")
            .attr("id", "places");

        var states = svg.append("g")
            .attr("id", "states");

        drawNaturalEarth();
        drawIndia(topoJson);
        drawStates(statesJson, drawIndiaPlaces)

    }

    function modalOpened(d) {
        //console.log(d);
        setConText(d.mystate, d.fullstate, parseInt(d.name, 10));
        $("#modal-content").modal('show');
    }

    function drawAggregateData(data) {

        var margin = {
                top: 20,
                right: 20,
                bottom: 30,
                left: 40
            },
            width = 1200 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        var x = d3.scale.ordinal()
            .rangeRoundBands([0, width], .1);

        var y = d3.scale.linear()
            .rangeRound([height, 0]);


        var color = d3.scale.ordinal()
            .range(["#E1C8a0", "#CC9900", "#CC6600", "#B9610E", "#A75D1C", "#94582A", "#825338", "#6F4F46", "#5D4A53", "#4A4661", "#38416F", "#253C7D", "#13388B", "#003399", "#000080"]);

        var xAxis = d3.svg.axis()
            .scale(x)
            .orient("bottom");

        var yAxis = d3.svg.axis()
            .scale(y)
            .orient("left")
            .tickFormat(d3.format(".2s"));

        var svg = d3.select("#aggViz").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        var active_link = "0"; //to control legend selections and hover
        var legendClicked; //to control legend selections
        var legendClassArray = []; //store legend classes to select bars in plotSingle()
        var legendClassArray_orig = []; //orig (with spaces)
        var sortDescending; //if true, bars are sorted by height in descending order
        var restoreXFlag = false; //restore order of bars back to original


        //disable sort checkbox
        d3.select("label")
            .select("input")
            .property("disabled", true)
            .property("checked", false);

        color.domain(d3.keys(data[0]).filter(function(key) {
            return (key !== "state" && key !== "code" && key !== "position");
        }));

        data.forEach(function(d) {
            var mystate = d.code; //add to stock code
            var y0 = 0;
            //d.ages = color.domain().map(function(name) { return {name: name, y0: y0, y1: y0 += +d[name]}; });
            d.deaths = color.domain().map(function(name) {
                //return { mystate:mystate, name: name, y0: y0, y1: y0 += +d[name]}; });
                return {
                    mystate: mystate,
                    fullstate: d.state,
                    name: name,
                    y0: y0,
                    y1: y0 += +d[name],
                    value: d[name],
                    y_corrected: 0
                };
            });
            d.total = d.deaths[d.deaths.length - 1].y1;

        });

        //Sort totals in descending order
        data.sort(function(a, b) {
            return b.total - a.total;
        });

        x.domain(data.map(function(d) {
            return d.code;
        }));
        y.domain([0, d3.max(data, function(d) {
            return d.total;
        })]);

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(xAxis);

        svg.append("g")
            .attr("class", "y axis")
            .call(yAxis)
            .append("text")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", ".71em")
            .style("text-anchor", "end");
        //.text("Population");

        var state = svg.selectAll(".state")
            .data(data)
            .enter().append("g")
            .attr("class", "g")
            .attr("transform", function(d) {
                return "translate(" + "0" + ",0)";
            });
        //.attr("transform", function(d) { return "translate(" + x(d.State) + ",0)"; })

        height_diff = 0; //height discrepancy when calculating h based on data vs y(d.y0) - y(d.y1)
        state.selectAll("rect")
            .data(function(d) {
                return d.deaths;
            })
            .enter().append("rect")
            .attr("width", x.rangeBand())
            .attr("y", function(d) {
                height_diff = height_diff + y(d.y0) - y(d.y1) - (y(0) - y(d.value));
                y_corrected = y(d.y1) + height_diff;
                d.y_corrected = y_corrected //store in d for later use in restorePlot()

                if (d.name === "2013") height_diff = 0; //reset for next d.mystate

                return y_corrected;
                // return y(d.y1);  //orig, but not accurate  
            })
            .attr("x", function(d) { //add to stock code
                return x(d.mystate)
            })
            .attr("height", function(d) {
                //return y(d.y0) - y(d.y1); //heights calculated based on stacked values (inaccurate)
                return y(0) - y(d.value); //calculate height directly from value in csv file
            })
            .attr("class", function(d) {
                classLabel = d.name.replace(/\s/g, ''); //remove spaces
                return "bars class" + classLabel;
            })
            .style("fill", function(d) {
                return color(d.name);
            })
            .on("click", barClicked)
            .each(function() {
                //tipsy
                var s = this.__data__;
                d3.select(this).append("title").text("<div>" + s.fullstate + " in " + s.name + " saw " + formatNumber(s.value) + " suicides</div><div>*Click to see more details</div>");
                $(this).tipsy({
                    html: true
                });
            });

        state.selectAll("rect")
            .on("mouseenter", function(d) {
                this.style.opacity = 0.5;
                //this.setAttribute("x",parseFloat(this.getAttribute("x"))-5);
                //this.setAttribute("width",parseFloat(this.getAttribute("width"))+10);
                //this.attr("x")
                //console.log(this);
                /*var delta = d.y1 - d.y0;
                var xPos = parseFloat(d3.select(this).attr("x"));
                var yPos = parseFloat(d3.select(this).attr("y"));
                var height = parseFloat(d3.select(this).attr("height"))

                d3.select(this).attr("stroke","blue").attr("stroke-width",0.8);

                svg.append("text")
                .attr("x",xPos)
                .attr("y",yPos +height/2)
                .attr("class","tooltip")
                .text(d.name +": "+ delta); */

            })
            .on("mouseleave", function() {
                /*svg.select(".tooltip").remove();
                d3.select(this).attr("stroke","pink").attr("stroke-width",0.2);*/
                //this.setAttribute("x",parseFloat(this.getAttribute("x"))+5);
                //this.setAttribute("width",parseFloat(this.getAttribute("width"))-10);
                this.style.opacity = 1;
            })


        var legend = svg.selectAll(".legend")
            .data(color.domain().slice().reverse())
            .enter().append("g")
            .attr("class", function(d) {
                legendClassArray.push(d.replace(/\s/g, '')); //remove spaces
                legendClassArray_orig.push(d); //remove spaces
                return "legend";
            })
            .attr("transform", function(d, i) {
                return "translate(0," + i * 20 + ")";
            });

        //reverse order to match order in which bars are stacked    
        legendClassArray = legendClassArray.reverse();
        legendClassArray_orig = legendClassArray_orig.reverse();

        legend.append("rect")
            .attr("x", width - 18)
            .attr("width", 18)
            .attr("height", 18)
            .style("fill", color)
            .attr("id", function(d, i) {
                return "id" + d.replace(/\s/g, '');
            })
            .on("mouseover", function() {

                if (active_link === "0") d3.select(this).style("cursor", "pointer");
                else {
                    if (active_link.split("class").pop() === this.id.split("id").pop()) {
                        d3.select(this).style("cursor", "pointer");
                    } else d3.select(this).style("cursor", "auto");
                }
            })
            .on("click", function(d) {

                if (active_link === "0") { //nothing selected, turn on this selection
                    d3.select(this)
                        .style("stroke", "black")
                        .style("stroke-width", 2);

                    active_link = this.id.split("id").pop();
                    plotSingle(this);

                    //gray out the others
                    for (i = 0; i < legendClassArray.length; i++) {
                        if (legendClassArray[i] != active_link) {
                            d3.select("#id" + legendClassArray[i])
                                .style("opacity", 0.5);
                        } else sortBy = i; //save index for sorting in change()
                    }

                    //enable sort checkbox
                    d3.select("label").select("input").property("disabled", false)
                    d3.select("label").style("color", "black")
                    //sort the bars if checkbox is clicked            
                    d3.select("input").on("change", change);

                } else { //deactivate
                    if (active_link === this.id.split("id").pop()) { //active square selected; turn it OFF
                        d3.select(this)
                            .style("stroke", "none");

                        //restore remaining boxes to normal opacity
                        for (i = 0; i < legendClassArray.length; i++) {
                            d3.select("#id" + legendClassArray[i])
                                .style("opacity", 1);
                        }


                        if (d3.select("label").select("input").property("checked")) {
                            restoreXFlag = true;
                        }

                        //disable sort checkbox
                        d3.select("label")
                            .style("color", "#D8D8D8")
                            .select("input")
                            .property("disabled", true)
                            .property("checked", false);


                        //sort bars back to original positions if necessary
                        change();

                        //y translate selected category bars back to original y posn
                        restorePlot(d);

                        active_link = "0"; //reset
                    }

                } //end active_link check


            });

        legend.append("text")
            .attr("x", width - 24)
            .attr("y", 9)
            .attr("dy", ".35em")
            .style("text-anchor", "end")
            .text(function(d) {
                return d;
            });

        // restore graph after a single selection
        function restorePlot(d) {
            //restore graph after a single selection
            d3.selectAll(".bars:not(.class" + class_keep + ")")
                .transition()
                .duration(1000)
                .delay(function() {
                    if (restoreXFlag) return 3000;
                    else return 750;
                })
                .attr("width", x.rangeBand()) //restore bar width
                .style("opacity", 1);

            //translate bars back up to original y-posn
            d3.selectAll(".class" + class_keep)
                .attr("x", function(d) {
                    return x(d.mystate);
                })
                .transition()
                .duration(1000)
                .delay(function() {
                    if (restoreXFlag) return 2000; //bars have to be restored to orig posn
                    else return 0;
                })
                .attr("y", function(d) {
                    //return y(d.y1); //not exactly correct since not based on raw data value
                    return d.y_corrected;
                });

            //reset
            restoreXFlag = false;

        }

        // plot only a single legend selection
        function plotSingle(d) {

            class_keep = d.id.split("id").pop();
            idx = legendClassArray.indexOf(class_keep);

            //erase all but selected bars by setting opacity to 0
            d3.selectAll(".bars:not(.class" + class_keep + ")")
                .transition()
                .duration(1000)
                .attr("width", 0) // use because svg has no zindex to hide bars so can't select visible bar underneath
                .style("opacity", 0);

            //lower the bars to start on x-axis  
            state.selectAll("rect").forEach(function(d, i) {

                //get height and y posn of base bar and selected bar
                h_keep = d3.select(d[idx]).attr("height");
                y_keep = d3.select(d[idx]).attr("y");

                h_base = d3.select(d[0]).attr("height");
                y_base = d3.select(d[0]).attr("y");

                h_shift = h_keep - h_base;
                y_new = y_base - h_shift;

                //reposition selected bars
                d3.select(d[idx])
                    .transition()
                    .ease("bounce")
                    .duration(1000)
                    .delay(750)
                    .attr("y", y_new);

            })

        }

        //adapted change() fn in http://bl.ocks.org/mbostock/3885705
        function change() {

            if (this.checked) sortDescending = true;
            else sortDescending = false;

            colName = legendClassArray_orig[sortBy];

            var x0 = x.domain(data.sort(sortDescending ?
                        function(a, b) {
                            return b[colName] - a[colName];
                        } :
                        function(a, b) {
                            return b.total - a.total;
                        })
                    .map(function(d, i) {
                        return d.code;
                    }))
                .copy();

            state.selectAll(".class" + active_link)
                .sort(function(a, b) {
                    return x0(a.mystate) - x0(b.mystate);
                });

            var transition = svg.transition().duration(750),
                delay = function(d, i) {
                    return i * 20;
                };

            //sort bars
            transition.selectAll(".class" + active_link)
                .delay(delay)
                .attr("x", function(d) {
                    return x0(d.mystate);
                });

            //sort x-labels accordingly    
            transition.select(".x.axis")
                .call(xAxis)
                .selectAll("g")
                .delay(delay);


            transition.select(".x.axis")
                .call(xAxis)
                .selectAll("g")
                .delay(delay);
        }


        function barClicked() {
            modalOpened(this.__data__);
        }
    }

    function paintTbl(data){
        var strHTML = "<table class='table table-bordered text-center' style='width:300px;margin:auto'><tr><th colspan='2'> Short codes for State/UT</th><tr>";

        data.forEach(function(d){
            strHTML += "<tr><td>" + d.code + "</td><td>" + d.state + "</td></tr>";
        });

        strHTML+="</html>";

        $("#tblCodes").html(strHTML);
    }


    $(document).ready(function() {
        d3.json("data/state_wise_agg.json", function(error, data) {
            if (error) throw error;
            aggData = data;
            drawAggregateData(aggData);
            paintTbl(aggData);
        });

        d3.json("data/processed.json", function(error, data) {
            if (error) throw error;
            masterData = data;
        });

        d3.json("data/in-states-topo.json", function(error, data) {
            if (error) throw error;
            statesJson = data;
        });

        d3.json("data/in-demo-topo.json", function(error, data) {
            if (error) throw error;
            topoJson = data;
        });

        $('#modal-content').on('shown.bs.modal', function() {
            $("#pieChart1").html("");
            $("#pieChart2").html("");
            $("#guageChart1").html("");
            $("#map").html("");
            updateCharts();
            setTimeout(function() {
                drawMap();
            }, 1000)
            //drawMap();
        })

    });

})();