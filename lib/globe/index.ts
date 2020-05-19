import * as d3 from "d3"

import worldTopo from "./world-50m.json"
import * as topojson from "topojson"
import range from "lodash/range"

export interface GlobeLine {
  type: "track" | "calculation" | "prediction" | "meridian" | "parallel"
  start_lat: number
  start_lon: number
  end_lat: number
  end_lon: number
}

export interface GlobeArgs {
  lines?: GlobeLine[]
  showLand?: boolean
}

export interface GlobeState {
  x: number
  y: number
  scale: number
  rotationActive: boolean
  rotationOffsetX?: number
  rotationOffsetY?: number
}

export default function (div: HTMLDivElement, args: GlobeArgs) {
  let currentArgs = args
  const state: GlobeState = {
    x: 180,
    y: 0,
    scale: 400,
    rotationActive: false,
  }

  const svg = d3
    .select(div)
    .append("svg")
    .attr("class", "Globe")
    .attr("width", div.offsetWidth - 2)
    .attr("height", div.offsetHeight - 2)

  div.addEventListener("mousedown", function (e: MouseEvent) {
    e.preventDefault()
    state.rotationOffsetX = (e.pageX - div.offsetLeft) / div.offsetWidth
    state.rotationOffsetY = (e.pageY - div.offsetTop) / div.offsetHeight
    state.rotationActive = true
  })

  div.addEventListener("mousemove", function (e: MouseEvent) {
    if (!state.rotationActive) return

    e.preventDefault()

    const offsetX = (e.pageX - div.offsetLeft) / div.offsetWidth
    const offsetY = (e.pageY - div.offsetTop) / div.offsetHeight

    state.x = state.x + (offsetX - state.rotationOffsetX) * 80
    state.y = state.y - (offsetY - state.rotationOffsetY) * 80

    state.rotationOffsetX = offsetX
    state.rotationOffsetY = offsetY

    console.log(state.x, state.y)
    rotate(div, svg, state)
  })

  div.addEventListener("mouseup", function (e: MouseEvent) {
    e.preventDefault()
    state.rotationActive = false
  })

  div.addEventListener("wheel", function (e: WheelEvent) {
    const scaleAdjust = e.deltaMode == 0 ? e.deltaY : e.deltaY * 20
    state.scale = Math.max(state.scale + scaleAdjust, 100)
    rotate(div, svg, state)
  })

  window.addEventListener("resize", function () {
    svg.attr("width", div.offsetWidth - 2).attr("height", div.offsetHeight - 2)
    svg.selectAll("*").remove()
    render(div, svg, currentArgs, state)
  })

  window.requestAnimationFrame(() => {
    render(div, svg, currentArgs, state)
  })

  return (updatedArgs: GlobeArgs) => {
    currentArgs = updatedArgs

    svg.selectAll("*").remove()

    let latTotal = 0
    let lonTotal = 0

    currentArgs.lines.forEach((line) => {
      latTotal += line.start_lat + line.end_lat
      lonTotal += line.start_lon + line.end_lon
    })

    console.log(lonTotal, latTotal)

    const mlon = lonTotal / (currentArgs.lines.length * 2)
    const mlat = latTotal / (currentArgs.lines.length * 2)

    state.x = 180 - mlon
    state.y = 180 + mlat
    state.scale = 400
    console.log("CENTERING ON", mlon, mlat)

    render(div, svg, currentArgs, state)
  }
}

function render(
  div: HTMLDivElement,
  svg: any,
  args: GlobeArgs,
  state: GlobeState
) {
  const width = div.offsetWidth - 2
  const height = div.offsetHeight - 2

  const projection = d3
    .geoOrthographic()
    .scale(state.scale)
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .precision(0.1)

  const path = d3.geoPath().projection(projection.rotate([state.x, state.y, 0]))

  const graticule = d3.geoGraticule()

  svg
    .append("defs")
    .append("path")
    .datum({ type: "Sphere" })
    .attr("id", "sphere")
    .attr("d", path)

  svg.append("use").attr("class", "stroke").attr("xlink:href", "#sphere")

  svg.append("use").attr("class", "fill").attr("xlink:href", "#sphere")

  svg.append("path").datum(graticule).attr("class", "graticule").attr("d", path)

  const primeMed = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: interpolateLine({
        type: "meridian",
        start_lat: 85,
        start_lon: 0,
        end_lat: -85,
        end_lon: 0,
      }),
    },
  }

  const antiMed = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: interpolateLine({
        type: "meridian",
        start_lat: 85,
        start_lon: 180,
        end_lat: -85,
        end_lon: 180,
      }),
    },
  }

  const equatorEast = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: interpolateLine({
        type: "parallel",
        start_lat: 0,
        start_lon: 0,
        end_lat: 0,
        end_lon: 170,
      }),
    },
  }
  const equatorWest = {
    type: "Feature",
    geometry: {
      type: "LineString",
      coordinates: interpolateLine({
        type: "parallel",
        start_lat: 0,
        start_lon: 0,
        end_lat: 0,
        end_lon: -170,
      }),
    },
  }

  if (args.showLand) {
    const world: any = worldTopo
    svg
      .insert("path", ".graticule")
      .datum(topojson.feature(world, world.objects.land))
      .attr("class", "land")
      .attr("d", path)

    svg
      .insert("path", ".graticule")
      .datum(
        topojson.mesh(world, world.objects.countries, function (a, b) {
          return a !== b
        })
      )
      .attr("class", "boundary")
      .attr("d", path)
  }

  svg
    .insert("path", `.prime-meridian`)
    .datum(primeMed)
    .attr("class", "prime-meridian")
    .attr("d", path)

  svg
    .insert("path", `.anti-meridian`)
    .datum(antiMed)
    .attr("class", "anti-meridian")
    .attr("d", path)

  svg
    .insert("path", `.equator`)
    .datum(equatorEast)
    .attr("class", "equator")
    .attr("d", path)

  svg
    .insert("path", `.equator`)
    .datum(equatorWest)
    .attr("class", "equator")
    .attr("d", path)

  if (args.lines) {
    args.lines.forEach((line) => {
      const feature = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: interpolateLine(line),
        },
      }
      const classes = `track track--${line.type}`

      svg
        .insert("path", `.${classes}`)
        .datum(feature)
        .attr("class", classes)
        .attr("d", path)
    })
  }
}

function interpolateLine(line: GlobeLine) {
  const dlat = line.end_lat - line.start_lat
  let dlon = line.end_lon - line.start_lon
  if (dlon > 180) {
    dlon -= 360
  } else if (dlon < -180) {
    dlon += 360
  }
  const distance = Math.sqrt(Math.pow(dlat, 2) + Math.pow(dlon, 2))

  const steps = Math.max(Math.ceil(distance * 0.5), 2)

  const interpolation = range(steps).map((step) => {
    const latdiff = dlat * (step / (steps - 1))
    const londiff = dlon * (step / (steps - 1))

    return [line.start_lon + londiff, line.start_lat + latdiff]
  })

  return interpolation
}

function rotate(div: HTMLDivElement, svg: any, state: GlobeState) {
  const width = div.offsetWidth - 2
  const height = div.offsetHeight - 2

  const projection = d3
    .geoOrthographic()
    .scale(state.scale)
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .precision(0.1)

  const path = d3.geoPath().projection(projection.rotate([state.x, state.y, 0]))

  svg.selectAll("path").attr("d", path)
}
