import json
import urllib3
import boto3
from boto3.dynamodb.conditions import Key
import math
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
        elif not 'state' in body or not 'id' in body:
            responseStatusCode = 400
            responseBody['msg'] = 'Desired State or Id is not provided'
        else:
            #retrieve all the needed variables from the request body
            desiredAction = body['state']
            desiredLight = body['id']
            user = body['userId']
            if 'color' in body:
                color = body['color']
            else:
                color = {}
            #determine the function to call based on the provided desired action
            if desiredAction == True:
                turn_on_light(user, desiredLight,color)
            elif desiredAction == False:
                turn_off_light(user, desiredLight)
            else:
                responseStatusCode = 400
                responseBody['msg'] = 'Desired State is invalid'
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
The turn_on_light function is used to turn on a specific light
params:
-------
user_id: the id of the user
light_id: the id of the light
color: the color to turn the light to
-------
return:
-------
{'msg': ______}
-------
'''
def turn_on_light(user_id,light_id,color):
    light = get_light_by_id_from_dynamo(user_id,light_id)
    if light == {}:
        return {'msg':'Invalid light id provided'}
    else: 
        light_type = light['device_type']
        connection_info = light['connection']
        if color == {}:
            lightColor = light['color']
            lightRed = int(lightColor['red'])
            lightBlue = int(lightColor['blue'])
            lightGreen = int(lightColor['green'])
        else:
            lightRed = int(color['red'])
            lightBlue = int(color['blue'])
            lightGreen = int(color['green'])
        lightHueX, lightHueY = get_hue_xy(lightRed,lightGreen,lightBlue)
        lightColor = {'red': str(lightRed), 'blue': str(lightBlue), 'green': str(lightGreen)}
        set_light_state_in_dynamo(user_id,light_id,True)
        set_light_color_in_dynamo(user_id,light_id,lightColor)
        if light_type == 'Hue':
            api_url_base = connection_info['baseAPI']
            bearer_token = connection_info['Bearer']
            payload = {"on":True, "xy": [lightHueX, lightHueY], "bri": 200}
            headers = {"content-type": "application/json",
                       "Authorization": bearer_token}
            url = api_url_base + "/state"
            http = urllib3.PoolManager()
            response = http.request('PUT',url,body=json.dumps(payload),headers=headers)
            return json.loads(response.data.decode('utf-8'))
        else:
            return {'msg': 'Fake light turned on'}
'''
The turn_off_light function is used to turn off a lights
params:
-------
user_id: the id of the user
light_id: the id of the light
-------
return:
-------
{'msg': _______}
-------
'''
def turn_off_light(user_id,light_id):
    light = get_light_by_id_from_dynamo(user_id,light_id)
    if light == {}:
        return {'msg':'Invalid light id provided'}
    else: 
        light_type = light['device_type']
        connection_info = light['connection']
        set_light_state_in_dynamo(user_id,light_id,False)
        if light_type == 'Hue':
            api_url_base = connection_info['baseAPI']
            bearer_token = connection_info['Bearer']
            payload = {"on":False}
            headers = {"content-type": "application/json",
                       "Authorization": bearer_token}
            url = api_url_base + "/state"
            print(url)
            http = urllib3.PoolManager()
            response = http.request('PUT',url,body=json.dumps(payload),headers=headers)
            return json.loads(response.data.decode('utf-8'))
        else:
            return {'msg': 'Fake light turned off'}
'''
The get_light_by_id_from_dynamo function is used to retrieve the information on a specific light associated with a user.
params:
-------
userId: the id of the user 
lightId: the id of the light
-------
return:
-------
a map of the light info
-------
'''
def get_light_by_id_from_dynamo(userId, lightId):
    dynamodb = boto3.resource('dynamodb')
    tbl = dynamodb.Table('SmartHomeManagerUserDevices')
    dynamoResponse = tbl.query(KeyConditionExpression=Key('userId').eq(userId))
    dynamo_user_lights = dynamoResponse['Items'][0]['lights']
    if lightId in dynamo_user_lights:
        return dynamo_user_lights[lightId]
    else:
        return {}
'''
The set_light_state_in_dynamo function is used to up the current state of a light in dynamo
params:
-------
userId: The id of the user 
lightId: the id of the light
light_state: the updated state
-------
return:
-------
-------
'''
def set_light_state_in_dynamo(userId, lightId, light_state):
    print('dynamo')
    print(lightId)
    dynamodb = boto3.resource('dynamodb')
    tbl = dynamodb.Table('SmartHomeManagerUserDevices')
    dynamoSetExpression = "set lights.%s.light_state=:s"%(lightId)
    dynamoResponse = tbl.update_item(Key={'userId': userId}, UpdateExpression=dynamoSetExpression, ExpressionAttributeValues={':s': light_state}, ReturnValues="UPDATED_OLD")
    return dynamoResponse
'''
The set_light_color_in_dynamo function is used update the light color in the dyanmo database, to keep the current state consistent
params:
-------
userId: the user id
lightId: the light id 
color: the updated color
-------
return:
-------
-------
'''
def set_light_color_in_dynamo(userId, lightId, color):
    dynamodb = boto3.resource('dynamodb')
    tbl = dynamodb.Table('SmartHomeManagerUserDevices')
    dynamoSetExpression = "set lights.%s.color=:s"%(lightId)
    dynamoResponse = tbl.update_item(Key={'userId': userId}, UpdateExpression=dynamoSetExpression, ExpressionAttributeValues={':s': color}, ReturnValues="UPDATED_OLD")
    return dynamoResponse
'''
The get_hue_xy function is used to turn r,g,b value in to an x,y value for hue to interpret
params:
-------
red: color value
blue: color value
green: color value
-------
return:
-------
x: hue x color value
y: hue y color value
-------
'''
def get_hue_xy(red,green,blue):
    if red > 0.04045:
        red = math.pow((red + 0.055) / (1.0 + 0.055), 2.4);
    else:
        red = (red / 12.92);
    
    if (green > 0.04045):
        green = math.pow((green + 0.055) / (1.0 + 0.055), 2.4);
    else:
        green = (green / 12.92);
    
    if blue > 0.04045:
        blue = math.pow((blue + 0.055) / (1.0 + 0.055), 2.4);
    else:
        blue = (blue / 12.92);
    
    X = red * 0.664511 + green * 0.154324 + blue * 0.162028;
    Y = red * 0.283881 + green * 0.668433 + blue * 0.047685;
    Z = red * 0.000088 + green * 0.072310 + blue * 0.986039;
    x = X / (X + Y + Z);
    y = Y / (X + Y + Z);
    return x,y;
    
    