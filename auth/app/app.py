from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random
import hashlib

app = Flask(__name__)
CORS(app)

# Reads in the local data.json file
data = open('../data.json').read()
directory = json.loads(data)
uuid = -1

@app.route('/checkUser', methods=['POST'])
def check_user():
    global uuid
    route_uuid = request.json.get('uuid')

    if int(route_uuid) == int(uuid):
        return jsonify({'message': 'true'})
    else:
        return jsonify({'message': 'false'})



# Endpoint to add a new building
@app.route('/authUser', methods=['POST'])
def auth_user():
    global uuid
    global data
    new_user = request.get_json()

    # Validate required fields
    required_fields = ['username', 'password']
    for field in required_fields:
        keys = field.split('.')
        value = new_user
        for key in keys:
            if key not in value:
                return jsonify({'message': f'Missing field: {field}'}), 400
            value = value[key]

    username = new_user.get('username')
    password = new_user.get('password')
    hash_object = hashlib.sha256(password.encode('utf-8'))
    hex_digest = hash_object.hexdigest()

    if username in directory:

        password = directory[username]
        if password == hex_digest:
            uuid = random.randint(0, 1000000)
            return jsonify({'message': f'{uuid}'})
        else:
            return jsonify({'message': 'User && password not found'})

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
