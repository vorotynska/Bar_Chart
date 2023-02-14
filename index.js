let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json';
const req = new XMLHttpRequest();
let data;
let values;
const width = 800;
const height = 600;
const margin = 50;
const padding = 1;

const xAxisLength = width - 2 * margin;
const yAxisLength = height - 2 * margin;

const svg = d3.select('svg')
    .attr('class', 'axis')
    .attr('width', width)
    .attr('height', height);

let tooltip = d3.select('body')
    .append('div')
    .attr('id', 'tooltip')
    .style('visibility', 'hidden')
    .style('width', 'auto')
    .style('height', 'auto')


req.open('GET', url, true);
req.send();
req.onload = () => {
    data = JSON.parse(req.responseText);
    values = data.data;
    console.log(values)

    const scaleY = d3.scaleLinear()
        .domain([d3.min(values, (d) => d[1]),
            d3.max(values, (d) => d[1])
        ])
        .range([yAxisLength, 0]);

    let datesArray = values.map((d) => {
        new Date(d[0]);

    })

    const scaleD = d3.scaleLinear()
        .domain([0, values.length - 1])
        .range([0, xAxisLength]);

    const scaleX = d3.scaleTime()
        .domain([d3.min(datesArray), d3.max(datesArray)])
        .range([0, xAxisLength]);

    const xAxis = d3.axisBottom(scaleD);

    const yAxis = d3.axisLeft(scaleY);
    svg.append("g")
        .attr('id', 'y-axis')
        .attr("class", "y-axis")
        .attr("transform",
            "translate(" + margin + "," + margin + ")")
        .call(yAxis);

    svg.append("g")
        .attr('id', 'x-axis')
        .attr("class", "x-axis")
        .attr("transform",
            "translate(" + margin + "," + (height - margin) + ")")
        .call(xAxis);

    var g = svg.append("g")
        .attr("class", "body")
        .attr("transform",
            "translate(" + margin + ", 0 )");

    g.selectAll("rect.bar")
        .data(values)
        .enter()
        .append("rect")
        .attr("class", "bar");

    g.selectAll("rect.bar")
        .data(values)
        .attr('data-date', (d) => d[0])
        .attr('data-gdp', (d) => d[1])
        .attr("x", function (d, index) {
            return scaleD(index);
        })
        .attr("y", function (d) {
            return scaleY(d[1]) + margin;
        })
        .attr("height", function (d) {
            return yAxisLength - scaleY(d[1]);
        })
        .attr("width", function (d) {

            return (xAxisLength / values.length);
        })
        .on('mouseover', (d) => {
            tooltip.transition()
                .style('visibility', 'visible')

            tooltip.text(d[0] + ' - ' + d[1])

            document.querySelector('#tooltip').setAttribute('data-date', d[0])
        })
        .on('mouseout', (d) => {
            tooltip.transition()
                .style('visibility', 'hidden')
            tooltip.text(d[0] + ' - ' + d[1])
        })

}