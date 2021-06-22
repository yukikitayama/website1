import pymysql
import boto3
import json
import sys
import logging


SECRET_NAME = 'mysqlforlambdatest/yuki'
REGION_NAME = 'us-west-1'


def get_secret() -> str:
    session = boto3.session.Session()
    client = session.client(
        service_name='secretsmanager',
        region_name=REGION_NAME
    )
    get_secret_value_response = client.get_secret_value(
        SecretId=SECRET_NAME
    )
    secret = get_secret_value_response['SecretString']
    secret = json.loads(secret)
    return secret


secret = get_secret()
host = secret['host']
port = int(secret['port'])
user = secret['username']
passwd = secret['password']
db = secret['dbname']


logger = logging.getLogger()
logger.setLevel(logging.INFO)

try:
    conn = pymysql.connect(host=host, user=user, passwd=passwd, db=db, connect_timeout=5)
except pymysql.MySQLError as e:
    logger.error("ERROR: Unexpected error: Could not connect to MySQL instance.")
    logger.error(e)
    sys.exit()

logger.info("SUCCESS: Connection to RDS MySQL instance succeeded")
def handler(event, context):
    """
    This function fetches content from MySQL RDS instance
    """

    item_count = 0

    with conn.cursor() as cur:
        cur.execute("create table Employee ( EmpID  int NOT NULL, Name varchar(255) NOT NULL, PRIMARY KEY (EmpID))")
        cur.execute('insert into Employee (EmpID, Name) values(1, "Joe")')
        cur.execute('insert into Employee (EmpID, Name) values(2, "Bob")')
        cur.execute('insert into Employee (EmpID, Name) values(3, "Mary")')
        conn.commit()
        cur.execute("select * from Employee")
        for row in cur:
            item_count += 1
            logger.info(row)
            #print(row)
    conn.commit()

    return "Added %d items from RDS MySQL table" %(item_count)