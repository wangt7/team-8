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
        #check to ensure the desired state and desired light are in the body
        elif not 'name' in body or not 'baseAPI' in body or not 'light_type' in body or not 'Bearer' in body:
            responseStatusCode = 400
            responseBody['msg'] = 'name, baseAPI, or id is not provided'
        else:
            #retrieve all the needed variables from the request body
            userId = body['userId']
            new_light_id = get_next_light_id_from_dynamo(userId)
            add_new_light_in_dynamo(userId,new_light_id,body['name'],body['light_type'],body['baseAPI'],body['Bearer'])
            
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
The get_next_light_id_from_dynamo function is used to get the next incrementing light id based on the current light ids in dynamo.
params:
-------
userId: the id of the user 
-------
return:
-------
a string of the new light id
-------
'''
def get_next_light_id_from_dynamo(userId):
    dynamodb = boto3.resource('dynamodb')
    tbl = dynamodb.Table('SmartHomeManagerUserDevices')
    dynamoResponse = tbl.query(KeyConditionExpression=Key('userId').eq(userId))
    if len(dynamoResponse['Items']) < 1 or not 'lights' in dynamoResponse['Items'][0]:
        return userId[:2] + "L1"
    dynamo_user_lights = dynamoResponse['Items'][0]['lights']
    maxLightId = 0
    for lightId in dynamo_user_lights:
        print(lightId)
        print(lightId[-1])
        if int(lightId[-1]) > maxLightId:
            maxLightId = int(lightId[-1])
    if maxLightId == 0:
        return userId[:2] + "L1"
    else:
        return userId[:2] + "L" + str(maxLightId+1)
'''
The add_new_light_in_dynamo function is used to add a new light into the dynamo db
params:
-------
userId: The id of the user 
lightId: The id of light being added
light_name: The name of the light being added
light_type: The type of light being added
light_api: The api of the light being added
light_bearer: The bearer token of the light being added
-------
return:
-------
dynamoResponse
-------
'''
def add_new_light_in_dynamo(userId, lightId, light_name, light_type, light_api, light_bearer):
    print('dynamo')
    print(lightId)
    dynamodb = boto3.resource('dynamodb')
    tbl = dynamodb.Table('SmartHomeManagerUserDevices')
    response = tbl.query(KeyConditionExpression=Key('userId').eq(userId))
    if len(response['Items']) < 1 or not 'lights' in response['Items'][0]:
        new_light_map = {'name': light_name, 'light_state': False, 'device_type': light_type, 'color': {'red': '255', 'blue': '255', 'green': '255'}, 'connection' : {'baseAPI': light_api, 'Bearer': light_bearer}}
        insert_dict = {'userId': userId, 'lights': {lightId: new_light_map}}
        dynamoResponse = tbl.put_item(Item=insert_dict)
    else:
        dynamoResponse = tbl.update_item(Key={'userId': userId}, UpdateExpression="SET lights.#lightId = :m", ExpressionAttributeNames={'#lightId':lightId}, ExpressionAttributeValues={':m':new_light_map})
    print(dynamoResponse)
    return dynamoResponse