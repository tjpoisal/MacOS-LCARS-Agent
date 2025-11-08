"""
LCARS Agent Backend - Agentic Assistant Service
Provides AI-powered task execution and voice interface integration
"""

import os
import json
import logging
from typing import Optional
from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO, emit, join_room, leave_room

from .agent import LCARSAgent
from .voice import VoiceManager
from .utils import setup_logging

# Load environment variables
load_dotenv()

# Setup logging
logger = setup_logging(__name__)

# Initialize Flask app
app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'lcars-secret-key-dev')

# Initialize SocketIO for real-time communication
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize agent and voice manager
agent: Optional[LCARSAgent] = None
voice_manager: Optional[VoiceManager] = None


def initialize_services():
    """Initialize LCARS Agent and Voice Manager"""
    global agent, voice_manager

    api_key = os.getenv('ANTHROPIC_API_KEY')
    if not api_key:
        logger.error('ANTHROPIC_API_KEY not set in environment')
        raise ValueError('ANTHROPIC_API_KEY environment variable is required')

    agent = LCARSAgent(api_key=api_key)
    voice_manager = VoiceManager()
    logger.info('LCARS Agent and Voice Manager initialized')


# REST API Routes

@app.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({
        'status': 'operational',
        'system': 'LCARS Agent',
        'version': '1.0.0'
    }), 200


@app.route('/api/query', methods=['POST'])
def process_query():
    """Process a query through the LCARS agent"""
    try:
        data = request.json
        query = data.get('query', '')

        if not query:
            return jsonify({'error': 'Query is required'}), 400

        logger.info(f'Processing query: {query}')

        # Get response from agent
        response = agent.process(query)

        return jsonify({
            'status': 'success',
            'query': query,
            'response': response['text'],
            'actions': response.get('actions', [])
        }), 200

    except Exception as e:
        logger.error(f'Error processing query: {str(e)}')
        return jsonify({'error': str(e)}), 500


@app.route('/api/execute', methods=['POST'])
def execute_task():
    """Execute a task through the LCARS agent"""
    try:
        data = request.json
        task = data.get('task', '')

        if not task:
            return jsonify({'error': 'Task is required'}), 400

        logger.info(f'Executing task: {task}')

        # Execute task through agent
        result = agent.execute_task(task)

        return jsonify({
            'status': 'success',
            'task': task,
            'result': result
        }), 200

    except Exception as e:
        logger.error(f'Error executing task: {str(e)}')
        return jsonify({'error': str(e)}), 500


# SocketIO Events

@socketio.on('connect')
def handle_connect():
    """Handle client connection"""
    logger.info(f'Client connected: {request.sid}')
    emit('status', {'message': 'Connected to LCARS Agent'})


@socketio.on('disconnect')
def handle_disconnect():
    """Handle client disconnection"""
    logger.info(f'Client disconnected: {request.sid}')


@socketio.on('voice-input')
def handle_voice_input(data):
    """Handle voice input from client"""
    try:
        audio_data = data.get('audio')

        if not audio_data:
            emit('error', {'message': 'No audio data provided'})
            return

        logger.info('Processing voice input')

        # Transcribe audio to text
        text = voice_manager.transcribe_audio(audio_data)
        logger.info(f'Transcribed: {text}')

        # Process query through agent
        response = agent.process(text)

        # Synthesize response to speech
        audio_response = voice_manager.synthesize_speech(response['text'])

        # Send response back to client
        emit('voice-response', {
            'text': response['text'],
            'audio': audio_response,
            'actions': response.get('actions', [])
        })

    except Exception as e:
        logger.error(f'Error processing voice input: {str(e)}')
        emit('error', {'message': str(e)})


@socketio.on('text-query')
def handle_text_query(data):
    """Handle text query from client"""
    try:
        query = data.get('query', '')

        if not query:
            emit('error', {'message': 'No query provided'})
            return

        logger.info(f'Processing text query: {query}')

        # Process query through agent
        response = agent.process(query)

        # Synthesize response to speech
        audio_response = voice_manager.synthesize_speech(response['text'])

        # Send response back to client
        emit('response', {
            'text': response['text'],
            'audio': audio_response,
            'actions': response.get('actions', [])
        })

    except Exception as e:
        logger.error(f'Error processing text query: {str(e)}')
        emit('error', {'message': str(e)})


# Main entry point
if __name__ == '__main__':
    try:
        initialize_services()
        logger.info('Starting LCARS Agent backend...')
        socketio.run(
            app,
            host='127.0.0.1',
            port=5000,
            debug=os.getenv('DEBUG', 'False') == 'True'
        )
    except Exception as e:
        logger.error(f'Failed to start backend: {str(e)}')
        raise
