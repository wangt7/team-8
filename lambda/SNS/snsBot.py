import json
import boto3
import random

# Static variables
PINPOINT_ID = 'b7baecbbf2654468bae2c1e2886861fb'
# USER_DEVICE_TABLE = 'SmartHomeManagerUserDevices'
# PHONE_NUMBER_TABLE = 'PhoneNumbers'
IOT_ARN = 'arn:aws:sns:us-east-1:764464694121:IoTtopic'

pinpoint = boto3.client('pinpoint')
sns = boto3.client('sns')

dynamodb = boto3.resource('dynamodb', endpoint_url="http://localhost:8000")

# table = dynamodb.Table(USER_DEVICE_TABLE)
# phoneTable = dynamodb.Table(PHONE_NUMBER_TABLE)


def lambda_handler(event, context):
    message = json.loads(event['Records'][0]['Sns']['Message'])
    parsetext = message['messageBody'].lower()
    phoneNumber = message['originationNumber']
    
    """
    user = phoneTable.get_item(
        Key = {
            'phone': phoneNumber
        }
    )

    table.get_item(
        user
    )
    """
    
    """
    if user is blank:
        pinpoint.send_messages(
            ApplicationId='PINPOINT_ID',
            MessageRequest={
                'Addresses': {
                    message['originationNumber']: {'ChannelType': 'SMS'}
                },
                'MessageConfiguration': {
                    'SMSMessage': {
                        'Body': 'This number is not registered with a current user.',
                        'MessageType': 'PROMOTIONAL'
                    }
                }
            }
        )
    """
    
    if "light1 on" in parsetext:
        response = sns.publish(
            TargetArn=IOT_ARN,
            Message=json.dumps({'default': json.dumps("Light 1 is now ON")}),
            MessageStructure='json'
            # lightToggle(phoneNumber, 1, 1)
        )
    elif "light1 off" in parsetext:
        response = sns.publish(
            TargetArn=IOT_ARN,
            Message=json.dumps({'default': json.dumps("Light 1 is now OFF")}),
            MessageStructure='json'
            # lightToggle(phoneNumber, 1, 0)
        )
    else:
        response = sns.publish(
            TargetArn=IOT_ARN,
            Message=json.dumps({'default': json.dumps("No commands found in " + parsetext)}),
            MessageStructure='json'
        )

"""
def lightToggle(phone, light, state):
    table.update_item(
        Key={
            'light': light
        }
        UpdateExpression="set light.state=:s"
        ExpressionAttributeValues={
            ':s': state
        }
    )
"""