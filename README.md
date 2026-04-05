# Najikai - Hyper-local Multi-vendor E-commerce Platform

**Najikai** is a MERN-stack based e-commerce solution designed specifically for local communities in Nepal (like Jhumka, Sunsari). It connects local vendors directly with customers, focusing on fresh groceries and daily essentials.

## Project Goal
To digitize local marketplaces and provide an "Atomic Inventory" system that ensures real-time stock accuracy for both unit-based and weight-based products.

## Tech Stack
- **Frontend:** React.js, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (Cloud)
- **State Management:** Context API / Redux
- **Authentication:** JWT (JSON Web Tokens)

## Key Features
- **Role-Based Access:** Separate dashboards for Admin, Vendor, and Customers.
- **Location Discovery:** Find stores near your specific area.
- **Atomic Inventory:** Real-time stock validation to prevent over-ordering.
- **Commission System:** Automated 10% admin and 90% vendor payout logic.
- **Status Workflow:** Manual order tracking (Pending -> Confirmed -> Delivered).

## Project Structure
```text
├── backend/
│   ├── config/             # Database connection, Cloudinary, etc.
│   ├── controllers/        # Logic for routes (auth, products, users)
│   ├── middlewares/        # Auth check, Role check, Error handler
│   ├── models/             # Mongoose Schemas (User, Product, Order)
│   ├── routes/             # Express Route definitions
│   ├── utils/              # helper functions (sendEmail, jwtToken)
│   ├── .env                # Environment variables (Secrets)
│   ├── server.js           # Main entry point
│   └── package.json
└── frontend/
    