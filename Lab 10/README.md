# Lab 10: A/B Testing Lab

This project implements a comprehensive A/B testing environment to compare two different User Interface (UI) designs using quantitative metrics. It integrates **Fitts' Law** predictions and **ANOVA (Analysis of Variance)** statistical analysis to evaluate user performance.

## Overview

The application is a React-based tool designed to conduct usability tests on two variations of a user registration form:
- **Version A**: A traditional, standard layout.
- **Version B**: A modern, compact layout with gradient styling.

The tool randomly assigns a version to each participant, tracks their interaction, and provides real-time statistical analysis to determine which design performs better.

## Features

- **A/B Test Execution**:
  - Random assignment of UI versions (A or B).
  - Participant ID tracking.
  - Real-time recording of completion time and errors.
- **Dual UI Implementations**:
  - **Version A**: Standard vertical form with explicit labels.
  - **Version B**: Compact form with placeholders and modern aesthetics.
- **Advanced Analytics**:
  - **Fitts' Law Integration**: Calculates Index of Difficulty (ID) and predicted Movement Time (MT) based on target size and distance.
  - **ANOVA Calculation**: Performs statistical significance testing (F-statistic, p-value check) to validate results.
- **Data Visualization**:
  - **Bar Charts**: Compare completion times between versions.
  - **Scatter Plots**: Visualize accuracy distribution across participants.
- **Data Export**: Download all test results as a CSV file.

## Project Structure

- **`code.js`**: Contains the main React component (`ABTestingUI`) which handles the test logic, UI rendering, data collection, and statistical analysis.
- **`screenshot/`**: Directory containing visual evidence of the application:
  - `1.png`: Setup Screen
  - `2.png`: Testing Interface (Version A)
  - `3.png`: Testing Interface (Version B)
  - `4.png`: Results Dashboard
  - `5.png`: Statistical Analysis View
- **`LAB-10.pdf`**: Likely contains the lab assignment details or theoretical background.

## Getting Started

To run this project, you can include the `ABTestingUI` component in a React application.

1.  **Prerequisites**:
    - Node.js and npm.
    - A React project setup.
    - `recharts` library for data visualization.
    - `lucide-react` library for icons.

2.  **Installation**:
    If you are adding this to an existing project, ensure you have the required libraries installed:
    ```bash
    npm install recharts lucide-react
    ```

3.  **Usage**:
    Import and use the component in your App:
    ```jsx
    import ABTestingUI from './code';

    function App() {
      return (
        <div className="App">
          <ABTestingUI />
        </div>
      );
    }
    ```

## How to Use

1.  **Setup**: Enter a unique **Participant ID** and click "Start Test".
2.  **Perform Task**:
    - The system will present either Version A or Version B.
    - Fill out the form fields (Name, Email, Age) as quickly and accurately as possible.
    - Click the submit button ("Submit Registration" or "Get Started").
3.  **Review**: After completion, you will be returned to the setup screen.
4.  **Analyze**:
    - Repeat the test with multiple participants to build a dataset.
    - View the **Test Results** section for tables and charts.
    - Check the **ANOVA Results** panel to see if there is a statistically significant difference between the two designs.
    - Use **Export CSV** to save the data for external reporting.
