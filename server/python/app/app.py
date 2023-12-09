from flask import Flask, request,  jsonify, g
from flask_cors import CORS
import pandas as pd
from psycopg2 import extras
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF
from sklearn.model_selection import GridSearchCV
import os
import json
from connection import establish_connection, close_connection
from redis_client import redis_client 

r=redis_client()

app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "http://localhost:3001",}} )

# @app.route('/ratings', methods=['GET'])
# def handle_post_request():
#     if request.method == 'POST':
        
#         return jsonify({"message": "Data received successfully!"})

@app.route('/home', methods=['GET'])
def handle_post_request():
    if(request.method=='GET'):
        user_id=request.args.get("userId")
        ui_json = r.get("ui_sim_tags")
        if ui_json is not None:
            ui_dict = json.loads(ui_json)
            ui_dict_sorted = dict(sorted(ui_dict[user_id].items(), key=lambda item: item[1], reverse=True))
            ui_sorted_keys = [int(item) for item in ui_dict_sorted]
            print(ui_sorted_keys)
            print("hi i am here!")
            return jsonify({'user_sim_item_id': ui_sorted_keys[:50]})
            # return jsonify({'ui_sim_tag_keys': ui_sorted_keys})
            # print("sorted keys: \n", int(ui_sorted_keys[0])+int(ui_sorted_keys[1]))
        else:
            print("The key uu_sim_tags does not exist in Redis.")
        # return jsonify({'message': 'data received successfully!'})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    # close_connection(cursor, connection)

    # print(result)