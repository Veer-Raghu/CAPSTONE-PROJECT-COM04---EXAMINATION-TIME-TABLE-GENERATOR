import React, { useRef, useState } from "react";
import styled from "styled-components";
import axios from "axios";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem;
  background: linear-gradient(135deg, #1e3c72, #2a5298);
  min-height: 100vh;
  font-family: "Poppins", sans-serif;
  color: #ffffff;
`;

const Header = styled.h1`
  margin-bottom: 2rem;
  color: #f1f1f1;
  font-size: 3rem;
  text-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  letter-spacing: 2px;
  text-transform: uppercase;
  animation: fadeIn 1s ease-in-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  width: 80%;
  margin-bottom: 2rem;
`;

const Card = styled.div`
  background: linear-gradient(145deg, #ffffff, #f8f8f8);
  border-radius: 20px;
  box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.15),
    -10px -10px 20px rgba(255, 255, 255, 0.8);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease-in-out;
  font-weight: 600;
  color: #2c3e50;
  font-size: 1.2rem;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 12px 12px 25px rgba(0, 0, 0, 0.2),
      -12px -12px 25px rgba(255, 255, 255, 0.8);
    background: linear-gradient(145deg, #f0f0f0, #e8e8e8);
  }

  &:active {
    transform: translateY(0);
    box-shadow: inset 5px 5px 10px rgba(0, 0, 0, 0.1),
      inset -5px -5px 10px rgba(255, 255, 255, 0.7);
  }
`;

const HiddenInput = styled.input`
  display: none;
`;

const Button = styled.button`
  padding: 1rem 3rem;
  background: linear-gradient(90deg, #ff5f6d, #ffc371);
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: bold;
  border: none;
  border-radius: 50px;
  cursor: pointer;
  box-shadow: 0 8px 15px rgba(0, 0, 0, 0.2);
  transition: all 0.3s ease-in-out;

  &:hover {
    background: linear-gradient(90deg, #ffc371, #ff5f6d);
    transform: translateY(-5px);
    box-shadow: 0 12px 20px rgba(0, 0, 0, 0.3);
  }

  &:active {
    transform: translateY(0);
    box-shadow: inset 0 4px 8px rgba(0, 0, 0, 0.2);
  }
`;

const Dashboard = () => {
  const studentFileInput = useRef(null);
  const invigilatorFileInput = useRef(null);
  const classroomFileInput = useRef(null);
  const subjectFileInput = useRef(null);
  const timingFileInput = useRef(null);

  const [files, setFiles] = useState({});

  const handleFileSelection = (type, event) => {
    const file = event.target.files[0];
    if (file) {
      setFiles((prev) => ({ ...prev, [type]: file }));
      alert(`Selected ${type} file: ${file.name}`);
    }
  };

  const handleGenerateTimetable = async () => {
    if (
      !files["Student Details"] ||
      !files["Invigilator Details"] ||
      !files["Classroom Details"] ||
      !files["Subject Details"] ||
      !files["Timing Details"]
    ) {
      alert(
        "Please upload all required files before generating the timetable."
      );
      return;
    }

    const formData = new FormData();
    for (const [key, file] of Object.entries(files)) {
      formData.append(key, file);
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/generate-timetable",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      console.log("Response from server:", response.data);
      alert(
        "Timetable generated successfully! Download it from the provided link."
      );
    } catch (error) {
      console.error("Error generating timetable:", error);
      alert("Failed to generate the timetable. Please try again.");
    }
  };

  return (
    <Container>
      <Header>Dashboard</Header>
      <CardGrid>
        <Card onClick={() => studentFileInput.current.click()}>
          Upload Student Details
          <HiddenInput
            type="file"
            ref={studentFileInput}
            onChange={(e) => handleFileSelection("Student Details", e)}
          />
        </Card>
        <Card onClick={() => invigilatorFileInput.current.click()}>
          Upload Invigilator Details
          <HiddenInput
            type="file"
            ref={invigilatorFileInput}
            onChange={(e) => handleFileSelection("Invigilator Details", e)}
          />
        </Card>
        <Card onClick={() => classroomFileInput.current.click()}>
          Upload Classroom Details
          <HiddenInput
            type="file"
            ref={classroomFileInput}
            onChange={(e) => handleFileSelection("Classroom Details", e)}
          />
        </Card>
        <Card onClick={() => subjectFileInput.current.click()}>
          Upload Subject Details
          <HiddenInput
            type="file"
            ref={subjectFileInput}
            onChange={(e) => handleFileSelection("Subject Details", e)}
          />
        </Card>
        <Card onClick={() => timingFileInput.current.click()}>
          Upload Timing Details
          <HiddenInput
            type="file"
            ref={timingFileInput}
            onChange={(e) => handleFileSelection("Timing Details", e)}
          />
        </Card>
      </CardGrid>
      <Button onClick={handleGenerateTimetable}>Generate Timetable</Button>
    </Container>
  );
};

export default Dashboard;
