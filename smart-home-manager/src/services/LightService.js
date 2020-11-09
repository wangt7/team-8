import axios from 'axios'

const SMART_HOME_MANAGER_LIGHT_API = 'https://cors-anywhere.herokuapp.com/https://ymlsh3q6dj.execute-api.us-east-1.amazonaws.com/test1Stage/lights'

class LightService{
    getAllLights(){
        let allLightsRequest = SMART_HOME_MANAGER_LIGHT_API;
        let allLightBody = {'userId': 'TG001'};
        let allLightsResponse = axios.post(`${allLightsRequest}`,allLightBody);
        return allLightsResponse;
    }
    getLightById(light_id){
        let lightByIdRequest = SMART_HOME_MANAGER_LIGHT_API;
        let lightByIdBody = {'userId': 'TG001', 'lightId': light_id};
        let lightByIdResponse = axios.post(`${lightByIdRequest}`, lightByIdBody);
        return lightByIdResponse;
    }
    turnOffLight(light_id){
        let turnOffLightRequest = SMART_HOME_MANAGER_LIGHT_API + '/state';
        let body = {'state': false, 'id':light_id, 'userId': 'TG001'};
        let turnOffResponse = axios.post(`${turnOffLightRequest}`,body);
        return turnOffResponse;
    }
    turnOnLight(light_id){
        let turnOffLightRequest = SMART_HOME_MANAGER_LIGHT_API + '/state';
        let body = {'state': true, 'id':light_id, 'userId': 'TG001'};
        let turnOnResponse = axios.post(`${turnOffLightRequest}`,body);
        return turnOnResponse;
    }
    updateLight(light_id,pendingChanges){
        let updateLightRequest = SMART_HOME_MANAGER_LIGHT_API + '/update'
        let updateLightBody = pendingChanges
        updateLightBody['lightId'] = light_id;
        updateLightBody['userId'] = 'TG001';
        let updateLightResponse = axios.post(`${updateLightRequest}`,updateLightBody);
        return updateLightResponse;
    }
    addNewLight(lightName,lightType,lightApi,lightBearer){
        let addNewLightRequest = SMART_HOME_MANAGER_LIGHT_API + '/add'
        let addNewLightBody = {'name':lightName,'light_type':lightType,'baseAPI':lightApi,'Bearer':lightBearer,'userId': 'TG001'};
        let addNewLightResponse = axios.post(`${addNewLightRequest}`,addNewLightBody);
        return addNewLightResponse
    }
}

export default new LightService()