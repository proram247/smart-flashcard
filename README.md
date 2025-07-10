# Smart Flashcard Backend

A Node.js/Express backend for a smart flashcard system with automatic subject inference and mixed subject retrieval, using MongoDB for storage.

## Features

- Add flashcards with automatic subject detection (rule-based)
- Retrieve a mixed batch of flashcards by subject for a student
- Interactive API documentation with Swagger
- PM2 process management for production deployment

## Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- PM2 (Process Manager)
- Swagger (API Documentation)

## Setup & Installation


1. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Configure environment variables:**

   - Create a `.env` file in the root directory:
     ```env
     MONGODB_URI=mongodb://localhost:27017/flashcards
     PORT=3000
     ```

4. **Start MongoDB:**

   - Make sure MongoDB is running locally (or update the URI for Atlas/cloud).

5. **Run the server:**

   **For Development:**

   ```bash
   npm run dev
   ```

   **For Production (PM2):**

   ```bash
   npm start
   ```

   **Other PM2 Commands:**

   ```bash
   npm run stop      # Stop all instances
   npm run restart   # Reload all instances
   ```

## API Documentation

Visit `http://localhost:3000/api-docs` for interactive API documentation with Swagger UI.

## API Endpoints

### 1. Add Flashcard with Subject Inference

- **POST /create-flashcard**
- **Request Body:**
  ```json
  {
    "student_id": "stu001",
    "question": "What is Newton's Second Law?",
    "answer": "Force equals mass times acceleration"
  }
  ```
- **Response:**
  ```json
  {
    "message": "Flashcard added successfully",
    "subject": "Physics"
  }
  ```

### 2. Get Flashcards by Mixed Subjects

- **GET /get-subject?student_id=stu001&limit=5**
- **Response:**
  ```json
  [
    {
      "question": "What is Newton's Second Law?",
      "answer": "Force equals mass times acceleration",
      "subject": "Physics"
    },
    {
      "question": "What is photosynthesis?",
      "answer": "A process used by plants to convert light into energy",
      "subject": "Biology"
    }
  ]
  ```


## Available Scripts

- `npm run dev` - Start development server with nodemon
- `npm start` - Start production server with PM2 (cluster mode)
- `npm run stop` - Stop PM2 processes
- `npm run restart` - Reload PM2 processes

## Subject Classification

The system automatically classifies flashcards into subjects using keyword analysis:

- **Physics**: newton, gravity, force, energy, quantum, relativity, etc.
- **Biology**: photosynthesis, cell, dna, evolution, organism, etc.
- **Chemistry**: atom, molecule, reaction, acid, base, etc.
- **Mathematics**: algebra, calculus, equation, geometry, etc.
- **History**: revolution, war, empire, democracy, etc.
- **Geography**: continent, ocean, mountain, climate, etc.
- **Computer Science**: algorithm, programming, database, etc.
- **Literature**: novel, poem, drama, metaphor, etc.
- **Economics**: market, supply, demand, inflation, etc.
- **Psychology**: mind, emotion, behavior, personality, etc.

## Notes
- The subject inference is rule-based and can be extended for more subjects or replaced with ML.
- Make sure to set your MongoDB URI in `.env` if using a remote database.
- PM2 runs the application in cluster mode for better performance and reliability.

---
