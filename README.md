# MERN Expense Tracker App

A full-stack expense manager application built with the MERN stack (MongoDB, Express, React, Node.js). This app allows users to track expenses, view reports, download CSVs, and unlock premium features like leaderboards.

## Features

- **User Authentication:** Sign up, sign in, and password reset via email.
- **Expense Management:** Add, view, and delete expenses.
- **Pagination:** Customizable rows per page for expense lists.
- **Reports:** Filter expenses by day, month, or year; download CSV reports.
- **Premium Features:** Leaderboard for top spenders, CSV downloads.
- **Payment Integration:** Upgrade to premium via Cashfree payment gateway.


## Getting Started

### Prerequisites

- Node.js & npm
- MongoDB database (local or Atlas)
- Cashfree account for payment integration

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/yourusername/MERN_EXPENSE_TRACKER_APP.git
cd MERN_EXPENSE_TRACKER_APP

cd SERVER
npm install

cd ../CLIENT
npm install

cd ../SERVER
npm start


cd ../CLIENT
npm run dev
