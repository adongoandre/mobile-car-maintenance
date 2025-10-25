import sys
import os

# Add the backend directory to Python path
sys.path.append(os.path.join(os.path.dirname(__file__), '../../backend'))

from app.main import app
from mangum import Mangum

# This creates the serverless function handler
handler = Mangum(app)