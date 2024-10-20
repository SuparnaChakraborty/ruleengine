

### **Overview of the Rule Engine**

The rule engine will:
- Allow users to create dynamic rules based on attributes like age, income, and spend.
- Parse these rules into an AST for efficient processing.
- Evaluate user data against these rules to determine eligibility.
  
### **Steps to Build the Application**

---

### **1. Define the Problem**

- The user should be able to define eligibility rules, such as:
  - `age > 30 AND income > 50000`
  - `spend <= 1000 OR (department == 'Sales' AND age < 50)`

- The rule engine should evaluate these rules based on user data attributes:
  - **User data** could include fields like `age`, `income`, `spend`, and `department`.

- The system should allow modification, combination, and removal of rules dynamically.

---

### **2. Project Setup**

- **Backend**: Node.js/Express.js
- **Frontend**: React.js (optional for user interface)
- **Database**: MongoDB (for storing rules and user data)

1. **Initialize the Project**:
   - Initialize a new project using Node.js:
     ```bash
     mkdir rule-engine-app
     cd rule-engine-app
     npm init -y
     ```

2. **Install Dependencies**:
   ```bash
   npm install express body-parser mongoose
   ```

   For AST handling, you can use **jsep** or other libraries that help parse expressions:
   ```bash
   npm install jsep
   ```

---

### **3. Design the Rule Structure**

We will store user-defined rules as logical expressions and use an AST to parse and evaluate them.

#### **Example Rule**:
- Rule: `age > 30 AND income > 50000`
- Represented as a string: `"age > 30 && income > 50000"`

This will be parsed into an AST like:
```json
{
  "type": "LogicalExpression",
  "operator": "&&",
  "left": {
    "type": "BinaryExpression",
    "operator": ">",
    "left": { "type": "Identifier", "name": "age" },
    "right": { "type": "Literal", "value": 30 }
  },
  "right": {
    "type": "BinaryExpression",
    "operator": ">",
    "left": { "type": "Identifier", "name": "income" },
    "right": { "type": "Literal", "value": 50000 }
  }
}
```

---

### **4. Define AST Parsing and Evaluation**

We will use the **jsep** library to parse expressions into AST and then evaluate them against user data.

#### **Example Code to Parse Rules**:

1. **AST Parser**:
   ```javascript
   const jsep = require('jsep');

   // Parse rule into AST
   const parseRule = (rule) => {
       return jsep(rule);  // Returns the AST
   };
   
   // Example usage
   const rule = "age > 30 && income > 50000";
   const ast = parseRule(rule);
   console.log(JSON.stringify(ast, null, 2));
   ```

2. **Evaluate AST**:
   Create a function to evaluate the parsed AST using user data:
   ```javascript
   const evaluateAST = (node, userData) => {
       switch (node.type) {
           case 'BinaryExpression':
               const leftValue = evaluateAST(node.left, userData);
               const rightValue = evaluateAST(node.right, userData);
               switch (node.operator) {
                   case '>': return leftValue > rightValue;
                   case '<': return leftValue < rightValue;
                   case '==': return leftValue == rightValue;
                   case '!=': return leftValue != rightValue;
                   default: throw new Error(`Unknown operator: ${node.operator}`);
               }

           case 'LogicalExpression':
               const left = evaluateAST(node.left, userData);
               const right = evaluateAST(node.right, userData);
               switch (node.operator) {
                   case '&&': return left && right;
                   case '||': return left || right;
                   default: throw new Error(`Unknown operator: ${node.operator}`);
               }

           case 'Identifier':
               return userData[node.name];

           case 'Literal':
               return node.value;

           default:
               throw new Error(`Unknown node type: ${node.type}`);
       }
   };

   // Example evaluation
   const userData = { age: 35,

Here’s a **comprehensive README** for your **Rule Engine Application using AST**:

---

# Rule Engine Application

This is a **Rule Engine Application** that uses **Abstract Syntax Trees (AST)** to evaluate user-defined rules for determining eligibility based on attributes like age, income, spend, and department. Users can define dynamic rules, which are parsed into an AST and evaluated against user data.

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#project-structure)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [Design Choices](#design-choices)
- [API Endpoints](#api-endpoints)
- [Docker Setup](#docker-setup)
- [Testing](#testing)
- [License](#license)

---

## Overview

This rule engine allows for the dynamic creation, modification, and evaluation of rules. These rules are parsed using an Abstract Syntax Tree (AST) and evaluated in real-time against user data, determining eligibility based on predefined conditions.

For example, a rule like:
```
age > 30 AND income > 50000
```
will be parsed into an AST and evaluated for users based on their `age` and `income` data.

---

## Features

- Dynamic rule creation based on user attributes (age, income, spend, etc.).
- AST-based parsing of rules using the **jsep** library.
- Real-time rule evaluation against user data.
- Support for logical expressions (`&&`, `||`) and comparison operators (`>`, `<`, `==`, `!=`).
- Docker support for easy setup and scaling.

---

## Prerequisites

Before starting, make sure you have the following installed on your machine:

- **Node.js** (v14 or later)
- **MongoDB** (v6.0 or later)
- **Docker** (optional for containerized deployment)

---

## Installation

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/rule-engine-app.git
cd rule-engine-app
```

### 2. Install Backend Dependencies

```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies (Optional if you have a frontend)

```bash
cd frontend
npm install
```

---

## Project Structure

```
rule-engine-app/
├── backend/
│   ├── server.js         # Express server
│   ├── models/           # Mongoose models for User and Rule data
│   ├── routes/           # API routes for managing rules and user data
│   └── services/         # AST parsing and rule evaluation logic
└── frontend/             # (Optional) React frontend to manage rules and visualize results
```

---

## Usage

### 1. Create `.env` File

In the `backend` directory, create a `.env` file to define the environment variables:

```bash
MONGO_URI=mongodb://localhost:27017/ruleEngineDB
PORT=5000
```

### 2. Start Backend

```bash
cd backend
npm start
```

The backend server will be running at `http://localhost:5000`.

### 3. Start Frontend (Optional)

```bash
cd frontend
npm start
```

The frontend will be running at `http://localhost:3000`.

---

## Environment Variables

- `MONGO_URI`: MongoDB connection string.
- `PORT`: Port on which the backend server will run.

Make sure to update these values in the `.env` file as needed.

---

## Design Choices

- **Abstract Syntax Tree (AST)**: We chose to use AST to efficiently represent and evaluate complex user-defined rules. AST allows breaking down expressions into logical structures (nodes) that can be easily evaluated against user data.

- **MERN Stack**: Using MongoDB for persistent rule storage and Express.js for the backend. Optional React frontend for UI interaction.

- **Rule Parsing**: The rules are stored as strings and parsed using **jsep** into an AST, which makes it easier to handle complex nested expressions with logical operators (`&&`, `||`).

---

## API Endpoints

### 1. **POST /api/rules/create**
- **Description**: Create a new rule.
- **Body**:
  ```json
  {
    "rule": "age > 30 && income > 50000"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Rule created successfully",
    "ruleId": "606..."
  }
  ```

### 2. **POST /api/rules/evaluate**
- **Description**: Evaluate a rule for a user.
- **Body**:
  ```json
  {
    "ruleId": "606...",
    "userData": {
      "age": 35,
      "income": 60000,
      "spend": 2000,
      "department": "Sales"
    }
  }
  ```
- **Response**:
  ```json
  {
    "isEligible": true
  }
  ```

### 3. **GET /api/rules**
- **Description**: Fetch all rules.

---

## Docker Setup

To simplify deployment, you can run the application using Docker.

### 1. Dockerize Backend

Create a `Dockerfile` in the backend directory:

```Dockerfile
FROM node:14-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

### 2. Build Docker Image

```bash
cd backend
docker build -t rule-engine-backend .
```

### 3. Run Docker Container

```bash
docker run -p 5000:5000 --env-file .env --name rule-engine-backend -d rule-engine-backend
```

### 4. Run MongoDB with Docker

```bash
docker run --name rule-engine-db -p 27017:27017 -d mongo
```

You can now access the backend at `http://localhost:5000`.

---

## Testing

### Run Unit Tests

1. **Backend**:
   ```bash
   cd backend
   npm test
   ```

2. **Frontend**:
   ```bash
   cd frontend
   npm test
   ```

