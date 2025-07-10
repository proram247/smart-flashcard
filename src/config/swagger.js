const swaggerJsdoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Smart Flashcard API",
      version: "1.0.0",
      description:
        "A Node.js/Express backend for a smart flashcard system with automatic subject inference and mixed subject retrieval",
      contact: {
        name: "API Support",
        email: "support@flashcard-api.com",
      },
    },
    servers: [
      {
        url: "http://localhost:3000/api/v1/flashcard",
        description: "Development server",
      },
    ],
    components: {
      schemas: {
        Flashcard: {
          type: "object",
          properties: {
            student_id: {
              type: "string",
              description: "Unique identifier for the student",
              example: "stu001",
            },
            question: {
              type: "string",
              description: "The flashcard question",
              example: "What is Newton's Second Law?",
            },
            answer: {
              type: "string",
              description: "The flashcard answer",
              example: "Force equals mass times acceleration",
            },
            subject: {
              type: "string",
              description: "The inferred subject of the flashcard",
              example: "Physics",
            },
          },
          required: ["student_id", "question", "answer"],
        },
        AddFlashcardRequest: {
          type: "object",
          properties: {
            student_id: {
              type: "string",
              description: "Unique identifier for the student",
              example: "stu001",
            },
            question: {
              type: "string",
              description: "The flashcard question",
              example: "What is Newton's Second Law?",
            },
            answer: {
              type: "string",
              description: "The flashcard answer",
              example: "Force equals mass times acceleration",
            },
          },
          required: ["student_id", "question", "answer"],
        },
        AddFlashcardResponse: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Success message",
              example: "Flashcard added successfully",
            },
            subject: {
              type: "string",
              description: "The inferred subject",
              example: "Physics",
            },
          },
        },
        GetFlashcardsResponse: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: {
                type: "string",
                description: "The flashcard question",
                example: "What is Newton's Second Law?",
              },
              answer: {
                type: "string",
                description: "The flashcard answer",
                example: "Force equals mass times acceleration",
              },
              subject: {
                type: "string",
                description: "The subject of the flashcard",
                example: "Physics",
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            message: {
              type: "string",
              description: "Error message",
              example: "Missing required fields",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Path to the API routes
};

const specs = swaggerJsdoc(options);

module.exports = specs;
