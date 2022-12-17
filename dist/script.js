window.onload = () => {
  graph();
};

const graph = () => {
  const dataset = [1, 1, 1, 1, 1, 1, 1];

  // let colors = ['#8dd3c7', '#ffffb3', '#bebada', '#fb8072', '#80b1d3', '#fdb462', '#b3de69', '#fccde5', '#d9d9d9', '#bc80bd'];
  // let colors = ['#67001f', '#b2182b', '#d6604d', '#f4a582', '#fddbc7', '#e0e0e0', '#bababa', '#878787', '#4d4d4d', '#1a1a1a'];
  const colors = [
    "#7f221e",
    "#a42c27",
    "#bd4640",
    "#c55a55",
    "#d38380",
    "#db9895",
    "#e2adaa",
    "#5e4fa2",
    "#491411",
    "#7f221e",
  ];
  const headings = [
    "Boots 86,000pcs",
    "Leather Garments",
    "Gloves",
    "Textile Garments",
    "Denim",
    "Bags",
    "Accessories",
    "h",
    "i",
  ];
  const sub_headings = [
    "1-Boots",
    "2-Leather Garments",
    "3-Gloves",
    "4-Textile Garments",
    "Denim",
    "Bags",
    "Accessories",
    "h",
    "i",
  ];
  const head_col = [
    "#a42c27",
    "#a42c27",
    "#a42c27",
    "#a42c27",
    "#a42c27",
    "#a42c27",
    "#a42c27",
  ];

  const data = [
    {
      name: "Boots",
      number: "93,600",
      smallTitle: " PAIRS",
    },
    {
      name: "Leather Garments",
      number: "97,200",
      smallTitle: " PCS",
    },
    {
      name: "Gloves",
      number: "110,000",
      smallTitle: " PAIRS",
    },
    {
      name: "Textile Garments",
      number: "135,000",
      smallTitle: " PCS",
    },
    {
      name: "Denim",
      number: "75,000",
      smallTitle: " PCS",
    },
    {
      name: "Bags",
      number: "60,000",
      smallTitle: " PCS",
    },
    {
      name: "Accessories",
      number: "85,000",
      smallTitle: " PCS",
    },
  ];

  // radius of graph in different display size
  let innerRadius1;
  let innerRadius2;
  let outerRadius1;
  let outerRadius2;

  let tspanY = 1;

  const diviceWidth = window.innerWidth;

  if (diviceWidth >= 1200) {
    outerRadius1 = 0.6;
    innerRadius1 = 0.45;

    innerRadius2 = 0.85;
    outerRadius2 = 0.85;
  } else {
    outerRadius1 = 0.3;
    innerRadius1 = 0.4;

    innerRadius2 = 0.6;
    outerRadius2 = 0.6;

    tspanY = 0.6;
  }

  if (diviceWidth < 900) {
    tspanY = 0.55;
  }

  const width = document.querySelector(".chart-wrapper").offsetWidth;
  const height = document.querySelector(".chart-wrapper").offsetHeight;
  const minOfWH = Math.min(width, height) / 2;
  const initialAnimDelay = 300;
  const arcAnimDelay = 150;
  const arcAnimDur = 3000;
  const secDur = 1000;
  const secIndividualdelay = 150;

  let radius;

  // calculate minimum of width and height to set chart radius
  if (minOfWH > 200) {
    if (diviceWidth >= 1200) {
      radius = 300;
    } else {
      radius = 200;
    }
  } else {
    radius = minOfWH;
  }

  // append svg
  let svg = d3
    .select(".chart-wrapper")
    .append("svg")
    .attr({
      width: width,
      height: height,
      class: "pieChart",
    })
    .append("g");

  svg.attr({
    transform: `translate(${width / 2}, ${height / 2})`,
  });

  // for drawing slices
  let arc = d3.svg
    .arc()
    .outerRadius(radius * outerRadius1)
    .innerRadius(radius * innerRadius1);

  // for labels and polylines
  let outerArc = d3.svg
    .arc()
    .innerRadius(radius * innerRadius2)
    .outerRadius(radius * outerRadius2);

  // d3 color generator
  // let c10 = d3.scale.category10();

  let pie = d3.layout.pie().value((d) => d);

  let draw = function () {
    svg.append("g").attr("class", "lines");
    svg.append("g").attr("class", "slices");
    svg.append("g").attr("class", "labels");

    // define slice
    let slice = svg
      .select(".slices")
      .datum(dataset)
      .selectAll("path")
      .data(pie);
    slice
      .enter()
      .append("path")
      .attr({
        fill: (d, i) => colors[i],
        d: arc,
        "stroke-width": "25px",
        transform: (d, i) => "rotate(-180, 0, 0)",
      })
      .style("opacity", 0)
      .transition()
      .delay((d, i) => i * arcAnimDelay + initialAnimDelay)
      .duration(arcAnimDur)
      .ease("elastic")
      .style("opacity", 1)
      .attr("transform", "rotate(0,0,0)");

    slice
      .transition()
      .delay((d, i) => arcAnimDur + i * secIndividualdelay)
      .duration(secDur)
      .attr("stroke-width", "5px");

    let midAngle = (d) => d.startAngle + (d.endAngle - d.startAngle) / 2;

    let text = svg.select(".labels").selectAll("text").data(pie(dataset));

    text
      .enter()
      .append("text")
      .attr("dy", "0.35em")
      .style("opacity", 0)
      .style("fill", (d, i) => head_col[i])
      .html((d, i) => {
        return `<tspan>${data[i].name}</tspan><tspan fill="black" class="numbers" y="${tspanY}cm" x="-1">(${data[i].number}<tspan class="pcs">${data[i].smallTitle}</tspan>)</tspan>`;
      })
      .attr("transform", (d) => {
        // calculate outerArc centroid for 'this' slice
        let pos = outerArc.centroid(d);
        // define left and right alignment of text labels
        pos[0] = radius * (midAngle(d) < Math.PI ? 1 : -1);
        return `translate(${pos})`;
      })
      .style("text-anchor", (d) => (midAngle(d) < Math.PI ? "start" : "end"))
      .transition()
      .delay((d, i) => arcAnimDur + i * secIndividualdelay)
      .duration(secDur)
      .style("opacity", 1);

    let polyline = svg
      .select(".lines")
      .selectAll("polyline")
      .data(pie(dataset));

    polyline
      .enter()
      .append("polyline")
      .style("opacity", 0.5)
      .attr("points", (d) => {
        let pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), arc.centroid(d), arc.centroid(d)];
      })
      .transition()
      .duration(secDur)
      .delay((d, i) => arcAnimDur + i * secIndividualdelay)
      .attr("points", (d) => {
        let pos = outerArc.centroid(d);
        pos[0] = radius * 0.95 * (midAngle(d) < Math.PI ? 1 : -1);
        return [arc.centroid(d), outerArc.centroid(d), pos];
      });

    let numberPcs = document.getElementsByClassName("numbers");
    for (let i = 0; i < numberPcs.length; i++) {
      numberPcs[i].style.opacity = 0;
      numberPcs[i].style.display = "none";
    }

    d3.selectAll(".numbers")
      .transition()
      .duration(1000)
      .delay(5000)
      .style("display", "block")
      .style("opacity", 1);
  };

  draw();

  let button = document.querySelector("button");

  let replay = () => {
    d3.selectAll(".slices")
      .transition()
      .ease("back")
      .duration(500)
      .delay(0)
      .style("opacity", 0)
      .attr("transform", "translate(0, 250)")
      .remove();
    d3.selectAll(".lines")
      .transition()
      .ease("back")
      .duration(500)
      .delay(100)
      .style("opacity", 0)
      .attr("transform", "translate(0, 250)")
      .remove();
    d3.selectAll(".labels")
      .transition()
      .ease("back")
      .duration(500)
      .delay(200)
      .style("opacity", 0)
      .attr("transform", "translate(0, 250)")
      .remove();

    setTimeout(draw, 800);
  };
};
