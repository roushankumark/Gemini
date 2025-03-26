import { createContext, useState } from "react";
import run from "../config/gemini";

export const Context = createContext();

const ContextProvider = ({ children }) => {
    const [input, setInput] = useState("");
    const [recentPrompt, setRecentPrompt] = useState("");
    const [prevPrompts, setPrevPrompts] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);
    const [resultData, setResultData] = useState("");

    const delayPara = (index, nextWord) => {
        setTimeout(() => {
            setResultData((prev) => prev + nextWord);
        }, 75 * index);
    };

    const newChat = () => {
        setLoading(false);
        setShowResult(false);
        setRecentPrompt("");
        setResultData("");
    };

    const onSent = async (prompt) => {
        setResultData("");
        setLoading(true);
        setShowResult(true);

        let response = "";
        let finalPrompt = prompt !== undefined ? prompt : input.trim();

        if (!finalPrompt) {
            setLoading(false);
            return;
        }

        try {
            response = await run(finalPrompt);
            if (!prevPrompts.includes(finalPrompt)) {
                setPrevPrompts((prev) => [...prev, finalPrompt]); 
            }
            setRecentPrompt(finalPrompt);
        } catch (error) {
            console.error("Error fetching response:", error);
            setLoading(false);
            return;
        }

        let formattedResponse = response.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>").replace(/\*/g, "</br>");
        let responseWords = formattedResponse.split(" ");

        responseWords.forEach((word, index) => {
            delayPara(index, word + " ");
        });

        setLoading(false);
        setInput("");
    };

    const contextValue = {
        prevPrompts,
        setPrevPrompts,
        onSent,
        setRecentPrompt,
        recentPrompt,
        showResult,
        loading,
        resultData,
        input,
        setInput,
        newChat,
    };

    return <Context.Provider value={contextValue}>{children}</Context.Provider>;
};

export default ContextProvider;
