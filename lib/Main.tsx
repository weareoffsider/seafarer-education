import * as d3 from "d3"

// import PlaneSailingAtoB from "./sailings/PlaneSailingAtoB"
import ParallelSailing from "./sailings/ParallelSailing"

document.addEventListener("DOMContentLoaded", function (event) {
  const parallelSailing = document.querySelectorAll(".ParallelSailing")
  Array.from(parallelSailing).forEach(ParallelSailing)
})
