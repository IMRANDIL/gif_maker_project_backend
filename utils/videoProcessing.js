const ffmpeg = require('fluent-ffmpeg');
const path = require('path');

function getVideoDuration(inputVideoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputVideoPath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const duration = metadata.format.duration;
      resolve(duration);
    });
  });
}

/**
 * Retrieves the width of the video specified by the input path.
 * 
 * @param {string} inputVideoPath - The path to the input video file.
 * @returns {Promise<number>} - A promise that resolves with the width of the video.
 */
function getVideoWidth(inputVideoPath) {
  return new Promise((resolve, reject) => {
    ffmpeg.ffprobe(inputVideoPath, (err, metadata) => {
      if (err) {
        return reject(err);
      }
      const width = metadata.streams[0].width;
      resolve(width);
    });
  });
}

function createGif(inputVideoPath, outputGifPath, startTime, duration) {
  return new Promise((resolve, reject) => {
    const palettePath = path.join(__dirname, 'palette.png');

    // Step 1: Generate a color palette
    ffmpeg(inputVideoPath)
      .setStartTime(startTime)
      .duration(duration)
      .outputOptions([
        '-vf', `fps=15,scale=640:-1:flags=lanczos,palettegen`,
        '-y'
      ])
      .output(palettePath)
      .on('end', () => {
        // Step 2: Use the generated palette to create the GIF
        ffmpeg(inputVideoPath)
          .setStartTime(startTime)
          .duration(duration)
          .outputOptions([
            '-i', palettePath,
            '-lavfi', 'fps=15,scale=640:-1:flags=lanczos [x]; [x][1:v] paletteuse=dither=bayer:bayer_scale=3',
            '-gifflags', '+transdiff',
            '-y'
          ])
          .output(outputGifPath)
          .on('end', () => {
            console.log('GIF created successfully!');
            resolve();
          })
          .on('error', (err) => {
            console.error('Error: ' + err.message);
            reject(err);
          })
          .run();
      })
      .on('error', (err) => {
        console.error('Error generating palette: ' + err.message);
        reject(err);
      })
      .run();
  });
}

module.exports = { getVideoDuration, createGif };
