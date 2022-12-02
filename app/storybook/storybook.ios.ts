import { Application } from "@nativescript/core";
import { parseUrl } from "./utils/url";

export class StorybookDevice {
  public static init(cb: any): void {
    @NativeClass()
    class UIApplicationDelegateImpl
      extends UIResponder
      implements UIApplicationDelegate
    {
      public static ObjCProtocols = [UIApplicationDelegate];
    }
    Application.ios.delegate = UIApplicationDelegateImpl;

    const appDelegate = Application.ios.delegate;

    function enableMultipleOverridesFor(
      classRef: any,
      methodName: string,
      nextImplementation: any
    ) {
      const currentImplementation = classRef.prototype[methodName];
      classRef.prototype[methodName] = function () {
        const result =
          currentImplementation &&
          currentImplementation.apply(
            currentImplementation,
            Array.from(arguments)
          );
        return nextImplementation.apply(
          nextImplementation,
          Array.from(arguments).concat([result])
        );
      };
    }

    enableMultipleOverridesFor(
      appDelegate,
      "applicationOpenURLOptions",
      function (application: UIApplication, url: NSURL, options: any): boolean {
        const lastArgument = arguments[arguments.length - 1];
        const previousResult =
          lastArgument !== options ? lastArgument : undefined;

        if (!previousResult) {
          const data = parseUrl(url.absoluteString);
          cb?.(data);
          return true;
        }

        return previousResult;
      }
    );
  }
}
