import { CHATCONFIG } from "./chatconfig.js";

const chatButton = document.getElementById("chat-send");
chatButton.onclick = chatSendMessage;

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

    // get prompt
    const promptResponse = await fetch("prompts.txt");
    if (!promptResponse.ok) throw new Error("Failed to load system prompt.");
    const systemMessage = await promptResponse.text();

    // Fetch AI response
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${CHATCONFIG.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4",
            messages: [
                { role: "system", content: systemMessage.trim() }, // System message from file
                { role: "user", content: userText }
            ]
        })
    });

    const data = await response.json();
    console.log(data);
    const aiMessageText = data.choices[0].message.content;

    // Display AI message
    const aiMessage = document.createElement("div");
    aiMessage.textContent = aiMessageText;
    aiMessage.className = "chat-message chat-ai-message";
    chatMessages.appendChild(aiMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}
