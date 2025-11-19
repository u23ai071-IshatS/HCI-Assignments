# Lab 8: E-Commerce Checkout Wireframe

This project implements a comprehensive e-commerce checkout flow wireframe using React. It is designed to simulate a real-world checkout experience while providing built-in tools for usability testing and performance analysis.

## Overview

The application guides users through a 7-step checkout process, from cart review to order confirmation. It features a "Test Mode" that allows evaluators to measure the time taken by users to complete each step, helping to identify usability bottlenecks.

## Features

- **Multi-Step Checkout**: A clear, linear process including:
  1.  Review Cart
  2.  Authentication (Sign In / Guest)
  3.  Shipping Address
  4.  Shipping Method
  5.  Payment Details
  6.  Review Order
  7.  Order Confirmation
- **Usability Testing Tools**:
  - **Test Mode**: Records the start and end time of the entire session and individual steps.
  - **Timing Analysis**: Displays elapsed time for the current session.
  - **Bottleneck Detection**: Automatically identifies and visualizes the steps that take the longest to complete.
  - **Results Log**: Keeps a history of test runs with total times.
- **Interactive UI**:
  - Real-time cart total calculation.
  - Form validation (e.g., disabling "Continue" until required fields are filled).
  - Responsive design using Tailwind CSS.
  - Visual progress bar.

## Project Structure

- **`code/`**: Contains the main source code (`App.js`) for the React application.
- **`diagrams/`**: Contains task analysis diagrams:
  - `CTT_Assignment8.png`: ConcurTaskTrees (CTT) diagram representing the task model.
  - `HTA_Assignment8.png`: Hierarchical Task Analysis (HTA) diagram breaking down the checkout process.
- **`Test screenshot/`**: Contains screenshots of the application during testing.

## Getting Started

To run this project locally:

1.  Navigate to the `code` directory.
2.  Install dependencies (assuming a standard React setup):
    ```bash
    npm install
    ```
    *Note: You may need to install `lucide-react` and `tailwindcss` if they are not already present in your environment.*
3.  Start the development server:
    ```bash
    npm start
    ```

## Usage

1.  **Standard Flow**: Click through the steps to experience the checkout process.
2.  **Testing**:
    - Click the **"Start Test"** button in the header.
    - Complete the checkout flow.
    - Upon reaching the "Order Confirmation" step, click **"Complete Test & Record Results"**.
    - View the timing breakdown and identified bottlenecks in the sidebar.
