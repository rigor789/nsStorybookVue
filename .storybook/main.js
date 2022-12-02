module.exports = {
  stories: ["../**/*.stories.js"],
  addons: [
    "@storybook/addon-controls",
    // "@storybook/addon-links",
    // "@storybook/addon-essentials",
    // "@storybook/addon-interactions",
    "@storybook/native-addon/dist/register.js",
    "./custom/register.js"
  ],
  core: {
    builder: "webpack5",
  },
  framework: "@storybook/vue",
};
