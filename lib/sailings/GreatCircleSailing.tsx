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
  atan,
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

export class GreatCircleSailingState {
  @observable point_a_lat: Latitude
  @observable point_a_lon: Longitude
  @observable point_b_lat: Latitude
  @observable point_b_lon: Longitude
  @observable calcPole: "N" | "S"
  @observable showAnswer: boolean
  @observable showProforma: boolean

  constructor() {
    // this.point_a_lat = new Latitude(34, 55, "S")
    // this.point_a_lon = new Longitude(56, 10, "W")
    // this.point_b_lat = new Latitude(33, 55, "S")
    // this.point_b_lon = new Longitude(18, 25, "E")
    // this.point_a_lat = new Latitude(37, 48, "N")
    // this.point_a_lon = new Longitude(122, 40, "W")
    // this.point_b_lat = new Latitude(35, 40, "N")
    // this.point_b_lon = new Longitude(141, 0, "E")
    this.point_a_lat = new Latitude(33, 51, "S")
    this.point_a_lon = new Longitude(151, 16, "E")
    this.point_b_lat = new Latitude(37, 37, "N")
    this.point_b_lon = new Longitude(122, 30, "W")
    this.calcPole = "N"
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
    this.showAnswer = false
    // this.showProforma = false
  }
}

export default function (root: HTMLDivElement) {
  const globeContainer = document.createElement("div")
  globeContainer.classList.add("ParallelSailing__globe")
  const proforma = document.createElement("form")
  proforma.classList.add("ParallelSailing_proforma")

  const state = new GreatCircleSailingState()

  root.appendChild(globeContainer)
  root.appendChild(proforma)

  const globeUpdate = Globe(globeContainer, {})

  autorun(render)
  window.requestAnimationFrame(render)

  function render() {
    renderWithContext(proforma, <GreatCircleSailingProforma state={state} />)

    globeUpdate({
      circles: [
        {
          type: "prediction",
          start_lat: state.point_a_lat.asFloat(),
          start_lon: state.point_a_lon.asFloat(),
          end_lat: state.point_b_lat.asFloat(),
          end_lon: state.point_b_lon.asFloat(),
          showVertex: true,
          showWhole: true,
        },
      ],
      lines: [
        {
          type: "calculation",
          start_lat: state.point_a_lat.asFloat(),
          start_lon: state.point_a_lon.asFloat(),
          end_lat: state.calcPole == "N" ? 90 : -90,
          end_lon: state.point_a_lon.asFloat(),
        },
        {
          type: "calculation",
          start_lat: state.calcPole == "N" ? 90 : -90,
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
          text: "Orig",
        },
        {
          type: "dot",
          lat: state.point_b_lat.asFloat(),
          lon: state.point_b_lon.asFloat(),
          text: "Dest",
        },
      ],
    })
  }
}

export function GreatCircleSailingProforma(props: {
  state: GreatCircleSailingState
}) {
  const { state } = props
  const { localize: l10n } = useContext(RenderContext)

  let proformaRender = null

  if (state.showProforma) {
    const pole = new Latitude(90, 0, state.calcPole)
    const PA = state.point_a_lat.getDlat(pole)
    const PB = state.point_b_lat.getDlat(pole)

    const dlon = state.point_a_lon.getDlon(state.point_b_lon)
    const dlat = state.point_a_lat.getDlat(state.point_b_lat)
    const mlat = latFromFloat(
      (state.point_a_lat.asFloat() + state.point_b_lat.asFloat()) / 2
    )
    const departure = dlon.asMinutes() * cos(mlat.asFloat())
    const course_angle = atan(departure / dlat.asMinutes())

    const distanceDegs = acos(
      cos(PA.asDegrees()) * cos(PB.asDegrees()) +
        sin(PA.asDegrees()) * sin(PB.asDegrees()) * cos(dlon.asDegrees())
    )

    const initialCourseAngle = acos(
      (cos(PB.asDegrees()) - cos(PA.asDegrees()) * cos(distanceDegs)) /
        (sin(PA.asDegrees()) * sin(distanceDegs))
    )
    const finalCourseAngle = acos(
      (cos(PA.asDegrees()) - cos(PB.asDegrees()) * cos(distanceDegs)) /
        (sin(PB.asDegrees()) * sin(distanceDegs))
    )
    const initialTrueCourse = courseAngleToTrue(
      pole.sign,
      initialCourseAngle,
      dlon.sign
    )
    const finalTrueCourse = courseAngleToTrue(
      pole.sign == "N" ? "S" : "N",
      finalCourseAngle,
      dlon.sign
    )

    const distance = distanceDegs * 60

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
          {pole.asFloat() + "° - Origin'Lat"}
        </tr>
        <tr>
          <td>{"OP"}</td>
          {state.showAnswer && <td>{PA.asDegrees().toFixed(2) + "°"}</td>}
        </tr>
        <tr>
          <td>{"DP"}</td>
          {pole.asFloat() + "° - Destination'Lat"}
        </tr>
        <tr>
          <td>{"DP"}</td>
          {state.showAnswer && <td>{PB.asDegrees().toFixed(2) + "°"}</td>}
        </tr>
        <tr>
          <td>
            {"Distance"}
            <sub>{"degrees"}</sub>
          </td>
          {"cos"}
          <sup>{"-1"}</sup>
          {"(cos OP cos DP + sin OP sin DP cos P)"}
        </tr>
        <tr>
          <td>
            {"Distance"}
            <sub>{"degrees"}</sub>
          </td>
          {state.showAnswer && <td>{distanceDegs.toFixed(2) + "°"}</td>}
        </tr>
        <tr>
          <td>
            {"Distance"}
            <sub>{"nm"}</sub>
          </td>
          {state.showAnswer && (
            <td>{distance.toFixed(2) + " nautical miles"}</td>
          )}
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
          <td>{l10n.t("great_circle_sailing.origin_latitude")}</td>
          <td>
            <LatitudeInput lat={state.point_a_lat} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("great_circle_sailing.origin_longitude")}</td>
          <td>
            <LongitudeInput lon={state.point_a_lon} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("great_circle_sailing.destination_latitude")}</td>
          <td>
            <LatitudeInput lat={state.point_b_lat} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("great_circle_sailing.destination_longitude")}</td>
          <td>
            <LongitudeInput lon={state.point_b_lon} />
          </td>
        </tr>

        <tr>
          <td>{l10n.t("great_circle_sailing.calculation_pole")}</td>
          <td>
            <select
              value={state.calcPole}
              onChange={(e) =>
                (state.calcPole = (e.target as HTMLInputElement).value as
                  | "N"
                  | "S")
              }
            >
              <option value="N">{"N"}</option>
              <option value="S">{"S"}</option>
            </select>
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
