import requests
import json

URL = '	https://f0h87b5pwj.execute-api.us-west-1.amazonaws.com/my-python-function-from-scratch'

r = requests.get(url=URL)
print(f'Status code: {r.status_code}')
print(f'Response: {r.text}')
