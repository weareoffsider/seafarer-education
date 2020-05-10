import * as d3 from "d3"

document.addEventListener("DOMContentLoaded", function (event) {
  const planeSailing = document.querySelectorAll(".plane-sailing-diagram")
  Array.from(planeSailing).forEach(doPlaneSailing)
})

function doPlaneSailing(element: SVGElement) {
  const data = {
    a: { lat: 10, lon: 10 },
    b: { lat: 20, lon: 20 },
  }
  const longitudeScale = d3.scaleLinear().domain([-180, 180])
  const latitudeScale = d3.scaleLinear().domain([-90, 90])

  const canvas = d3.select(element)
  const pa = canvas.append("circle").attr("r", 1).style("fill", "red")
  const pb = canvas.append("circle").attr("r", 1).style("fill", "red")
  update()

  function update() {
    canvas.attr("viewBox", "-180 -90 360 180")
    pa.data([data.a])
      .attr("cx", (d) => d.lat)
      .attr("cy", (d) => d.lon * -1)
    pb.data([data.b])
      .attr("cx", (d) => d.lat)
      .attr("cy", (d) => d.lon * -1)
  }
}
