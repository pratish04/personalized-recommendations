from flask import Flask, request, jsonify, g
from flask_cors import CORS
import pandas as pd
from psycopg2 import extras
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF
from sklearn.model_selection import GridSearchCV
import os
from connection import establish_connection, close_connection

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/ratings', methods=['GET'])
def handle_post_request():
    if request.method == 'POST':
        
        return jsonify({"message": "Data received successfully!"})
    
@app.route('/testing', methods=['GET', 'POST'])
def handle_post_request1():
    if request.method == 'POST':
        print(request)

if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
    # close_connection(cursor, connection)

    # print(result)