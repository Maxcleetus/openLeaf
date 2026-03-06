const getGeminiResponse = async (question, prompt) => {
  const API_KEY = process.env.GEMINI_API_KEY;
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured on the backend.");
  }

  const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const aiResponse = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: prompt(question),
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.7,
        topK: 1,
        topP: 1,
        maxOutputTokens: 2500,
      },
    }),
  });

  const data = await aiResponse.json();
  if (!aiResponse.ok) {
    throw new Error(data.error?.message || "Gemini API Error");
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "";
};

export const handleChatResponse = async (req, res) => {
  const { question } = req.body;

  if (!question) {
    return res.status(400).json({ message: "Question is required." });
  }

  try {
    const text = await getGeminiResponse(
      question,
      (q) => `Provide a comprehensive explanation of "${q}" for educational purposes. Structure your response with:

1. **Overview** - Brief introduction
2. **Key Concepts** - Core principles with bullet points
3. **Detailed Explanation** - In-depth analysis
4. **Real-World Applications** - Practical examples
5. **Common Questions** - FAQ section
6. **Summary & Takeaways** - Key points to remember

Use clear headings, bullet points for lists, and maintain a professional yet accessible tone suitable for students and learners. Only maximum 400 words.`
    );

    res.status(200).json({ text });
  } catch (error) {
    console.error("Chatbot response error:", error.message);
    res.status(500).json({ message: "Service Error", error: error.message });
  }
};
