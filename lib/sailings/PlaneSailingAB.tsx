import { observable, computed, action, autorun } from "mobx"
import { useContext } from "preact/hooks"
import { useObserver, useLocalStore } from "mobx-react-lite"
import { h, Component, createContext, Fragment } from "preact"
import { RenderContext, renderWithContext } from "../foundation/RenderContext"
import Chance from "chance"

import Globe from "../globe"

import {
  cos,
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

export class PlaneSailingABState {
  @observable point_a_lat: Latitude
  @observable point_a_lon: Longitude
  @observable point_b_lat: Latitude
  @observable point_b_lon: Longitude
  @observable showAnswer: boolean

  constructor() {
    this.point_a_lat = new Latitude(15, 37, "S")
    this.point_a_lon = new Longitude(174, 14, "E")
    this.point_b_lat = new Latitude(17, 18, "S")
    this.point_b_lon = new Longitude(176, 25, "E")
  }

  @action.bound
  toggleShowAnswer(e: Event) {
    e.preventDefault()
    this.showAnswer = !this.showAnswer
  }

  @action.bound
  randomise(e: Event) {
    e.preventDefault()

    this.point_a_lat = generateRandomLat()
    this.point_a_lon = generateRandomLon()
    this.point_b_lat = generateRandomLat()
    this.point_b_lon = generateRandomLon()
    this.showAnswer = false
  }
}

export default function (root: HTMLDivElement) {
  const globeContainer = document.createElement("div")
  globeContainer.classList.add("ParallelSailing__globe")
  const proforma = document.createElement("form")
  proforma.classList.add("ParallelSailing_proforma")

  const state = new PlaneSailingABState()

  root.appendChild(globeContainer)
  root.appendChild(proforma)

  const globeUpdate = Globe(globeContainer, {})

  autorun(() => {
    console.log("Runner")
    renderWithContext(proforma, <PlaneSailingABProforma state={state} />)

    globeUpdate({
      lines: [
        {
          type: "prediction",
          start_lat: state.point_a_lat.asFloat(),
          start_lon: state.point_a_lon.asFloat(),
          end_lat: state.point_b_lat.asFloat(),
          end_lon: state.point_b_lon.asFloat(),
        },
        {
          type: "calculation",
          start_lat: state.point_a_lat.asFloat(),
          start_lon: state.point_a_lon.asFloat(),
          end_lat: state.point_b_lat.asFloat(),
          end_lon: state.point_a_lon.asFloat(),
        },
        {
          type: "calculation",
          start_lat: state.point_b_lat.asFloat(),
          start_lon: state.point_a_lon.asFloat(),
          end_lat: state.point_b_lat.asFloat(),
          end_lon: state.point_b_lon.asFloat(),
        },
      ],
    })
  })
}

export function PlaneSailingABProforma(props: { state: PlaneSailingABState }) {
  const { state } = props
  const { localize: l10n } = useContext(RenderContext)

  let answerRender = null

  if (state.showAnswer) {
    const dlon = state.point_a_lon.getDlon(state.point_b_lon)
    const dlat = state.point_a_lat.getDlat(state.point_b_lat)
    const mlat = latFromFloat(
      (state.point_a_lat.asFloat() + state.point_b_lat.asFloat()) / 2
    )
    const departure = dlon.asMinutes() * cos(mlat.asFloat())
    const course_angle = atan(departure / dlat.asMinutes())
    const true_course = courseAngleToTrue(dlat.sign, course_angle, dlon.sign)
    const distance = dlat.asMinutes() / cos(course_angle)

    answerRender = (
      <tbody>
        <tr>
          <td>{"D'Lat"}</td>
          <td>{dlat.asString()}</td>
        </tr>
        <tr>
          <td>
            {"D'Lat"}
            <sub>{"min"}</sub>
          </td>
          <td>{dlat.asMinutes().toFixed(2) + "'"}</td>
        </tr>
        <tr>
          <td>{"D'Lon"}</td>
          <td>{dlon.asString()}</td>
        </tr>
        <tr>
          <td>
            {"D'Lon"}
            <sub>{"min"}</sub>
          </td>
          <td>{dlon.asMinutes().toFixed(2) + "'"}</td>
        </tr>
        <tr>
          <td>{"M'Lat"}</td>
          <td>{mlat.asString()}</td>
        </tr>
        <tr>
          <td>
            {"Departure"}
            <sub>{"nm"}</sub>
          </td>
          <td>
            {"D'Lon"}
            <sub>{"min"}</sub>
            {" * cos M'Lat"}
          </td>
        </tr>
        <tr>
          <td>
            {"Departure"}
            <sub>{"nm"}</sub>
          </td>
          <td>{departure.toFixed(2) + " nautical miles"}</td>
        </tr>
        <tr>
          <td>{"Course Angle"}</td>
          <td>
            {"tan"}
            <sup>{"-1"}</sup>
            {"(Departure / D'Lat"}
            <sub>{"min"}</sub>
            {")"}
          </td>
        </tr>
        <tr>
          <td>{"Course Angle"}</td>
          <td>{`${dlat.sign} ${course_angle.toFixed(1)}° ${dlon.sign}`}</td>
        </tr>
        <tr>
          <td>
            {"Distance"}
            <sub>{"nm"}</sub>
          </td>
          <td>
            {"D'Lat"}
            <sub>{"min"}</sub>
            {" * cos Course Angle"}
          </td>
        </tr>
        <tr>
          <td>
            {"Distance"}
            <sub>{"nm"}</sub>
          </td>
          <td>{`${distance.toFixed(2)} nautical miles`}</td>
        </tr>
        <tr>
          <td>{"Course"}</td>
          <td>{`${true_course.toFixed(1)}° T`}</td>
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
          <td>{l10n.t("plane_sailing_ab.origin_latitude")}</td>
          <td>
            <LatitudeInput lat={state.point_a_lat} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("plane_sailing_ab.origin_longitude")}</td>
          <td>
            <LongitudeInput lon={state.point_a_lon} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("plane_sailing_ab.destination_latitude")}</td>
          <td>
            <LatitudeInput lat={state.point_b_lat} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("plane_sailing_ab.destination_longitude")}</td>
          <td>
            <LongitudeInput lon={state.point_b_lon} />
          </td>
        </tr>
      </tbody>
      <tbody>
        <tr>
          <td></td>
          <td>
            <button onClick={state.toggleShowAnswer}>
              {l10n.t("show_answer")}
            </button>
          </td>
        </tr>
      </tbody>
      {answerRender}
    </table>
  )
}
