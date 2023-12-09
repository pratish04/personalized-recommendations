import pandas as pd
import numpy as np
import json

from connection import establish_connection, close_connection
from redis_client import redis_client

r=redis_client()

def jaccard_similarity(common_tags, user_tags, product_tags):
    return (common_tags/(user_tags + product_tags - common_tags))

def uu_ui_sim_tags():
    connection=establish_connection()
    cursor=connection.cursor()
    query="SELECT user_id, user_profile_tags FROM user_profiles"
    cursor.execute(query)
    data1=cursor.fetchall()
    user_tag_dict = {item[0]: set(item[1]) for item in data1}
    query="SELECT item_id, item_tags FROM items"
    cursor.execute(query)
    data2=cursor.fetchall()
    close_connection(cursor, connection)
    
    # calculating user-item similarity matrix using common tags
    item_tag_dict = {item[0]: set(item[1]) for item in data2}
    jaccard_matrix = [[0] * len(data2) for _ in range(len(data1))]
    for i in range(len(data1)):
        for j in range(len(data2)):
            jaccard_matrix[i][j]=jaccard_similarity(len(user_tag_dict[data1[i][0]].intersection(item_tag_dict[data2[j][0]])), len(user_tag_dict[data1[i][0]]), len(item_tag_dict[data2[j][0]]))

    df = pd.DataFrame(jaccard_matrix, index=[user[0] for user in data1], columns=[item[0] for item in data2])
    print (df)
    del jaccard_matrix
    
    ## saving calculated similarity matrix in redis
    pair_dict = {}
    df_redis = {}

    for index, row in df.iterrows():
        pair_dict[index]=row.to_dict()
        df_redis[index] = pair_dict[index]

    json_string = json.dumps(df_redis)
    r.set("ui_sim_tags", json_string)
    
    jaccard_matrix = [[0] * len(data1) for _ in range(len(data1))]
    
    # calculating user-user similarity matrix using common tags
    for i in range(len(data1)):
        for j in range(i, len(data1)):
            jaccard_matrix[i][j]=jaccard_similarity(len(user_tag_dict[data1[i][0]].intersection(user_tag_dict[data1[j][0]])), len(user_tag_dict[data1[i][0]]), len(user_tag_dict[data1[j][0]]))
            jaccard_matrix[j][i]=jaccard_matrix[i][j]

    # print(jaccard_matrix)
    df = pd.DataFrame(jaccard_matrix, index=[user[0] for user in data1], columns=[user[0] for user in data1])

    ## saving calculated similarity matrix in redis
    pair_dict = {}
    df_redis = {}

    for index, row in df.iterrows():
        pair_dict[index]=row.to_dict()
        df_redis[index] = pair_dict[index]

    json_string = json.dumps(df_redis)
    r.set("uu_sim_tags", json_string)

uu_ui_sim_tags()

json_string = r.get("ui_sim_tags")

if json_string is not None:
    # Convert the JSON string back to a Python dictionary
    your_dict = json.loads(json_string)
    
    # Now, your_dict contains the original dictionary
    # print("here is your ui_sim_tags dict: \n", your_dict)
else:
    print("The key ui_sim_tags does not exist in Redis.")

json_string = r.get("uu_sim_tags")

if json_string is not None:
    # Convert the JSON string back to a Python dictionary
    your_dict = json.loads(json_string)
    
    # Now, your_dict contains the original dictionary
    # print("here is your uu_sim_tags dict: \n", your_dict)
else:
    print("The key uu_sim_tags does not exist in Redis.")