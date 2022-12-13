// @ts-ignore
import { currentStory } from "./current";

// @ts-ignore
if (module.hot) {
  // @ts-ignore
  module.hot.accept("./current.js", () => {
    _cb?.(currentStory.story);
  });
}

let _cb: any;
export const registerCb = (cb: any) => {
  _cb = cb;
};

export function getCurrent() {
  return currentStory.story;
}
