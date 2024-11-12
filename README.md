# Housing Investment Plan and Calculator

A Django web application that helps users plan and visualize their home buying journey by calculating mortgage costs and tracking savings progress.

## Features
- User account system for saving personal calculations
- Mortgage calculator with detailed cost breakdown
- Savings tracker with multiple contributor support
- Interactive charts showing financial projections
- Goal setting and progress visualization

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

## License
This project is licensed under the MIT License - see the LICENSE file for details.
