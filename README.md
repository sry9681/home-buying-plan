# Home Price Calculator and Savings Tracker

## Overview
This repository contains a JavaScript-based tool that helps users calculate their loan amount based on home price, down payment, and other financial inputs. Additionally, it visualizes the user's savings progress towards a specific goal using a dynamic line chart powered by Chart.js. The project also integrates Material Design Lite (MDL) for enhanced UI components.

![image](https://github.com/user-attachments/assets/241423d7-8778-404a-af08-abaa647d62ba)


## Features
- **Loan Calculation**: Automatically calculates the loan amount based on user input for home price and down payment.
- **Savings Tracker**: Visualizes monthly savings, total spent on home, cumulative savings, and a savings goal using an interactive line chart.
- **Goal Highlighting**: Marks the point when the savings goal is met with a special annotation on the chart.
- **Dynamic Updates**: Ensures real-time updates to both the loan amount display and the chart as users modify their inputs.

## How It Works
1. **Input Fields**: Users input values for home price, down payment, monthly costs, savings goal, etc.
2. **Loan Calculation**: The system calculates the loan amount based on these inputs.
3. **Chart Visualization**: A line chart is generated to track progress over time. The chart includes:
   - Monthly cost
   - Total spent on home
   - Cumulative savings
   - Savings goal (dashed line)
4. **Goal Met Highlight**: If the user reaches their savings goal, a special point is highlighted on the chart.
5. **Event Handling**: Changes in input fields trigger recalculations and updates to the UI and chart dynamically.

## Technologies Used
- **JavaScript**: For core functionality and dynamic content manipulation.
- **Chart.js**: To create interactive and responsive line charts.
- **Material Design Lite (MDL)**: For styling and enhancing user interface components.

## Getting Started
1. **Clone the Repository**
   ```bash
   git clone https://github.com/sry9681/home-buying-plan.git
   cd home-buying-plan
   ```
2. **Open in Browser**
   - Open `index.html` in your preferred browser to interact with the tool.
3. **Modify and Extend**
   - Feel free to modify the JavaScript code in `script.js` to add new features or customize existing ones.

## Directory Structure
```
home-price-calculator/
│
├── index.html        # Main HTML file for UI layout
├── script.js         # Core JavaScript logic for calculations and chart updates
└── README.md         # This readme file
```

## Contributing
Contributions are welcome! Here’s how you can help:
1. **Fork the Repository**
2. **Create a New Branch**: `git checkout -b feature/your-feature-name`
3. **Make Your Changes**
4. **Submit a Pull Request**

## Issues and Feedback
If you encounter any bugs or have suggestions for improvements, please open an issue on the repository page.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

By following this README, developers should be able to understand the purpose and functionality of the code, set up their environment, and contribute effectively to the project.
