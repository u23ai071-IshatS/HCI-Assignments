# Lab 9: MHP Typing Test & Analysis

This project implements a typing test application designed to analyze user performance based on the **Model Human Processor (MHP)** framework. It specifically compares typing speeds and error rates between English and Hindi languages, providing a breakdown of cognitive processing stages.

## Overview

The application is a React-based tool that allows users to:
1.  **Set up a Participant Profile**: Record ID, age, native language, and typing experience.
2.  **Perform Typing Tests**: Type given text passages in English and Hindi.
3.  **Analyze Performance**: View detailed metrics including WPM, accuracy, and MHP stage breakdown (Perception, Cognition, Motor, Correction).
4.  **Compare Languages**: Side-by-side comparison of performance metrics between English and Hindi.
5.  **Export Data**: Download test results as a CSV file for further analysis.

## Features

- **User Setup**: Collects demographic and experience data for context.
- **Dual-Language Support**: Includes standardized test texts for both English and Hindi.
- **Real-Time Metrics**:
  - Timer and error counter during the test.
  - Immediate calculation of WPM, Accuracy, and Time per Character.
- **MHP Analysis**:
  - Estimates time spent in different processing stages based on total time per character:
    - **Perception (30%)**
    - **Cognition (25%)**
    - **Motor (35%)**
    - **Error Correction (10%)**
- **Comparative Analysis**: Automatically calculates and displays the performance difference (percentage) between the two languages.
- **Data Export**: Generates a downloadable CSV file of all test runs.

## Project Structure

- **`code.js`**: Contains the main React component (`MHPTypingTest`) which handles the entire application logic, including state management, MHP calculations, and UI rendering.
- **`screenshots/`**: Directory containing visual evidence of the application in use:
  - `1.png`: Setup Screen
  - `2.png`: Language Selection
  - `3.png`: Typing Test Interface
  - `4.png`: Results and Analysis Dashboard
- **`LAB-9.pdf`**: Likely contains the lab assignment details or theoretical background.

## Getting Started

To run this project, you can include the `MHPTypingTest` component in a React application.

1.  **Prerequisites**:
    - Node.js and npm.
    - A React project setup.
    - `lucide-react` library for icons.

2.  **Installation**:
    If you are adding this to an existing project, ensure you have `lucide-react` installed:
    ```bash
    npm install lucide-react
    ```

3.  **Usage**:
    Import and use the component in your App:
    ```jsx
    import MHPTypingTest from './code';

    function App() {
      return (
        <div className="App">
          <MHPTypingTest />
        </div>
      );
    }
    ```

## How to Use

1.  **Setup**: Enter participant details (ID, Age, etc.) and click "Start Test".
2.  **Select Language**: Choose either "English Test" or "Hindi Test".
3.  **Typing Task**:
    - Read the text displayed in the gray box.
    - Type it exactly into the text area below.
    - The timer starts automatically.
    - Click "Finish Test" when done.
4.  **View Results**:
    - See your WPM, Accuracy, and the MHP stage breakdown.
    - Choose to "Take Another Test" (e.g., the other language) or "View Full Analysis".
5.  **Analysis & Export**:
    - In the Analysis view, compare your English vs. Hindi performance.
    - Click "Export CSV" to save your data.
