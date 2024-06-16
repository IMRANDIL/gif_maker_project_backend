import React, { useState, useRef } from 'react';
import axios from 'axios';
import styled, { keyframes } from 'styled-components';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: linear-gradient(135deg, #6e8efb, #a777e3);
  height: 100vh; /* Use full viewport height */
  color: #fff;
  overflow: auto; /* Allow scrolling if content overflows */
`;

const animateBorder = keyframes`
  0% {
    border-color: #6e8efb;
  }
  25% {
    border-color: #a777e3;
  }
  50% {
    border-color: #ff7e5f;
  }
  75% {
    border-color: #feb47b;
  }
  100% {
    border-color: #6e8efb;
  }
`;

const Title = styled.h1`
  font-size: 2.5em;
  margin-bottom: 8px;
  padding: 10px;
  border: 4px solid;
  border-radius: 10px;
  animation: ${animateBorder} 4s linear infinite;
`;

const Form = styled.form`
  background: rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const Label = styled.label`
  margin-bottom: 10px;
  font-size: 1.2em;
`;

const Input = styled.input`
  margin-bottom: 20px;
  padding: 10px;
  border: none;
  border-radius: 5px;
  font-size: 1em;
`;

const Button = styled.button`
  background: #ff7e5f;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  font-size: 1.2em;
  color: #fff;
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #feb47b;
  }
`;

const GifContainer = styled.div`
  margin-top: 30px;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Gif = styled.img`
  max-width: 100%;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  margin-right: 10px;
  margin-left: 10px;
`;

const DownloadLink = styled.a`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: #ff7e5f;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease;

  &:hover {
    background: #feb47b;
  }
`;

const ResetLink = styled.button`
  display: inline-block;
  margin-top: 20px;
  padding: 10px 20px;
  background: red;
  color: #fff;
  text-decoration: none;
  border-radius: 5px;
  transition: background 0.3s ease;
  cursor: pointer;
  outline: none;
  border: none;  /* Add this line to remove any border */

  &:hover {
    background: #feb47b;
  }
`;

const UploadForm = () => {
  const [videoFile, setVideoFile] = useState(null);
  const [startTime, setStartTime] = useState(0);
  const [duration, setDuration] = useState(5);
  const [gifUrl, setGifUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    setVideoFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('video', videoFile);
    formData.append('startTime', startTime);
    formData.append('duration', duration);

    try {
      const response = await axios.post('http://localhost:3001/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const fixedGifUrl = response.data.gifUrl.replace(/\\/g, '/');
      setGifUrl(fixedGifUrl);
      fileInputRef.current.value = ''; // Clear the file input
      setVideoFile(null); // Clear the video file state
    } catch (error) {
      toast.error('Error creating GIF: ' + error.message); // Show error toast
      fileInputRef.current.value = ''; // Clear the file input
      setVideoFile(null); // Clear the video file state
    }
  };

  return (
    <Container>
      <Title>GiphyMania</Title>
      <ToastContainer /> {/* Add this line */}
      {!gifUrl && (
        <Form onSubmit={handleSubmit}>
          <Label htmlFor="video">Video file:</Label>
          <Input
            type="file"
            name="video"
            id="video"
            onChange={handleFileChange}
            ref={fileInputRef}
            required
          />
          <Label htmlFor="startTime">Start time (seconds):</Label>
          <Input
            type="number"
            name="startTime"
            id="startTime"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
          <Label htmlFor="duration">Duration (seconds):</Label>
          <Input
            type="number"
            name="duration"
            id="duration"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />
          <Button type="submit">Create GIF</Button>
        </Form>
      )}

      {gifUrl && (
        <GifContainer>
          <h2 style={{ marginBottom: '8px' }}>Generated GIF</h2>
          <Gif src={gifUrl} alt="Generated GIF" />
          <DownloadLink href={`http://localhost:3001/download/${gifUrl.split('/').pop()}`} download="output.gif" onClick={() => setGifUrl(null)}>
            Download GIF
          </DownloadLink>
          <ResetLink onClick={() => setGifUrl(null)}>
            Reset
          </ResetLink>
        </GifContainer>
      )}
    </Container>
  );
};

export default UploadForm;
