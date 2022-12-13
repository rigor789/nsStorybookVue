import { addons, types } from "@storybook/addons";
// import { ControllerManager } from "@storybook/native-controllers";

function debounce<T extends Function>(
  func: T,
  wait: number,
  immediate = false
): (...args: any[]) => void {
  var timeout;
  return function () {
    var context = this,
      args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (immediate && !timeout) func.apply(context, args);
  };
}

addons.register("NATIVESCRIPT", () => {
  let isListening = false;
  addons.add("STORYCHANGELISTENER", {
    title: "STORYCHANGELISTENER",
    type: types.TOOLEXTRA,
    render() {
      if (!isListening) {
        listenToStoryChange("ios");
        isListening = true;
      }

      return null as any;
    },
  });
});

function listenToStoryChange(targetPlatform) {
  addons.ready().then((channel) => {
    let currentStory: any = null;

    channel.addListener("setCurrentStory", (story) => {
      // console.log("setCurrentStory", story);
      currentStory = story;
      storyChange(currentStory);
    });
    channel.addListener("updateStoryArgs", (storyArgs) => {
      // console.log("updateStoryArgs", storyArgs);

      if (currentStory) {
        currentStory.args = {
          ...currentStory.args,
          ...storyArgs.updatedArgs,
        };

        storyChange(currentStory);
      }
    });
  });
}

function storyChange(story) {
  console.log("story change", story);

  updateDeepLink(story, "ios");
}

const updateDeepLink = debounce(
  (story: any, targetPlatform: "android" | "ios") => {
    // const manager = new ControllerManager();
    const context = targetPlatform;
    // const controller = manager.getController(context);
    const deepLinkBaseUrl = "sb-native://deep.link";
    // controller.updateConfig({
    //   settings: {
    //     device: targetPlatform,
    //   },
    //   platform: targetPlatform,
    //   baseUrl: deepLinkBaseUrl,
    // });
    const newAppUrl = getFullDeepLinkUrl(deepLinkBaseUrl, story);
    console.log(newAppUrl);

    try {
      fetch("http://localhost:3000/", {
        method: "POST",
        body: JSON.stringify({
          newAppUrl,
          story,
        }),
      });
      // controller.openDeepLink(newAppUrl);
    } catch (err) {
      // ignore
    }
  },
  1000
);

function getFullDeepLinkUrl(
  baseDeepLinkUrl: string,
  storyParams: Record<string, any>
): string {
  console.log(JSON.stringify(storyParams));
  return baseDeepLinkUrl + "?" + btoa(JSON.stringify(storyParams));
}
