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
  const story = data.default;

  console.log("DATA:", story);

  // const id = story.id ?? toId("story", story.title);

  // console.log("ID:", id);
  // storiesMeta.storyMap.set()
  (storiesMeta.stories as any).push(story.component);
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
