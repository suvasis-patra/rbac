# Role-Based Access Control (RBAC) Backend

## Description

This project is a backend application implementing Role-Based Access Control (RBAC) to manage user permissions and secure resources. It includes user authentication, role-based authorization, and secure token management using access and refresh tokens.

---

## Features

- **User Authentication:** Sign up, login, and logout functionality.
- **Role-Based Authorization:** Define roles and permissions for accessing resources.
- **Access & Refresh Tokens:** Secure token-based authentication system.
- **Cookie Management:** Store tokens in HTTP-only cookies for enhanced security.
- **Input Validation:** Validate user input with Zod.
- **Password Hashing:** Encrypt user passwords using bcrypt.

---

## Technologies Used

- **TypeScript**: For type safety and enhanced developer experience.
- **Node.js**: Backend runtime.
- **Express.js**: Web framework for building APIs.
- **Zod**: Schema-based validation for user input.
- **JWT**: Token-based authentication and authorization.
- **bcrypt**: Secure password hashing.
- **Cookies**: Manage access and refresh tokens securely.

---

## Installation

### Prerequisites

Ensure you have the following installed:

- Node.js (v14 or later)
- npm (v7 or later)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/username/rbac-backend.git
   cd rbac-backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a .env file in the project root and add the following variables:
   ```bash
   MONGODB_URI=""
   PORT=
   ACCESS_TOKEN_SECRET=""
   REFRESH_TOKEN_SECRET=""
   ```
4. Run the application:
   ```bash
   npm run dev
   ```

## Usage

### Endpoints

#### Authentication

- **POST /auth/signup**  
  Create a new user.

- **POST /auth/login**  
  Authenticate user and issue tokens.

- **POST /auth/logout**  
  Revoke refresh token and clear cookies.

#### Token Management

- **POST /auth/refresh**  
  Renew access tokens using refresh tokens.

#### Role Management

- **POST /roles**  
  Create a new role with specific permissions.

- **GET /roles**  
  Get all roles.

#### Protected Resources

- **GET /dashboard**  
  Accessible only to authorized roles.
