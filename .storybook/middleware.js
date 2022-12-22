const { middleware } = require("@nativescript/storybook");

module.exports = middleware();

// (app) => {
//   console.log(app);
//   app.post("/changeStory", (req) => {
//     console.log("CHANGE STORY", req);
//   });
// };
