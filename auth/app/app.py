from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import hashlib
import threading
import time
import uuid as ud

app = Flask(__name__)
CORS(app)

# Reads in the local data.json file
data = open("../data.json").read()
directory = json.loads(data)
uuid = ud.uuid4()


def update_uuid():
    global uuid

    while True:
        time.sleep(300)
        uuid = ud.uuid4()


thread = threading.Thread(target=update_uuid, daemon=True)
thread.start()


@app.route("/checkUser", methods=["POST"])
def check_user():
    global uuid
    route_uuid = request.json.get("uuid")

    if f'{uuid}' == f'{route_uuid}':
        return jsonify({
                "message": "true"
                # "expecting": uuid,
                # "recevied": route_uuid
            })
    else:
        return jsonify({
                "message": "false"
                # "expecting": uuid,
                # "recevied": route_uuid
            })


# Endpoint to add a new building
@app.route("/authUser", methods=["POST"])
def auth_user():
    global uuid
    global data
    new_user = request.get_json()

    # Validate required fields
    required_fields = ["username", "password"]
    for field in required_fields:
        keys = field.split(".")
        value = new_user
        for key in keys:
            if key not in value:
                return jsonify({"message": f"Missing field: {field}"}), 400
            value = value[key]

    username = new_user.get("username")
    password = new_user.get("password")
    hash_object = hashlib.sha512(password.encode("utf-8"))
    hex_digest = hash_object.hexdigest()

    if username in directory:

        password = directory[username]
        if password == hex_digest:
            uuid = ud.uuid4()
            return jsonify({"message": f"{uuid}"})
        else:
            return jsonify({"message": "User && password not found"}), 400


# Start the Flask app
if __name__ == "__main__":
    app.run(debug=True)
