from flask import Blueprint, jsonify

data_api = Blueprint('data_api', __name__)

@data_api.route('/api/data', methods=['GET'])
def get_data():
    data = {
        'key1': 'value1',
        'key2': 'value2',
    }
    return jsonify(data)