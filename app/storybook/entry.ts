import Vue from "nativescript-vue";

import { toId } from "@storybook/csf";

const storiesMeta = new Vue({
  data: {
    storyMap: new Map(),
    stories: [],
  },
});

// @ts-ignore
const stories = require.context("../", true, /\.stories\.js$/);

stories.keys().forEach((key: string) => {
  console.log("STORY:", key);
  const data = stories(key);
  const storyMeta = data.default;
  const exports = Object.keys(data).filter((name) => name !== "default");

  console.log({
    title: storyMeta.title,
    exports: exports.map((name) => {
      return {
        id: toId(storyMeta.title, name),
        name,
      };
    }),
  });

  // console.log("ID:", id);
  // storiesMeta.storyMap.set()
  (storiesMeta.stories as any).push(storyMeta.component);
});

console.log();

new Vue({
  render: (h) =>
    h({
      computed: {
        currentComponent() {
          return storiesMeta.stories[0];
        },
      },
      template: `
        <GridLayout rows="auto, *">
          <Label text="Storybook entry!"/>
          <ContentView row="1" backgroundColor="#ccc">
            <component :is="currentComponent" />
          </ContentView>
        </GridLayout>
      `,
    }),
}).$start();
