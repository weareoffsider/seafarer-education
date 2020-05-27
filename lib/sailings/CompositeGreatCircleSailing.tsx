import { observable, computed, action, autorun } from "mobx"
import { useContext } from "preact/hooks"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { h, Component, createContext, Fragment } from "preact"
import { RenderContext, renderWithContext } from "../foundation/RenderContext"
import Chance from "chance"

import Globe from "../globe"

import {
  cos,
  acos,
  sin,
  asin,
  atan,
  tan,
  courseAngleToTrue,
  Latitude,
  LatitudeInput,
  Longitude,
  LongitudeInput,
  latFromFloat,
  lonFromFloat,
  generateRandomLat,
  generateRandomLon,
} from "./Shared"

export class CompositeGreatCircleSailingState {
  @observable point_a_lat: Latitude
  @observable point_a_lon: Longitude
  @observable point_b_lat: Latitude
  @observable point_b_lon: Longitude
  @observable limiting_latitude: Latitude
  @observable calcPole: "N" | "S"
  @observable showAnswer: boolean
  @observable showProforma: boolean

  constructor() {
    // this.point_a_lat = new Latitude(34, 55, "S")
    // this.point_a_lon = new Longitude(56, 10, "W")
    // this.point_b_lat = new Latitude(33, 55, "S")
    // this.point_b_lon = new Longitude(18, 25, "E")
    this.point_a_lat = new Latitude(37, 48, "N")
    this.point_a_lon = new Longitude(122, 40, "W")
    this.point_b_lat = new Latitude(35, 40, "N")
    this.point_b_lon = new Longitude(141, 0, "E")
    // this.point_a_lat = new Latitude(33, 51, "S")
    // this.point_a_lon = new Longitude(151, 16, "E")
    // this.point_b_lat = new Latitude(37, 37, "N")
    // this.point_b_lon = new Longitude(122, 30, "W")
    this.limiting_latitude = new Latitude(45, 0, "N")
  }

  @action.bound
  toggleShowAnswer(e: Event) {
    e.preventDefault()
    this.showAnswer = !this.showAnswer
    if (this.showAnswer) {
      this.showProforma = true
    }
  }

  @action.bound
  toggleProforma(e: Event) {
    e.preventDefault()
    this.showProforma = !this.showProforma
  }

  @action.bound
  randomise(e: Event) {
    e.preventDefault()
    const chance = new Chance()

    this.point_a_lat = generateRandomLat()
    this.point_a_lon = generateRandomLon()
    this.point_b_lat = generateRandomLat()
    this.point_b_lon = generateRandomLon()
    this.limiting_latitude = generateRandomLat()
    this.showAnswer = false
    // this.showProforma = false
  }
}

export default function (root: HTMLDivElement) {
  const globeContainer = document.createElement("div")
  globeContainer.classList.add("ParallelSailing__globe")
  const proforma = document.createElement("form")
  proforma.classList.add("ParallelSailing_proforma")

  const state = new CompositeGreatCircleSailingState()

  root.appendChild(globeContainer)
  root.appendChild(proforma)

  const globeUpdate = Globe(globeContainer, {})

  autorun(render)
  window.requestAnimationFrame(render)

  function render() {
    renderWithContext(
      proforma,
      <CompositeGreatCircleSailingProforma state={state} />
    )

    const poleLat = new Latitude(90, 0, state.limiting_latitude.sign)
    const PA = state.point_a_lat.getDlat(poleLat)
    const PB = state.point_b_lat.getDlat(poleLat)

    const dlon = state.point_a_lon.getDlon(state.point_b_lon)
    const dlat = state.point_a_lat.getDlat(state.point_b_lat)

    const PV = state.limiting_latitude.getDlat(poleLat)
    const PW = state.limiting_latitude.getDlat(poleLat)

    const Pv = acos(tan(PV.asDegrees()) * tan(90 - PA.asDegrees()))
    const AVDegs = acos(
      cos(PA.asDegrees()) * cos(PV.asDegrees()) +
        sin(PA.asDegrees()) * sin(PV.asDegrees()) * cos(Pv)
    )
    const AVnm = AVDegs * 60
    const initialCourseAngle = acos(
      (cos(PV.asDegrees()) - cos(PA.asDegrees()) * cos(Pv)) /
        (sin(PA.asDegrees()) * sin(Pv))
    )
    const initialTrueCourse = courseAngleToTrue(
      poleLat.sign,
      initialCourseAngle,
      dlon.sign
    )

    const Pw = acos(tan(PW.asDegrees()) * tan(90 - PB.asDegrees()))
    const BWDegs = acos(
      cos(PB.asDegrees()) * cos(PW.asDegrees()) +
        sin(PB.asDegrees()) * sin(PW.asDegrees()) * cos(Pw)
    )
    const BWnm = BWDegs * 60
    const finalCourseAngle = acos(
      (cos(PW.asDegrees()) - cos(PB.asDegrees()) * cos(Pw)) /
        (sin(PB.asDegrees()) * sin(Pw))
    )
    const finalTrueCourse = courseAngleToTrue(
      poleLat.sign == "N" ? "S" : "N",
      finalCourseAngle,
      dlon.sign
    )

    const vLat = state.limiting_latitude
    const vLon = lonFromFloat(state.point_a_lon.asFloat() - Pv)
    const wLat = state.limiting_latitude
    const wLon = lonFromFloat(state.point_b_lon.asFloat() + Pw)

    globeUpdate({
      circles: [
        {
          type: "prediction",
          start_lat: state.point_a_lat.asFloat(),
          start_lon: state.point_a_lon.asFloat(),
          end_lat: vLat.asFloat(),
          end_lon: vLon.asFloat(),
          showWhole: true,
        },
        {
          type: "prediction",
          start_lat: wLat.asFloat(),
          start_lon: wLon.asFloat(),
          end_lat: state.point_b_lat.asFloat(),
          end_lon: state.point_b_lon.asFloat(),
          showWhole: true,
        },
      ],
      lines: [
        {
          type: "prediction",
          start_lat: vLat.asFloat(),
          start_lon: vLon.asFloat(),
          end_lat: wLat.asFloat(),
          end_lon: wLon.asFloat(),
        },
        {
          type: "calculation",
          start_lat: state.point_a_lat.asFloat(),
          start_lon: state.point_a_lon.asFloat(),
          end_lat: state.limiting_latitude.sign == "N" ? 90 : -90,
          end_lon: state.point_a_lon.asFloat(),
        },
        {
          type: "calculation",
          start_lat: vLat.asFloat(),
          start_lon: vLon.asFloat(),
          end_lat: state.limiting_latitude.sign == "N" ? 90 : -90,
          end_lon: vLon.asFloat(),
        },
        {
          type: "calculation",
          start_lat: wLat.asFloat(),
          start_lon: wLon.asFloat(),
          end_lat: state.limiting_latitude.sign == "N" ? 90 : -90,
          end_lon: wLon.asFloat(),
        },
        {
          type: "calculation",
          start_lat: state.limiting_latitude.sign == "N" ? 90 : -90,
          start_lon: state.point_b_lon.asFloat(),
          end_lat: state.point_b_lat.asFloat(),
          end_lon: state.point_b_lon.asFloat(),
        },
      ],
      points: [
        {
          type: "dot",
          lat: state.point_a_lat.asFloat(),
          lon: state.point_a_lon.asFloat(),
          text: "O",
        },
        {
          type: "dot",
          lat: vLat.asFloat(),
          lon: vLon.asFloat(),
          text: "V",
        },
        {
          type: "dot",
          lat: wLat.asFloat(),
          lon: wLon.asFloat(),
          text: "W",
        },
        {
          type: "dot",
          lat: state.limiting_latitude.sign == "N" ? 90 : -90,
          lon: state.point_a_lon.asFloat(),
          text: "P",
        },
        {
          type: "dot",
          lat: state.point_b_lat.asFloat(),
          lon: state.point_b_lon.asFloat(),
          text: "D",
        },
      ],
    })
  }
}

export function CompositeGreatCircleSailingProforma(props: {
  state: CompositeGreatCircleSailingState
}) {
  const { state } = props
  const { localize: l10n } = useContext(RenderContext)

  let proformaRender = null

  if (state.showProforma) {
    const pole = new Latitude(90, 0, state.limiting_latitude.sign)
    const PA = state.point_a_lat.getDlat(pole)
    const PB = state.point_b_lat.getDlat(pole)

    const dlon = state.point_a_lon.getDlon(state.point_b_lon)
    const dlat = state.point_a_lat.getDlat(state.point_b_lat)

    const PV = state.limiting_latitude.getDlat(pole)
    const PW = state.limiting_latitude.getDlat(pole)

    const Pv = acos(tan(PV.asDegrees()) * tan(90 - PA.asDegrees()))
    const AVDegs = acos(
      cos(PA.asDegrees()) * cos(PV.asDegrees()) +
        sin(PA.asDegrees()) * sin(PV.asDegrees()) * cos(Pv)
    )
    const AVnm = AVDegs * 60
    const initialCourseAngle = acos(
      (cos(PV.asDegrees()) - cos(PA.asDegrees()) * cos(Pv)) /
        (sin(PA.asDegrees()) * sin(Pv))
    )
    const initialTrueCourse = courseAngleToTrue(
      pole.sign,
      initialCourseAngle,
      dlon.sign
    )

    const Pw = acos(tan(PW.asDegrees()) * tan(90 - PB.asDegrees()))
    const BWDegs = acos(
      cos(PB.asDegrees()) * cos(PW.asDegrees()) +
        sin(PB.asDegrees()) * sin(PW.asDegrees()) * cos(Pw)
    )
    const BWnm = BWDegs * 60
    const finalCourseAngle = acos(
      (cos(PW.asDegrees()) - cos(PB.asDegrees()) * cos(Pw)) /
        (sin(PB.asDegrees()) * sin(Pw))
    )
    const finalTrueCourse = courseAngleToTrue(
      pole.sign == "N" ? "S" : "N",
      finalCourseAngle,
      dlon.sign
    )

    const Pvw = dlon.asDegrees() - Pw - Pv
    const WVDeparture = Pvw * 60 * cos(state.limiting_latitude.asFloat())

    const vLat = state.limiting_latitude
    const vLon = lonFromFloat(state.point_a_lon.asFloat() - Pv)
    const wLat = state.limiting_latitude
    const wLon = lonFromFloat(state.point_b_lon.asFloat() + Pw)

    const total = WVDeparture + BWnm + AVnm

    proformaRender = (
      <tbody>
        <tr>
          <td>{"Calculation Pole"}</td>
          <td>{pole.asFloat() + "°"}</td>
        </tr>
        <tr>
          <td>{"D'Lon = P"}</td>
          {state.showAnswer && <td>{dlon.asString()}</td>}
        </tr>
        <tr>
          <td>{"OP"}</td>
          <td>{pole.asFloat() + "° - Origin'Lat"}</td>
        </tr>
        <tr>
          <td>{"OP"}</td>
          {state.showAnswer && <td>{PA.asDegrees().toFixed(2) + "°"}</td>}
        </tr>
        <tr>
          <td>{"PV = PW"}</td>
          <td>{pole.asFloat() + "° - Limit'Lat"}</td>
        </tr>
        <tr>
          <td>{"PV = PW"}</td>
          {state.showAnswer && <td>{PV.asDegrees().toFixed(2) + "°"}</td>}
        </tr>
        <tr>
          <td>{"DP"}</td>
          <td>{pole.asFloat() + "° - Destination'Lat"}</td>
        </tr>
        <tr>
          <td>{"DP"}</td>
          {state.showAnswer && <td>{PB.asDegrees().toFixed(2) + "°"}</td>}
        </tr>
        <tr>
          <td>{"Initial Seg Angle"}</td>
          <td>
            {"cos"}
            <sup>{"-1"}</sup>
            {"(tan(PV) * tan(90 - PA)) - Napier"}
          </td>
        </tr>
        <tr>
          <td>{"Initial Seg Angle"}</td>
          {state.showAnswer && <td>{Pv.toFixed(2) + "°"}</td>}
        </tr>
        <tr>
          <td>{"Initial Seg Side"}</td>
          {state.showAnswer && <td>{AVDegs.toFixed(2) + "°"}</td>}
        </tr>
        <tr>
          <td>{"Initial Seg Distance"}</td>
          {state.showAnswer && <td>{AVnm.toFixed(2) + " nautical miles"}</td>}
        </tr>
        <tr>
          <td>{"Final Seg Angle"}</td>
          <td>
            {"cos"}
            <sup>{"-1"}</sup>
            {"(tan(PW) * tan(90 - PB)) - Napier"}
          </td>
        </tr>
        <tr>
          <td>{"Final Seg Angle"}</td>
          {state.showAnswer && <td>{Pw.toFixed(2) + "°"}</td>}
        </tr>
        <tr>
          <td>{"Final Seg Side"}</td>
          {state.showAnswer && <td>{BWDegs.toFixed(2) + "°"}</td>}
        </tr>
        <tr>
          <td>{"Final Seg Distance"}</td>
          {state.showAnswer && <td>{BWnm.toFixed(2) + " nautical miles"}</td>}
        </tr>

        <tr>
          <td>{"Parallel Seg Angle"}</td>
          <td>{"D'Lon - First Seg Angle - Final Seg Angle"}</td>
        </tr>

        <tr>
          <td>{"Parallel Seg Angle"}</td>
          {state.showAnswer && <td>{Pvw.toFixed(2) + "°"}</td>}
        </tr>

        <tr>
          <td>{"Parallel Seg"}</td>
          <td>{"Parallel Seg Angle * 60 * cos(Limit'Lat)"}</td>
        </tr>
        <tr>
          <td>{"Parallel Seg"}</td>
          {state.showAnswer && (
            <td>{WVDeparture.toFixed(2) + " nautical miles"}</td>
          )}
        </tr>

        <tr>
          <td>
            {"Distance"}
            <sub>{"nm"}</sub>
          </td>
          <td>{"OV + VW + WD"}</td>
        </tr>
        <tr>
          <td>
            {"Distance"}
            <sub>{"nm"}</sub>
          </td>
          {state.showAnswer && <td>{total.toFixed(2) + " nautical miles"}</td>}
        </tr>

        <tr>
          <td>{"Initial Course Angle"}</td>
          <td>
            {"cos"}
            <sup>{"-1"}</sup>
            {"((cos DP - cos OP * cos Distance) / (sin OP * sin Distance))"}
          </td>
        </tr>
        <tr>
          <td>{"Initial Course Angle"}</td>
          {state.showAnswer && (
            <td>{`${pole.sign} ${initialCourseAngle.toFixed(1)}° ${
              dlon.sign
            }`}</td>
          )}
        </tr>
        <tr>
          <td>{"Initial Course"}</td>
          {state.showAnswer && <td>{`${initialTrueCourse.toFixed(1)}° T`}</td>}
        </tr>
        <tr>
          <td>{"Final Course Angle"}</td>
          <td>
            {"cos"}
            <sup>{"-1"}</sup>
            {"((cos OP - cos DP * cos Distance) / (sin DP * sin Distance))"}
          </td>
        </tr>
        <tr>
          <td>{"Final Course Angle"}</td>
          {state.showAnswer && (
            <td>{`${pole.sign == "N" ? "S" : "N"} ${finalCourseAngle.toFixed(
              1
            )}° ${dlon.sign}`}</td>
          )}
        </tr>
        <tr>
          <td>{"Final Course"}</td>
          {state.showAnswer && <td>{`${finalTrueCourse.toFixed(1)}° T`}</td>}
        </tr>
        <tr>
          <td></td>
          <td>
            <button onClick={state.randomise}>
              {l10n.t("generate_new_question")}
            </button>
          </td>
        </tr>
      </tbody>
    )
  }

  return (
    <table>
      <tbody>
        <tr>
          <td>{l10n.t("composite_great_circle_sailing.origin_latitude")}</td>
          <td>
            <LatitudeInput lat={state.point_a_lat} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("composite_great_circle_sailing.origin_longitude")}</td>
          <td>
            <LongitudeInput lon={state.point_a_lon} />
          </td>
        </tr>
        <tr>
          <td>
            {l10n.t("composite_great_circle_sailing.destination_latitude")}
          </td>
          <td>
            <LatitudeInput lat={state.point_b_lat} />
          </td>
        </tr>
        <tr>
          <td>
            {l10n.t("composite_great_circle_sailing.destination_longitude")}
          </td>
          <td>
            <LongitudeInput lon={state.point_b_lon} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("composite_great_circle_sailing.limiting_latitude")}</td>
          <td>
            <LatitudeInput lat={state.limiting_latitude} />
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td>
            <button onClick={state.toggleProforma}>
              {l10n.t("show_proforma")}
            </button>
          </td>
          <td>
            <button onClick={state.toggleShowAnswer}>
              {l10n.t("show_answer")}
            </button>
          </td>
        </tr>
      </tbody>
      {proformaRender}
    </table>
  )
}
