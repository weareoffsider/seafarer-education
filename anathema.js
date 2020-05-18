const anathema = require("./build-tasks/config.js")
const { createServer } = require("http-server")
const { exec } = require("child_process")

var gitRev = require("git-rev")
var del = require("del")

const scripts = require("./build-tasks/scripts.js")

anathema.task("clean", function (task) {
  const { buildRoot } = anathema.config.paths
  return del([anathema.rootDirectory + "/" + buildRoot + "/**/*"]).then(
    (paths) => {
      task.stats.filesMatched = task.stats.filesMatched.concat(paths)
      return true
    }
  )
})

anathema.task("docs", function (task) {
  return new Promise((resolve, reject) => {
    exec(
      `yarn docs`,
      {
        cwd: anathema.rootDirectory,
      },
      (err) => {
        if (err) {
          console.error(err)
          return reject(err)
        }
        resolve(true)
      }
    )
  })
    .then(() => {
      return task
        .srcFromString({
          name: "CNAME",
          data: "seafarer.education",
        })
        .output("build/html")
    })
    .then(() => {
      return task
        .srcFromString({
          name: ".nojekyll",
          data: "",
        })
        .output("build/html")
    })
})
anathema.watcher("docs", "docs/**/*", ["docs"], {
  runOnStart: true,
})

anathema.task("server", function (task) {
  const { buildHtmlRoot } = anathema.config.paths
  const server = createServer({
    root: anathema.rootDirectory + "/" + buildHtmlRoot,
    autoIndex: true,
  })
  server.listen(4000, "0.0.0.0")
  console.log("Webserver set up at 0.0.0.0:4000")
  return Promise.resolve(true)
})

anathema.dashboard("default", function (dashboard) {
  dashboard.task(["clean"])
  dashboard.task(["scripts"])
  dashboard.watch(["docs"])
  dashboard.monitor(["webpack"])
  dashboard.task(["server"])
})

module.exports = anathema
