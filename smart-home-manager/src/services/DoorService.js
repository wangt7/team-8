import axios from 'axios'

const SMART_HOME_MANAGER_DOOR_API = 'https://cors-anywhere.herokuapp.com/https://mpw657jp3g.execute-api.us-east-1.amazonaws.com/dev/doors'

class DoorService{
    getAllDoors(userId){
        let allDoorsRequest = SMART_HOME_MANAGER_DOOR_API;
        let allDoorsBody = {'userId': userId};
        let allDoorsResponse = axios.post(`${allDoorsRequest}`,allDoorsBody);
        return allDoorsResponse;
    }
    getLog(userId,doorId){
        let allDoorLogsRequest = SMART_HOME_MANAGER_DOOR_API;
        let allDoorLogsBody = {'userId': userId, 'doorId': doorId};
        let allDoorLogsResponse = axios.post(`${allDoorLogsRequest}`, allDoorLogsBody);
        return allDoorLogsResponse;
    }
}

export default new DoorService()