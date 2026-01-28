# Task Application Backend

## Overview
This project is a backend application for managing tasks using MongoDB Atlas for persistent data storage. It is built with Node.js and Express, utilizing Mongoose for database interactions.

## Project Structure
```
task-application-backend
├── src
│   ├── models
│   │   └── task.js
│   ├── routes
│   │   └── tasks.js
│   ├── controllers
│   │   └── taskController.js
│   ├── config
│   │   └── database.js
│   └── server.js
├── package.json
└── README.md
```

## Setup Instructions

1. **Clone the repository**
   ```
   git clone <repository-url>
   cd task-application-backend
   ```

2. **Install dependencies**
   ```
   npm install
   ```

3. **Set up MongoDB Atlas**
   - Create a MongoDB Atlas account and set up a new cluster.
   - Create a database and a collection for tasks.
   - Obtain the connection string and replace `<password>` with your database password.

4. **Configure the database connection**
   - Update the `src/config/database.js` file with your MongoDB connection string.

5. **Start the server**
   ```
   npm start
   ```

## API Endpoints

- **GET /tasks**: Retrieve all tasks.
- **GET /tasks/:id**: Retrieve a task by ID.
- **POST /tasks**: Create a new task.
- **PUT /tasks/:id**: Update a task by ID.
- **DELETE /tasks/:id**: Delete a task by ID.

## Usage Examples

### Create a Task
```json
POST /tasks
{
  "title": "New Task",
  "description": "Task description",
  "status": "pending"
}
```

### Get All Tasks
```json
GET /tasks
```

### Update a Task
```json
PUT /tasks/:id
{
  "title": "Updated Task",
  "description": "Updated description",
  "status": "completed"
}
```

### Delete a Task
```json
DELETE /tasks/:id
```

## License
This project is licensed under the MIT License.