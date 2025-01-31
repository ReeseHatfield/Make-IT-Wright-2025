from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
@app.route('/')
def home():
    return {
        'message': 'Hello World!'
    }

@app.route('/getkey')
def getkey():
    return {
        # get the contents of key.txt and return it
        'key': open('../key.txt').read()
    }

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=3000) 