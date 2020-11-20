import json
import urllib3
import boto3
from boto3.dynamodb.conditions import Key
'''
The lambda_handler is used to handle the incoming http requests
'''
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
        elif 'lightId' in body: 
            user_id = body['userId']
            light_id =  body['lightId']
            responseBody['msg'] = get_light_info_by_id_from_dynamo(user_id, light_id)
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
the get_light_info_all_from_dynamo function is used to get all the lights associated with a specific user
params:
-------
userId: the id of the user for which we are searching for lights
-------
return:
-------
a dictionary of the lights associated to the userId
-------
'''
def get_light_info_all_from_dynamo(userId):
    dynamodb = boto3.resource('dynamodb')
    tbl = dynamodb.Table('SmartHomeManagerUserDevices')
    response = tbl.query(KeyConditionExpression=Key('userId').eq(userId))
    lights_dict = {}
    if len(response['Items']) < 1 or not 'lights' in response['Items'][0]:
        return lights_dict
    for light_id, light_info in response['Items'][0]['lights'].items():
        light_name = light_info['name']
        light_state = light_info['light_state']
        light_type = light_info['device_type']
        light_color = light_info['color']
        lights_dict[light_id] = {'name': light_name, 'state': light_state, 'color': light_color}
    return lights_dict
'''
the get_light_info_by_id_from_dynamo is used to get the info of a specific light
params:
-------
userId: the id of the user 
lightId: the id of the light being searched
-------
return:
-------
a dictionary of the properties of the desired lights
-------
'''
def get_light_info_by_id_from_dynamo(userId,lightId):
    dynamodb = boto3.resource('dynamodb')
    tbl = dynamodb.Table('SmartHomeManagerUserDevices')
    dynamoResponse = tbl.query(KeyConditionExpression=Key('userId').eq(userId))
    if len(dynamoResponse['Items']) < 1 or not 'lights' in dynamoResponse['Items'][0]:
        return {}
    dynamo_user_lights = dynamoResponse['Items'][0]['lights']
    if lightId in dynamo_user_lights:
        return dynamo_user_lights[lightId]
    else:
        return {}