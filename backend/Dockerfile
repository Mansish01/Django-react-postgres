FROM python:3.10-slim

WORKDIR /app/backend

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy project files
COPY backend/ .

# Run migrations and start server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "backend.wsgi:application"]