import axios from 'axios'

const SMART_HOME_MANAGER_DOOR_API = 'https://cors-anywhere.herokuapp.com/https://ymlsh3q6dj.execute-api.us-east-1.amazonaws.com/dev/doors'

class DoorService{
    getAllDoors(){
        let allDoorsRequest = SMART_HOME_MANAGER_DOOR_API;
        let allDoorsBody = {'userId': 'TG001'};
        let allDoorsResponse = axios.post(`${allDoorsRequest}`,allDoorsBody);
        return allDoorsResponse;
    }
    getLog(doorId){
        let allDoorLogsRequest = SMART_HOME_MANAGER_DOOR_API;
        let allDoorLogsBody = {'userId': 'TG001', 'doorId': doorId};
        let allDoorLogsResponse = axios.post(`${allDoorLogsRequest}`, allDoorLogsBody);
        return allDoorLogsResponse;
    }
}

export default new DoorService()