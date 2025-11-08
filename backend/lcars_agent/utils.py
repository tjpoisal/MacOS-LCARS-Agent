"""
Utility functions for LCARS Agent
"""

import logging
import logging.handlers
import os
from pathlib import Path


def setup_logging(name: str, log_level=logging.INFO) -> logging.Logger:
    """
    Setup logging configuration for LCARS Agent

    Args:
        name: Logger name
        log_level: Logging level

    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    logger.setLevel(log_level)

    # Create logs directory if it doesn't exist
    logs_dir = Path.home() / '.lcars' / 'logs'
    logs_dir.mkdir(parents=True, exist_ok=True)

    # File handler
    log_file = logs_dir / 'lcars_agent.log'
    file_handler = logging.handlers.RotatingFileHandler(
        log_file,
        maxBytes=10485760,  # 10MB
        backupCount=5
    )
    file_handler.setLevel(log_level)

    # Console handler
    console_handler = logging.StreamHandler()
    console_handler.setLevel(log_level)

    # Formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    file_handler.setFormatter(formatter)
    console_handler.setFormatter(formatter)

    # Add handlers
    if not logger.handlers:
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)

    return logger


def get_config_dir() -> Path:
    """Get LCARS configuration directory"""
    config_dir = Path.home() / '.lcars'
    config_dir.mkdir(parents=True, exist_ok=True)
    return config_dir


def get_cache_dir() -> Path:
    """Get LCARS cache directory"""
    cache_dir = Path.home() / '.lcars' / 'cache'
    cache_dir.mkdir(parents=True, exist_ok=True)
    return cache_dir


def load_config(config_name: str = 'config.json') -> dict:
    """
    Load configuration file

    Args:
        config_name: Name of config file

    Returns:
        Configuration dictionary
    """
    import json

    config_file = get_config_dir() / config_name
    if config_file.exists():
        with open(config_file, 'r') as f:
            return json.load(f)
    return {}


def save_config(config: dict, config_name: str = 'config.json'):
    """
    Save configuration file

    Args:
        config: Configuration dictionary
        config_name: Name of config file
    """
    import json

    config_file = get_config_dir() / config_name
    with open(config_file, 'w') as f:
        json.dump(config, f, indent=2)
