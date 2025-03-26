import { GoogleGenerativeAI } from "@google/generative-ai";

// Load API key from environment variables
const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error("❌ API Key is missing! Make sure to set VITE_GEMINI_API_KEY in your .env file.");
}

const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

async function run(prompt) {
    try {
        const chatSession = model.startChat({
            generationConfig,
            history: [],
        });

        const result = await chatSession.sendMessage(prompt);
        const response = result.response;
        console.log("Gemini Response:", response.text());
        return response.text();  
    } catch (error) {
        console.error("❌ Error calling Gemini API:", error);
        return "Failed to fetch response from Gemini API.";
    }
}

export default run;
