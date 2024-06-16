const ffmpeg = require('fluent-ffmpeg');

function createGif(inputVideoPath, outputGifPath, startTime, duration) {
  return new Promise((resolve, reject) => {
    ffmpeg(inputVideoPath)
      .setStartTime(startTime)  // Start time in seconds
      .duration(duration)       // Duration in seconds
      .outputOptions([
        '-vf', 'fps=10,scale=320:-1:flags=lanczos',
        '-gifflags', '+transdiff',
        '-y'  // Overwrite output files
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
  });
}

module.exports = { createGif };
