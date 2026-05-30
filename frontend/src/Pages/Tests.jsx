import { useEffect, useState } from "react";
import { Plus, Trash, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import testService from "../services/testService";
import { useAuth } from "../context/AuthContext";

const Tests = () => {
    const navigate = useNavigate();
    const { user } = useAuth(); // ✅ get user role

    const [open, setOpen] = useState(false);
    const [tests, setTests] = useState([]);
    const [deleteId, setDeleteId] = useState(null);

    const [formData, setFormData] = useState({
        title: "Untitled Test",
        description: "No description",
        duration: 30,
        subject: "",
        questions: [
            {
                question: "",
                options: ["", "", "", ""],
                correctAnswer: 0,
            },
        ],
    });

    // ================= FETCH TESTS =================
    const fetchTests = async () => {
        try {
            const res = await testService.getAllTests();
            setTests(res?.tests || []);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    // ================= CREATE TEST =================
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await testService.createTest(formData);
            setOpen(false);

            setFormData({
                title: "Untitled Test",
                description: "No description",
                duration: 30,
                subject: "",
                questions: [
                    {
                        question: "",
                        options: ["", "", "", ""],
                        correctAnswer: 0,
                    },
                ],
            });

            fetchTests();
        } catch (err) {
            console.log(err);
        }
    };

    // ================= DELETE TEST =================
    const handleDelete = async () => {
        try {
            await testService.deleteTest(deleteId);
            setDeleteId(null);
            fetchTests();
        } catch (err) {
            console.log(err);
        }
    };

    // ================= QUESTION HANDLERS =================
    const handleQuestionChange = (index, value) => {
        const updated = [...formData.questions];
        updated[index].question = value;
        setFormData({ ...formData, questions: updated });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const updated = [...formData.questions];
        updated[qIndex].options[oIndex] = value;
        setFormData({ ...formData, questions: updated });
    };

    const addQuestion = () => {
        setFormData({
            ...formData,
            questions: [
                ...formData.questions,
                {
                    question: "",
                    options: ["", "", "", ""],
                    correctAnswer: 0,
                },
            ],
        });
    };

    const removeQuestion = (index) => {
        const updated = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: updated });
    };

    return (
        <div className="p-6 bg-slate-50 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Tests</h1>

                {/* ✅ ROLE BASED BUTTON */}
                {user?.role !== "user" && (
                    <button
                        onClick={() => setOpen(true)}
                        className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg shadow hover:bg-emerald-600"
                    >
                        <Plus size={18} />
                        Create Test
                    </button>
                )}
            </div>

            {/* ================= TEST CARDS ================= */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {tests.map((test) => (
                    <div
                        key={test._id}
                        onClick={() => navigate(`/tests/${test._id}`)}
                        className="p-5 bg-white border border-slate-200 rounded-xl shadow-sm hover:shadow-md transition cursor-pointer"
                    >
                        {/* TITLE + DELETE */}
                        <div className="flex justify-between items-start">
                            <h2 className="font-semibold text-lg">{test.title}</h2>

                            {/* (optional: also restrict delete for users) */}
                            {user?.role !== "user" && (
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setDeleteId(test._id);
                                    }}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <Trash size={18} />
                                </button>
                            )}
                        </div>

                        <p className="text-sm text-slate-500 mt-1">
                            {test.subject || "General"}
                        </p>

                        <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                            {test.description}
                        </p>

                        <div className="flex items-center gap-2 mt-3 text-sm text-slate-600">
                            <Clock size={16} className="text-emerald-500" />
                            <span>Duration: {test.duration} mins</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* ================= CREATE MODAL ================= */}
            {open && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

                    <div className="bg-white w-[800px] max-h-[90vh] overflow-y-auto rounded-xl shadow-xl border border-slate-200 p-6">

                        <h2 className="text-xl font-bold mb-4">Create Test</h2>

                        <div className="grid grid-cols-2 gap-3 mb-5">

                            <input
                                placeholder="Title"
                                value={formData.title}
                                onChange={(e) =>
                                    setFormData({ ...formData, title: e.target.value })
                                }
                                className="border border-slate-200 p-2 rounded-md"
                            />

                            <input
                                placeholder="Subject"
                                value={formData.subject}
                                onChange={(e) =>
                                    setFormData({ ...formData, subject: e.target.value })
                                }
                                className="border border-slate-200 p-2 rounded-md"
                            />

                            <input
                                type="number"
                                placeholder="Duration"
                                value={formData.duration}
                                onChange={(e) =>
                                    setFormData({ ...formData, duration: e.target.value })
                                }
                                className="border border-slate-200 p-2 rounded-md"
                            />

                            <textarea
                                placeholder="Description"
                                value={formData.description}
                                onChange={(e) =>
                                    setFormData({ ...formData, description: e.target.value })
                                }
                                className="border border-slate-200 p-2 rounded-md"
                            />
                        </div>

                        {/* QUESTIONS */}
                        {formData.questions.map((q, qIndex) => (
                            <div
                                key={qIndex}
                                className="border border-slate-200 rounded-lg p-4 mb-4 bg-slate-50"
                            >
                                <div className="flex justify-between">
                                    <h3 className="font-semibold">Question {qIndex + 1}</h3>

                                    <button
                                        onClick={() => removeQuestion(qIndex)}
                                        className="text-red-500"
                                    >
                                        <Trash size={16} />
                                    </button>
                                </div>

                                <input
                                    placeholder="Enter question"
                                    value={q.question}
                                    onChange={(e) =>
                                        handleQuestionChange(qIndex, e.target.value)
                                    }
                                    className="w-full border border-slate-200 rounded-md p-2 mt-3"
                                />

                                <div className="grid grid-cols-2 gap-2 mt-3">
                                    {q.options.map((opt, oIndex) => (
                                        <input
                                            key={oIndex}
                                            placeholder={`Option ${oIndex + 1}`}
                                            value={opt}
                                            onChange={(e) =>
                                                handleOptionChange(qIndex, oIndex, e.target.value)
                                            }
                                            className="border border-slate-200 rounded-md p-2"
                                        />
                                    ))}
                                </div>
                                <div className="mt-3">
                                    <label className="text-sm font-medium text-slate-600">
                                        Correct Option
                                    </label>

                                    <select
                                        value={q.correctAnswer}
                                        onChange={(e) => {
                                            const updated = [...formData.questions];
                                            updated[qIndex].correctAnswer = Number(e.target.value);
                                            setFormData({ ...formData, questions: updated });
                                        }}
                                        className="w-full border border-slate-200 rounded-md p-2 mt-1"
                                    >
                                        {q.options.map((_, oIndex) => (
                                            <option key={oIndex} value={oIndex}>
                                                Option {oIndex + 1}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        ))}



                        <button
                            onClick={addQuestion}
                            className="bg-slate-100 border border-slate-200 px-4 py-2 rounded-lg mb-4"
                        >
                            + Add Question
                        </button>

                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setOpen(false)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleSubmit}
                                className="px-4 py-2 bg-emerald-500 text-white rounded-lg"
                            >
                                Create
                            </button>
                        </div>

                    </div>
                </div>
            )}

            {/* ================= DELETE MODAL ================= */}
            {deleteId && (
                <div className="fixed inset-0 bg-black/50 flex justify-center items-center">

                    <div className="bg-white w-[400px] p-6 rounded-xl shadow-xl">

                        <h2 className="text-lg font-bold mb-3">
                            Confirm Delete
                        </h2>

                        <p className="text-sm text-slate-600 mb-5">
                            Are you sure you want to delete this test?
                        </p>

                        <div className="flex justify-end gap-2">

                            <button
                                onClick={() => setDeleteId(null)}
                                className="px-4 py-2 border rounded-lg"
                            >
                                Cancel
                            </button>

                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg"
                            >
                                Delete
                            </button>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
};

export default Tests;