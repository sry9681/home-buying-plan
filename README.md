# Housing Investment Plan and Calculator

## Overview
This repository contains a Django-based web application that helps users calculate their loan amount based on home price, down payment, and other financial inputs. Additionally, it visualizes the user's savings progress towards a specific goal using a dynamic line chart powered by Chart.js. The project also integrates Material Design Lite (MDL) for enhanced UI components.

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
- **Django**: The web framework for perfectionists with deadlines.
- **JavaScript**: For core functionality and dynamic content manipulation.
- **Chart.js**: To create interactive and responsive line charts.
- **Material Design Lite (MDL)**: For styling and enhancing user interface components.

## Getting Started
To get a local copy up and running follow these simple steps.

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sry9681/home-buying-plan.git
   cd home-buying-plan
   ```
2. **Set Up a Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```
4. **Run Migrations**
   ```bash
   python manage.py migrate
   ```
5. **Start the Development Server**
   ```bash
   python manage.py runserver
   ```
6. **Open Web Browser**
   - Navigate to `http://127.0.0.1:8000/` to view the application.

## Directory Structure
```
home-buying-plan/
│
├── realestateapp/ # Django app directory
│ ├── static/ # Static files like CSS and JavaScript
│ ├── templates/ # Template files
│ ├── admin.py # Admin site configuration
│ ├── models.py # Database models
│ ├── views.py # Views for handling requests
│ └── ...
├── homeBuyersPlan/ # Django project directory
│ ├── settings.py # Django settings
│ ├── urls.py # Project URLs
│ └── ...
├── manage.py # Command-line utility for administrative tasks
├── requirements.txt # Project dependencies
└── README.md # This readme file
```

## Contributing
Contributions are welcome! Here’s how you can help:
1. **Fork the Repository**
2. **Create a New Branch**: `git checkout -b feature/your-feature-name`
3. **Make Your Changes**
4. **Submit a Pull Request**

## Issues and Feedback
If you encounter any bugs or have suggestions for improvements, please open an issue on the repository page.
