import { CHATCONFIG } from "./chatconfig.js";

const chatButton = document.getElementById("chat-send");
chatButton.onclick = chatSendMessage;

// get prompt
const promptResponse = await fetch("/prompts/prompt.txt");
if (!promptResponse.ok) throw new Error("Failed to load system prompt.");
const systemMessage = await promptResponse.text();
var llmMessages = [
    { role: "system", content: systemMessage.trim() }, // System message from file
];

export async function chatSendMessage() {
    const userInput = document.getElementById("chat-userInput");
    const chatMessages = document.getElementById("chat-messages");

    if (!userInput.value.trim()) return;

    // Display user message
    const userMessage = document.createElement("div");
    userMessage.textContent = userInput.value;
    userMessage.className = "chat-message chat-user-message";
    chatMessages.appendChild(userMessage);

    const userText = userInput.value;
    userInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
    // Add user message to llmMessages
    llmMessages.push({ role: "user", content: userText });

    // Fetch AI response

    const proxy = "";
    // Gemini only
    
    //const endpoint = "https://api.deepseek.com/v1/chat/completions";
    const endpoint = "https://api.openai.com/v1/chat/completions";

    // OpenAI: "https://api.openai.com/v1/chat/completions";
    // DeepSeek: "https://api.deepseek.com/v1/chat/completions";
    // Gemini: "https://generativelanguage.googleapis.com/v1beta/openai/";
    // Claude: "https://api.anthropic.com/v1/";
    
    //const model = "deepseek-reasoner";
    const model = "o3-mini";
    //const model = "gpt-4o";

    // o3-mini
    // gpt-4o
    // deepseek-chat
    // deepseek-reasoner
    // claude-3-7-sonnet-20250219
    // gemini-2.0-flash
    // gemini-2.0-flash-lite

    const headers = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${CHATCONFIG.OPENAI_API_KEY}` // Change this!
        },
        body: JSON.stringify({
            model: model,
            messages: llmMessages,
            // Claude
            /*extra_body: {
                "thinking": { "type": "enabled", "budget_tokens": 2000 }
            }*/
        })
    };
    
    console.log(headers);
    const response = await fetch(proxy + endpoint, headers);

    const data = await response.json();
    console.log(data);
    const aiMessageText = (data.choices != undefined ? data.choices[0].message.content : "Sorry, there was an error processing your request. Please try again.");

    // Display AI message
    const aiMessage = document.createElement("div");
    aiMessage.textContent = aiMessageText;
    aiMessage.className = "chat-message chat-ai-message";
    chatMessages.appendChild(aiMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add AI message to llmMessages
    llmMessages.push({ role: "assistant", content: aiMessageText });
}
