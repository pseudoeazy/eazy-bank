# Eazy Node.js Bank Application

This Node.js bank application allows users to create accounts, deposit and withdraw funds, and transfer money between accounts through a RESTful API. Built using Express.js and MongoDB, this application demonstrates the use of asynchronous operations to handle financial transactions efficiently.

## Features

- **User Authentication:** Secure user registration and login.
- **Account Management:** Create and manage bank accounts.
- **Transactions:** Deposit and withdraw funds.
- **Transfers:** Transfer funds between accounts.
- **Asynchronous Processing:** Handles operations using asynchronous programming for better performance.

## Models

### User

Represents a user in the system.

- `email`: String (required, unique)
- `password`: String (required, hashed)

### Account

Represents a bank account.

- `accountNumber`: String (required, unique)
- `balance`: Number (default: 0)
- `user`: ObjectId (reference to User, required)

### Transaction

Represents a financial transaction.

- `amount`: Number (required)
- `type`: String (enum: ['deposit', 'withdrawal'], required)
- `date`: Date (default: current date)
- `user`: ObjectId (reference to User, required)

## API Endpoints

### User Endpoints

- **POST /api/auth/signup:** Register a new user.
- **POST /api/auth/signin:** Login and obtain a JWT token.
- **POST /api/auth/signout:** Log out.
- **POST /api/auth/me:** Get current logged in user.

### Account Endpoints

- **POST /api/accounts/create:** Create a new account.

### Transaction Endpoints

- **POST /api/transactions/deposit:** Transfer funds to current user accounts.
- **POST /api/transactions/withdrawal:** Withdraw funds from current user account.
- **POST /api/transactions/p2p:** Transfer funds between accounts.
- **POST /api/transactions/account:** get all transactions (deposit or withdrawal) by account number.

## Middleware

- **Authentication Middleware:** Ensures that routes are accessed by authenticated users only.

## Getting Started

### Prerequisites

- Node.js
- MongoDB

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/pseudoeazy/eazy-bank.git
   cd eazy-bank
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and add the following:

   ```
   MONGO_DB=mongodb://127.0.0.1:27017/eazy-bank
   MONGO_DB_TEST=mongodb://127.0.0.1:27017/eazy-bank-test
   JWT_PRIVATE_KEY=jwt-private-key
   PORT=4000
   NODE_ENV=development
   ```

4. Start the application:
   ```bash
   npm start
   ```

### Usage

- Use an API client like Postman to interact with the API endpoints.
- Register a new user, create accounts, and perform transactions using the provided endpoints.

## License

This project is licensed under the MIT License.
