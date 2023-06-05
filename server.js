"use strict";
require("dotenv/config");
const download = require("./download");
const Hapi = require("@hapi/hapi");
const Joi = require("joi");
const Path = require("path");

const init = async () => {
  const server = Hapi.server({
    port: process.env.PORT || 3000,
    host: process.env.HOST || "localhost",
    routes: {
      files: {
        relativeTo: Path.join(__dirname, ""),
      },
    },
  });
  await server.register(require("@hapi/inert"));
  server.route({
    method: "GET",
    path: "/get_audio",
    options: {
      validate: {
        query: Joi.object({
          youtube_id: Joi.string().required(),
        }),
      },
    },
    handler: download,
  });
  await server.start();
  console.log("Server running on %s", server.info.uri);
};

process.on("unhandledRejection", (err) => {
  console.log(err);
  process.exit(1);
});

init();
