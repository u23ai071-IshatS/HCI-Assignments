# Lab 7: Fitts' Law UI Optimization Tool

This project implements an interactive experiment to demonstrate and test **Fitts' Law** in the context of User Interface (UI) design. It allows users to measure interaction speeds across different target configurations and demonstrates how optimizing layout based on Fitts' Law can improve user efficiency.

## Overview

The application is a React-based tool that guides users through two testing phases:
1.  **Original Layout**: A standard set of targets with varying sizes and distances.
2.  **Optimized Layout**: A reconfigured layout where frequently used or important targets are larger and placed closer to the starting position.

The tool collects data on movement time and accuracy, compares it against Fitts' Law predictions, and visualizes the performance gains achieved through optimization.

## Features

- **Interactive Testing Canvas**:
  - Visual start and target indicators.
  - Real-time tracking of clicks and errors.
  - "Setup", "Testing", and "Results" phases.
- **Fitts' Law Analysis**:
  - Automatic calculation of the **Index of Difficulty (ID)** for each target.
  - Comparison of **Actual Time** vs. **Predicted Time** (using Fitts' Law formula: $MT = a + b \cdot \log_2(D/W + 1)$).
- **Performance Visualization**:
  - **Bar Charts**: Visual comparison of actual vs. predicted times.
  - **Data Tables**: Detailed breakdown of size, distance, ID, and timing for each target.
  - **Optimization Comparison**: Side-by-side metrics showing percentage improvement in speed and error reduction between the original and optimized layouts.
- **Educational Content**: Built-in instructions explaining Fitts' Law concepts and the test procedure.

## Project Structure

- **`code.js`**: Contains the main React component (`FittsLawTester`) which handles the experiment logic, rendering, and data visualization.
- **`Results/`**: Directory containing screenshots of the test results and analysis:
  - `1.png`, `2.png`, `3.png`: Visual records of the experiment outcomes and charts.

## Getting Started

To run this project, you can include the `FittsLawTester` component in a React application.

1.  **Prerequisites**:
    - Node.js and npm.
    - A React project setup.
    - `recharts` library for data visualization.
    - `lucide-react` (if icons are used, though standard SVGs are used in the canvas).

2.  **Installation**:
    If you are adding this to an existing project, ensure you have `recharts` installed:
    ```bash
    npm install recharts
    ```

3.  **Usage**:
    Import and use the component in your App:
    ```jsx
    import FittsLawTester from './code';

    function App() {
      return (
        <div className="App">
          <FittsLawTester />
        </div>
      );
    }
    ```

## How to Use

1.  **Start the Test**: Read the instructions and click "Start Original Layout Test".
2.  **Perform Tasks**:
    - Click the **Green Start Circle**.
    - Quickly and accurately click the **Blue Target Circle**.
    - Repeat for all targets presented.
3.  **Analyze Results**: Review the charts and tables showing your performance against Fitts' Law predictions.
4.  **Test Optimization**: Proceed to the "Optimized Layout" test to see how design changes affect your speed.
5.  **Compare**: View the final comparison to understand the impact of UI optimization.
