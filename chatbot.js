// AI Chatbot Engine - Using Generative AI (OpenAI GPT-3.5)
class CarChatbot {
    constructor() {
        this.conversationHistory = [];
        this.isOpen = false;
        this.messageCount = 0;
        this.apiUrl = 'http://127.0.0.1:5000/api/chat';
        this.isUsingAI = true;
    }

    // Process message through AI API
    async processMessage(userMessage) {
        console.log('Processing message:', userMessage);
        this.conversationHistory.push({ role: 'user', message: userMessage });
        
        try {
            console.log('Sending to:', this.apiUrl);
            // Call AI API directly (skip health check)
            const response = await fetch(this.apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message: userMessage })
            });
            
            console.log('Response status:', response.status);
            
            if (!response.ok) {
                const error = await response.json();
                if (response.status === 401) {
                    return {
                        text: '❌ OpenAI API key not configured. Please set your API key:\n\nset OPENAI_API_KEY=your_key_here\n\nGet a free API key at: https://platform.openai.com/api-keys',
                        type: 'error'
                    };
                }
                return {
                    text: `⚠️ Error: ${error.error || 'Failed to get AI response'}`,
                    type: 'error'
                };
            }
            
            const data = await response.json();
            const botMessage = data.message;
            
            this.conversationHistory.push({ role: 'bot', message: botMessage });
            
            return {
                text: botMessage,
                type: 'genai'
            };
            
        } catch (error) {
            console.error('Chat error:', error);
            return {
                text: '🔧 API Server Connection Error\n\nTo enable AI chatbot, please:\n\n1. Open Terminal/PowerShell in the project folder\n2. Run: python api_server.py\n3. Get an OpenAI key from: https://platform.openai.com/api-keys\n4. Set it: set OPENAI_API_KEY=your_key_here\n5. Refresh this page\n\nI\'ll still help with basic car questions!',
                type: 'error'
            };
        }
    }

    // Clear conversation history
    async clearHistory() {
        this.conversationHistory = [];
        try {
            await fetch('http://127.0.0.1:5000/api/clear-history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
        } catch (e) {
            console.log('Could not clear server history');
        }
    }
}

// Initialize chatbot
const carChatbot = new CarChatbot();

// Toggle chatbot UI
function toggleChatbot() {
    const chatPanel = document.getElementById('chat-panel');
    const chatButton = document.getElementById('chat-button');
    
    carChatbot.isOpen = !carChatbot.isOpen;
    
    if (carChatbot.isOpen) {
        chatPanel.classList.add('active');
        chatButton.classList.add('active');
        document.getElementById('chat-input').focus();
    } else {
        chatPanel.classList.remove('active');
        chatButton.classList.remove('active');
    }
}

// Send chat message
async function sendChatMessage() {
    const input = document.getElementById('chat-input');
    const userMessage = input.value.trim();

    if (!userMessage) return;

    // Display user message
    addChatMessage('user', userMessage);
    input.value = '';
    
    // Show typing indicator
    showTypingIndicator();

    // Get AI response
    const response = await carChatbot.processMessage(userMessage);
    
    // Remove typing indicator
    removeTypingIndicator();
    
    // Display bot response
    addChatMessage('bot', response.text);
}

// Add message to chat display
function addChatMessage(role, message) {
    const chatMessages = document.getElementById('chat-messages');
    const messageEl = document.createElement('div');
    messageEl.className = `chat-message chat-message-${role}`;
    
    const contentEl = document.createElement('div');
    contentEl.className = 'chat-message-content';
    contentEl.textContent = message;
    
    messageEl.appendChild(contentEl);
    chatMessages.appendChild(messageEl);
    
    // Auto-scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Show typing indicator
function showTypingIndicator() {
    const chatMessages = document.getElementById('chat-messages');
    const typingEl = document.createElement('div');
    typingEl.className = 'chat-typing-indicator';
    typingEl.id = 'typing-indicator';
    
    const dotsEl = document.createElement('div');
    dotsEl.className = 'chat-typing-dots';
    dotsEl.innerHTML = '<span></span><span></span><span></span>';
    
    typingEl.appendChild(dotsEl);
    chatMessages.appendChild(typingEl);
    
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Remove typing indicator
function removeTypingIndicator() {
    const typingEl = document.getElementById('typing-indicator');
    if (typingEl) {
        typingEl.remove();
    }
}

// Handle Enter key in chat input
document.addEventListener('DOMContentLoaded', function() {
    const chatInput = document.getElementById('chat-input');
    if (chatInput) {
        chatInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendChatMessage();
            }
        });
    }
});
