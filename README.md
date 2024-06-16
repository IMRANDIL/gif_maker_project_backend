# Video to GIF Converter

This project is a simple web application that allows users to upload a video file, specify a start time and duration, and convert a segment of the video into a GIF. The application uses Express.js for the server, multer for file uploads, and fluent-ffmpeg for video processing.

## Features

- Upload video files in MP4, MPEG, or QuickTime formats.
- Specify the start time and duration for the GIF segment.
- Convert the specified segment of the video into a GIF.
- Enforce a maximum upload file size of 10 MB.

## Technologies Used

- Node.js
- Express.js
- multer
- fluent-ffmpeg
- HTML/CSS for the front end

## Getting Started

### Prerequisites

- Node.js and npm installed on your machine.
- ffmpeg installed on your machine. You can download it from [FFmpeg's official website](https://ffmpeg.org/download.html).

### Installation

1. Clone the repository:

   ```sh
   git clone https://github.com/your-username/video-to-gif-converter.git
   cd video-to-gif-converter
   ```

2. Install the dependencies:

   ```sh
   npm install
   ```

3. Ensure ffmpeg is installed and accessible in your system's PATH. You can check this by running:

   ```sh
   ffmpeg -version
   ```

### Running the Application

1. Start the server:

   ```sh
   node server.js
   ```

2. Open your web browser and navigate to `http://localhost:3001`.

## Project Structure

- `server.js`: Entry point for the application. Sets up the Express server, middleware, and routes.
- `routers/routes.js`: Defines the route handlers for the application.
- `utils/multerSetup.js`: Configures multer for handling file uploads with file size and format validation.
- `utils/videoProcessing.js`: Contains the function to create a GIF from a video segment.
- `public/index.html`: Simple HTML form for uploading video files and specifying GIF parameters.

## Usage

1. Open the web application in your browser.
2. Use the form to upload a video file.
3. Specify the start time (in seconds) and duration (in seconds) for the GIF segment.
4. Submit the form to convert the video segment to a GIF.
5. The resulting GIF will be displayed and available for download.

## Error Handling

- If an invalid file format or a file larger than 10 MB is uploaded, an error message will be displayed.
- If there is an issue with the GIF creation process, a 500 error will be returned with an appropriate message.



