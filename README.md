## Smart Task Manager Dashboard

- A comprehensive task management solution built with Next.js that helps teams efficiently manage projects, tasks, and workloads with intelligent auto-assignment features.

## Features

Authentication & User Management

-User registration and login system

- Secure JWT-based authentication

- Role-based access control

- Password reset functionality

## Team Management

- Create and manage teams

- Add team members with roles

- Set individual capacity limits (0-5 tasks)

- Real-time team performance monitoring

## Project & Task Management

- Create and organize projects

- Add tasks with titles, descriptions, and priorities

- Assign tasks to team members

- Track task status (Pending, In Progress, Done)

- Priority levels: Low, Medium, High

## Smart Task Assignment

- Capacity Monitoring: Visual indicators showing member workload

- Overload Warnings: Alerts when assigning beyond capacity

- Auto-Assign: Intelligent task distribution based on availability

- Manual Override: Option to assign despite capacity warnings

## Intelligent Auto-Reassignment

- One-Click Optimization: Automatically balance workloads

- Priority-Aware: Keeps High Priority tasks with current assignees

- Smart Distribution: Moves Low/Medium tasks to available members

- Activity Logging: Tracks all reassignment activities

## Dashboard & Analytics

- Real-time project and task statistics

--Team performance overview

- Visual workload indicators

- Recent activity timeline

- Completion progress tracking

## Technology Stack

## Frontend

- Framework: Next.js 16 with App Router

- Language: JavaScript

- State Management: Redux Toolkit with RTK Query

- Styling: Tailwind CSS

- Forms: React Hook Form with Zod validation

- Charts: Recharts for data visualization

- Icons: React Icons

- Notifications: React Toastify

## Getting Started: Setup and Usage

Follow these steps to get the development server running:

## Setup and Usage

- `Clone the Repository:`

```js
git clone https://github.com/alive1258/Smart-Task-Manager-Dashboard


```

- `Navigate to Project Directory:`

```js
cd Smart-Task-Manager-Dashboard
```

- `Create a .env file in the root folder of the frontend project and add the`
- `Add the following environment variable`

```js
 NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1

```

- `Install Dependencies::`

```js
npm install
```

- `Start Development Server:`

```js
npm run dev
```

## 🧑‍💻 Author

Zamirul Kabir
Web Developer

GitHub: @alive1258

Email: zamirulkabir999@gmail.com
