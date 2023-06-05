const fs = require("fs");
const ytdl = require("ytdl-core");
const util = require("util");
const cron = require("node-cron");
// const youtube_id = "8sLS2knUa6Y";
// const youtube_link = `https://www.youtube.com/watch?v=${youtube_id}`;
const download = async (req, res) => {
  try {
    const options = {
      filter: "audioonly",
    };
    const youtube_link = `https://www.youtube.com/watch?v=${req.query.youtube_id}`;
    // Download the video with audio
    const unlinkAsync = util.promisify(fs.unlink);
    await new Promise((resolve, reject) => {
      ytdl(youtube_link, options)
        .pipe(fs.createWriteStream("output.mp3"))
        .on("finish", resolve)
        .on("error", reject);
    });

    console.log("Download completed");

    // Wait for 3 seconds
    // await new Promise((resolve) => setTimeout(resolve, 3000));

    // Delete the file
    cron.schedule("*/3 * * * * *", async () => {
      // Task to be executed every 3 seconds
      await unlinkAsync("output.mp3");
      console.log("File deleted successfully");
    });
    return res.file("output.mp3");
  } catch (error) {
    console.log(error);
  }
};

module.exports = download;
