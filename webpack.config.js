const webpack = require("@nativescript/webpack");
const { IgnorePlugin } = require("webpack");

module.exports = (env) => {
  webpack.init(env);

  // Learn how to customize:
  // https://docs.nativescript.org/webpack

  webpack.chainWebpack((config, env) => {
    if (env.storybook) {
      config
        .entry("bundle")
        .clear()
        .add("@nativescript/core/globals/index.js")
        .add("@nativescript/core/bundle-entry-points")
        .add("./app/storybook/entry.ts");

      config.module.rule("bundle").test(webpack.Utils.project.getProjectFilePath("./app/storybook/entry.ts"));

      if (webpack.Utils.platform.getPlatformName() === "android") {
        config
          .entry("bundle")
          .add("@nativescript/core/ui/frame")
          .add("@nativescript/core/ui/frame/activity");
      }
    } else {
      config.plugin("IgnorePlugin|storybook").use(IgnorePlugin, [
        {
          checkResource: (resource, context) => {
            if (context === webpack.Utils.platform.getEntryDirPath()) {
              if (/\.stories\.(ts|js)$/.test(resource)) {
                return true;
              }
            }
            return false;
          },
        },
      ]);
    }
  });

  return webpack.resolveConfig();
};
