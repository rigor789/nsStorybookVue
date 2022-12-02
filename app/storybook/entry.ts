import Vue from "nativescript-vue";
import { StorybookDevice } from "./storybook.ios";
import { toId } from "@storybook/csf";

const storiesMeta = new Vue({
  data: {
    storyMap: new Map(),
    stories: [],
    current: null,
    currentComponent: null
  },
  watch: {
    current() {
      console.log("CURRENT CHANGE");
      if (!this.current) {
        return;
      }

      console.log(this.current);
      // @ts-ignore
      const id = this.current.storyId;

      console.log(id, this.storyMap.has(id));

      if (this.storyMap.has(id)) {
        const meta = this.storyMap.get(id);
        console.log(meta);

        this.currentComponent = meta.component;
      }
    },
  },
});

// @ts-ignore
const stories = require.context("../", true, /\.stories\.js$/);

stories.keys().forEach((key: string) => {
  console.log("STORY:", key);
  const data = stories(key);
  const storyMeta = data.default;
  const exports = Object.keys(data).filter((name) => name !== "default");

  const storiesInFile: any = exports.map((name: string) => {
    return {
      id: toId(storyMeta.title, name),
      name,
    };
  });

  storiesInFile.forEach((story: any) => {
    storiesMeta.storyMap.set(story.id, storyMeta);
  });
});

StorybookDevice.init((story: any) => {
  console.log("SWITCH STORY", story);
  storiesMeta.current = story;
});

new Vue({
  render: (h) =>
    h({
      computed: {
        currentComponent() {
          return storiesMeta.currentComponent;
        },
      },
      template: `
        <GridLayout rows="auto, *">
          <Label text="Storybook entry!"/>
          <ContentView row="1" backgroundColor="#ccc">
            <component v-if="currentComponent" :is="currentComponent" />
          </ContentView>
        </GridLayout>
      `,
    }),
}).$start();
