import { h, Component, createContext, Fragment } from "preact"
import { useContext } from "preact/hooks"
import { observable, computed, action } from "mobx"
import { useObserver, useObservable } from "mobx-react-lite"
import { RenderContext } from "../RenderContext"
import {
  cos,
  acos,
  tan,
  atan,
  courseAngleToTrue,
  courseTrueToAngle,
  Latitude,
  LatitudeInput,
  Longitude,
  LongitudeInput,
  latFromFloat,
  lonFromFloat,
} from "./Shared"

export class PlaneSailingDRState {
  @observable point_a_lat: Latitude
  @observable point_a_lon: Longitude
  @observable course: number
  @observable speed: number
  @observable time: number

  constructor() {
    this.point_a_lat = new Latitude(12, 4.2, "S")
    this.point_a_lon = new Longitude(179, 24.3, "W")
    this.course = 243
    this.speed = 9
    this.time = 8
  }
}

export default function PlaneSailingDR() {
  const { localize: l10n } = useContext(RenderContext)
  const state = useObservable(new PlaneSailingDRState())

  return useObserver(() => {
    const startingPoints = (
      <Fragment>
        <label>{l10n.t("plane_sailing_dr.start")}</label>
        <LatitudeInput lat={state.point_a_lat} />{" "}
        <LongitudeInput lon={state.point_a_lon} />
        <br />
        <label>
          {l10n.t("plane_sailing_dr.course")}
          <input
            onChange={(e) =>
              (state.course = (e.target as HTMLInputElement).valueAsNumber)
            }
            type="number"
            max="360"
            min="0"
            value={state.course}
          />
        </label>
        <br />
        <label>
          {l10n.t("plane_sailing_dr.speed")}
          <input
            onChange={(e) =>
              (state.speed = (e.target as HTMLInputElement).valueAsNumber)
            }
            type="number"
            min="0"
            value={state.speed}
          />
        </label>
        <br />
        <label>
          {l10n.t("plane_sailing_dr.time")}
          <input
            onChange={(e) =>
              (state.time = (e.target as HTMLInputElement).valueAsNumber)
            }
            type="number"
            min="0"
            value={state.time}
          />
        </label>
        <br />
      </Fragment>
    )

    const distance = state.speed * state.time
    const [ca_lat, ca, ca_lon] = courseTrueToAngle(state.course)

    const measures = (
      <Fragment>
        <p>
          {`Distance = ${distance.toFixed(2)} nm`}
          <br />
          {`Course Angle = ${ca_lat} ${ca.toFixed(1)}\u00b0 ${ca_lon}`}
          <br />
        </p>
      </Fragment>
    )

    const dlat_deg = (distance * cos(ca)) / 60
    const dlat = latFromFloat(ca_lat == "S" ? dlat_deg * -1 : dlat_deg)
    const departure = dlat.asMinutes() * tan(ca)

    const mlat = latFromFloat(state.point_a_lat.asFloat() + dlat.asFloat() / 2)
    const dlon_deg = departure / cos(mlat.asDegrees()) / 60
    const dlon = lonFromFloat(ca_lon == "E" ? dlon_deg : dlon_deg * -1)

    const dest_lat = latFromFloat(state.point_a_lat.asFloat() + dlat.asFloat())
    const dest_lon = lonFromFloat(state.point_a_lon.asFloat() + dlon.asFloat())

    const calculation = (
      <Fragment>
        <p>
          {`D'Lat = Distance * Cos Course Angle`}
          <br />
          {`D'Lat = ${dlat.asString()} = ${dlat
            .asMinutes()
            .toFixed(2)} = ${dlat.asDegrees().toFixed(3)}\u00b0`}
          <br />
          {`Departure = D'Lat * Tan Course Angle`}
          <br />
          {`Departure = ${departure.toFixed(2)}nm`}
          <br />
          {`Mean Lat = ${mlat.asString()}`}
          <br />
          {`D'Lon = Departure / Cos Mean Lat`}
          <br />
          {`D'Lon = ${dlon.asString()} = ${dlon
            .asMinutes()
            .toFixed(2)} = ${dlon.asDegrees().toFixed(3)}\u00b0`}
          <br />
        </p>
        <hr />
        <p>{`Destination = ${dest_lat.asString()}, ${dest_lon.asString()}`}</p>
      </Fragment>
    )

    return (
      <Fragment>
        <h1>{l10n.t("plane_sailing_dr.title")}</h1>
        <hr />
        {startingPoints}
        <hr />
        {measures}
        <hr />
        {calculation}
        <hr />
      </Fragment>
    )
  })
}
