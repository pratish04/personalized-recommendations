## DONE based on common product tags (content)
## DONE product ratings by users (collaborative)
# based on product prices (collaborative)

import pandas as pd
import numpy as np
import json

from connection import establish_connection, close_connection
from redis_client import redis_client

r=redis_client()

def jaccard_similarity(common_tags, user_tags, product_tags):
    return (common_tags/(user_tags + product_tags - common_tags))

def ii_sim_tags():
    # connecting to the database and retrieving product ratings by users
    connection=establish_connection()
    cursor=connection.cursor()
    query="SELECT item_id, item_tags FROM items"
    cursor.execute(query)
    data=cursor.fetchall()
    close_connection(cursor, connection)

    # Create a dictionary to store tags for each item
    tag_dict = {item[0]: set(item[1]) for item in data}

    # print (tag_dict)
    # Empty dict to store tag count for each item
    # i_tag_count = {item[0]: item[1] for item in data}


    # Initialize an empty matrix to store the number of common tags
    # jc_matrix=[[0] * len(data) for _ in range(len(data))]
    # common_tags_matrix= [[0] * len(data) for _ in range(len(data))]
    jaccard_matrix = [[0] * len(data) for _ in range(len(data))]

    # ii_sim_tags = pd.DataFrame(index = 'item_id', columns = 'item_id')

    
    # Calculate the number of common tags between every two items
    for i in range(len(data)):
        # print( data[i][0], " ",  len(tag_dict[data[i][0]]))
        # i_tag_count[data[i][0]]= len(tag_dict[data[i][0]])
        for j in range(i, len(data)):
            # print(len(tag_dict[data[i][0]].intersection(tag_dict[data[j][0]])), " ", len(tag_dict[data[i][0]]), " ", len(tag_dict[data[j][0]]))
            jaccard_matrix[i][j] = jaccard_similarity(len(tag_dict[data[i][0]].intersection(tag_dict[data[j][0]])), len(tag_dict[data[i][0]]), len(tag_dict[data[j][0]]))
            jaccard_matrix[j][i] = jaccard_similarity(len(tag_dict[data[i][0]].intersection(tag_dict[data[j][0]])), len(tag_dict[data[i][0]]), len(tag_dict[data[j][0]]))
            # common_tags = len(tag_dict[data[i][0]].intersection(tag_dict[data[j][0]]))
            # common_tags_matrix[i][j] = common_tags
            # common_tags_matrix[j][i] = common_tags
        # print ('\n')
    # for i in range(len(data)):
    #     for j in range(i, len(data)):
    #         jc_matrix[i][j]=jaccard_similarity(common_tags_matrix[i][j], len(tag_dict[data[i][0]]), len(tag_dict[data[j][0]]))
    #         jc_matrix[j][i]=jaccard_similarity(common_tags_matrix[i][j], len(tag_dict[data[i][0]]), len(tag_dict[data[j][0]]))

    df = pd.DataFrame(jaccard_matrix, index=[item[0] for item in data], columns=[item[0] for item in data])
    # jc = pd.DataFrame(jc_matrix, index=[item[0] for item in data], columns=[item[0] for item in data])


    # print ('jaccard matrix: ')
    # print(df)

    ## saving calculated similarity matrix in redis
    pair_dict = {}
    df_redis = {}

    for index, row in df.iterrows():
        # print("rows"+str(index), row.to_dict())
        # r.hmset((index, row.to_dict())
        pair_dict[index]=row.to_dict()
        df_redis[index] = pair_dict[index]
        # print(index, df_redis[index])

    json_string = json.dumps(df_redis)
    r.set("ii_sim_tags", json_string)
    
ii_sim_tags()

json_string = r.get("ii_sim_tags")

if json_string is not None:
    # Convert the JSON string back to a Python dictionary
    your_dict = json.loads(json_string)
    
    # Now, your_dict contains the original dictionary
    print("here is your dict: \n", your_dict)
else:
    print(f"The key ii_sim_tags does not exist in Redis.")
