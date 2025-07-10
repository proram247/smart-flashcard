const Flashcard = require("../models/Flashcard");
const { inferSubject } = require("../utils/subjectClassifier");
const { logInfo, logError } = require("../config/logger");

// Add a new flashcard with subject inference
async function addFlashcard(req, res) {
  try {
    const { student_id, question, answer } = req.body;
    if (!student_id || !question || !answer) {
      logError("Missing required fields in flashcard creation", {
        student_id,
        question: question ? "provided" : "missing",
        answer: answer ? "provided" : "missing",
      });
      return res.status(400).json({ message: "Missing required fields" });
    }

    const subject = inferSubject(question + " " + answer);
    const flashcard = new Flashcard({ student_id, question, answer, subject });
    await flashcard.save();

    logInfo("Flashcard created successfully", {
      student_id,
      subject,
      questionLength: question.length,
    });
    res.json({ message: "Flashcard added successfully", subject });
  } catch (err) {
    logError("Error creating flashcard", err);
    res.status(500).json({ message: "Server error" });
  }
}

// Get mixed subject flashcards for a student
async function getMixedSubjectFlashcards(req, res) {
  try {
    const { student_id, limit } = req.query;
    if (!student_id) {
      logError("Missing student_id in flashcard retrieval");
      return res.status(400).json({ message: "Missing student_id" });
    }

    const lim = parseInt(limit) || 5;
    const cards = await Flashcard.find({ student_id });

    logInfo("Flashcards retrieved", {
      student_id,
      totalCards: cards.length,
      requestedLimit: lim,
    });

    const bySubject = {};
    for (const card of cards) {
      if (!bySubject[card.subject]) bySubject[card.subject] = [];
      bySubject[card.subject].push(card);
    }

    let result = [];
    const subjects = Object.keys(bySubject);
    for (let i = subjects.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [subjects[i], subjects[j]] = [subjects[j], subjects[i]];
    }

    for (const subject of subjects) {
      if (result.length < lim && bySubject[subject].length > 0) {
        const cardsArr = bySubject[subject];
        const idx = Math.floor(Math.random() * cardsArr.length);
        result.push(cardsArr[idx]);
      }
    }

    if (result.length < lim) {
      const remaining = cards.filter((c) => !result.includes(c));
      for (let i = remaining.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remaining[i], remaining[j]] = [remaining[j], remaining[i]];
      }
      result = result.concat(remaining.slice(0, lim - result.length));
    }

    const output = result.map((card) => ({
      question: card.question,
      answer: card.answer,
      subject: card.subject,
    }));

    logInfo("Mixed subject flashcards returned", {
      student_id,
      returnedCount: output.length,
      subjects: [...new Set(output.map((card) => card.subject))],
    });
    res.json(output);
  } catch (err) {
    logError("Error retrieving flashcards", err);
    res.status(500).json({ message: "Server error" });
  }
}

module.exports = {
  addFlashcard,
  getMixedSubjectFlashcards,
};
