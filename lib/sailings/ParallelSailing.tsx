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

export class ParallelSailingState {
  @observable latitude: Latitude
  @observable point_a_lon: Longitude
  @observable point_b_lon: Longitude
  @observable showAnswer: boolean

  constructor() {
    this.latitude = new Latitude(18, 37, "N")
    this.point_a_lon = new Longitude(160, 14, "E")
    this.point_b_lon = new Longitude(125, 25, "E")
  }

  @action.bound
  toggleShowAnswer(e: Event) {
    e.preventDefault()
    this.showAnswer = !this.showAnswer
  }

  @action.bound
  randomise(e: Event) {
    e.preventDefault()

    this.latitude = generateRandomLat()
    this.point_a_lon = generateRandomLon()
    this.point_b_lon = generateRandomLon()
    this.showAnswer = false
  }
}

export default function (root: HTMLDivElement) {
  const globeContainer = document.createElement("div")
  globeContainer.classList.add("ParallelSailing__globe")
  const proforma = document.createElement("form")
  proforma.classList.add("ParallelSailing_proforma")

  const state = new ParallelSailingState()

  root.appendChild(globeContainer)
  root.appendChild(proforma)

  const globeUpdate = Globe(globeContainer, {
    lines: [
      {
        type: "prediction",
        start_lat: 20,
        start_lon: 160,
        end_lat: 20,
        end_lon: 130,
      },
    ],
  })

  autorun(() => {
    console.log("Runner")
    renderWithContext(proforma, <ParallelSailingProforma state={state} />)

    globeUpdate({
      lines: [
        {
          type: "prediction",
          start_lat: state.latitude.asFloat(),
          start_lon: state.point_a_lon.asFloat(),
          end_lat: state.latitude.asFloat(),
          end_lon: state.point_b_lon.asFloat(),
        },
      ],
    })
  })
}

export function ParallelSailingProforma(props: {
  state: ParallelSailingState
}) {
  const { state } = props
  const { localize: l10n } = useContext(RenderContext)

  let answerRender = null

  if (state.showAnswer) {
    const dlon = state.point_a_lon.getDlon(state.point_b_lon)
    const departure = dlon.asMinutes() * cos(state.latitude.asFloat())
    const course = dlon.sign == "E" ? "90° T" : "270° T"

    answerRender = (
      <tbody>
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
          <td>
            {"Departure"}
            <sub>{"nm"}</sub>
          </td>
          <td>
            {"D'Lon"}
            <sub>{"min"}</sub>
            {" * cos Latitude"}
          </td>
        </tr>
        <tr>
          <td>{"Distance"}</td>
          <td>{departure.toFixed(2) + " nautical miles"}</td>
        </tr>
        <tr>
          <td>{"Course"}</td>
          <td>{course}</td>
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
          <td>{l10n.t("parallel_sailing.sailing_latitude")}</td>
          <td>
            <LatitudeInput lat={state.latitude} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("parallel_sailing.origin_longitude")}</td>
          <td>
            <LongitudeInput lon={state.point_a_lon} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("parallel_sailing.destination_longitude")}</td>
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
