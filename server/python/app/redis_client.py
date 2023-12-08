# import redis
import redis

# Assuming 'df' is your DataFrame

# Create a connection to Redis
def redis_client():
    r = redis.Redis(host='localhost', port=6379, db=1, decode_responses=True)
    # r.set('foo', 'bar')
    # print(r.get('foo'))
    return r
