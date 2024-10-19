 Project Overview
This project implements a 3-tier Rule Engine application that uses an Abstract Syntax Tree (AST) to represent conditional rules. Users can create, combine, and evaluate rules based on attributes like age, department, income, spend, etc. The system allows dynamic rule creation and evaluation, with rules stored and managed in a MongoDB database.

2. Features
Dynamic creation, combination, and modification of rules.
Uses an Abstract Syntax Tree (AST) to represent rules.
Rules can be evaluated against user data (e.g., age, department, income).
API for creating and combining rules.
Frontend UI built with React for rule management.
Backend built with Node.js and Express.
Data storage in MongoDB.
3. Tech Stack
Frontend: React.js
Backend: Node.js, Express.js
Database: MongoDB
Language: JavaScript (ES6+)
Containerization: Docker (optional)
4. Prerequisites
Before you can set up the project, make sure you have the following installed:

Node.js (v14+)
npm (Node Package Manager)
MongoDB (v4.4+ or MongoDB Atlas for cloud hosting)
Docker (if you want to use Docker containers)
5. Installation Instructions
Step 1: Clone the Repository
bash
Copy code
git clone https://github.com/your-username/rule-engine-ast.git
cd rule-engine-ast
Step 2: Install Dependencies
Backend:

bash
Copy code
cd backend
npm install
Frontend:

bash
Copy code
cd ../frontend
npm install
Step 3: Set Up Environment Variables
For the backend, create a .env file in the backend directory:

bash
Copy code
MONGO_URI=mongodb://localhost:27017/rule_engine
PORT=5000
Note: If you're using MongoDB Atlas for the database, replace MONGO_URI with your Atlas connection string.

Step 4: Start MongoDB
If you have MongoDB installed locally:

bash
Copy code
mongod --dbpath /your/local/dbpath
If you're using Docker for MongoDB:

bash
Copy code
docker run -d -p 27017:27017 --name rule-engine-mongo mongo
Step 5: Start the Backend Server
bash
Copy code
cd backend
npm start
The backend will be running on http://localhost:5000.

Step 6: Start the Frontend
In a new terminal window:

bash
Copy code
cd frontend
npm start
The frontend will be running on http://localhost:3000.

6. API Endpoints
1. Create Rule (POST)
URL: /api/rules/create_rule
Description: Creates an AST for a given rule string.
Request Body:
json
Copy code
{
  "rule": "age > 30 AND department = 'Sales'"
}
Response:
json
Copy code
{
  "_id": "60c728b1b3db52001f6e8f15",
  "type": "operand",
  "left": null,
  "right": null,
  "value": "age > 30 AND department = 'Sales'"
}
2. Combine Rules (POST)
URL: /api/rules/combine_rules
Description: Combines multiple rules into a single AST.
Request Body:
json
Copy code
{
  "rules": [
    "age > 30 AND department = 'Sales'",
    "age < 25 AND department = 'Marketing'"
  ]
}
Response: Combined AST root node.
3. Evaluate Rule (POST)
URL: /api/rules/evaluate_rule
Description: Evaluates the rule AST against user data.
Request Body:
json
Copy code
{
  "ruleAST": { /* AST object */ },
  "data": {
    "age": 35,
    "department": "Sales",
    "salary": 60000,
    "experience": 3
  }
}
Response: true or false.
7. Design Choices
1. Data Structure for AST
We represent the AST as a tree of Node objects with the following fields:

type: A string indicating whether the node is an operator (AND, OR) or an operand (a condition).
left: The left child node (for operators).
right: The right child node (for operators).
value: The value for operand nodes (conditions like age > 30).
This flexible design allows us to dynamically create, combine, and modify rules.

2. Database Choice: MongoDB
We chose MongoDB because it provides a flexible schema, making it easy to store AST structures. Its document-based format allows easy retrieval and manipulation of nested structures, like trees.

3. Use of Express for API
Express provides a minimalistic framework for building the backend API, making it easy to define endpoints for rule management.

4. Frontend UI with React
React provides a dynamic user interface for creating, combining, and managing rules. It offers component-based design, which makes it easier to handle forms and integrate the API.

5. Optional Docker Support
To ensure the application is portable and easy to set up, we have added support for Docker. This allows users to set up both the MongoDB and Node.js server as containers, ensuring consistency across different environments.

8. Dependencies
Backend (Node.js):
express: Web framework for the backend API.
mongoose: ODM for MongoDB.
body-parser: Middleware for parsing request bodies.
cors: Middleware for handling cross-origin requests.
Frontend (React):
axios: For making HTTP requests from React.
react: The core React library.
react-dom: For rendering React components.
9. Testing Instructions
We recommend using Postman or cURL to test the backend APIs. Here are sample cURL commands to test:

Create Rule:

curl -X POST http://localhost:5000/api/rules/create_rule -H "Content-Type: application/json" -d '{"rule": "age > 30 AND department = Sales"}'
Combine Rules:


curl -X POST http://localhost:5000/api/rules/combine_rules -H "Content-Type: application/json" -d '{"rules": ["age > 30 AND department = Sales", "age < 25 AND department = Marketing"]}'
Evaluate Rule:


curl -X POST http://localhost:5000/api/rules/evaluate_rule -H "Content-Type: application/json" -d '{"ruleAST": { /* AST object */ }, "data": {"age": 35, "department": "Sales"}}'
10. Running with Docker
You can also run the application with Docker. Follow these steps:

1. Backend Docker Setup
Create a Dockerfile for the backend in the backend folder:

dockerfile
Copy code
FROM node:14

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5000
CMD ["npm", "start"]
2. MongoDB Docker Setup
You can spin up a MongoDB instance using Docker:



docker run -d -p 27017:27017 --name rule-engine-mongo mongo
3. Running Containers
Build and run the backend:


docker build -t rule-engine-backend .
docker run -p 5000:5000 rule-engine-backend
