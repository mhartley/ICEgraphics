function progress_arcs(chart_id, misdo, felony) {


        var scale = d3.scaleLinear()
            .domain([0, 100])
            .range([0, 2 * Math.PI]);


        var percentComplete = Math.round((misdo / (misdo + felony)*100)),
            percentCompleteInner = Math.round((felony / (misdo + felony)*100))

        var endAngle = scale(percentComplete);
        var innerEndAngle = scale(percentCompleteInner);

        var svg = d3.select(chart_id)
            .append("svg")
            .attr("width", 300)
            .attr("height", 300)
            .append("g")
            .attr("transform", "translate(150,150)");

        

        var innerarc = d3.arc()
            .innerRadius(88)
            .outerRadius(115)
            .startAngle(0)
            .endAngle(innerEndAngle);

        var arc = d3.arc()
            .innerRadius(118)
            .outerRadius(145)
            .startAngle(0)
            .endAngle(endAngle);

        var outerfullarc = d3.arc()
            .innerRadius(147)
            .outerRadius(149)
            .startAngle(0)
            .endAngle(Math.PI * 2);

        var outerfullpath = svg.append("path")
            .attr("class", "outerfullarc")
            .attr("d", outerfullarc);

        var path = svg.append("path")
            .attr("class", "arc");

        path
            .transition()
            .duration(800)
            .attr("d", arc);


        path
            .on("mouseover", function(d) {
                svg.append('text')
                .attr('text-anchor', 'middle')
                .attr('class', 'progress_arc_text')
                .attr('dy', '.35em')
                .text(misdo.toString())
                })
            .on('click', function(d){
                svg.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('class', 'progress_arc_text')
                    .attr('dy', '.35em')
                    .text(misdo.toString());
                setTimeout(function(){ d3.select('.progress_arc_text').remove();} , 2000);
            })
            .on("mouseout", function(d) {
               d3.select('.progress_arc_text').remove();
            });

        var innerpath = svg.append("path")
            .attr("class", "innerarc");
        
        innerpath   
            .transition()
            .duration(1100)
            .attr("d", innerarc);
        

        innerpath.on("mouseover", function(d) {
            svg.append('text')
            .attr('text-anchor', 'middle')
            .attr('class', 'progress_arc_text')
            .attr('dy', '.35em')
            .text(felony.toString())
            })
           .on('click', function(d){
                svg.append('text')
                    .attr('text-anchor', 'middle')
                    .attr('class', 'progress_arc_text')
                    .attr('dy', '.35em')
                    .text(felony.toString());
                setTimeout(function(){ d3.select('.progress_arc_text').remove();} , 2000);
            })
            .on("mouseout", function(d) {
               d3.select('.progress_arc_text').remove();
            });


    //     var text = 
    // };
}



    function timeline(div) {

        var width = 1000;
        var height = 150;
        var padding = 80;
        var dotmargintop = 15; //CONTROLS DOTS ABOVE THE TIMELINE
        var dotmarginbottom = 5;
        var dotsize = '11px';

        var svg = d3.select('#' + div).append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g');
        // .attr('transform', 'translate(10,100)');


        var mindate = new Date(2016, 9, 1),
            maxdate = new Date(2017, 5, 1);

        var counties = ['A', 'D', 'J']; //counties in which the arrests have occured
        var countyDict = {
            'A': 'Arapahoe County',
            'D': 'Denver County',
            'J': 'Jefferson County'
        }

        var timeScale = d3.scaleTime()
            .domain([mindate, maxdate]) // values between for month of january
            .range([35, width]); // map these the the chart width = total width minus padding at both sides

        var yScale = d3.scaleOrdinal()
            .domain(counties)
            .range([(height / 2) - dotmargintop, (height / 2) + dotmarginbottom, (height / 2) + dotmarginbottom]);

        var dotScale = d3.scaleLinear()
            .domain([0, 10])
            .range([0, 30]);


        var orientText = d3.scaleOrdinal()
            .domain(counties)
            .range([-90, 90, 90]);

        var eventColor = d3.scaleOrdinal()
            .domain(["misdo", "felony"])
            .range(["#67a9cf", "#ef8a62"]);



        var testrotate = orientText('J');

        //make the axis    

        var timeaxis = d3.axisBottom(timeScale)
            .ticks(d3.timeMonth.every(1))
            .tickFormat(d3.timeFormat('%b'))

        svg.append('g')
            .attr('class', 'timescale')
            .call(timeaxis)
            .attr('transform', 'translate(0,' + height / 2 + ')');

        d3.selectAll('.timescale .tick text')
            .attr('dy', '.3em')
            .attr('dx', '1.5em');

        var tooltip = d3.select("body").append("div").attr("class", "toolTip");

        var xval = function(d) {
            return d.arrDate;
        };
        var mapx = function(d) {
            return timeScale(d.arrDate);
        };
        var yval = function(d) {
            return d.category;
        };
        var mapy = function(d) {
            return yScale(yval(d));
        };
        var orient = function(d) {
            return 'rotate(' + orientText(yval(d)) + ')'
        }


        d3.csv('http://www.westword.com/theme/den/9583140/icearrests.csv', function(error, data) {
            if (error) throw error;

            data.forEach(function(d) {
                d.convictYear = +d.convictYear;
                d.arrDate = d3.timeParse("%Y-%m-%d")(d.arrDate);
                d.ctype = d.ctype.toString();
            });

            //draw things
            var eventdot = svg.selectAll('.event')
                .data(data)
                .enter().append('g')
                .attr('transform', function(d) {
                    return 'translate(' + mapx(d) + ',' + mapy(d) + ')'
                })
                .attr('class', 'event');

            eventdot.append('circle')
                .attr('r', dotsize)
                .attr('fill', function(d) {
                    return eventColor(d.ctype)
                })
                .attr('stroke', function(d) {
                    return eventColor(d.ctype)
                })
                .on("mousemove", function(d) {
                    tooltip
                        .style("left", d3.event.pageX - 50 + "px")
                        .style("top", d3.event.pageY - 100 + "px")
                        .style("display", "inline-block")
                        .html("<b>" + d.arrDate.toLocaleDateString() + "</b><br />" + countyDict[d.cntyCode] + ' Courthouse<br/>' + d.crime + '<br/> Convicted:' + (d.convictYear > 0 ? d.convictYear : "Pending"));
                })
                .on("mouseout", function(d) {
                    tooltip.style("display", "none");
                });


//THIS IS THE FUNCTION FOR ADDING TEXT TO THE DOTS.

            // eventdot.append('text')
            //     .attr('text-anchor', 'left')
            //     .attr('transform', function(d) {
            //         return orient(d)
            //     })
            //     .attr('dx', '.7em')
            //     .attr('dy', '-.2em')
            //     .attr('font-size', '10px')
            //     .attr('fill', function(d) {
            //         return eventColor(d.ctype)
            //     })
            //     .text(function(d) {
            //         return d.arrDate.toLocaleDateString() 
            //     });
        }); //end .csv

            
    }; //end timeline
