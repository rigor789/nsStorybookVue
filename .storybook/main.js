module.exports = {
  stories: [
    "../**/*.stories.js"
  ],
  addons: [
    "@storybook/addon-links",
    "@storybook/addon-essentials",
    "@storybook/addon-interactions",
  ],
  core: {
    builder: 'webpack5',
  },
  // "framework": "@storybook/vue"
};
