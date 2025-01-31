# Use a Python base image
FROM python:3.9-slim-buster 

# Set environment variables
#ENV PYTHONDONTWRITEBYTECODE 1
#ENV PYTHONUNBUFFERED 1

# Set the working directory
WORKDIR /app

# Copy requirements.txt
COPY requirements.txt requirements.txt

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the app code
COPY . . 

# Expose the port
EXPOSE 3000

# Run the app using Gunicorn
CMD ["gunicorn", "--bind", "0.0.0.0:3000", "app.app:app"]
