/**
 * AquaMind Chatbot Logic
 * Integrates with Google Gemini API (Vanilla JS)
 */

(function() {
    // =================================================================
    // 1. CONFIGURATION & API SETUP
    // =================================================================
    
    // 🔑 API Key (As provided)
    const API_KEY = "AIzaSyDnN7vOA5lKz9cvqpXaXgqgpwJWAsQZpxk";
    
    // 🤖 Gemini Model
    const MODEL_NAME = "gemini-1.5-flash";
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    // 📝 KNOWLEDGE BASE / CONTEXT (Rich Text)
    // -----------------------------------------------------------------
    // PASTE YOUR WEBSITE INFO BELOW inside the backticks (` `).
    // This is the "brain" of your chatbot.
    // -----------------------------------------------------------------
    const AQUAMIND_CONTEXT = `
You are the intelligent assistant for AquaMind, a platform dedicated to water conservation and sustainability.

**ABOUT AQUAMIND:**
AquaMind delivers an interactive experience through a gamified learning journey and a virtual smart house.
We help users understand how daily actions affect water consumption.
Our mission is to build awareness, encourage responsible behavior, and promote sustainable water use.

**KEY FEATURES:**
1. **AquaGuard:** A game-based experience teaching water conservation through challenges.
2. **Interactive House:** A virtual home simulation to explore daily water usage.
3. **Stories & Charts:** Visual insights and real stories about water impact.
4. **MarketPlace:** Eco-friendly products to reduce water consumption.

**YOUR ROLE:**
- Act as a friendly, helpful, and knowledgeable guide.
- ONLY answer questions based on the context of AquaMind and water conservation.
- If asked about unrelated topics (like sports, politics, or coding), politely steer the conversation back to water saving or AquaMind features.
- Keep answers concise (under 3-4 sentences) unless asked for details.
- Use emojis occasionally to be engaging (💧, 🌍, 🌱).

**TONE:**
- Professional yet approachable.
- Encouraging and educational.
`;

    // =================================================================
    // 2. STATE MANAGEMENT
    // =================================================================
    let chatHistory = [
        {
            role: "user",
            parts: [{ text: AQUAMIND_CONTEXT }]
        },
        {
            role: "model",
            parts: [{ text: "Understood. I am ready to assist AquaMind users." }]
        }
    ];

    // =================================================================
    // 3. DOM ELEMENTS SELECTION
    // =================================================================
    const bubble = document.getElementById('chatbot-bubble');
    const windowEl = document.getElementById('chatbot-window');
    const closeBtn = document.getElementById('chatbot-close');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input');
    const sendBtn = document.getElementById('chatbot-send-btn');

    // =================================================================
    // 4. EVENT LISTENERS
    // =================================================================
    
    // Toggle Chat Window
    bubble.addEventListener('click', () => {
        windowEl.classList.add('active');
        // Focus input when opened
        setTimeout(() => inputField.focus(), 300);
    });

    closeBtn.addEventListener('click', () => {
        windowEl.classList.remove('active');
    });

    // Send Message on Click
    sendBtn.addEventListener('click', handleUserMessage);

    // Send Message on Enter Key
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });

    // =================================================================
    // 5. CORE FUNCTIONS
    // =================================================================

    async function handleUserMessage() {
        const userText = inputField.value.trim();
        if (!userText) return;

        // 1. Display User Message
        appendMessage('user', userText);
        inputField.value = '';

        // 2. Add to History
        chatHistory.push({
            role: "user",
            parts: [{ text: userText }]
        });

        // 3. Show Loading Indicator
        const loadingId = appendLoading();

        try {
            // 4. Call Gemini API
            const responseText = await callGeminiAPI();
            
            // 5. Remove Loading & Display Bot Message
            removeLoading(loadingId);
            appendMessage('bot', responseText);

            // 6. Add Bot Response to History
            chatHistory.push({
                role: "model",
                parts: [{ text: responseText }]
            });

        } catch (error) {
            console.error("Chatbot Error Details:", error);
            
            // CRITICAL FIX: Remove the last user message from history if API fails.
            // This prevents "User, User" sequence which breaks Gemini API on next try.
            chatHistory.pop();

            removeLoading(loadingId);
            
            let errorMessage = "Sorry, I'm having trouble connecting to the water grid right now. 💧 Please try again later.";
            
            // Customize message for common errors
            if (error.message.includes("400")) {
                errorMessage = "I'm a bit confused. Could you rephrase that? (400 Error)";
            } else if (error.message.includes("403") || error.message.includes("Key")) {
                errorMessage = "My API Key seems to be invalid or restricted. Please check the configuration. (403 Error)";
            }

            appendMessage('bot', errorMessage);
        }
    }

    async function callGeminiAPI() {
        const payload = {
            contents: chatHistory
        };

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error("Gemini API Raw Error:", errorData);
            throw new Error(`API Error: ${response.status} - ${JSON.stringify(errorData)}`);
        }

        const data = await response.json();
        
        // Extract text from Gemini response structure
        const botText = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        return botText || "I didn't catch that. Could you rephrase?";
    }

    // =================================================================
    // 6. UI HELPER FUNCTIONS
    // =================================================================

    function appendMessage(sender, text) {
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', sender);
        
        // Convert simple markdown bold (**text**) to <b>text</b> for better display
        const formattedText = text.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');
        msgDiv.innerHTML = formattedText;

        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
    }

    function appendLoading() {
        const id = 'loading-' + Date.now();
        const msgDiv = document.createElement('div');
        msgDiv.classList.add('message', 'bot', 'loading');
        msgDiv.id = id;
        msgDiv.textContent = "Thinking...";
        messagesContainer.appendChild(msgDiv);
        scrollToBottom();
        return id;
    }

    function removeLoading(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }

    function scrollToBottom() {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

})();