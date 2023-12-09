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
from uu_ui_sim_tags import uu_ui_sim_tags
from redis_client import redis_client 

r=redis_client()

app = Flask(__name__)
# CORS(app)  # Enable CORS for all routes
CORS(app, resources={r"/*": {"origins": "http://localhost:3001",}} )

@app.route('/calculate-user-item-tag-based-similarity', methods=['GET'])
async def calculate_user_item_tag_based_similarity():
    if(request.method=='GET'):
        print("inside app ")
        uu_ui_sim_tags()
        print("i am here! repeat!")
        # print("here")
        user_id=request.args.get("userId")
        ui_json = r.get("ui_sim_tags")
        if ui_json is not None:
            ui_dict = json.loads(ui_json)
            ui_dict_sorted = dict(sorted(ui_dict[user_id].items(), key=lambda item: item[1], reverse=True))
            ui_sorted_keys = [int(item) for item in ui_dict_sorted]
            return jsonify({'user_sim_item_id': ui_sorted_keys[:50]})
        else:
            print("The key ui_sim_tags does not exist in Redis.")

@app.route('/home', methods=['GET'])
def handle_home_request():
    if(request.method=='GET'):
        user_id=request.args.get("userId")
        ui_json = r.get("ui_sim_tags")
        if ui_json is not None:
            ui_dict = json.loads(ui_json)
            ui_dict_sorted = dict(sorted(ui_dict[user_id].items(), key=lambda item: item[1], reverse=True))
            ui_sorted_keys = [int(item) for item in ui_dict_sorted]
            return jsonify({'user_sim_item_id': ui_sorted_keys[:50]})
        else:
            print("The key uu_sim_tags does not exist in Redis.")
        # return jsonify({'message': 'data received successfully!'})

@app.route('/similar-tag-items', methods=['GET'])
def handle_similar_tag_items_request():
    if(request.method=='GET'):
        item_id = request.args.get("itemId")
        ii_json = r.get("ii_sim_tags")
        if(ii_json is not None):
            ii_dict = json.loads(ii_json)
            ii_dict_sorted = dict(sorted(ii_dict[item_id].items(), key=lambda item: item[1], reverse=True))
            ii_sorted_keys = [int(item) for item in ii_dict_sorted]
            print(ii_sorted_keys)
            return jsonify({'item_sim_item_id': ii_sorted_keys[:50]})
        else:
            print("The key uu_sim_tags does not exist in Redis.")
        # return jsonify({'message': 'data received successfully!'})

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    # close_connection(cursor, connection)

    # print(result)