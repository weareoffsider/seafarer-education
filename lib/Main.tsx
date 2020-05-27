import * as d3 from "d3"

import PlaneSailingAB from "./sailings/PlaneSailingAB"
import MercatorSailingAB from "./sailings/MercatorSailingAB"
import ParallelSailing from "./sailings/ParallelSailing"
import GreatCircleSailing from "./sailings/GreatCircleSailing"
import CompositeGreatCircleSailing from "./sailings/CompositeGreatCircleSailing"
import MeridianPassage from "./celestial/MeridianPassage"
import Amplitude from "./celestial/Amplitude"
import Azimuth from "./celestial/Azimuth"

document.addEventListener("DOMContentLoaded", function (event) {
  const parallelSailing = document.querySelectorAll(".ParallelSailing")
  Array.from(parallelSailing).forEach(ParallelSailing)
  const planeSailingAB = document.querySelectorAll(".PlaneSailingAB")
  Array.from(planeSailingAB).forEach(PlaneSailingAB)
  const mercatorSailingAB = document.querySelectorAll(".MercatorSailingAB")
  Array.from(mercatorSailingAB).forEach(MercatorSailingAB)
  const greatCircleSailing = document.querySelectorAll(".GreatCircleSailing")
  Array.from(greatCircleSailing).forEach(GreatCircleSailing)
  const compositeGreatCircleSailing = document.querySelectorAll(
    ".CompositeGreatCircleSailing"
  )
  Array.from(compositeGreatCircleSailing).forEach(CompositeGreatCircleSailing)
  const meridianPassage = document.querySelectorAll(".MeridianPassage")
  Array.from(meridianPassage).forEach(MeridianPassage)
  const amplitude = document.querySelectorAll(".Amplitude")
  Array.from(amplitude).forEach(Amplitude)
  const azimuth = document.querySelectorAll(".Azimuth")
  Array.from(azimuth).forEach(Azimuth)
})
