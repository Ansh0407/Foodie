# Foodie - Food Ordering Platform

This project is a full-stack food ordering platform where users can browse items, add them to a cart, and place orders. It uses React (Vite) for the frontend and MySQL for the backend.

## Features

- User registration and authentication
- Browse items by category
- Add items to cart
- Checkout process
- Responsive design for multiple devices

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or later)
- npm (v6 or later)
- MySQL (v5.7 or later)

## Installation

1. Clone the repository:
   ```
   git clone https://github.com/Ansh0407/Foodie.git
   cd food-ordering-platform
   ```

2. Install frontend dependencies:
   ```
   cd frontend
   npm install
   ```

3. Install backend dependencies:
   ```
   cd ../backend
   npm install
   ```

4. Set up the MySQL database:
   - Create a new database named `food_ordering_db`
   - Update the database configuration in `backend/config/db.js` with your MySQL credentials

## Running the Application

1. Start the backend server:
   ```
   cd backend
   node app.js
   ```

2. In a new terminal, start the frontend development server:
   ```
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` to view the application.

## Project Structure

```
FOOD-DEL/
├── .git/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   └── authController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── node_modules/
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── orderRoutes.js
│   ├── .env
│   ├── app.js
│   ├── generateHash.js
│   ├── package-lock.json
│   ├── package.json
│   └── vercel.json
├── frontend/
│   ├── dist/
│   ├── node_modules/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── Context/
│   │   ├── pages/
│   │   ├── App.jsx
│   │   └── index.css
│   ├── .eslintrc.cjs
│   ├── index.html
│   ├── main.jsx
│   ├── package-lock.json
│   ├── package.json
│   ├── README.md
│   ├── vite.config.js
│   └── .gitignore
└── vercel.json
```

## Acknowledgments

- [Vite](https://vitejs.dev/)
- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MySQL](https://www.mysql.com/)

