import requests
import json

URL = 'AWS_API_GATEWAY'

r = requests.get(url=URL)
print(f'Status code: {r.status_code}')
print(f'Response: {r.text}')

# With payload
event_01 = {
    'time_zone': 'UTC'
}
r = requests.post(url=URL, data=event_01)
print(f'Request 1:')
print(f'Status code 1: {r.status_code}')
print(f'Response 1: {r.text}')
print()
event_02 = {
    'time_zone': 'US/Mountain'
}
# r = requests.post(url=URL, data=event_02)
r = requests.post(url=URL, params=event_02)
print(f'Request 2:')
print(f'Status code 2: {r.status_code}')
print(f'Response 2: {r.text}')
print()
