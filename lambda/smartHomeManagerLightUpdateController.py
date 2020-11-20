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
        if not 'userId' in body or not 'lightId' in body:
            responseStatusCode = 400
            responseBody['msg'] = 'User Id not provided'
        else:
            #retrieve all the needed variables from the request body
            userId = body['userId']
            lightId = body['lightId']
            if 'name' in body: 
                update_light_property_in_dynamo(userId,lightId,'name',body['name'])
            if 'baseAPI' in body: 
                update_light_property_in_dynamo(userId,lightId,'connection.baseAPI',body['baseAPI'])
            if 'Bearer' in body:
                update_light_property_in_dynamo(userId,lightId,'connection.Bearer',body['Bearer'])

            
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
The update_light_property_in_dynamo function is used to upadte a property of a specific light
params:
-------
userId: the id of the user
lightId: the id of the light to be updated
propertyName: the name of the property to be updated
propertyValue: the updated value 
-------
return:
-------
-------
'''
def update_light_property_in_dynamo(userId,lightId,propertyName,propertyValue):
    dynamodb = boto3.resource('dynamodb')
    tbl = dynamodb.Table('SmartHomeManagerUserDevices')
    dynamoResponse = tbl.update_item(Key={'userId': userId}, UpdateExpression="SET lights.#lightId.#property = :v", ExpressionAttributeNames={'#lightId':lightId,'#property':propertyName}, ExpressionAttributeValues={':v':propertyValue})
    print(dynamoResponse)
    return dynamoResponse
