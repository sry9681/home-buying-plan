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
source "$VENV_DIR/bin/activate" || { echo "Failed to activate virtual environment."; exit 1; }

# Install requirements from requirements.txt if they are not already installed
if ! pip freeze | grep -q -f requirements.txt; then
    echo "Installing required packages from requirements.txt..."
    pip install -r requirements.txt
fi