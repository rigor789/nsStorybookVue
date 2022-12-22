const { resolve } = require('path')

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
  webpackFinal (config) {
    config.plugins = config.plugins.filter(plugin => {
      const name = plugin.constructor.name;
      return name !== 'VueLoaderPlugin';
    })

    config.module.rules = config.module.rules.filter(rule => {
      const loader = rule.loader || ''
      return !loader.includes('vue-loader');
    })

    config.module.rules.push({
      test: /\.vue$/,
      type: 'asset/source'
    })

    config.resolve.alias = {
      ...config.resolve.alias,
      '~': resolve(__dirname, '../src/'),
    }

    console.log(config)
    return config
  }
};
