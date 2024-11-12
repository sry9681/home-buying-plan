# Housing Investment Plan and Calculator

A Django web application that helps users plan and visualize their home buying journey by calculating mortgage costs and tracking savings progress after purchasing a home. You are able to calculate the cost of a home, add multiple peoples savings (the amount they can contribute to rent + utilities + extra savings to be applied to a future savings goal), then set a target savings goal. This can then tell you how long it will take, given the contributions of one or more people, how long it will take to hit that savings goal while paying off the home.

## Features
- User account system for saving personal calculations
- Mortgage calculator with detailed cost breakdown for calculating the monthly payment
- Savings tracker with multiple contributor support
- Interactive chart showing the progress towards the savings goal while paying off the home. Currently the mortgage and savings amount both start at the same time, but this will be changed in the future.
- Login/Logout system with personal calculations persistently saved in SQLite per user.

![image](https://github.com/user-attachments/assets/6850f3ff-14e1-4b12-8be3-186f267563eb)

![image](https://github.com/user-attachments/assets/55a5b339-49c5-4b0f-9503-b0decf84cb18)

![image](https://github.com/user-attachments/assets/dd6f432b-ce9a-4763-a46d-c91310887e22)




## Requirements
- Python 3.x
- Django
- Web browser with JavaScript enabled

## Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/sry9681/home-buying-plan.git
   cd home-buying-plan
   ```

2. **Set Up Virtual Environment**
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```

3. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize Database**
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create Admin User (Optional)**
   ```bash
   python manage.py createsuperuser
   ```

6. **Start Development Server**
   ```bash
   python manage.py runserver
   ```

7. **Access the Application**
   - Open a web browser and navigate to `http://127.0.0.1:8000`
   - Create an account or log in to start using the calculator

## Project Structure
```
home-buying-plan/
│
├── realestateapp/           # Main application directory
│   ├── static/             # Static files (JS, CSS)
│   │   ├── scripts.js     # Mortgage calculator logic
│   │   ├── home.js        # Home page functionality
│   │   ├── savings.js     # Savings calculator logic
│   │   └── styles.css     # Application styling
│   │
│   ├── templates/         # HTML templates
│   ├── models.py          # Database models
│   ├── views.py           # View logic
│   └── urls.py           # URL routing
│
├── homeBuyersPlan/         # Project settings directory
├── manage.py              # Django management script
├── requirements.txt       # Project dependencies
└── README.md             # This file
```

## Additional Packages
*No additional packages required beyond those installed by requirements.txt*

## Troubleshooting

### Common Issues
1. **Database Errors**
   - Ensure all migrations are applied: `python manage.py migrate`
   - Delete db.sqlite3 and run migrations again if database is corrupted

2. **Static Files Not Loading**
   - Run `python manage.py collectstatic`
   - Check that DEBUG = True in settings.py for development

3. **Server Won't Start**
   - Ensure no other service is using port 8000
   - Check that virtual environment is activated
   - Verify Python version is 3.x: `python --version`

## Development Notes
- The application uses SQLite by default for development
- All calculations are performed client-side using JavaScript
- User data is stored per account in the database
- Chart visualizations use Chart.js library

## Contributing
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## Future Features
- Highlight on the navigation bar which page you are on
- Separate the savings and mortgage calculators into different apps
- Show on the chart: equity vs interest paid using a stacked line chart or something.
- Allow multiple home purchases either at a fixed time in the future or based on a trigger event (like a savings goal being met)
- Allow users to upload a csv of their monthly expenses to auto fill the savings calculator
    - This will require adding changeable savings rate over time on a per user basis.
- Add a page that shows the user how much they can save per month given their current expenses and a target amount. (Large update. Low priority)
- 

## License
This project is licensed under the MIT License - see the LICENSE file for details.
