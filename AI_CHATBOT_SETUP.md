# 🤖 CarPedia AI Chatbot Setup Guide

Your app now includes a **Generative AI-powered chatbot** using OpenAI's GPT-3.5!

## Quick Setup (3 Steps)

### Step 1: Install Required Libraries
Open Terminal/PowerShell in your project folder and run:
```bash
pip install flask flask-cors openai
```

### Step 2: Get Your OpenAI API Key
1. Go to: https://platform.openai.com/api-keys
2. Sign up (free account) or log in
3. Create a new API key
4. Copy the key (you'll use it in Step 3)

### Step 3: Start the AI Server
In your project folder terminal, run:
```bash
set OPENAI_API_KEY=your_api_key_here
python api_server.py
```

Replace `your_api_key_here` with your actual OpenAI API key.

You should see:
```
 * Running on http://localhost:5000
 * Press CTRL+C to quit
```

## Using the Chatbot

1. **Refresh your browser** at http://localhost:8000
2. **Click the "💬 Ask AI" button** in the bottom right
3. **Ask anything about cars!**

### Example Questions
- "What's the best sports car under $100,000?"
- "Recommend a family car with good fuel economy"
- "Tell me about the Ferrari SF90"
- "Compare luxury sedans vs SUVs"
- "What electric cars would you recommend?"
- "Which car has the fastest 0-100 time?"
- "I need a comfortable car for long drives"

## How It Works

- **Frontend**: Interactive chat UI (chatbot.js)
- **Backend**: Flask API server (api_server.py)  
- **AI Engine**: OpenAI GPT-3.5-turbo
- **Database**: 1,200+ cars for context

The AI has been trained to understand:
- Car specifications and performance
- Price comparisons
- Fuel types and efficiency
- Comfort and luxury features
- Safety and technology
- Your preferences and needs

## Troubleshooting

### "API Server is not running"
Make sure you:
1. Have Python installed (python --version)
2. Installed required packages (pip install flask flask-cors openai)
3. Set your API key: set OPENAI_API_KEY=your_key_here
4. Started the server: python api_server.py

### "Invalid OpenAI API key"
- Check your API key is correct
- Make sure you didn't accidentally copy extra spaces
- Get a new key at: https://platform.openai.com/api-keys

### "API rate limit exceeded"
- You've made too many requests too quickly
- Wait a moment and try again
- OpenAI has free tier limits

### Nothing happens when I send a message
- Check browser console (F12 > Console tab) for errors
- Make sure the API server is running on port 5000
- Try a hard refresh: Ctrl+Shift+R

## Cost Information

OpenAI's API is **very affordable**:
- GPT-3.5 costs ~$0.0005 per 1K tokens
- A typical chat message = 50-500 tokens
- You get $5 free trial credit monthly
- Most usage will cost pennies per month

## Architecture

```
┌─────────────────────────────────────┐
│     Browser (Frontend)              │
│  - index.html                       │
│  - styles.css                       │
│  - app.js                           │
│  - chatbot.js (Chat UI)             │
│  - HTTP Server (port 8000)          │
└──────────────┬──────────────────────┘
               │ POST /api/chat
               ▼
┌──────────────────────────────────────┐
│    Flask API Server (Backend)        │
│  - api_server.py (port 5000)         │
│  - Handles chat requests             │
└──────────────┬──────────────────────┘
               │ API Request
               ▼
┌──────────────────────────────────────┐
│    OpenAI GPT-3.5 API                │
│  - Generates intelligent responses   │
│  - Context: Car database             │
└──────────────────────────────────────┘
```

## Running Both Servers

You need TWO terminals:

**Terminal 1 (Frontend - Port 8000):**
```bash
cd your-project-folder
python -m http.server 8000
```

**Terminal 2 (AI Backend - Port 5000):**
```bash
cd your-project-folder
set OPENAI_API_KEY=your_key_here
python api_server.py
```

Then open: http://localhost:8000

## Advanced: Customizing the AI

Edit `api_server.py` to customize the AI's personality:

```python
CAR_EXPERT_SYSTEM_PROMPT = """Your custom instructions here..."""
```

Change the temperature (0-1) for more/less creative responses:
```python
temperature=0.7,  # 0.3 = more focused, 0.9 = more creative
```

Adjust context window:
```python
max_tokens=500,  # Number of response tokens
```

## Need Help?

- OpenAI Docs: https://platform.openai.com/docs
- API Keys: https://platform.openai.com/api-keys
- Flask Docs: https://flask.palletsprojects.com
- Discord/Community: https://community.openai.com

Enjoy your AI-powered car recommendation chatbot! 🚗✨
