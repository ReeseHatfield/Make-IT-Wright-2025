# Use a Python base image
FROM python:3.9-slim-buster 

COPY . . 

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
CMD ["gunicorn", "--bind", "0.0.0.0:6969", "app.app:app"]
