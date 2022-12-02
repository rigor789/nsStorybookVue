import { addons } from "@storybook/addons";
import { ControllerManager } from "@storybook/native-controllers";
console.log("HERE")

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

listenToStoryChange("ios");

function storyChange(story) {
  console.log("story change", story);

  updateDeepLink(story, "ios");
}

function updateDeepLink(story: any, targetPlatform: "android" | "ios"): void {
  const manager = new ControllerManager();
  const context = targetPlatform;
  const controller = manager.getController(context);
  const deepLinkBaseUrl = "sb-native://deep.link";
  controller.updateConfig({
    settings: {
      device: targetPlatform,
    },
    platform: targetPlatform,
    baseUrl: deepLinkBaseUrl,
  });
  const newAppUrl = getFullDeepLinkUrl(deepLinkBaseUrl, story);
  console.groupCollapsed("Generating deeplink");
  console.log("newAppUrl", newAppUrl);
  console.groupEnd();
  controller.openDeepLink(newAppUrl);
}

function getFullDeepLinkUrl(
  baseDeepLinkUrl: string,
  storyParams: Record<string, any>
): string {
  return baseDeepLinkUrl + "?" + btoa(JSON.stringify(storyParams));
}
