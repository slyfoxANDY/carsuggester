"""
Flask API Server for CarPedia AI Chatbot
Integrates with OpenAI GPT for intelligent car recommendations and Q&A
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import os
from datetime import datetime
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

app = Flask(__name__)
CORS(app)

# Configure Groq API
api_key = os.getenv('GROQ_API_KEY')
client = None

if api_key:
    try:
        from groq import Groq
        client = Groq(api_key=api_key)
        print("✓ Groq client initialized successfully")
    except Exception as e:
        print(f"✗ Error initializing Groq: {e}")
else:
    print("✗ GROQ_API_KEY environment variable not set!")

# System prompt for car expertise
CAR_EXPERT_SYSTEM_PROMPT = """You are CarPedia, an expert AI assistant specialized in cars and automobiles. 

Your expertise includes:
- Detailed car specifications and performance metrics
- Car recommendations based on user preferences (budget, fuel type, performance, comfort, seating)
- Price comparisons and value analysis
- Engine types, horsepower, acceleration, top speed information
- Fuel efficiency and environmental considerations
- Luxury vs practical vehicle comparisons
- Safety features and technology
- Maintenance and reliability

You have access to a database of 1,200+ cars from various brands including Ferrari, Lamborghini, Mercedes, BMW, Rolls Royce, Tesla, Toyota, Nissan, Aston Martin, and more.

When users ask for car recommendations:
1. Ask clarifying questions about their needs (budget, fuel type, use case, passengers)
2. Provide specific car models with key specs
3. Explain why each recommendation matches their needs
4. Be enthusiastic about cars while being factually accurate

Always be helpful, friendly, and car-focused. If asked about non-car topics, gently redirect to car-related discussions.

Current date: """ + datetime.now().strftime("%Y-%m-%d")

conversation_history = []

@app.route('/', methods=['GET'])
def root():
    """Root endpoint - server status check"""
    return jsonify({
        'status': 'CarPedia AI Backend Server is running',
        'endpoints': {
            'chat': 'POST /api/chat',
            'clear_history': 'POST /api/clear-history',
            'health': 'GET /api/health'
        }
    })

@app.route('/api/chat', methods=['POST'])
def chat():
    """Handle chat messages and return AI-generated responses"""
    try:
        data = request.json
        user_message = data.get('message', '').strip()
        
        if not user_message:
            return jsonify({'error': 'No message provided'}), 400
        
        if not client:
            return jsonify({'error': 'OpenAI API key not configured. Set OPENAI_API_KEY environment variable.'}), 500
        
        # Add user message to history
        conversation_history.append({
            'role': 'user',
            'content': user_message
        })
        
        # Keep conversation history manageable (last 20 messages)
        if len(conversation_history) > 20:
            conversation_history.pop(0)
        
        # Call Groq API
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {'role': 'system', 'content': CAR_EXPERT_SYSTEM_PROMPT}
            ] + conversation_history,
            temperature=0.7,
            max_tokens=500,
            top_p=0.9
        )
        
        bot_message = response.choices[0].message.content.strip()
        
        # Add bot response to history
        conversation_history.append({
            'role': 'assistant',
            'content': bot_message
        })
        
        return jsonify({
            'success': True,
            'message': bot_message,
            'type': 'genai'
        })
    
    except Exception as e:
        print(f'Chat error: {str(e)}')
        error_msg = str(e)
        if 'API key' in error_msg or 'authentication' in error_msg.lower():
            return jsonify({'error': 'Invalid or expired OpenAI API key'}), 401
        if 'rate' in error_msg.lower():
            return jsonify({'error': 'API rate limit exceeded. Try again later.'}), 429
        return jsonify({'error': f'Error: {error_msg}'}), 500

@app.route('/api/clear-history', methods=['POST'])
def clear_history():
    """Clear conversation history"""
    global conversation_history
    conversation_history = []
    return jsonify({'success': True, 'message': 'Conversation cleared'})

@app.route('/api/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'api_configured': bool(client),
        'timestamp': datetime.now().isoformat()
    })

if __name__ == '__main__':
    # Run on port 5000
    print("\n" + "="*50)
    print("CarPedia AI Backend Server")
    print("="*50)
    print(f"API Key Configured: {bool(client)}")
    print("Running on http://127.0.0.1:5000")
    print("="*50 + "\n")
    app.run(debug=True, port=5000, host='127.0.0.1')
