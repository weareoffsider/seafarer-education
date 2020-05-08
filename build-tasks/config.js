var { Anathema } = require("anathema")
let anathema = new Anathema()

anathema.config = {
  projectName: "Seafarer",
  serverAppName: "seafarer-education",
  paths: {
    docSrc: "docs",
    src: "lib",
    staticOut: "build/assets",
    buildRoot: "build",
    buildHtmlRoot: "build/html",
  },
  packed: false,
}

module.exports = anathema
