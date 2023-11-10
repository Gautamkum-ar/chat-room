# MERN Chatroom Project

Welcome to the MERN Chatroom project! This is a full-stack web application built using the MERN stack (MongoDB, Express.js, React, and Node.js). The project aims to provide a simple and real-time chatroom experience.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Folder Structure](#folder-structure)
- [Dependencies](#dependencies)


## Features

1. **Real-Time Chatting**: Engage in real-time conversations with other users.
2. **User Authentication**: Secure your chatroom with user authentication.
3. **Message History**: View past messages and conversations.
5. **Responsive Design**: The chatroom is accessible and usable on various devices.

## Installation

### Prerequisites

- Node.js and npm installed on your machine.
- MongoDB Atlas account for database storage.

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/chat-room.git
   ```

2. Navigate to the project directory:

   ```bash
   cd chatroom
   ```

3. Navigate to the backend directory:

   ```bash
   cd backend
   ```
4. Install server dependencies:

   ```bash
   npm install
   ```

4. Install client dependencies:

   ```bash
   npm install
   ```
5. Navigate to the client directory:

   ```bash
   cd frontend
   ```

6. Install client dependencies:

   ```bash
   npm install
   ```

7. Create a `.env` file in the root directory and set up the following environment variables:

   ```env
   MONGO_URI=your_mongodb_uri
   JWT_SECRET=your_jwt_secret
   ```





## Usage

1. Open your web browser and go to `http://localhost:3000`.
2. Register or log in to access the chatroom.
3. Enjoy real-time chatting with other users!

## Folder Structure

```plaintext
chatroom/
|-- frontedn/             # React frontend
|   |-- public/
|   |-- src/
|   |-- package.json
|   
|-- backend/              # NodeJS backend
|   |-- controllers/
    |-- models/             # MongoDB data models
    |-- handler/             # async handler
    |-- middleware/             # checkauth
    |-- routes/             # Express.js routes
    |-- .env                # Environment variables
    |-- index.js           # Express.js server setup
    |-- package.json        # Server dependencies
    |-- README.md           # Project documentation
```



       


## Dependencies

- **Server Dependencies:**
  - express
  - mongoose
  - socket.io
  - jsonwebtoken


- **Client Dependencies:**
  - react
  - react-router-dom
  - socket.io-client

## Contributing

Contributions are welcome! Feel free to open issues or pull requests.

## License

This project is licensed under the [MIT License](LICENSE).
