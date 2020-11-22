import json
import boto3
import random


pinpoint = boto3.client('pinpoint')
sns = boto3.client('sns')

iotARN = 'arn:aws:sns:us-east-1:764464694121:IoTtopic'


def lambda_handler(event, context):
    message = json.loads(event['Records'][0]['Sns']['Message'])
    parsetext = message['messageBody'].lower()

    
    if "echo" in parsetext:
        response = sns.publish(
            TargetArn=iotARN,
            Message=json.dumps({'default': json.dumps(parsetext)}),
            MessageStructure='json'
        )
    elif "light1 on" in parsetext:
        # TODO implement functionality
        response = sns.publish(
            TargetArn=iotARN,
            Message=json.dumps({'default': json.dumps("Light 1 is now ON")}),
            MessageStructure='json'
        )
    elif "light1 off" in parsetext:
        # TODO implement functionality
        response = sns.publish(
            TargetArn=iotARN,
            Message=json.dumps({'default': json.dumps("Light 1 is now OFF")}),
            MessageStructure='json'
        )
    else:
        response = sns.publish(
            TargetArn=iotARN,
            Message=json.dumps({'default': json.dumps("No commands found in " + parsetext)}),
            MessageStructure='json'
        )
            
