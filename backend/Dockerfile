FROM python:3.11-slim

# Set workdir
WORKDIR /app

# Install system deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and app
COPY requirements.txt /app/requirements.txt
COPY app /app/app

# Create virtualenv and install python deps
RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"
RUN pip install --upgrade pip
RUN pip install --no-cache-dir -r /app/requirements.txt

# Expose port used by uvicorn
EXPOSE 8000

# Development entry: run uvicorn with reload
CMD ["/bin/sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload"]
