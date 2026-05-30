import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CheckCircle } from "lucide-react";
import testService from "../services/testService";
import { toast } from "react-hot-toast";

const Exam = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [test, setTest] = useState(null);
    const [answers, setAnswers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timeLeft, setTimeLeft] = useState(0);
    const [submitted, setSubmitted] = useState(false);

    const [result, setResult] = useState(null);
    const [showModal, setShowModal] = useState(false);

    // ================= LOAD TEST =================
    const loadTest = async () => {
        try {
            setLoading(true);

            const res = await testService.getTestById(id);
            const testData = res?.test || res;

            if (!testData) {
                toast.error("Test not found");
                return;
            }

            setTest(testData);

            setAnswers(
                testData.questions.map((q) => ({
                    questionId: q._id,
                    selected: null,
                }))
            );

            setTimeLeft((testData.duration || 30) * 60);
        } catch (err) {
            console.log(err);
            toast.error("Failed to load test");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadTest();
    }, [id]);

    // ================= TIMER =================
    useEffect(() => {
        if (!timeLeft || submitted) return;

        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, submitted]);

    const formatTime = (sec) => {
        const m = Math.floor(sec / 60);
        const s = sec % 60;
        return `${m}:${s < 10 ? "0" : ""}${s}`;
    };

    // ================= SELECT =================
    const handleSelect = (qIndex, optIndex) => {
        setAnswers((prev) => {
            const updated = [...prev];
            updated[qIndex] = {
                ...updated[qIndex],
                selected: optIndex,
            };
            return updated;
        });
    };

    // ================= SUBMIT =================
    const handleSubmit = async () => {
        if (submitted) return;

        try {
            setSubmitted(true);

            const payload = {
                answers: answers.map((a) => ({
                    questionId: a.questionId,
                    selectedOption:
                        a.selected !== null ? Number(a.selected) : -1,
                })),
            };

            const res = await testService.submitTest(id, payload);

            setResult(res.submission);
            setShowModal(true);

            toast.success("Test submitted successfully");
        } catch (err) {
            console.log(err);
            toast.error("Submit failed");
            setSubmitted(false);
        }
    };

    // ================= UI =================
    if (loading) return <div className="p-6">Loading test...</div>;
    if (!test) return <div className="p-6">Test not found</div>;

    const percentage =
        result && test
            ? Math.round((result.score / test.questions.length) * 100)
            : 0;

    return (
        <div className="p-6 bg-slate-50 min-h-screen">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h1 className="text-2xl font-bold">{test.title}</h1>
                    <p className="text-slate-500">{test.description}</p>
                </div>

                <div className="bg-white border border-slate-200 shadow px-4 py-2 rounded-lg">
                    ⏱ {formatTime(timeLeft)}
                </div>
            </div>

            {/* QUESTIONS */}
            <div className="space-y-5">
                {test.questions.map((q, i) => (
                    <div
                        key={q._id}
                        className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm"
                    >
                        <h2 className="font-semibold mb-3">
                            {i + 1}. {q.question}
                        </h2>

                        <div className="space-y-2">
                            {q.options.map((opt, j) => (
                                <label
                                    key={j}
                                    className="flex items-center gap-2 cursor-pointer"
                                >
                                    <input
                                        type="radio"
                                        name={`q-${i}`}
                                        checked={answers[i]?.selected === j}
                                        onChange={() => handleSelect(i, j)}
                                        disabled={submitted}
                                    />
                                    <span>{opt}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* SUBMIT */}
            <button
                onClick={handleSubmit}
                disabled={submitted}
                className={`mt-6 px-6 py-2 rounded-lg text-white ${submitted
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-emerald-500 hover:bg-emerald-600"
                    }`}
            >
                {submitted ? "Submitting..." : "Submit Test"}
            </button>

            {/* RESULT MODAL */}
            {showModal && result && (
                <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 z-50">
                    <div className="bg-white rounded-xl p-6 w-96 shadow-lg text-center">

                        <div className="flex justify-center mb-3">
                            <CheckCircle size={50} className="text-green-500" />
                        </div>

                        <h2 className="text-xl font-bold mb-4">Test Submitted</h2>

                        <p className="mb-2">
                            Total Questions: <strong>{test.questions.length}</strong>
                        </p>

                        <p className="mb-2">
                            Score: <strong>{result.score}</strong>
                        </p>

                        {/* ✅ NEW */}
                        <p className="mb-2 text-green-600">
                            Correct Answers: <strong>{result.correctCount}</strong>
                        </p>

                        <p className="mb-2 text-red-500">
                            Wrong Answers: <strong>{result.wrongCount}</strong>
                        </p>

                        <p className="mb-4">
                            Percentage: <strong>{percentage}%</strong>
                        </p>

                        <button
                            onClick={() => {
                                setShowModal(false);
                                navigate("/tests");
                            }}
                            className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-lg"
                        >
                            Go to Tests
                        </button>

                    </div>
                </div>
            )}
        </div>
    );
};

export default Exam;