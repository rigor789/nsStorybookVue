"use strict";
exports.__esModule = true;
var node_fs_1 = require("node:fs");
var node_http_1 = require("node:http");
var node_path_1 = require("node:path");
var hostname = "127.0.0.1";
var port = 3000;
var currentPath = (0, node_path_1.resolve)(__dirname, "../../app/storybook/current.js");
var cid = 0;
var server = (0, node_http_1.createServer)(function (req, res) {
    if (req.method !== "POST") {
        res.statusCode = 404;
        return;
    }
    console.log(req.url);
    var body = "";
    req.on("data", function (data) { return (body += data); });
    req.on("end", function () {
        try {
            var data = JSON.parse(body);
            console.log(data);
            (0, node_fs_1.writeFileSync)(currentPath, "export const currentStory = ".concat(JSON.stringify(data, null, 2)));
        }
        catch (err) {
            // handle...
        }
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.setHeader("Access-Control-Allow-Origin", "*");
        res.end(JSON.stringify({
            ok: true
        }));
    });
});
server.listen(port, hostname, function () {
    console.log("Server running at http://".concat(hostname, ":").concat(port, "/"));
});
