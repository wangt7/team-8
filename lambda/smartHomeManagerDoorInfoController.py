import json
import urllib3
import boto3
from boto3.dynamodb.conditions import Key

def lambda_handler(event, context):
    #variable setup
    responseStatusCode = 200
    responseHeaders = {}
    responseBody = {}
    #function execution 
    #check to ensure there is a body to the request
    if not 'body' in event or event['body'] == None:
        responseStatusCode = 400
        responseBody['msg'] = 'No body provided'
    else:
        body = json.loads(event['body'])
        #check to ensure the user id was provided in the body
        if not 'userId' in body:
            responseStatusCode = 400
            responseBody['msg'] = 'User Id not provided'
        elif 'doorId' in body: 
            user_id = body['userId']
            door_id =  body['doorId']
            responseBody['msg'] = get_door_log_from_dynamo(user_id, door_id)
        else:
            #retrieve all the needed variables from the request body
            user_id = body['userId']
            responseBody['msg'] = get_light_info_all_from_dynamo(user_id)
            # responseBody['user_id'] = user_id
    #return response
    responseHeaders['ContentType'] = 'application/json'
    responseHeaders['Access-Control-Allow-Origin'] = '*'
    responseHeaders['Access-Control-Allow-Credentials'] = ''
    return {
        'statusCode': responseStatusCode,
        'headers': responseHeaders,
        'body': json.dumps(responseBody)
    }
'''
'''
def get_light_info_all_from_dynamo(userId):
    dynamodb = boto3.resource('dynamodb')
    tbl = dynamodb.Table('SmartHomeManagerUserDoors')
    response = tbl.query(KeyConditionExpression=Key('userId').eq(userId))
    if len(response['Items']) < 1 or not 'DoorSensors' in response['Items'][0]:
        return {}
    door_sensor_dict = {}
    for light_id, light_info in response['Items'][0]['DoorSensors'].items():
        light_name = light_info['name']
        light_state = light_info['sensor_state']
        # light_type = light_info['device_type']
        door_sensor_dict[light_id] = {'name': light_name, 'state': light_state}
    return door_sensor_dict
'''
'''
def get_door_log_from_dynamo(userId,doorId):
    dynamodb = boto3.resource('dynamodb')
    tbl = dynamodb.Table('SmartHomeManagerUserDoors')
    response = tbl.query(KeyConditionExpression=Key('userId').eq(userId))
    if len(response['Items']) < 1 or not 'DoorSensors' in response['Items'][0]:
        return []
    doorSensors = response['Items'][0]['DoorSensors']
    print(doorSensors)
    if doorId in doorSensors:
        doorSerial = doorSensors[doorId]['serial']
        doorLogs = log_from_dynamo_by_serial(doorSerial)
        return doorLogs
    else:
        return []
'''
'''
def log_from_dynamo_by_serial(doorSerial):
    dynamodb = boto3.resource('dynamodb')
    tbl = dynamodb.Table('SmartHomeManagerDoorSensorLog')
    response = tbl.query(KeyConditionExpression=Key('serial').eq(doorSerial))
    doorLog = response['Items']
    logs = []
    for log in doorLog:
        logs.append({'date_time':log['date_time'], 'status':log['status']})
    return logs