import React, { useState } from "react";
import { MessageCircle } from "lucide-react";
import { toast } from "react-toastify";

const Chatbot = () => {
    const [open, setOpen] = useState(false);

    // Separate states
    const [question, setQuestion] = useState("");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    // Inside Chatbot.jsx, update the fetch URL:
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch("http://localhost:3000/api/common/explain-topic", { // Your API Route
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question, email }),
            });

            if (res.ok) {
                toast.success("✅ Check your email for the explanation PDF!");
            } else {
                toast.error("❌ Failed to send. Please try again.");
            }
        } catch (error) {
            toast.error("🚨 Server error.");
        } finally {
            setLoading(false);
            setQuestion("");
            setEmail("");
            setOpen(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat popup */}
            {open && (
                <div className="bg-white border border-[#035DCA] rounded-2xl w-80 h-auto flex flex-col">
                    {/* Header */}
                    {/* Header */}
                    <div className="bg-blue-500 text-white p-3 rounded-t-2xl flex justify-between items-center">
                        <h3 className="text-lg font-semibold">Topic Explained</h3>
                        <button onClick={() => setOpen(false)} className="text-white">✖</button>
                    </div>

                    {/* Note under header */}
                    <p className="text-xs text-center text-gray-500 mt-2">
                        Available between <span className="font-semibold">7 PM – 8 PM</span>
                    </p>


                    {/* Form */}
                    <form onSubmit={handleSubmit} className="flex flex-col gap-3 p-4">
                        {/* Question */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Topic
                            </label>
                            <input
                                type="text"
                                value={question}
                                onChange={(e) => setQuestion(e.target.value)}
                                placeholder="Enter your topic"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                                required
                            />
                        </div>

                        {/* Note */}
                        <p className="text-xs text-gray-500">
                            The explanation will be sent as a{" "}
                            <span className="font-semibold">PDF</span> to this email.
                        </p>

                        {/* Submit button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`${loading ? "bg-blue-300 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"
                                } text-white py-2 px-4 rounded-lg shadow-md transition flex justify-center items-center`}
                        >
                            {loading ? (
                                <svg
                                    className="animate-spin h-5 w-5 text-white"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <circle
                                        className="opacity-25"
                                        cx="12"
                                        cy="12"
                                        r="10"
                                        stroke="currentColor"
                                        strokeWidth="4"
                                    ></circle>
                                    <path
                                        className="opacity-75"
                                        fill="currentColor"
                                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                                    ></path>
                                </svg>
                            ) : (
                                "Submit"
                            )}
                        </button>
                    </form>
                </div>
            )}

            {/* Floating button */}
            <button
                onClick={() => setOpen(!open)}
                className={`${open ? "hidden" : "block"
                    } bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transition`}
            >
                <MessageCircle size={24} />
            </button>
        </div>
    );
};

export default Chatbot;
