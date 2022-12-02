function decode(base64String: string): string {
  const decodedData = NSData.alloc().initWithBase64EncodedStringOptions(
    base64String,
    0
  );
  const decodedString = NSString.alloc().initWithDataEncoding(
    decodedData,
    NSUTF8StringEncoding
  );

  return String(decodedString);
}
export function parseUrl(url: string) {
  if (!url) {
    return null;
  }
  // example url: sb-native://deep.link?eysadasdasd==

  const [_, base64Data] = url.match(/\?(.+)$/) ?? [];

  try {
    return JSON.parse(decode(base64Data));
  } catch {
    return "";
  }
}
