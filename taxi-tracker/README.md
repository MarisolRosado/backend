# Contents of /taxi-tracker/taxi-tracker/README.md

# Taxi Tracker Project

This project is a Node.js application that tracks taxis on a map and allows users to submit form data to Firebase.

## Features

- Sends form data to Firebase.
- Displays random moving taxis on a map using generated coordinates.
- Utilizes Express for the backend server.

## Project Structure

- `src/`: Contains the source code for the application.
  - `config/`: Configuration files, including Firebase setup.
  - `controllers/`: Contains controllers for handling business logic.
  - `models/`: Defines data models for the application.
  - `routes/`: Defines API routes for the application.
  - `services/`: Contains services for interacting with external APIs.
  - `utils/`: Utility functions for various tasks.
  - `app.js`: Entry point of the application.

- `public/`: Contains static files for the frontend.
  - `js/`: Client-side JavaScript files.
  - `index.html`: Main HTML file for the application.

## Installation

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Set up Firebase configuration in `src/config/firebase.js`.
4. Start the server with `node src/app.js`.

## Usage

Access the application in your browser at `http://localhost:3000`. Use the form to submit data and view moving taxis on the map.

## License

This project is licensed under the MIT License.