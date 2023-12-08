from sklearn.decomposition import NMF
import numpy as np

# Given user-item matrix
# user_item_matrix = np.array([
#     [1, 0, 2, 3],
#     [4, 5, 0, 6],
#     [7, 0, 8, 9],
#     [10, 11, 12, 0]
# ])

user_item_matrix = np.array([
    [3, 0, 1, 1],
    [1, 0, 4, 0],
    [3, 1, 0, 1],
    [0, 3, 0, 4]
])

# Define the number of features (components) you want
n_features = 2

# Perform Non-Negative Matrix Factorization (NMF)
model = NMF(n_components=n_features, init='random', random_state=42)
W = model.fit_transform(user_item_matrix)
H = model.components_

# Reconstruct the original matrix using the obtained matrices
reconstructed_matrix = np.dot(W, H)

predicted_matrix_clipped = np.clip(reconstructed_matrix, 1, 5)

# Print the obtained factor matrices
print("W matrix:")
print(W)
print("\nH matrix:")
print(H)

# Print the reconstructed matrix using the factor matrices
print("\nReconstructed Matrix (using NMF):")
print(reconstructed_matrix)
print(predicted_matrix_clipped)
