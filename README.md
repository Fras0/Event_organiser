# Event Organizer API

This API is a Node.js and MongoDB backend designed for organizing charity organization events and managing volunteer participation. It provides a comprehensive set of functionalities for event creation, management, user profiles, attendance tracking, and notifications.

## Features

- **Authentication:** Secure user authentication using JWT tokens, including signup, login, logout, and refresh token functionality.
- **User Profiles:** CRUD (Create, Read, Update, Delete) operations for managing user profiles.
- **Event Management:** Comprehensive event management features, including creation, retrieval, updating, deletion, and the ability to close events (marking them as finished while retaining data).
- **Attendance Management:** Handles volunteer subscriptions (interest), attendance records, and retrieves subscriber lists and user event subscriptions.
- **Real-time Notifications:** Sends notifications to all volunteers upon new event creation and reminder notifications to subscribers for upcoming events.
- **Scheduled Reminders:** Cron jobs automatically send reminder notifications for events nearing their start date.
- **Authorization:** `restrictTo` middleware enforces authorization rules, limiting access to specific endpoints based on user roles or permissions.
- **Error Handling:** A custom `AppError` class and error handling middleware provide more informative and manageable error responses.

## Technologies Used

- Node.js
- MongoDB
- JWT (JSON Web Token)
- FCM (Firebase Cloud Messaging)
- Cron Jobs

## Getting Started

### Prerequisites

- Node.js and npm (Node Package Manager) installed on your system.
- MongoDB installed and running.
- Firebase account and project set up for FCM.

### Installation

1. Clone the repository: `git clone <repository_url>`
2. Install dependencies: `npm install`
3. Configure environment variables: Create a `.env` file in the root directory and set the necessary environment variables (e.g., database connection string, JWT secret, FCM credentials). See the `.env.example` for the variable names you need to set.
4. Start the server: `npm start`

## Documentation

Detailed API endpoint documentation, including request parameters, response formats, and examples, can be found in the [API Documentation](https://documenter.getpostman.com/view/39607730/2sAYXEEHvW). This README provides a high-level overview of the API's capabilities.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.
