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
  tan,
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

export class AzimuthState {
  @observable gp_dec: Latitude
  @observable gp_lon: Longitude
  @observable dr_lat: Latitude
  @observable dr_lon: Longitude
  @observable observation_direction: "E" | "W"
  @observable showAnswer: boolean
  @observable showProforma: boolean

  constructor() {
    // this.gp_dec = new Latitude(14, 21.6, "S")
    // this.gp_lon = new Longitude(27, 6.3, "E")
    // this.dr_lat = new Latitude(39, 16.8, "S")
    // this.dr_lon = new Longitude(0, 0, "E")

    this.gp_dec = new Latitude(48, 0, "N")
    this.gp_lon = new Longitude(87, 27, "W")
    this.dr_lat = new Latitude(42, 0, "N")
    this.dr_lon = new Longitude(63, 57, "W")
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

    this.dr_lat = generateRandomLat()
    this.dr_lon = generateRandomLon()
    this.gp_dec = generateRandomLat()
    this.gp_lon = lonFromFloat(
      this.dr_lon.asFloat() + chance.floating({ min: -80, max: 80 })
    )

    this.showAnswer = false
    // this.showProforma = false
  }
}

export default function (root: HTMLDivElement) {
  const globeContainer = document.createElement("div")
  globeContainer.classList.add("Azimuth__globe")
  const proforma = document.createElement("form")
  proforma.classList.add("Azimuth_proforma")

  const state = new AzimuthState()

  root.appendChild(globeContainer)
  root.appendChild(proforma)

  const globeUpdate = Globe(globeContainer, {})

  autorun(render)
  window.requestAnimationFrame(render)

  function render() {
    renderWithContext(proforma, <AzimuthProforma state={state} />)

    globeUpdate({
      circles: [
        {
          type: "prediction",
          start_lat: state.dr_lat.asFloat(),
          start_lon: state.dr_lon.asFloat(),
          end_lat: state.gp_dec.asFloat(),
          end_lon: state.gp_lon.asFloat(),
        },
      ],
      lines: [
        {
          type: "calculation",
          start_lat: state.dr_lat.asFloat(),
          start_lon: state.dr_lon.asFloat(),
          end_lat: state.dr_lat.sign == "N" ? 90 : -90,
          end_lon: state.dr_lon.asFloat(),
        },
        {
          type: "calculation",
          start_lat: state.gp_dec.asFloat(),
          start_lon: state.gp_lon.asFloat(),
          end_lat: state.dr_lat.sign == "N" ? 90 : -90,
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
        {
          type: "dot",
          lat: state.dr_lat.asFloat(),
          lon: state.dr_lon.asFloat(),
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

export function AzimuthProforma(props: { state: AzimuthState }) {
  const { state } = props
  const { localize: l10n } = useContext(RenderContext)

  let proformaRender = null

  if (state.showProforma) {
    // const angle = Math.abs(
    //   asin(sin(state.gp_dec.asFloat()) / cos(state.dr_lat.asFloat()))
    // )

    const LHA = state.dr_lon.getDlon(state.gp_lon)
    const A_modifier = LHA.asDegrees() > 90 ? 1 : -1
    const A = (tan(state.dr_lat.asFloat()) / tan(LHA.asDegrees())) * A_modifier
    const B = tan(state.gp_dec.asFloat()) / sin(LHA.asDegrees())
    const C = A + B
    const angle = atan(Math.pow(Math.abs(C) * cos(state.dr_lat.asFloat()), -1))
    const bearing = courseAngleToTrue(C > 0 ? "N" : "S", angle, LHA.sign)

    proformaRender = (
      <tbody>
        <tr>
          <td>{"LHA"}</td>
          {state.showAnswer && <td>{LHA.asString()}</td>}
        </tr>
        <tr>
          <td>{"A"}</td>
          <td>{"(tan Latitude / tan LHA) * " + A_modifier}</td>
        </tr>
        <tr>
          <td>{"A"}</td>
          {state.showAnswer && <td>{A}</td>}
        </tr>
        <tr>
          <td>{"B"}</td>
          <td>{"tan Declination / sin LHA"}</td>
        </tr>
        <tr>
          <td>{"B"}</td>
          {state.showAnswer && <td>{B}</td>}
        </tr>
        <tr>
          <td>{"C"}</td>
          <td>{"A + B"}</td>
        </tr>
        <tr>
          <td>{"C"}</td>
          {state.showAnswer && <td>{C}</td>}
        </tr>
        <tr>
          <td>{"Angle"}</td>
          <td>
            {"tan"}
            <sup>{"-1"}</sup>
            {"[(C * cos Latitude)"}
            <sup>{"-1"}</sup>
            {"]"}
          </td>
        </tr>
        <tr>
          <td>{"Az Angle"}</td>
          {state.showAnswer && (
            <td>
              {(C > 0 ? "N" : "S") + " " + angle.toFixed(1) + "° " + LHA.sign}
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
          <td>{l10n.t("azimuth.gp_declination")}</td>
          <td>
            <LatitudeInput lat={state.gp_dec} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("azimuth.gp_longitude")}</td>
          <td>
            <LongitudeInput lon={state.gp_lon} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("azimuth.dr_latitude")}</td>
          <td>
            <LatitudeInput lat={state.dr_lat} />
          </td>
        </tr>
        <tr>
          <td>{l10n.t("azimuth.dr_longitude")}</td>
          <td>
            <LongitudeInput lon={state.dr_lon} />
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
