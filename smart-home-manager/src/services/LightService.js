import axios from 'axios'

const SMART_HOME_MANAGER_LIGHT_API = 'https://cors-anywhere.herokuapp.com/https://ymlsh3q6dj.execute-api.us-east-1.amazonaws.com/test1Stage/lights'

class LightService{
    getAllLights(){
        let allLightsRequest = SMART_HOME_MANAGER_LIGHT_API + '?real=true';
        let allLightsResponse = axios.get(`${allLightsRequest}`);
        return allLightsResponse;
    }
    turnOffLight(light_id){
        let turnOffLightRequest = SMART_HOME_MANAGER_LIGHT_API + '/state';
        let body = {'state': false, 'id':light_id};
        axios.post(`${turnOffLightRequest}`,body);
    }
    turnOnLight(light_id){
        let turnOffLightRequest = SMART_HOME_MANAGER_LIGHT_API + '/state';
        let body = {'state': true, 'id':light_id};
        axios.post(`${turnOffLightRequest}`,body);
    }
}

export default new LightService()