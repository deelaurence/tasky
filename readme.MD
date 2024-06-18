# Django Project

This is a Django project using templates and SQLite as the database.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Python 3.x installed on your machine. You can download it from [python.org](https://www.python.org/).
- Pip, the Python package installer.
- Virtualenv, to create isolated Python environments (optional but recommended).

## Installation

1. **Clone the repository:**

    ```sh
    git clone https://github.com/deelaurence/tasky.git
    cd tasky
    ```

2. **Create and activate a virtual environment:**

    ```sh
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate` OR `python -m venv venv` 
    ```

3. **Install the required dependencies:**

    ```sh
    pip install -r requirements.txt
    ```

## Database Setup

1. **Apply the migrations:**

    ```sh
    python manage.py migrate
    ```

    This will set up your SQLite database (by default, `db.sqlite3`).

## Running the Development Server

1. **Start the server:**

    ```sh
    python manage.py runserver
    ```

2. **Access the project in your web browser:**

    Open your browser and go to `http://127.0.0.1:8000/`.

    if everything works well you should be redirected to the signup page

## Project Structure
