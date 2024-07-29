- **Name:** Arnav Rajesh Kadu
- **Company:** CODTECH IT SOLUTIONS
- **ID:** CT12DS354
- **Domain:** WEB DEVELOPMENT
- **Duration:** 8 WEEKS
- **Mentor:** Muzammil

- # TaskHive - A To-Do List Web App

## Overview
TaskHive is a web application designed to help users manage their tasks efficiently. Users can register, log in, create tasks, categorize them into lists, and update their status. The application aims to provide a seamless and organized way to handle tasks, making it easier for users to stay on top of their responsibilities.

## Features
- **User Authentication:** Secure user registration and login system.
- **Task Management:** Create, view, update, and delete tasks.
- **Categorization:** Organize tasks into different lists.
- **Due Dates:** Set and manage due dates for tasks.
- **Responsive Design:** Mobile-friendly and accessible from various devices.
- **Interactive UI:** Intuitive and user-friendly interface with animations and dropdowns.

## Technologies Used
- **Frontend:**
  - HTML
  - CSS
  - JavaScript
  - Bootstrap
  - EJS (Embedded JavaScript Templates)
- **Backend:**
  - Node.js
  - Express.js
- **Database:**
  - PostgreSQL

## Getting Started

To get started with TaskHive, follow these steps:

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### Installation
1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/TaskHive.git
   cd TaskHive
   ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Setting the Database:Create a new database in PostgreSQL and then run the SQL script to create necessary tables:
    ```bash
    psql -U your-username -d your-database -f sql/the_hive.sql
    ```
4. Create a .env file in the root directory and add the following variables:
    ```env
    SECRET_WORD="YOUR_SECRET_KEY"
    PG_USER="YOUR_DATABASE_USER"
    PG_HOST="YOUR_DATABASE_HOST_ADDRESS"
    PG_DATABASE="YOUR_DATABASE_NAME"
    PG_PASSWORD="YOUR_DATABASE_USER_PASSWORD"
    PG_PORT="YOUR_DATABASE_PORT"
    ```
5. Start the server:
    ```bash
    node server.js
    ```

6. Open your browser and go to `http://localhost:3000`.
    
## Contributing

We welcome contributions to improve WeatherNow! Here’s how you can contribute:

1. Fork the repository.
2. Create a new branch:
    ```bash
    git checkout -b feature-name
    ```

3. Make your changes.
4. Commit your changes:
    ```bash
    git commit -m "Description of the feature"
    ```

5. Push to the branch:
    ```bash
    git push origin feature-name
    ```

6. Open a Pull Request with a detailed description of your changes.

## Contact

For any questions, suggestions, or issues, please contact:

- **Email:** arnavkaducr7@gmail.com

Feel free to reach out if you need any assistance!
