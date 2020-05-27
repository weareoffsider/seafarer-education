import * as d3 from "d3"

import worldTopo from "./world-50m.json"
import * as topojson from "topojson"
import range from "lodash/range"

import {
  Latitude,
  Longitude,
  latFromFloat,
  lonFromFloat,
  acos,
  cos,
  sin,
  asin,
  tan,
  atan,
} from "../sailings/Shared"

export interface GlobePoint {
  type: "dot"
  lat: number
  lon: number
  text: string
}

export interface GlobeLine {
  type: "track" | "calculation" | "prediction" | "meridian" | "parallel"
  start_lat: number
  start_lon: number
  end_lat: number
  end_lon: number
  showVertex?: boolean
  showWhole?: boolean
}

export interface GlobeArgs {
  lines?: GlobeLine[]
  circles?: GlobeLine[]
  points?: GlobePoint[]
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
    scale: 100,
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

    rotate(div, svg, state, currentArgs)
  })

  div.addEventListener("mouseup", function (e: MouseEvent) {
    e.preventDefault()
    state.rotationActive = false
  })

  div.addEventListener("wheel", function (e: WheelEvent) {
    const scaleAdjust = e.deltaMode == 0 ? e.deltaY : e.deltaY * 20
    state.scale = Math.max(state.scale + scaleAdjust, 100)
    rotate(div, svg, state, currentArgs)
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
    let points = 0

    if (currentArgs.lines) {
      currentArgs.lines.forEach((line) => {
        points++
        latTotal += line.start_lat + line.end_lat
        lonTotal += line.start_lon + line.end_lon
      })
    }
    if (currentArgs.circles) {
      currentArgs.circles.forEach((line) => {
        points++
        latTotal += line.start_lat + line.end_lat
        lonTotal += line.start_lon + line.end_lon
      })
    }

    const mlon = lonTotal / (points * 2)
    const mlat = latTotal / (points * 2)

    state.x = 0 - mlon
    state.y = 0 - mlat
    state.scale = 100

    render(div, svg, currentArgs, state)
  }
}

let sphereIdNum = 0

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

  const mainProjection = projection.rotate([state.x, state.y, 0])
  const path = d3.geoPath().projection(mainProjection)

  const graticule = d3.geoGraticule()

  const sphereId = `sphere-${sphereIdNum++}`

  svg
    .append("defs")
    .append("path")
    .datum({ type: "Sphere" })
    .attr("id", sphereId)
    .attr("d", path)

  svg
    .append("use")
    .attr("class", "stroke")
    .attr("xlink:href", "#" + sphereId)

  svg
    .append("use")
    .attr("class", "fill")
    .attr("xlink:href", "#" + sphereId)

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

  if (args.circles) {
    args.circles.forEach((line) => {
      if (line.showWhole) {
        const circleFeature = {
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: interpolateWholeCircle(line),
          },
        }

        const circleClasses = `great-circle`
        svg
          .insert("path", `.${circleClasses}`)
          .datum(circleFeature)
          .attr("class", circleClasses)
          .attr("d", path)
      }

      const feature = {
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: interpolateCircle(line),
        },
      }
      const classes = `track track--${line.type}`

      svg
        .insert("path", `.${classes}`)
        .datum(feature)
        .attr("class", classes)
        .attr("d", path)

      if (line.showVertex) {
        const [vlon, vlat] = getVertex(line)
        const pointRender = svg
          .insert("g")
          .attr("class", `vertex`)
          .attr(
            "transform",
            "translate(" + mainProjection([vlon, vlat]).join(",") + ")"
          )

        pointRender.insert("circle").attr("r", 2)
        pointRender.insert("text").attr("y", -6).text("V")
      }
    })
  }

  if (args.points) {
    args.points.forEach((p) => {
      const pointRender = svg
        .insert("g")
        .attr("class", `point point--${p.type}`)
        .attr(
          "transform",
          "translate(" + mainProjection([p.lon, p.lat]).join(",") + ")"
        )

      pointRender.insert("circle").attr("r", 2)
      pointRender.insert("text").attr("y", -6).text(p.text)
    })
  }
}

function getVertex(line: GlobeLine) {
  const dlat = line.end_lat - line.start_lat
  let dlon = line.end_lon - line.start_lon
  if (dlon > 180) {
    dlon -= 360
  } else if (dlon < -180) {
    dlon += 360
  }

  const pole = new Latitude(90, 0, dlat > 0 ? "N" : "S")
  const a_lat = latFromFloat(line.start_lat)
  const b_lat = latFromFloat(line.end_lat)

  const PA = a_lat.getDlat(pole)
  const PB = b_lat.getDlat(pole)

  const distanceDegs = acos(
    cos(PA.asDegrees()) * cos(PB.asDegrees()) +
      sin(PA.asDegrees()) * sin(PB.asDegrees()) * cos(dlon)
  )

  const distance = distanceDegs * 60

  const initialCourseAngle = acos(
    (cos(PB.asDegrees()) - cos(PA.asDegrees()) * cos(distanceDegs)) /
      (sin(PA.asDegrees()) * sin(distanceDegs))
  )

  const vPV = asin(cos(90 - PA.asDegrees()) * cos(90 - initialCourseAngle))
  const vP = atan(sin(90 - PA.asDegrees()) / tan(90 - initialCourseAngle)) + -90

  let vlon = dlon > 0 ? line.start_lon - vP : line.start_lon + vP
  if (vlon > 180) {
    vlon -= 360
  } else if (vlon < -180) {
    vlon += 360
  }

  const vlat =
    initialCourseAngle > 90
      ? pole.sign == "N"
        ? -90 + vPV
        : 90 - vPV
      : pole.sign == "N"
      ? 90 - vPV
      : -90 + vPV

  // console.log(
  //   "vertex",
  //   line.start_lon,
  //   initialCourseAngle,
  //   "vP",
  //   vP,
  //   "vPV",
  //   vPV,
  //   "vlon",
  //   vlon,
  //   "vlat",
  //   vlat,
  //   pole.sign,
  //   dlat,
  //   dlon
  // )

  return [vlon, vlat]
}

function interpolateCircle(line: GlobeLine) {
  const dlat = line.end_lat - line.start_lat
  let dlon = line.end_lon - line.start_lon
  if (dlon > 180) {
    dlon -= 360
  } else if (dlon < -180) {
    dlon += 360
  }

  const [vlon, vlat] = getVertex(line)

  const steps = Math.round(Math.abs(dlon))

  const interpolation = range(steps).map((step) => {
    const latdiff = dlat * (step / (steps - 1))
    const londiff = dlon * (step / (steps - 1))
    const i_lon = line.start_lon + londiff
    const iP = i_lon - vlon
    const iPV = 90 - vlat
    const iPI = atan(sin(90 - iP) / tan(iPV)) + -90

    const calc_lat = 90 + iPI
    const calc_lon = line.start_lon + londiff

    return [calc_lon, calc_lat]
  })

  return interpolation
}

function interpolateWholeCircle(line: GlobeLine) {
  const [vlon, vlat] = getVertex(line)

  const interpolation = range(361).map((step) => {
    const londiff = step
    const iP = londiff
    const iPV = 90 - vlat
    const iPI = atan(sin(90 - iP) / tan(iPV)) + -90

    const calc_lat = iPI + -90

    return [vlon + londiff, calc_lat]
  })

  return interpolation
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

function rotate(
  div: HTMLDivElement,
  svg: any,
  state: GlobeState,
  args: GlobeArgs
) {
  const width = div.offsetWidth - 2
  const height = div.offsetHeight - 2

  const projection = d3
    .geoOrthographic()
    .scale(state.scale)
    .translate([width / 2, height / 2])
    .clipAngle(90)
    .precision(0.1)

  const mainProjection = projection.rotate([state.x, state.y, 0])
  const path = d3.geoPath().projection(mainProjection)

  svg.selectAll("path").attr("d", path)
  if (args.points) {
    svg
      .selectAll("g.point")
      .data(args.points)
      .attr("transform", (p: GlobePoint) => {
        return "translate(" + mainProjection([p.lon, p.lat]).join(",") + ")"
      })
  }
  if (args.circles) {
    const withVertex = args.circles.filter((l) => l.showVertex)
    svg
      .selectAll("g.vertex")
      .data(withVertex)
      .attr("transform", (l: GlobeLine) => {
        const [vlon, vlat] = getVertex(l)
        return "translate(" + mainProjection([vlon, vlat]).join(",") + ")"
      })
  }
}
