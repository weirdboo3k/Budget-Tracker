# Personal Budget Tracker
A simple web application to track income and expenses.

## Features

- Add income/expense transactions
- View transaction history
- Calculate total income, expense, and balance
- Edit and delete transactions
- Filter transactions by date
- Data persistence with localStorage

## Setup

1. Install Node.js from [nodejs.org](https://nodejs.org/)

2. Install dependencies:
```bash
cd backend
npm install
```

3. Start the server:
```bash
npm start
```

4. Open `http://localhost:3000` in your browser

## Usage

- **Add Transaction**: Fill the form (Type, Amount, Category) and click "Add"
- **Edit**: Click "Edit" button to modify a transaction
- **Delete**: Click "Remove" button to delete a transaction
- **Filter**: Use the dropdown menus to filter by year, month, or day
- **Reset All**: Click "Reset All" to delete all transactions

## Tech Stack

- Frontend: HTML5, CSS3, JavaScript (ES6)
- Backend: Node.js, Express.js
- Storage: localStorage + API

## Project Structure

```
├── index.html
├── css/
│   ├── style.css
│   ├── components.css
│   └── theme.css
├── js/
│   ├── app.js
│   ├── storage.js
│   ├── ui.js
│   └── filter.js
└── backend/
    ├── index.js
    └── package.json
```


