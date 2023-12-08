import psycopg2
from dotenv import load_dotenv
import os

load_dotenv()

def establish_connection():
    try:
        # Connect to the PostgreSQL database
        connection = psycopg2.connect(
            host=os.getenv('HOST'),
            database=os.getenv('DATABASE'),
            user=os.getenv('USER'),
            password=os.getenv('PASSWORD')
        )
        print("Connected to Postgres Database!")
        return connection

    except psycopg2.Error as e:
        print("Error while connecting to PostgreSQL:", e)
        return

def close_connection(cursor, connection):
    if connection:
        cursor.close()
        connection.close()
        print("Postgres connection is closed!")
