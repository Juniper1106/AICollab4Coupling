// https://www.figma.com/plugin-docs/manifest/
export default {
  name: "Figma-Plugin-React-Vite",
  id: "1419651496336343854",
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
