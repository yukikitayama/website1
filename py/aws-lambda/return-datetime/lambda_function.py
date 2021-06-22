import json
from datetime import datetime
import pytz


def lambda_handler(event, context):
    time_zone = event.get('time_zone', 'UTC')
    tz = pytz.timezone(time_zone)
    dt = datetime.now(tz=tz).strftime('%Y-%m-%d %H:%M:%S')
    result = {
        'status_code': 200,
        'time_zone': time_zone,
        'date_time': dt
    }
    return result


if __name__ == '__main__':
    event_01 = {
        'time_zone': 'UTC',
    }
    print(f'Request 1: {event_01}')
    print(f'Response 1: {lambda_handler(event_01, "")}')
    print()
    event_02 = {
        'time_zone': 'US/Mountain',
    }
    print(f'Request 2: {event_02}')
    print(f'Response 2: {lambda_handler(event_02, "")}')
    print()
    event_03 = {}
    print(f'Request 3: {event_03}')
    print(f'Response 3: {lambda_handler(event_03, "")}')
