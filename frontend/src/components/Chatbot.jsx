import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Download, X, Send, User, Loader, Bot, Sparkles, FileText } from "lucide-react";
import { toast } from "react-toastify";
import { jsPDF } from "jspdf";

const Chatbot = () => {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hello! 👋 I'm your ReadMe Assistant. I can help explain complex topics and generate beautiful PDF summaries for you. What would you like to learn about today?",
            sender: "bot"
        }
    ]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const chatContainerRef = useRef(null);
    const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://open-leaf.vercel.app/api/common";

    // Auto-scroll to bottom when new messages are added
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);

    const formatAIResponse = (text) => {
        // Enhanced formatting for better readability
        return text
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/^(#{1,3})\s+(.*)$/gm, (match, hashes, content) => {
                const level = hashes.length;
                return `<div class="font-bold ${level === 1 ? 'text-lg text-blue-600 mt-4' : level === 2 ? 'text-md text-blue-500 mt-3' : 'text-sm text-blue-400 mt-2'}">${content}</div>`;
            })
            .replace(/^\s*[-*]\s+(.*)$/gm, '<li class="ml-4">• $1</li>')
            .replace(/^\s*\d+\.\s+(.*)$/gm, '<li class="ml-4">$1</li>')
            .split('\n')
            .map(line => line.trim() ? `<p class="mb-2">${line}</p>` : '<br/>')
            .join('');
    };

    const getAIResponse = async (question) => {
        try {
            const response = await fetch(`${API_BASE_URL}/chat-response`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) {
                throw new Error(`API Error: ${response.status}`);
            }

            const data = await response.json();
            return data.text;
        } catch (error) {
            console.error("Chatbot API Error:", error);
            return `I'll explain "${question}" in a structured way:

## Overview
A fundamental concept with wide-ranging applications.

## Key Concepts
• Core Principle 1
• Core Principle 2
• Core Principle 3

## Detailed Explanation
This topic encompasses several important aspects that are crucial for understanding the subject matter.

## Real-World Applications
1. Application in Industry
2. Everyday Examples
3. Future Implications

## Common Questions
Q: What's the most important aspect?
A: Understanding the basic principles.

## Summary & Takeaways
Key points to remember for practical application.`;
        }
    };

    const handleSend = async (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const userMessage = {
            id: messages.length + 1,
            text: input,
            sender: "user",
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages(prev => [...prev, userMessage]);
        const userQuestion = input;
        setInput("");
        setLoading(true);

        try {
            // Get AI response from Gemini API
            const aiResponse = await getAIResponse(userQuestion);

            const botMessage = {
                id: messages.length + 2,
                text: aiResponse,
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                formattedText: formatAIResponse(aiResponse)
            };
            setMessages(prev => [...prev, botMessage]);
            toast.success("✅ Response generated!");
        } catch (error) {
            console.error("Error:", error);
            // Fallback response if API fails
            const fallbackResponse = `I'd be happy to explain "${userQuestion}"! Here's a structured breakdown:

## Overview
This topic covers essential principles and applications.

## Key Concepts
• Fundamental Principle 1
• Core Component 2
• Important Relationship 3

## Detailed Explanation
While I can provide general information, for comprehensive details, ensure your API key is properly configured.

## Real-World Applications
• Industry Use Cases
• Practical Implementations
• Future Developments

## Common Questions
Q: Why is this important?
A: It forms the foundation for advanced topics.

## Summary & Takeaways
Remember these key points for better understanding.`;

            const botMessage = {
                id: messages.length + 2,
                text: fallbackResponse,
                sender: "bot",
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                formattedText: formatAIResponse(fallbackResponse)
            };
            setMessages(prev => [...prev, botMessage]);
            toast.warning("⚠️ Using fallback response - check backend API");
        } finally {
            setLoading(false);
        }
    };

    const generatePDF = () => {
        if (messages.length <= 1) {
            toast.warning("No conversation to download");
            return;
        }

        try {
            toast.info("Generating PDF...");

            const doc = new jsPDF({ unit: "pt", format: "a4" });
            const pageWidth = doc.internal.pageSize.getWidth();
            const pageHeight = doc.internal.pageSize.getHeight();
            const marginX = 44;
            const topMargin = 56;
            const bottomMargin = 52;
            const cardPadding = 12;
            const cardGap = 10;
            const lineHeight = 16;
            const cardWidth = pageWidth - marginX * 2;
            const generatedAt = new Date().toLocaleString();
            let yPos = topMargin + 44;

            const normalizeText = (text) =>
                text
                    .replace(/\r\n/g, "\n")
                    .replace(/^#{1,6}\s*/gm, "")
                    .replace(/\*\*(.*?)\*\*/g, "$1")
                    .replace(/\*(.*?)\*/g, "$1")
                    .replace(/^\s*[-*]\s+/gm, "• ");

            const drawHeader = () => {
                doc.setFillColor(241, 245, 249);
                doc.rect(0, 0, pageWidth, 34, "F");
                doc.setFont("helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(3, 93, 202);
                doc.text("ReadMe Assistant Conversation", marginX, 22);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(9);
                doc.setTextColor(100, 116, 139);
                doc.text(generatedAt, pageWidth - marginX, 22, { align: "right" });
            };

            drawHeader();
            doc.setFont("helvetica", "bold");
            doc.setFontSize(21);
            doc.setTextColor(15, 23, 42);
            doc.text("Chat Transcript", marginX, topMargin);
            doc.setFont("helvetica", "normal");
            doc.setFontSize(11);
            doc.setTextColor(71, 85, 105);
            doc.text("Structured export of your conversation", marginX, topMargin + 18);

            messages.forEach((msg) => {
                const cleanText = normalizeText(msg.text);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(11);
                const textLines = doc.splitTextToSize(cleanText, cardWidth - cardPadding * 2);
                const textBlockHeight = Math.max(lineHeight, textLines.length * lineHeight);
                const cardHeight = 34 + textBlockHeight + cardPadding;
                const maxY = pageHeight - bottomMargin;

                if (yPos + cardHeight > maxY) {
                    doc.addPage();
                    drawHeader();
                    yPos = topMargin;
                }

                const isUser = msg.sender === "user";
                const cardBg = isUser ? [239, 246, 255] : [248, 250, 252];
                const borderColor = isUser ? [147, 197, 253] : [203, 213, 225];
                const badgeBg = isUser ? [3, 93, 202] : [71, 85, 105];

                doc.setFillColor(...cardBg);
                doc.setDrawColor(...borderColor);
                doc.setLineWidth(0.8);
                doc.roundedRect(marginX, yPos, cardWidth, cardHeight, 8, 8, "FD");

                doc.setFillColor(...badgeBg);
                doc.roundedRect(marginX + 12, yPos + 10, 62, 14, 4, 4, "F");
                doc.setFont("helvetica", "bold");
                doc.setFontSize(8);
                doc.setTextColor(255, 255, 255);
                doc.text(isUser ? "YOU" : "ASSISTANT", marginX + 43, yPos + 20, { align: "center" });

                if (msg.timestamp) {
                    doc.setFont("helvetica", "normal");
                    doc.setFontSize(8);
                    doc.setTextColor(100, 116, 139);
                    doc.text(msg.timestamp, marginX + cardWidth - 12, yPos + 20, { align: "right" });
                }

                doc.setFont("helvetica", "normal");
                doc.setFontSize(11);
                doc.setTextColor(15, 23, 42);
                doc.text(textLines, marginX + cardPadding, yPos + 38);

                yPos += cardHeight + cardGap;
            });

            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setDrawColor(226, 232, 240);
                doc.setLineWidth(0.8);
                doc.line(marginX, pageHeight - 32, pageWidth - marginX, pageHeight - 32);
                doc.setFont("helvetica", "normal");
                doc.setFontSize(8);
                doc.setTextColor(100, 116, 139);
                doc.text(`Page ${i} of ${pageCount}`, pageWidth - marginX, pageHeight - 20, { align: "right" });
                doc.text("Generated by ReadMe Assistant", marginX, pageHeight - 20);
            }

            doc.save(`ai-chatbot-conversation-${Date.now()}.pdf`);
            toast.success("PDF downloaded successfully!");

        } catch (error) {
            console.error("PDF generation error:", error);
            toast.error("Failed to generate PDF");
        }
    };

    const clearChat = () => {
        setMessages([
            {
                id: 1,
                text: "Hello! 👋 I'm your ReadMe Assistant. I can help explain complex topics and generate beautiful PDF summaries for you. What would you like to learn about today?",
                sender: "bot"
            }
        ]);
        toast.info("💬 Chat cleared");
    };

    const quickQuestions = [
        "What is machine learning?",
        "Explain quantum computing",
        "How does blockchain work?",
        "What are neural networks?",
        "What is artificial intelligence?",
        "Explain cloud computing"
    ];

    return (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50">
            {open && (
                <div className="bg-white border border-gray-200 rounded-2xl md:rounded-3xl w-[calc(100vw-32px)] max-w-sm md:w-96 h-[550px] flex flex-col shadow-2xl backdrop-blur-sm bg-white/95">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 md:p-5 rounded-t-2xl md:rounded-t-3xl flex justify-between items-center border-b border-blue-400/30">
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <div className="p-1.5 bg-white/20 rounded-lg">
                                    <Sparkles className="w-4 h-4" />
                                </div>
                                <div>
                                    <h3 className="text-base md:text-lg font-bold truncate">ReadMe Assistant</h3>
                                    <p className="text-[10px] md:text-xs opacity-90 truncate">Intelligent Learning Companion</p>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-1 md:gap-2">
                            <button
                                onClick={generatePDF}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed group"
                                title="Download as PDF"
                                disabled={messages.length <= 1}
                            >
                                <div className="flex items-center gap-1.5">
                                    <FileText className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                    <span className="text-[10px] font-medium hidden md:inline">PDF</span>
                                </div>
                            </button>
                            <button
                                onClick={clearChat}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 group"
                                title="Clear chat"
                            >
                                <div className="flex items-center gap-1.5">
                                    <svg className="w-4 h-4 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <span className="text-[10px] font-medium hidden md:inline">Clear</span>
                                </div>
                            </button>
                            <button
                                onClick={() => setOpen(false)}
                                className="p-2 bg-white/20 hover:bg-white/30 rounded-lg transition-all duration-200 md:hidden"
                                title="Close chat"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    {/* Quick Questions */}
                    {messages.length === 1 && (
                        <div className="px-4 pt-3 pb-2">
                            <div className="flex items-center gap-2 mb-2">
                                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-pulse"></div>
                                <p className="text-xs font-medium text-gray-600">Try asking:</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {quickQuestions.map((q, idx) => (
                                    <button
                                        key={idx}
                                        onClick={() => {
                                            setInput(q);
                                            setTimeout(() => {
                                                document.querySelector('button[type="submit"]').click();
                                            }, 100);
                                        }}
                                        className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 text-blue-700 border border-blue-200 px-3 py-2 rounded-lg transition-all duration-200 hover:scale-[1.02] hover:shadow-sm"
                                    >
                                        {q.length > 25 ? q.substring(0, 25) + '...' : q}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Chat Messages */}
                    <div
                        ref={chatContainerRef}
                        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50/50 to-white"
                    >
                        {messages.map((msg) => (
                            <div
                                key={msg.id}
                                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"} animate-slideIn`}
                            >
                                <div
                                    className={`max-w-[85%] md:max-w-[80%] rounded-2xl px-4 py-3 ${msg.sender === "user"
                                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-br-none shadow-lg"
                                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-none shadow-md"
                                        }`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-full ${msg.sender === "user" ? "bg-blue-400" : "bg-gray-100"}`}>
                                                {msg.sender === "user" ?
                                                    <User className="w-3 h-3 text-white" /> :
                                                    <Bot className="w-3 h-3 text-gray-600" />
                                                }
                                            </div>
                                            <span className={`text-xs font-semibold ${msg.sender === "user" ? "text-blue-100" : "text-gray-500"}`}>
                                                {msg.sender === "user" ? "You" : "Assistant"}
                                            </span>
                                        </div>
                                        <span className={`text-[10px] ${msg.sender === "user" ? "text-blue-200" : "text-gray-400"}`}>
                                            {msg.timestamp}
                                        </span>
                                    </div>
                                    <div
                                        className="text-sm prose prose-sm max-w-none"
                                        dangerouslySetInnerHTML={{
                                            __html: msg.formattedText || formatAIResponse(msg.text)
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="flex space-x-1">
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                                            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                                        </div>
                                        <span className="text-sm text-gray-600 font-medium">Crafting response...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Form */}
                    <div className="border-t border-gray-200 p-4 bg-gradient-to-t from-white to-gray-50/50">
                        <form onSubmit={handleSend} className="relative">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder="Ask about any topic..."
                                    className="flex-1 border border-gray-300 bg-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent shadow-sm"
                                    disabled={loading}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            handleSend(e);
                                        }
                                    }}
                                />
                                <button
                                    type="submit"
                                    disabled={loading || !input.trim()}
                                    className={`bg-gradient-to-r from-blue-500 to-blue-600 text-white p-3 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg ${loading ? "animate-pulse" : ""
                                        }`}
                                >
                                    {loading ? (
                                        <Loader className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Send className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center justify-between mt-2 px-1">
                                <p className="text-[10px] text-gray-500">
                                    Press <kbd className="px-1.5 py-0.5 bg-gray-100 rounded text-xs">Enter</kbd> to send
                                </p>
                                <div className="flex items-center gap-1 text-[10px] text-gray-500">
                                    <FileText className="w-3 h-3" />
                                    <span>PDF includes full conversation</span>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Floating button */}
            <button
                onClick={() => setOpen(!open)}
                className={`bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 ${open ? "rotate-90" : ""
                    }`}
                aria-label="Open chatbot"
            >
                {open ? (
                    <p>X</p>
                ) : (
                    <MessageCircle className="w-6 h-6 md:w-7 md:h-7" />
                )}
            </button>


        </div>
    );
};

export default Chatbot;
