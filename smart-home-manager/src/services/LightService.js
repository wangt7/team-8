import axios from 'axios'

const SMART_HOME_MANAGER_LIGHT_API = 'https://cors-anywhere.herokuapp.com/https://ymlsh3q6dj.execute-api.us-east-1.amazonaws.com/dev/lights'

class LightService{
    getAllLights(userId){
        let allLightsRequest = SMART_HOME_MANAGER_LIGHT_API;
        let allLightBody = {'userId': userId};
        let allLightsResponse = axios.post(`${allLightsRequest}`,allLightBody);
        return allLightsResponse;
    }
    getLightById(userId,light_id){
        let lightByIdRequest = SMART_HOME_MANAGER_LIGHT_API;
        let lightByIdBody = {'userId': userId, 'lightId': light_id};
        let lightByIdResponse = axios.post(`${lightByIdRequest}`, lightByIdBody);
        return lightByIdResponse;
    }
    turnOffLight(userId,light_id){
        let turnOffLightRequest = SMART_HOME_MANAGER_LIGHT_API + '/state';
        let body = {'state': false, 'id':light_id, 'userId': userId};
        let turnOffResponse = axios.post(`${turnOffLightRequest}`,body);
        return turnOffResponse;
    }
    turnOnLight(userId,light_id){
        let turnOnLightRequest = SMART_HOME_MANAGER_LIGHT_API + '/state';
        let body = {'state': true, 'id':light_id, 'userId': userId};
        let turnOnResponse = axios.post(`${turnOnLightRequest}`,body);
        return turnOnResponse;
    }
    updateLightColor(userId, light_id,r,g,b){
        let changeColorLightRequest = SMART_HOME_MANAGER_LIGHT_API + '/state';
        let body = {'state': true, 'id':light_id, 'userId': userId, 'color': {'red': r, 'green': g, 'blue': b}};
        let turnOnResponse = axios.post(`${changeColorLightRequest}`,body);
        return turnOnResponse;
    }
    updateLight(userId, light_id,pendingChanges){
        let updateLightRequest = SMART_HOME_MANAGER_LIGHT_API + '/update'
        let updateLightBody = pendingChanges
        updateLightBody['lightId'] = light_id;
        updateLightBody['userId'] = userId;
        let updateLightResponse = axios.post(`${updateLightRequest}`,updateLightBody);
        return updateLightResponse;
    }
    addNewLight(userId, lightName, lightType, lightApi,lightBearer){
        let addNewLightRequest = SMART_HOME_MANAGER_LIGHT_API + '/add'
        let addNewLightBody = {'name':lightName,'light_type':lightType,'baseAPI':lightApi,'Bearer':lightBearer,'userId': userId};
        let addNewLightResponse = axios.post(`${addNewLightRequest}`,addNewLightBody);
        return addNewLightResponse
    }
}

export default new LightService()