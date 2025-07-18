const form = document.getElementById("chat-form");
const input = document.getElementById("user-input");
const chatBox = document.getElementById("chat-box");

/**
 * Sends a message to the backend API and gets the bot's response.
 * @param {string} userMessage The message from the user.
 * @returns {Promise<string>} The bot's response text.
 */
async function getBotResponse(userMessage) {
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    // The backend (`index.js`) expects a JSON object with a `message` key.
    body: JSON.stringify({ message: userMessage }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.reply || data.error || "An unknown error occurred.");
  }

  return data.output;
}

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const userMessage = input.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  input.value = "";

  try {
    const botMessage = await getBotResponse(userMessage);
    appendMessage("bot", botMessage);
  } catch (error) {
    console.error("Error:", error);
    appendMessage("bot", `Sorry, an error occurred: ${error.message}`);
  }
});

function appendMessage(sender, text) {
  const msg = document.createElement("div");
  msg.classList.add("message", sender);
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}
