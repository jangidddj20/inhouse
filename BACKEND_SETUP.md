# Backend Setup Guide

## Overview
The Smart Event Planner backend uses Node.js with Express and SQLite database to store all your event planning data.

## Database Structure
The backend automatically creates the following tables when you start it:
- **users** - User accounts and profiles
- **events** - Event details (name, type, date, location, etc.)
- **tasks** - Task management for events
- **budgets** - Budget calculations and tracking
- **marketing_materials** - Marketing content and assets
- **timeline_activities** - Event timeline and schedule

## How to Run the Backend

### Step 1: Start the Backend Server
Open a terminal and run:
```bash
node server/server.js
```

You should see output like:
```
========================================
  Smart Event Planner Backend Server
========================================

Initializing database...
✓ Connected to SQLite database
✓ Users table ready
✓ Events table ready
✓ Budgets table ready
✓ Tasks table ready
✓ Marketing Materials table ready
✓ Timeline Activities table ready

✓ Database initialization complete!

========================================
✓ Server running on port 5000
✓ API available at: http://localhost:5000
========================================
```

### Step 2: Keep the Backend Running
Leave this terminal window open with the backend running.

### Step 3: Start the Frontend
Open a NEW terminal window and run:
```bash
npm start
```

The frontend will connect to the backend automatically when available.

## Database Location
The SQLite database file is created at:
```
server/eventplanner.db
```

You can view and manage this database using DB Browser for SQLite.

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get a specific event
- `POST /api/events` - Create a new event
- `PUT /api/events/:id` - Update an event
- `DELETE /api/events/:id` - Delete an event

### Tasks
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a specific task
- `GET /api/tasks/event/:eventId` - Get tasks for a specific event
- `POST /api/tasks` - Create a new task
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task

### Budgets
- `GET /api/budgets` - Get all budgets
- `GET /api/budgets/:id` - Get a specific budget
- `GET /api/budgets/event/:eventId` - Get budget for a specific event
- `POST /api/budgets` - Create a new budget
- `PUT /api/budgets/:id` - Update a budget
- `DELETE /api/budgets/:id` - Delete a budget

### Users
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get a specific user
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update a user
- `DELETE /api/users/:id` - Delete a user

## How Data is Saved

1. When you create an event in the dashboard, it's automatically saved to the SQLite database
2. All tasks, budgets, and marketing materials are linked to their parent event
3. Data persists between sessions - you can close the app and come back later
4. The database file grows as you add more data

## Viewing Your Data in DB Browser

1. Open DB Browser for SQLite
2. Click "Open Database"
3. Navigate to your project folder
4. Select `server/eventplanner.db`
5. Click the "Browse Data" tab to view your tables
6. Select a table from the dropdown to see all records

## Troubleshooting

### Backend won't start
- Make sure port 5000 is not already in use
- Check that all dependencies are installed: `npm install`

### Data not saving
- Verify the backend is running (check the terminal)
- Check browser console for connection errors
- Ensure the database file has write permissions

### Database locked error
- Close DB Browser for SQLite before running the backend
- SQLite doesn't allow multiple connections while writing

## Notes

- The frontend will work without the backend using localStorage as fallback
- When the backend is running, data is saved to both localStorage and the database
- The backend must be running for full functionality
- Keep the backend terminal window open while using the application
