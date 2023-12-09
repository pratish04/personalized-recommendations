# based on common user profile tags (content)
## DONE product ratings by users (collaborative) 

# no. of common product purchases (collaborative)
# no. of common products wishlisted (collaborative)
# no. of common products viewed (collaborative)
# no. of common products searched (collaborative)

import pandas as pd
import numpy as np
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.decomposition import NMF
import os
import json
from connection import establish_connection, close_connection
from redis_client import redis_client

r = redis_client()
def uu_ii_sim_prod_rat():
    # connecting to the database and retrieving product ratings by users
    connection=establish_connection()
    cursor=connection.cursor()
    query="SELECT user_id, item_id, rating FROM item_ratings"
    cursor.execute(query)
    rows=cursor.fetchall()
    close_connection(cursor, connection)

    # converting retrieved data into a dataframe
    columns=['user_id', 'item_id', 'rating']
    df=pd.DataFrame(rows, columns=columns)
    pivot_df=pd.pivot_table(df, index='user_id', columns='item_id', values='rating', fill_value=0)

    pivot_df_transpose=pivot_df.transpose()
    
    # Perform Non-Negative Matrix Factorization (NMF)
    n_features = 5
    model = NMF(n_components=n_features, init='random', random_state=42)
    W=model.fit_transform(pivot_df)
    H = model.components_

    # restricting numpy scientific notations
    np.set_printoptions(suppress=True, precision=6)

    # reconstructing matrix from factor matrices and clipping between desired values
    reconstructed_matrix = np.dot(W, H)
    # print(reconstructed_matrix)
    predicted_uu_matrix = np.clip(reconstructed_matrix, 1, 5)
    # print(predicted_uu_matrix)    


    # Perform Non-Negative Matrix Factorization (NMF)
    n_features = 5
    model = NMF(n_components=n_features, init='random', random_state=42, max_iter=300)
    W=model.fit_transform(pivot_df_transpose)
    H = model.components_

    reconstructed_matrix=np.dot(W, H)
    # print(reconstructed_matrix)
    predicted_ii_matrix = np.clip(reconstructed_matrix, 1, 5)
    # print(predicted_ii_matrix)

    # calculating cosine similarity and conversion to dataframe
    cos_sim_uu_matrix=cosine_similarity(predicted_uu_matrix)
    cos_sim_uu_df = pd.DataFrame(cos_sim_uu_matrix, index=pivot_df.index, columns=pivot_df.index)
    cos_sim_ii_matrix=cosine_similarity(predicted_ii_matrix)
    cos_sim_ii_df=pd.DataFrame(cos_sim_ii_matrix, index=pivot_df_transpose.index, columns=pivot_df_transpose.index)
    # print(cos_sim_uu_df)
    # print(cos_sim_ii_df)

    ## saving calculated user-user cosine similarity matrix in redis
    pair_dict = {}
    df_redis = {}

    for index, row in cos_sim_uu_df.iterrows():
        # print("rows"+str(index), row.to_dict())
        # r.hmset((index, row.to_dict())
        pair_dict[index]=row.to_dict()
        df_redis[index] = pair_dict[index]
        # print(index, df_redis[index])

    json_string = json.dumps(df_redis)
    r.set("uu_sim_prod_rat", json_string)
    pair_dict.clear()
    df_redis.clear()

    print(pair_dict, df_redis)

    for index, row in cos_sim_ii_df.iterrows():
        pair_dict[index]=row.to_dict()
        df_redis[index] = pair_dict[index]

    json_string = json.dumps(df_redis)
    r.set("ii_sim_prod_rat", json_string)


    # return (cosine_sim_df)

uu_ii_sim_prod_rat()

print('here uu_sim_prod_rat\n: ')
print(r.get("uu_sim_prod_rat"))

print('here ii_sim_prod_rat\n')
print(r.get("ii_sim_prod_rat"))