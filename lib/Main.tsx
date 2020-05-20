import * as d3 from "d3"

import PlaneSailingAB from "./sailings/PlaneSailingAB"
import MercatorSailingAB from "./sailings/MercatorSailingAB"
import ParallelSailing from "./sailings/ParallelSailing"
import GreatCircleSailing from "./sailings/GreatCircleSailing"
import CompositeGreatCircleSailing from "./sailings/CompositeGreatCircleSailing"

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
})
