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
  courseAngleToTrue,
  amplitudeAngleToTrue,
  Latitude,
  LatitudeInput,
  Longitude,
  LongitudeInput,
  latFromFloat,
  lonFromFloat,
  generateRandomLat,
  generateRandomLon,
} from "../sailings/Shared"

export class AmplitudeState {
  @observable gp_dec: Latitude
  @observable gp_lon: Longitude
  @observable dr_lat: Latitude
  @observable observation_direction: "E" | "W"
  @observable showAnswer: boolean
  @observable showProforma: boolean

  constructor() {
    this.gp_dec = new Latitude(10, 0, "N")
    this.dr_lat = new Latitude(30, 0, "S")
    this.observation_direction = "E"
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
    this.dr_lat = generateRandomLat()
    this.observation_direction = chance.pick(["E", "W"])

    this.showAnswer = false
    // this.showProforma = false
  }
}

export default function (root: HTMLDivElement) {
  const globeContainer = document.createElement("div")
  globeContainer.classList.add("Amplitude__globe")
  const proforma = document.createElement("form")
  proforma.classList.add("Amplitude_proforma")

  const state = new AmplitudeState()

  root.appendChild(globeContainer)
  root.appendChild(proforma)

  const globeUpdate = Globe(globeContainer, {})

  autorun(render)
  window.requestAnimationFrame(render)

  function render() {
    renderWithContext(proforma, <AmplitudeProforma state={state} />)

    // const co_altitude = 90 - state.observation_altitude
    // const dlat =
    //   state.observation_direction == "N"
    //     ? latFromFloat(co_altitude * -1)
    //     : latFromFloat(co_altitude * 1)

    // const calc_lat = latFromFloat(state.gp_dec.asFloat() + dlat.asFloat())

    globeUpdate({
      circles: [
        {
          type: "prediction",
          start_lat: state.dr_lat.asFloat(),
          start_lon: 0,
          end_lat: state.gp_dec.asFloat(),
          end_lon: state.observation_direction == "E" ? 90 : -90,
        },
      ],
      lines: [
        {
          type: "calculation",
          start_lat: state.dr_lat.asFloat(),
          start_lon: 0,
          end_lat: state.gp_dec.sign == "N" ? 90 : -90,
          end_lon: 0,
        },
        {
          type: "calculation",
          start_lat: state.gp_dec.asFloat(),
          start_lon: state.observation_direction == "E" ? 90 : -90,
          end_lat: state.gp_dec.sign == "N" ? 90 : -90,
          end_lon: state.observation_direction == "E" ? 90 : -90,
        },
      ],
      points: [
        {
          type: "dot",
          lat: state.gp_dec.asFloat(),
          lon: state.observation_direction == "E" ? 90 : -90,
          text: "GP",
        },
        {
          type: "dot",
          lat: state.dr_lat.asFloat(),
          lon: 0,
          text: "DR",
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

export function AmplitudeProforma(props: { state: AmplitudeState }) {
  const { state } = props
  const { localize: l10n } = useContext(RenderContext)

  let proformaRender = null

  if (state.showProforma) {
    const angle = Math.abs(
      asin(sin(state.gp_dec.asFloat()) / cos(state.dr_lat.asFloat()))
    )
    const bearing = amplitudeAngleToTrue(
      state.observation_direction,
      angle,
      state.gp_dec.sign
    )

    proformaRender = (
      <tbody>
        <tr>
          <td>{"Angle"}</td>
          <td>
            {"sin"}
            <sup>{"-1"}</sup>
            {"(sin Declination / cos Latitude)"}
          </td>
        </tr>
        <tr>
          <td>{"Angle"}</td>
          {state.showAnswer && (
            <td>
              {state.observation_direction +
                " " +
                angle.toFixed(1) +
                "° " +
                state.gp_dec.sign}
            </td>
          )}
        </tr>
        <tr>
          <td>{"Bearing"}</td>
          {state.showAnswer && <td>{bearing.toFixed(1) + "° T"}</td>}
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
          <td>{l10n.t("amplitude.gp_declination")}</td>
          <td>
            <LatitudeInput lat={state.gp_dec} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("amplitude.dr_latitude")}</td>
          <td>
            <LatitudeInput lat={state.dr_lat} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("amplitude.observation_direction")}</td>
          <td>
            <select
              value={state.observation_direction}
              onChange={(e) =>
                (state.observation_direction = (e.target as HTMLInputElement)
                  .value as "E" | "W")
              }
            >
              <option value="E">{"E"}</option>
              <option value="W">{"W"}</option>
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
