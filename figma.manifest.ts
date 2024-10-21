// https://www.figma.com/plugin-docs/manifest/
export default {
  name: "AICollab4Coupling-Dev",
  id: "1430085371827286872",
  api: "1.0.0",
  main: "plugin.js",
  ui: "index.html",
  "documentAccess": "dynamic-page",
  "networkAccess": {
    "allowedDomains": [
      "*"
    ],
    "reasoning": "dev"
  },
  capabilities: [],
  enableProposedApi: false,
  editorType: ["figma", "figjam"],
};
