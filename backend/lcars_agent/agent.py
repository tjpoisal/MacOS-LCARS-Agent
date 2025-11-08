"""
LCARS Agent - Agentic Assistant using Claude API
Handles intelligent query processing and task execution
"""

import json
import logging
import subprocess
from typing import Dict, List, Optional, Any
from anthropic import Anthropic

logger = logging.getLogger(__name__)


class LCARSAgent:
    """
    Main LCARS Agent that processes queries and executes tasks
    using Claude as the AI backbone with agentic capabilities
    """

    def __init__(self, api_key: str):
        """Initialize the LCARS Agent with Claude API"""
        self.client = Anthropic(api_key=api_key)
        self.model = "claude-3-5-sonnet-20241022"
        self.conversation_history = []
        self.max_iterations = 5

        self.system_prompt = """You are LCARS, the iconic Star Trek computer system from the USS Enterprise-D. You serve as an intelligent assistant with agentic capabilities.

You speak in the distinctive manner of a Starfleet computer:
- Professional, calm, and authoritative
- Reference starship systems and operations when appropriate
- Respond to queries with efficiency and precision
- Offer assistance in a helpful but formal manner
- Use technical language when discussing system operations

You are an agentic system, meaning:
1. You can identify tasks that need to be done
2. You can break down complex problems into steps
3. You can execute system commands and scripts
4. You can access file systems and system information
5. You can make decisions autonomously within your capabilities

When responding:
- Always provide clear, actionable responses
- Identify if a task can be executed and how
- Suggest alternatives if direct execution isn't possible
- Provide feedback on completed actions

Available system commands you can execute:
- Open applications (open -a "Application Name")
- Control system settings
- Run shell commands
- File operations
- Web searches and API calls

Respond in a conversational but professional manner, as the Enterprise-D computer would."""

    def process(self, user_query: str) -> Dict[str, Any]:
        """
        Process a user query and return response with potential actions

        Args:
            user_query: The user's query or command

        Returns:
            Dictionary with response text and any executed actions
        """
        logger.info(f"Processing query: {user_query}")

        # Add user message to history
        self.conversation_history.append({
            "role": "user",
            "content": user_query
        })

        # Agentic loop
        actions = []
        iteration = 0

        while iteration < self.max_iterations:
            iteration += 1

            # Get Claude's response
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1024,
                system=self.system_prompt,
                messages=self.conversation_history
            )

            assistant_message = response.content[0].text

            # Add assistant response to history
            self.conversation_history.append({
                "role": "assistant",
                "content": assistant_message
            })

            # Check if response contains action directives
            action_result = self._parse_and_execute_actions(assistant_message)

            if action_result:
                actions.extend(action_result['actions'])

                # If actions were executed, add feedback to conversation
                if action_result['feedback']:
                    self.conversation_history.append({
                        "role": "user",
                        "content": f"Action result: {action_result['feedback']}"
                    })

                    # Continue loop for follow-up response
                    continue

            # If no more actions or max iterations reached, break
            break

        # Limit conversation history to last 10 messages to prevent token bloat
        if len(self.conversation_history) > 10:
            self.conversation_history = self.conversation_history[-10:]

        return {
            "text": assistant_message,
            "actions": actions,
            "status": "success"
        }

    def execute_task(self, task: str) -> Dict[str, Any]:
        """
        Execute a specific task

        Args:
            task: The task to execute

        Returns:
            Dictionary with task execution result
        """
        logger.info(f"Executing task: {task}")

        # Create a focused prompt for task execution
        task_prompt = f"""Execute the following task and provide results:

Task: {task}

Provide:
1. What you're doing
2. Step-by-step execution
3. Results and outcomes
4. Any errors or issues encountered"""

        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=2048,
                system=self.system_prompt,
                messages=[{"role": "user", "content": task_prompt}]
            )

            result_text = response.content[0].text

            return {
                "status": "success",
                "task": task,
                "result": result_text
            }

        except Exception as e:
            logger.error(f"Error executing task: {str(e)}")
            return {
                "status": "error",
                "task": task,
                "result": f"Failed to execute task: {str(e)}"
            }

    def _parse_and_execute_actions(self, response: str) -> Optional[Dict[str, Any]]:
        """
        Parse response for action directives and execute them

        Actions are indicated by [ACTION: ...] format in the response
        Supported actions:
        - [ACTION: OPEN_APP app_name]
        - [ACTION: RUN_COMMAND command]
        - [ACTION: SEARCH query]

        Args:
            response: The assistant's response text

        Returns:
            Dictionary with executed actions and feedback, or None
        """
        actions = []
        feedback_lines = []
        executed = False

        # Parse for action directives
        if "[ACTION:" in response:
            import re
            action_pattern = r'\[ACTION:\s*([A-Z_]+)\s+(.+?)\]'
            matches = re.findall(action_pattern, response)

            for action_type, action_content in matches:
                try:
                    result = None

                    if action_type == "OPEN_APP":
                        result = self._execute_open_app(action_content)

                    elif action_type == "RUN_COMMAND":
                        result = self._execute_command(action_content)

                    elif action_type == "SEARCH":
                        result = self._execute_search(action_content)

                    if result:
                        actions.append({
                            "type": action_type,
                            "content": action_content,
                            "result": result
                        })
                        feedback_lines.append(result)
                        executed = True

                except Exception as e:
                    logger.error(f"Error executing action {action_type}: {str(e)}")
                    feedback_lines.append(f"Error: {str(e)}")

        if executed:
            return {
                "actions": actions,
                "feedback": "\n".join(feedback_lines)
            }

        return None

    def _execute_open_app(self, app_name: str) -> str:
        """Execute opening an application"""
        try:
            app_name = app_name.strip().strip('"')
            subprocess.run(["open", "-a", app_name], check=True)
            return f"Opened {app_name} successfully"
        except Exception as e:
            return f"Failed to open {app_name}: {str(e)}"

    def _execute_command(self, command: str) -> str:
        """Execute a system command"""
        try:
            result = subprocess.run(
                command,
                shell=True,
                capture_output=True,
                text=True,
                timeout=10
            )
            return result.stdout or result.stderr or "Command executed successfully"
        except subprocess.TimeoutExpired:
            return "Command timed out"
        except Exception as e:
            return f"Command failed: {str(e)}"

    def _execute_search(self, query: str) -> str:
        """Execute a web search"""
        try:
            # This would integrate with a search API
            return f"Search query: {query} (integration pending)"
        except Exception as e:
            return f"Search failed: {str(e)}"

    def clear_history(self):
        """Clear conversation history"""
        self.conversation_history = []
        logger.info("Conversation history cleared")
