from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from geopy.distance import geodesic

app = Flask(__name__)
CORS(app)

# Reads in the local data.json file
data = open('data.json').read()
directory = json.loads(data)

# Helper function to save the directory to the JSON file
def save_directory():
    try:
        outfile = open('data.json', 'w+')
        json.dump(directory, outfile, indent=4)
        outfile.close()
    except Exception as e:
        print("Error saving directory:", e)
        raise


# Endpoint to add a new building
@app.route('/building', methods=['POST'])
def add_building():
    new_building = request.get_json()

    # Validate required fields
    required_fields = ['name', 'location', 'location.latitude', 'location.longitude', 'photo_path', 'desk_number', 'hours', 'description']
    for field in required_fields:
        keys = field.split('.')
        value = new_building
        for key in keys:
            if key not in value:
                return jsonify({'message': f'Missing field: {field}'}), 400
            value = value[key]
    
    # Add the new building to the directory
    directory['buildings'].append(new_building)

    # Save the updated directory to the data.json file
    save_directory()

    return jsonify({'message': 'Building added successfully', 'building': new_building}), 201

# Helper function to get building by name
def get_building_by_name(building_name):
    return next((building for building in directory['buildings'] if building['name'].lower() == building_name.lower()), None)

# Endpoint to get all buildings
@app.route('/buildings', methods=['GET'])
def get_buildings():
    return jsonify(directory['buildings'])

# Endpoint to get a specific building by name
@app.route('/building/<string:name>', methods=['GET'])
def get_building(name):
    building = get_building_by_name(name)
    if building:
        return jsonify(building)
    return jsonify({'message': 'Building not found'}), 404

# Endpoint to get rooms in a building
@app.route('/building/<string:name>/rooms', methods=['GET'])
def get_rooms(name):
    building = get_building_by_name(name)
    if building:
        return jsonify(building['rooms'])
    return jsonify({'message': 'Building not found'}), 404

# Endpoint to get a specific room in a building
@app.route('/building/<string:name>/room/<string:room_name>', methods=['GET'])
def get_room(name, room_name):
    building = get_building_by_name(name)
    if building:
        room = next((room for room in building['rooms'] if room['name'].lower() == room_name.lower()), None)
        if room:
            return jsonify(room)
        return jsonify({'message': 'Room not found'}), 404
    return jsonify({'message': 'Building not found'}), 404

# Endpoint to get employees in a building
@app.route('/building/<string:name>/employees', methods=['GET'])
def get_employees(name):
    building = get_building_by_name(name)
    if building:
        return jsonify(building['employee_list'])
    return jsonify({'message': 'Building not found'}), 404

# Endpoint to calculate the distance between two locations
@app.route('/distance', methods=['GET'])
def calculate_distance():
    lat1 = request.args.get('lat1', type=float)
    lon1 = request.args.get('lon1', type=float)
    lat2 = request.args.get('lat2', type=float)
    lon2 = request.args.get('lon2', type=float)

    if None in [lat1, lon1, lat2, lon2]:
        return jsonify({'message': 'Missing coordinates'}), 400

    coords_1 = (lat1, lon1)
    coords_2 = (lat2, lon2)
    
    distance = geodesic(coords_1, coords_2).miles
    return jsonify({'distance': distance})

# Helper function to get the closest building
def get_closest_building(lat, lon):
    closest_building = None
    min_distance = float('inf')  # Initialize with a very large number

    for building in directory['buildings']:
        building_coords = (building['location']['latitude'], building['location']['longitude'])
        distance = geodesic((lat, lon), building_coords).miles
        
        if distance < min_distance:
            min_distance = distance
            closest_building = building

    return closest_building

# Endpoint to get the closest building by location
@app.route('/building/closest', methods=['GET'])
def find_closest_building():
    lat = request.args.get('lat', type=float)
    lon = request.args.get('lon', type=float)

    if lat is None or lon is None:
        return jsonify({'message': 'Missing latitude or longitude'}), 400

    closest_building = get_closest_building(lat, lon)

    if closest_building:
        return jsonify(closest_building)
    return jsonify({'message': 'No buildings found'}), 404

# Start the Flask app
if __name__ == '__main__':
    app.run(debug=True)
