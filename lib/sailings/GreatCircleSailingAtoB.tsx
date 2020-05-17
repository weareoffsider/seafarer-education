import { h, Component, createContext, Fragment } from "preact"
import { useContext } from "preact/hooks"
import { observable, computed, action } from "mobx"
import { useObserver, useObservable } from "mobx-react-lite"
import { RenderContext } from "../RenderContext"
import {
  sin,
  cos,
  tan,
  asin,
  acos,
  atan,
  courseAngleToTrue,
  Latitude,
  LatitudeInput,
  Longitude,
  LongitudeInput,
  latFromFloat,
  lonFromFloat,
} from "./Shared"

export class GreatCircleSailingAtoBState {
  @observable point_a_lat: Latitude
  @observable point_a_lon: Longitude
  @observable point_b_lat: Latitude
  @observable point_b_lon: Longitude
  @observable calcPole: "N" | "S"
  @observable limitingLatitude: number

  constructor() {
    this.point_a_lat = new Latitude(37, 48, "N")
    this.point_a_lon = new Longitude(122, 40, "W")
    this.point_b_lat = new Latitude(35, 40, "N")
    this.point_b_lon = new Longitude(141, 0, "E")
    this.calcPole = "N"
    this.limitingLatitude = 45
  }
}

export default function GreatCircleSailingAtoB() {
  const { localize: l10n } = useContext(RenderContext)
  const state = useObservable(new GreatCircleSailingAtoBState())

  return useObserver(() => {
    const startingPoints = (
      <Fragment>
        <label>{l10n.t("great_circle_sailing_ab.point_a")}</label>
        <LatitudeInput lat={state.point_a_lat} />{" "}
        <LongitudeInput lon={state.point_a_lon} />
        <br />
        <label>{l10n.t("great_circle_sailing_ab.point_b")}</label>
        <LatitudeInput lat={state.point_b_lat} />{" "}
        <LongitudeInput lon={state.point_b_lon} />
        <br />
        {"Calculation Pole: "}
        <select
          value={state.calcPole}
          onChange={(e) =>
            (state.calcPole = (e.target as HTMLInputElement).value as "N" | "S")
          }
        >
          <option value="N">{"N"}</option>
          <option value="S">{"S"}</option>
        </select>
        <br />
        <label>
          {l10n.t("great_circle_sailing_ab.limiting_latitude")}
          <input
            onChange={(e) =>
              (state.limitingLatitude = (e.target as HTMLInputElement).valueAsNumber)
            }
            type="number"
            min="0"
            value={state.limitingLatitude}
          />
        </label>
      </Fragment>
    )

    const poleLat = new Latitude(90, 0, state.calcPole)
    const dlon = state.point_a_lon.getDlon(state.point_b_lon)

    const PA = state.point_a_lat.getDlat(poleLat)
    const PB = state.point_b_lat.getDlat(poleLat)

    const measures = (
      <Fragment>
        <p>
          {`PA = ${PA.asString()}`}
          <br />
          {`PB = ${PB.asString()}`}
          <br />
          {`P = D'Long = ${dlon.asString()}`}
          <br />
        </p>
      </Fragment>
    )

    // const mlat = latFromFloat(
    //   (state.point_a_lat.asFloat() + state.point_b_lat.asFloat()) / 2
    // )
    // const departure = dlon.asMinutes() * cos(mlat.asDegrees())
    // const course_angle = atan(departure / dlat.asMinutes())
    // const true_course = courseAngleToTrue(dlat.sign, course_angle, dlon.sign)
    // const distance = dlat.asMinutes() / cos(course_angle)

    if (state.limitingLatitude != 0) {
      const limit_lat = latFromFloat(state.limitingLatitude)
      limit_lat.sign = poleLat.sign

      const PV = limit_lat.getDlat(poleLat)
      const PW = limit_lat.getDlat(poleLat)

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

      const initialTriangle = (
        <Fragment>
          <p>
            {`PVA`}
            <br />
            {`V = 90\u00b0, PA = ${PA.asString()}, PV = ${PV.asString()}`}
            <br />
            {`P = ${Pv.toFixed(3)}\u00b0`}
            <br />
            {`AV = ${AVDegs.toFixed(3)}\u00b0 = ${AVnm.toFixed(2)}'`}
            <br />
            {`Initial Course Angle = ${
              poleLat.sign
            } ${initialCourseAngle.toFixed(1)}\u00b0 ${dlon.sign}`}
            <br />
            {`Initial Course = ${initialTrueCourse.toFixed(1)}\u00b0 (T)`}
            <br />
          </p>
        </Fragment>
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

      const finalTriangle = (
        <Fragment>
          <p>
            {`PWB`}
            <br />
            {`W = 90\u00b0, PB = ${PB.asString()}, PW = ${PW.asString()}`}
            <br />
            {`P = ${Pw.toFixed(3)}\u00b0`}
            <br />
            {`BW = ${BWDegs.toFixed(3)}\u00b0 = ${BWnm.toFixed(2)}'`}
            <br />
            {`Final Course Angle = ${
              poleLat.sign == "N" ? "S" : "N"
            } ${finalCourseAngle.toFixed(1)}\u00b0 ${dlon.sign}`}
            <br />
            {`Final Course = ${finalTrueCourse.toFixed(1)}\u00b0 (T)`}
            <br />
          </p>
        </Fragment>
      )

      const Pvw = dlon.asDegrees() - Pw - Pv
      const WVDeparture = Pvw * 60 * cos(limit_lat.asDegrees())

      const parallelSailing = (
        <Fragment>
          <p>
            {`PVW`}
            <br />
            {`P = ${Pvw.toFixed(3)}\u00b0`}
            <br />
            {`Departure = VW = (P * 60) * Cos Limit Lat`}
            <br />
            {`VW = ${WVDeparture.toFixed(2)}nm`}
            <br />
          </p>
        </Fragment>
      )

      const total = WVDeparture + BWnm + AVnm

      const finals = (
        <Fragment>
          <p>
            {`Total Distance = AV + VW + WB`}
            <br />
            {`Total Distance = ${total.toFixed(2)}nm`}
            <br />
          </p>
        </Fragment>
      )

      return (
        <Fragment>
          <h1>{l10n.t("great_circle_sailing_ab.title")}</h1>
          <hr />
          {startingPoints}
          <hr />
          {measures}
          <hr />
          {initialTriangle}
          <hr />
          {finalTriangle}
          <hr />
          {parallelSailing}
          <hr />
          {finals}
        </Fragment>
      )
    } else {
      const distanceDegs = acos(
        cos(PA.asDegrees()) * cos(PB.asDegrees()) +
          sin(PA.asDegrees()) * sin(PB.asDegrees()) * cos(dlon.asDegrees())
      )

      const distance = distanceDegs * 60

      const initialCourseAngle = acos(
        (cos(PB.asDegrees()) - cos(PA.asDegrees()) * cos(distanceDegs)) /
          (sin(PA.asDegrees()) * sin(distanceDegs))
      )
      const finalCourseAngle = acos(
        (cos(PA.asDegrees()) - cos(PB.asDegrees()) * cos(distanceDegs)) /
          (sin(PB.asDegrees()) * sin(distanceDegs))
      )
      const initialTrueCourse = courseAngleToTrue(
        poleLat.sign,
        initialCourseAngle,
        dlon.sign
      )
      const finalTrueCourse = courseAngleToTrue(
        poleLat.sign == "N" ? "S" : "N",
        finalCourseAngle,
        dlon.sign
      )

      const calculation = (
        <Fragment>
          <p>
            <br />
            {`AB = Distance = cos`}
            <sup>{"-1"}</sup>
            {` (cos PA cos PB + sin PA sin PB cos P)`}
            <br />
            {`Distance = ${distance.toFixed(2)} = ${distanceDegs.toFixed(
              2
            )}\u00b0`}
            <br />
            {`Initial Course Angle = cos`}
            <sup>{"-1"}</sup>
            {` (cos PB - cos PA cos AB / sin PA sin AB)`}
            <br />
            {`Initial Course Angle = ${
              poleLat.sign
            } ${initialCourseAngle.toFixed(1)}\u00b0 ${dlon.sign}`}
            <br />
            {`Initial Course = ${initialTrueCourse.toFixed(1)}\u00b0 (T)`}
            <br />
            {`Final Course Angle = ${
              poleLat.sign == "N" ? "S" : "N"
            } ${finalCourseAngle.toFixed(1)}\u00b0 ${dlon.sign}`}
            <br />
            {`Final Course = ${finalTrueCourse.toFixed(1)}\u00b0 (T)`}
            <br />
          </p>
        </Fragment>
      )

      const Pv = asin(cos(90 - PA.asDegrees()) * cos(90 - initialCourseAngle))
      const v_lat = latFromFloat(
        poleLat.sign == "N" ? poleLat.asFloat() - Pv : poleLat.asFloat() + Pv
      )
      const v_dlon = lonFromFloat(
        atan(tan(90 - initialCourseAngle) / cos(PA.asDegrees()))
      )
      v_dlon.sign = dlon.sign

      const v_lon = lonFromFloat(state.point_a_lon.asFloat() + v_dlon.asFloat())

      const vertexCalculation = (
        <Fragment>
          <p>
            <br />
            {`Pv = sin`}
            <sup>{"-1"}</sup>
            {` (cos(90 - PA) * cos(90 - Initial Course Angle)`}
            <br />
            {`Pv = ${Pv.toFixed(4)}`}
            <br />
            {`V'Lat = ${v_lat.asString()}`}
            <br />
            {`D'Long V = tan`}
            <sup>{"-1"}</sup>
            {` (tan(90 - Initial Course Angle) / cos(PA)`}
            <br />
            {`D'Long V = ${v_dlon.asString()}`}
            <br />
            {`V'Lon = ${v_lon.asString()}`}
            <br />
          </p>
        </Fragment>
      )

      return (
        <Fragment>
          <h1>{l10n.t("great_circle_sailing_ab.title")}</h1>
          <hr />
          {startingPoints}
          <hr />
          {measures}
          <hr />
          {calculation}
          <hr />
          {vertexCalculation}
        </Fragment>
      )
    }
  })
}
