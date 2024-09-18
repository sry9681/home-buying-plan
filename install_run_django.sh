#!/bin/bash

# Check if the venv module is installed
if ! python3 -m venv --help &> /dev/null; then
    echo "The venv module is not installed. Please install it using 'python3 -m pip install venv' and try again."
    exit 1
fi

# Define the virtual environment directory name
VENV_DIR="venv"

# Check if the virtual environment directory exists
if [ ! -d "$VENV_DIR" ]; then
    # The virtual environment does not exist, create it
    echo "Creating virtual environment..."
    python3 -m venv "$VENV_DIR"
fi

# Activate the virtual environment
echo "Activating virtual environment..."
source "./$VENV_DIR/bin/activate"

# Check if Django is installed
if ! pip freeze | grep -q Django; then
    # Django is not installed, install it
    echo "Installing Django..."
    pip install django
fi

# Run the Django manage.py start command
# Replace 'start' with 'startapp appname' or 'runserver' as needed
echo "Running Django manage command..."
#python manage.py start