module.exports = {
  stories: ["../**/*.stories.js"],
  addons: [
    "@storybook/addon-controls",
    // "@storybook/addon-links",
    // "@storybook/addon-essentials",
    // "@storybook/addon-interactions",
    "@nativescript/storybook"
  ],
  core: {
    builder: "webpack5",
  },
  framework: "@storybook/vue",
};
