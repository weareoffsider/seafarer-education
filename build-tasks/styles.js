const anathema = require("./config")
const path = require("path")
const postcss = require("postcss")
const autoprefixer = require("autoprefixer")
const less = require("less")
const CleanCSS = require("clean-css")
const customProperties = require("postcss-custom-properties")

const { src } = anathema.config.paths
const projectName = anathema.config.projectName

anathema.watcher("styles", src + "/**/*.{less,lass}", ["styles"], {
  runOnStart: true,
})
anathema.task("styles", function (task) {
  const { staticOut } = anathema.config.paths
  return Promise.all([
    task
      .src(src + "/{Main,admin}.less")
      .transform(
        (file) => {
          // clear less cache
          less.environment.fileManagers.forEach((fm) => {
            fm.contents = {}
          })
          return less.render(file.data, {
            paths: path.dirname(file.originalPath),
            strictMath: true,
            filename: file.originalPath,
            sourcemap: true,
            useFileCache: false,
          })
        },
        (file, out) => {
          return postcss([
            autoprefixer({
              overrideBrowserslist: "ie >= 10",
            }),
            customProperties({
              preserve: true,
            }),
          ]).process(out.css, {
            from: undefined,
          })
        },
        (file, out) => {
          if (anathema.config.packed) {
            const minifyOutput = new CleanCSS({ level: 2 }).minify(out.css)
            file.data = minifyOutput.styles
          } else {
            file.data = out.css
          }

          if (file.name == "Main.less") {
            file.name = projectName + "Main.css"
          } else {
            file.name = file.name.replace(".less", ".css")
          }
        }
      )
      .output(staticOut),
    task.src("node_modules/mocha/mocha.css").output(staticOut),
  ])
})
