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
} from "../sailings/Shared"

export class MeridianPassageState {
  @observable gp_dec: Latitude
  @observable gp_lon: Longitude
  @observable observation_altitude: number
  @observable observation_direction: "N" | "S"
  @observable showAnswer: boolean
  @observable showProforma: boolean

  constructor() {
    this.gp_dec = new Latitude(33, 51, "S")
    this.gp_lon = new Longitude(0, 0, "E")
    this.observation_altitude = 50.23
    this.observation_direction = "N"
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
    const direction = chance.pick(["N", "S"])

    this.gp_dec = latFromFloat(chance.floating({ min: -29, max: 29 }))
    // this.gp_lon = generateRandomLon()
    this.observation_direction = chance.pick(["N", "S"])

    const minAltitude =
      this.observation_direction != this.gp_dec.sign
        ? 90 - (90 - this.gp_dec.asDegrees())
        : 0

    this.observation_altitude = chance.floating({ min: minAltitude, max: 90 })

    this.showAnswer = false
    // this.showProforma = false
  }
}

export default function (root: HTMLDivElement) {
  const globeContainer = document.createElement("div")
  globeContainer.classList.add("MeridianPassage__globe")
  const proforma = document.createElement("form")
  proforma.classList.add("MeridianPassage_proforma")

  const state = new MeridianPassageState()

  root.appendChild(globeContainer)
  root.appendChild(proforma)

  const globeUpdate = Globe(globeContainer, {})

  autorun(render)
  window.requestAnimationFrame(render)

  function render() {
    renderWithContext(proforma, <MeridianPassageProforma state={state} />)

    const co_altitude = 90 - state.observation_altitude
    const dlat =
      state.observation_direction == "N"
        ? latFromFloat(co_altitude * -1)
        : latFromFloat(co_altitude * 1)

    const calc_lat = latFromFloat(state.gp_dec.asFloat() + dlat.asFloat())

    globeUpdate({
      lines: [
        {
          type: "calculation",
          start_lat: calc_lat.asFloat(),
          start_lon: state.gp_lon.asFloat() - 30,
          end_lat: calc_lat.asFloat(),
          end_lon: state.gp_lon.asFloat() + 30,
        },
        {
          type: "meridian",
          start_lat: state.gp_dec.asFloat(),
          start_lon: state.gp_lon.asFloat(),
          end_lat: calc_lat.asFloat(),
          end_lon: state.gp_lon.asFloat(),
        },
      ],
      points: [
        {
          type: "dot",
          lat: state.gp_dec.asFloat(),
          lon: state.gp_lon.asFloat(),
          text: "GP",
        },
        // {
        //   type: "dot",
        //   lat: state.point_b_lat.asFloat(),
        //   lon: state.point_b_lon.asFloat(),
        //   text: "Dest",
        // },
      ],
    })
  }
}

export function MeridianPassageProforma(props: {
  state: MeridianPassageState
}) {
  const { state } = props
  const { localize: l10n } = useContext(RenderContext)

  let proformaRender = null

  if (state.showProforma) {
    const co_altitude = 90 - state.observation_altitude
    const dlat =
      state.observation_direction == "N"
        ? latFromFloat(co_altitude * -1)
        : latFromFloat(co_altitude * 1)

    const calc_lat = latFromFloat(state.gp_dec.asFloat() + dlat.asFloat())

    proformaRender = (
      <tbody>
        <tr>
          <td>{"Co-Altitude"}</td>
          <td>{"90 - Observed Altitude"}</td>
        </tr>
        <tr>
          <td>{"Co-Altitude"}</td>
          {state.showAnswer && <td>{co_altitude.toFixed(8) + "°"}</td>}
        </tr>
        <tr>
          <td>{"D'Lat"}</td>
          {state.showAnswer && <td>{dlat.asString()}</td>}
        </tr>
        <tr>
          <td>{"Latitude"}</td>
          <td>{"Declination + D'Lat"}</td>
        </tr>
        <tr>
          <td>{"Latitude"}</td>
          {state.showAnswer && <td>{calc_lat.asString()}</td>}
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
          <td>{l10n.t("meridian_passage.gp_declination")}</td>
          <td>
            <LatitudeInput lat={state.gp_dec} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("meridian_passage.observation_altitude")}</td>
          <td>
            <input
              type="number"
              min="0"
              max="90"
              onChange={(e) =>
                (state.observation_altitude = parseFloat(
                  (e.target as HTMLInputElement).value
                ))
              }
              value={state.observation_altitude}
            />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("meridian_passage.observation_direction")}</td>
          <td>
            <select
              value={state.observation_direction}
              onChange={(e) =>
                (state.observation_direction = (e.target as HTMLInputElement)
                  .value as "N" | "S")
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
