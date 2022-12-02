import Vue from "nativescript-vue";
import { StorybookDevice } from "./storybook.ios";
import { toId } from "@storybook/csf";

const storiesMeta = new Vue({
  data: {
    storyMap: new Map(),
    stories: [],
    current: null,
    currentComponent: null,
  },
  watch: {
    current() {
      console.log("CURRENT CHANGE");
      if (!this.current) {
        return;
      }

      // @ts-ignore
      const id = this.current.storyId;

      if (this.storyMap.has(id)) {
        const meta = this.storyMap.get(id);
        console.log(meta);

        // @ts-ignore
        this.currentComponent = {
          id: meta.id,
          component: meta.component,
          args: {
            ...meta.args,
            // @ts-ignore
            ...this.current.args,
          },
        };
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
    storiesMeta.storyMap.set(story.id, {
      id: story.id,
      component: storyMeta.component,
      args: data[story.name].args,
    });
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
          <GridLayout row="1" backgroundColor="#fefefe" padding="16">
            <ContentView horizontalAlignment="left" verticalAlignment="top">
              <component v-if="currentComponent" :is="currentComponent.component" v-bind="currentComponent.args" :key="currentComponent.id" />
            </ContentView>
          </GridLayout>
        </GridLayout>
      `,
    }),
}).$start();
