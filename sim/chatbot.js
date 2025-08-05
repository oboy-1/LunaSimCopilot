import { CHATCONFIG } from "./chatconfig.js";
import { getDataJson } from "./editor.js";

const chatButton = document.getElementById("chat-send");
chatButton.onclick = chatSendMessage;

// get prompt
const promptResponse = await fetch("/prompts/prompt.txt");
if (!promptResponse.ok) throw new Error("Failed to load system prompt.");
const systemMessage = await promptResponse.text();
var llmMessages = [];

var selectedModel = 0;
// 0 = o3-mini
// 1 = gpt-4o
// 2 = deepseek-reasoner
// 3 = claude
const ENDPOINTS = {
    0: "https://api.openai.com/v1/chat/completions",
    1: "https://api.openai.com/v1/chat/completions",
    2: "https://api.deepseek.com/v1/chat/completions",
    3: "https://api.anthropic.com/v1/messages",
}
const MODELS = {
    0: "o3-mini",
    1: "gpt-4o",
    2: "deepseek-reasoner",
    3: "claude-sonnet-4-20250514",
}
const API_KEYS = {
    0: CHATCONFIG.OPENAI_API_KEY,
    1: CHATCONFIG.OPENAI_API_KEY,
    2: CHATCONFIG.DEEPSEEK_API_KEY,
    3: CHATCONFIG.CLAUDE_API_KEY
}

export async function chatSendMessage() {
    selectedModel = document.getElementById("chat-model").value;
    const endpoint = ENDPOINTS[selectedModel];
    const model = MODELS[selectedModel];
    
    let llmMessagesFull = [
        { role: "system", content: systemMessage.trim() }, // System message from file
    ];
    if (model == "claude-sonnet-4-20250514") llmMessagesFull = [];
    llmMessagesFull.concat(llmMessages);

    var userInput = document.getElementById("chat-userInput");
    const chatMessages = document.getElementById("chat-messages");
    if (!userInput.value.trim()) return;
    
    // Display user message
    const userMessage = document.createElement("div");
    userMessage.textContent = userInput.value;
    userMessage.className = "chat-message chat-user-message";
    chatMessages.appendChild(userMessage);

    const userText = userInput.value + "\nCurrent User Model: " + getDataJson();
    userInput.value = "";
    chatMessages.scrollTop = chatMessages.scrollHeight;
    // Add user message to llmMessages
    llmMessages.push({ role: "user", content: userText });
    llmMessagesFull.push({ role: "user", content: userText });

    // Fetch AI response
    const headers = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "x-api-key": CHATCONFIG.CLAUDE_API_KEY,
            "anthropic-dangerous-direct-browser-access": true,
            "anthropic-version": "2023-06-01",
            "Authorization": `Bearer ${API_KEYS[selectedModel]}` // Change this!
        },
        body: JSON.stringify({
            model: model,
            messages: llmMessagesFull,
            ...(selectedModel == 3 && { max_tokens: 1024*4 }), // claude
            ...(selectedModel < 2 && false && { max_completion_tokens: 1024 }), // openai, causes problems
            ...(selectedModel == 3 && { system: systemMessage.trim() })
        })
    };
    
    const aiMessage = document.createElement("div");
    var thunk = 0;
    aiMessage.textContent = "Thinking for 0s...";
    aiMessage.className = "chat-message chat-ai-message";
    chatMessages.appendChild(aiMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    var updateInterval = setInterval(function() {
        aiMessage.innerText = `Thinking for ${++this.x}s...`;
        console.log(this.x);
    }.bind({ x: thunk }), 1000);

    console.log(headers);
    console.log(endpoint);
    var response;
    var data;
    try {
        response = await fetch(endpoint, headers);
        data = await response.json();
    } catch(error) {
        clearInterval(updateInterval);
        const aiMessageText = "Sorry, something went wrong! " + error;
        aiMessage.textContent = aiMessageText;
        chatMessages.scrollTop = chatMessages.scrollHeight;
        llmMessages.push({ role: "assistant", content: "Something went wrong fulfilling this request." });
        return;
    }

    clearInterval(updateInterval);
    console.log(data);
    const aiMessageText = (data.choices != undefined ? data.choices[0].message.content : (data.content != undefined ? data.content[0].text : "Sorry, there was an error processing your request. Please try again."));

    // Display AI message
    aiMessage.textContent = aiMessageText;
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Add AI message to llmMessages
    llmMessages.push({ role: "assistant", content: aiMessageText });
}
