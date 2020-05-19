import * as d3 from "d3"

import PlaneSailingAB from "./sailings/PlaneSailingAB"
import ParallelSailing from "./sailings/ParallelSailing"

document.addEventListener("DOMContentLoaded", function (event) {
  const parallelSailing = document.querySelectorAll(".ParallelSailing")
  Array.from(parallelSailing).forEach(ParallelSailing)
  const planeSailingAB = document.querySelectorAll(".PlaneSailingAB")
  Array.from(planeSailingAB).forEach(PlaneSailingAB)
})
