import { writeFileSync } from "node:fs";
import { createServer } from "node:http";
import { resolve } from "node:path";

const hostname = "127.0.0.1";
const port = 3000;

const currentPath = resolve(__dirname, "../../app/storybook/current.js");

let cid = 0;
const server = createServer((req, res) => {
  if (req.method !== "POST") {
    res.statusCode = 404;
    return;
  }

  console.log(req.url);

  let body = "";
  req.on("data", (data) => (body += data));
  req.on("end", () => {
    try {
      let data = JSON.parse(body);
      console.log(data);
      writeFileSync(
        currentPath,
        `export const currentStory = ${JSON.stringify(data, null, 2)}`
      );
    } catch (err) {
      // handle...
    }

    res.statusCode = 200;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(
      JSON.stringify({
        ok: true,
      })
    );
  });
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
