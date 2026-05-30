import Test from "../models/TestModel.js";
import testSubmissionModel from "../models/testSubmissionModel.js";
//create test
export const createTest = async (req, res) => {
  try {
    const { title, description, duration, questions } = req.body;

    if (!title || !duration || !questions?.length) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const test = await Test.create({
      title,
      description,
      duration,
      questions,
      createdBy: req.user._id,
    });

    res.status(201).json({
      success: true,
      message: "Test created successfully",
      test,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//get all tests
export const getAllTests = async (req, res) => {
  try {
    const tests = await Test.find()
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: tests.length,
      tests,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//get single test
export const getSingleTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id)
      .populate("createdBy", "name email");

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    res.status(200).json({
      success: true,
      test,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//delete test
export const deleteTest = async (req, res) => {
  try {
    const test = await Test.findById(req.params.id);

    if (!test) {
      return res.status(404).json({
        success: false,
        message: "Test not found",
      });
    }

    await test.deleteOne();

    res.status(200).json({
      success: true,
      message: "Test deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const submitTest = async (req, res) => {
  try {
    const { id } = req.params;
    const { answers } = req.body;
    const userId = req.user.id || req.user._id;

    const test = await Test.findById(id);

    if (!test) {
      return res.status(404).json({ message: "Test not found" });
    }

    let correctCount = 0;
    let wrongCount = 0;

    // ✅ NEW ARRAY with correctOption
    const formattedAnswers = answers.map((ans) => {
      const question = test.questions.find(
        (q) => q._id.toString() === ans.questionId
      );

      let correctOption = null;

      if (question) {
        correctOption = question.correctAnswer;

        if (ans.selectedOption === -1) {
          // skipped → treat as wrong or ignore (your choice)
          wrongCount++;
        } else if (question.correctAnswer === ans.selectedOption) {
          correctCount++;
        } else {
          wrongCount++;
        }
      }

      return {
        questionId: ans.questionId,
        selectedOption: ans.selectedOption,
        correctOption, // ✅ store here
      };
    });

    const submission = await testSubmissionModel.create({
      userId,
      testId: id,
      answers: formattedAnswers,
      score: correctCount,
      correctCount,
      wrongCount,
    });

    res.status(201).json({
      message: "Test submitted successfully",
      submission,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};