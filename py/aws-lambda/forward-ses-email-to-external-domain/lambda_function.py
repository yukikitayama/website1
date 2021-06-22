import boto3
from botocore.exceptions import ClientError
import json
import email
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import re



SECRET_NAME = 'forward-ses-email-to-external-domain'
REGION_NAME = 'us-west-1'


def get_secret(secret_name: str) -> dict:
    session = boto3.session.Session()
    client = session.client(service_name='secretsmanager', region_name=REGION_NAME)
    content = client.get_secret_value(SecretId=secret_name)
    secret_string = content['SecretString']
    secret = json.loads(secret_string)
    return secret


def get_message_from_s3(message_id: str, mail_s3_bucket: str, mail_s3_prefix: str, region: str) -> dict:
    if mail_s3_prefix:
        object_path = f'{mail_s3_prefix}/{message_id}'
    else:
        object_path = message_id
    object_http_path = f'http://s3.console.aws.amazon.com/s3/object/{mail_s3_bucket}/{object_path}?region={region}'

    client_s3 = boto3.client('s3')
    object_s3 = client_s3.get_object(Bucket=mail_s3_bucket, Key=object_path)
    # Read the content of the message
    file = object_s3['Body'].read()
    file_dict = {
        'file': file,
        'path': object_http_path
    }
    return file_dict


def create_message(file_dict: dict, sender: str, recipient: str) -> dict:
    separator = ';'

    # Parse the email body
    mail_object = email.message_from_string(file_dict['file'].decode('utf-8'))

    # Create a new subject line
    subject_original = mail_object['Subject']
    subject = 'FW: ' + subject_original

    # The body text of the email
    body_text = f'The attached message was received from ' \
                f'{separator.join(mail_object.get_all("From"))}. ' \
                f'This message is archived at {file_dict["path"]}.'

    # The file name to be used for the attached message
    # Regex removes all non-alphanumeric characters
    # re.sub replace string
    file_name = re.sub('[^0-9a-zA-Z]+', '_', subject_original) + '.eml'

    # Create MIME container
    msg = MIMEMultipart()
    text_part = MIMEText(body_text, _subtype='html')
    msg.attach(text_part)
    msg['Subject'] = subject
    msg['From'] = sender
    msg['To'] = recipient

    # Create a new MIME object
    att = MIMEApplication(file_dict['file'], file_name)
    att.add_header('Content-Disposition', 'attachment', filename=file_name)
    msg.attach(att)

    message = {
        'Source': sender,
        'Destinations': recipient,
        'Data': msg.as_string()
    }

    return message


def send_email(message: dict, region: str):
    client = boto3.client('ses', region)

    # Send email
    try:
        response = client.send_raw_email(
            Source=message['Source'],
            Destinations=[
                message['Destinations']
            ],
            RawMessage={
                'Data': message['Data']
            }
        )
    except ClientError as e:
        output = e.response['Error']['Message']
    else:
        output = f'Email send! Message ID: {response["MessageId"]}'

    return output


def lambda_handler(event, context):

    # Secret
    secret = get_secret(SECRET_NAME)
    mail_s3_bucket = secret['mail-s3-bucket']
    mail_s3_prefix = secret['mail-s3-prefix']
    mail_sender = secret['mail-sender']
    mail_recipient = secret['mail-recipient']
    region = secret['region']

    # Unique message IS
    message_id = event['Records'][0]['ses']['mail']['messageId']
    print(f'Received message ID: {message_id}')

    # S3 file
    file_dict = get_message_from_s3(message_id, mail_s3_bucket, mail_s3_prefix, region)

    # Create message
    message = create_message(file_dict, mail_sender, mail_recipient)
    # print(f'Message:\n{message}')

    # Send email and print result
    result = send_email(message, region=region)
    print(result)


if __name__ == '__main__':
    messageId = '10nh636bpueafga4tq3chrsd07gac21daufgocg1'
    event = {
        'Records': [{
            'ses': {
                'mail': {
                    'messageId': messageId
                }
            }
        }]
    }
    print(event)
    print(event['Records'][0]['ses']['mail']['messageId'])
    lambda_handler(event, '')
