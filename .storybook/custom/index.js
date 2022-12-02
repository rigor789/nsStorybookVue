"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
exports.__esModule = true;
var addons_1 = require("@storybook/addons");
var native_controllers_1 = require("@storybook/native-controllers");
console.log("HERE");
function listenToStoryChange(targetPlatform) {
    addons_1.addons.ready().then(function (channel) {
        var currentStory = null;
        channel.addListener("setCurrentStory", function (story) {
            // console.log("setCurrentStory", story);
            currentStory = story;
            storyChange(currentStory);
        });
        channel.addListener("updateStoryArgs", function (storyArgs) {
            // console.log("updateStoryArgs", storyArgs);
            if (currentStory) {
                currentStory.args = __assign(__assign({}, currentStory.args), storyArgs.updatedArgs);
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
function updateDeepLink(story, targetPlatform) {
    var manager = new native_controllers_1.ControllerManager();
    var context = targetPlatform;
    var controller = manager.getController(context);
    var deepLinkBaseUrl = "sb-native://deep.link";
    controller.updateConfig({
        settings: {
            device: targetPlatform
        },
        platform: targetPlatform,
        baseUrl: deepLinkBaseUrl
    });
    var newAppUrl = getFullDeepLinkUrl(deepLinkBaseUrl, story);
    console.groupCollapsed("Generating deeplink");
    console.log("newAppUrl", newAppUrl);
    console.groupEnd();
    controller.openDeepLink(newAppUrl);
}
function getFullDeepLinkUrl(baseDeepLinkUrl, storyParams) {
    return baseDeepLinkUrl + "?" + btoa(JSON.stringify(storyParams));
}
