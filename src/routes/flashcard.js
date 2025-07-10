const express = require("express");
const router = express.Router();
const {
  addFlashcard,
  getMixedSubjectFlashcards,
} = require("../controllers/flashcardController");
const cacheMiddleware = require("../middleware/cache");
/**
 * @swagger
 * /create-flashcard:
 *   post:
 *     summary: Add a new flashcard with automatic subject inference
 *     description: Creates a new flashcard for a student. The system automatically determines the subject based on the question and answer content using keyword analysis.
 *     tags: [Flashcards]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AddFlashcardRequest'
 *           example:
 *             student_id: "stu001"
 *             question: "What is Newton's Second Law?"
 *             answer: "Force equals mass times acceleration"
 *     responses:
 *       200:
 *         description: Flashcard added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AddFlashcardResponse'
 *             example:
 *               message: "Flashcard added successfully"
 *               subject: "Physics"
 *       400:
 *         description: Missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Missing required fields"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Server error"
 */
router.post("/create-flashcard", addFlashcard);

/**
 * @swagger
 * /get-subject:
 *   get:
 *     summary: Get mixed subject flashcards for a student
 *     description: Retrieves a mixed batch of flashcards from different subjects for a specific student. The system ensures variety by selecting one card from each available subject before filling remaining slots.
 *     tags: [Flashcards]
 *     parameters:
 *       - in: query
 *         name: student_id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique identifier for the student
 *         example: "stu001"
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 5
 *           minimum: 1
 *           maximum: 50
 *         description: Maximum number of flashcards to return
 *         example: 5
 *     responses:
 *       200:
 *         description: List of mixed subject flashcards
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/GetFlashcardsResponse'
 *             example:
 *               - question: "What is Newton's Second Law?"
 *                 answer: "Force equals mass times acceleration"
 *                 subject: "Physics"
 *               - question: "What is photosynthesis?"
 *                 answer: "A process used by plants to convert light into energy"
 *                 subject: "Biology"
 *       400:
 *         description: Missing student_id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Missing student_id"
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               message: "Server error"
 */
router.get("/get-subject",cacheMiddleware('10 minutes'), getMixedSubjectFlashcards);

module.exports = router;
