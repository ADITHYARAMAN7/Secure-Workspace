# WorkStation: Secure Workspace Application

WorkStation is a comprehensive, secure workspace management platform designed to streamline organizational workflows while ensuring data security and role-based access control. It features a modern, responsive interface and a robust backend for managing employees, assignments, documents, and internal communications.

## 🚀 Project Overview

This application serves as a centralized hub for:
- **Attendance Tracking**: Employees can check in daily, and managers can monitor team attendance.
- **Task Management**: Managers can assign tasks to employees with file attachments.
- **Secure Document Vault**: A role-based document storage system with granular visibility controls (Admin/Manager/Employee).
- **Internal Messaging**: A secure inbox for direct and group messaging within the organization.

The platform emphasizes security with JWT-based authentication, password handling, and role-based route protection.

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework**: React (Vite)
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Native Fetch API / Axios (implied)
- **Linting**: ESLint

### Backend (Server)
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3 (Lightweight, file-based relational database)
- **Authentication**: JSON Web Tokens (JWT) & Bcrypt
- **File Handling**: Multer (for secure file uploads)

## ✨ Key Features

### 1. 🔐 Security & Authentication
- **Role-Based Access Control (RBAC)**: Distinct dashboards and permissions for Admins, Managers, and Employees.
- **Secure Login/Register**: JWT implementation for session management.
- **Cinematic Intro**: Engaging splash screen on application load.

### 2. 📊 Dashboards
- **Employee Dashboard**: View assigned tasks, check-in for attendance, upload personal documents.
- **Manager Dashboard**: Overview of employee status, create and assign tasks, view team performance.
- **Admin Dashboard**: System-wide controls and user management (features scalable).

### 3. 📂 Document Vault
- **Secure Uploads**: Upload documents with description and specific visibility settings.
- **Granular Permissions**: Control who can see the document (Admin, Manager, Employee-wide).
- **Secure Download**: Verified download paths ensuring only authorized users access files.

### 4. 💬 Messaging System
- **Secure Inbox**: Internal messaging system.
- **Group Broadcasts**: Send messages to "All Managers", "All Employees", or specific individuals.

### 5. 📅 Attendance System
- **Status Tracking**: "Present", "Absent" status tracking based on daily check-ins.
- **History**: Users can view their own attendance history.

## 📦 Installation & Setup

Follow these steps to get the project running locally.

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or higher recommended)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd "Secure WorkS"
```

### 2. Backward Setup (Server)
Navigate to the server directory and install dependencies.

```bash
cd server
npm install
```

Start the backend server (runs on port 3001):
```bash
# For development (updates on file change)
npm run dev
# OR for standard start
npm start
```
*The database (`database.sqlite`) will be automatically initialized on the first run.*

### 3. Frontend Setup (Client)
Open a new terminal, navigate to the client directory, and install dependencies.

```bash
cd client
npm install
```

Start the React development server:
```bash
npm run dev
```

### 4. Access the Application
Open your browser and navigate to the URL provided by Vite, typically:
`http://localhost:5173`


## 📝 Usage

### 1. Registration & Roles
The system automatically assigns roles based on the email address used during registration:
- **Admin**: Include the word `admin` in your email (e.g., `admin@workstation.com`).
- **Manager**: Include the word `manager` in your email (e.g., `manager@company.com`).
- **Employee**: Any other email address (e.g., `john@company.com`).

### 2. Login & Multi-Factor Authentication (MFA)
1.  Enter your registered email and password.
2.  **MFA Challenge**: The system will simulate sending an MFA code.
3.  **Get the Code**: Check the **Server Terminal/Console**. You will see a log message like:
    ```
    [MFA SMART] Code for admin@workstation.com (Admin): 123456
    ```
4.  Enter this code in the UI to complete the login.

### 3. Explore
-   **Nav Bar**: Navigate between Dashboard, Inbox, Vault, and Security settings.
-   **Dashboard**: Check your specific role-based widgets.
-   **Vault**: Try uploading a file and setting visibility.


## 📂 Project Structure

```
Secure WorkS/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Dashboard, Auth, Shared components
│   │   ├── App.jsx         # Main application component
│   │   └── main.jsx        # Entry point
│   ├── index.html
│   └── package.json
│
└── server/                 # Express Backend
    ├── index.js            # Entry point
    ├── db.js               # Database connection
    ├── auth.js             # Authentication routes
    ├── features.js         # Core feature routes (Attendance, Vault, etc.)
    ├── uploads/            # Directory for uploaded files
    └── package.json
```
