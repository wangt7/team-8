import React, { Component } from 'react';
import LightService from '../services/LightService'

function TurnOff(props){
    return <td><button onClick={props.onClick}>Turn Off</button></td>;
}
function TurnOn(props){
    return <td><button onClick={props.onClick}>Turn On</button></td>;
}
class LightsController extends Component{
    constructor(props){
        super(props)
        this.state = {
            lights: [
                {
                    "name": "Test Light 1",
                    "state": "Off",
                    "light_color_xy": [
                        0,
                        1
                    ],
                    "id" : "1"
                },
                {
                    "name": "Test Light 2",
                    "state": "Off",
                    "light_color_xy": [
                        0,
                        1
                    ],
                    "id" : "2"
                }
            ]
        }
        this.refreshLights = this.refreshLights.bind(this)
    }

    componentDidMount() {
        this.refreshLights();
    }

    refreshLights(){
        LightService.getAllLights().then(response =>{
            let responseLights = [];
            for(let light in response.data['msg']){
                let tmpLight = {};
                tmpLight['name'] = response.data['msg'][light]['name'];
                tmpLight['id'] = light;
                if(response.data['msg'][light]['state']){
                    tmpLight['state'] = 'On';
                }
                else{
                    tmpLight['state'] = 'Off';
                }
                responseLights.push(tmpLight);
            }
            console.log(responseLights);
            this.setState({lights: responseLights});
        });
    }

    TurnLightOn(id){
        console.log('Turning On Light Id: ' + id);
        LightService.turnOnLight(id);
        this.refreshLights();
    }
    TurnLightOff(id){
        console.log('Turning Off Light Id: ' + id);
        LightService.turnOffLight(id);
        this.refreshLights();
    }

    render() {
        return (
            <div className="container">
                <h3>Your Lights</h3>
                <table>
                    <thead>
                        <tr>
                            <td>Name</td>
                            <td>State</td>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.lights.map(
                                light =>
                                    <tr key = {light.id}>
                                        <td>{light.name}</td>
                                        <td>{light.state}</td>
                                        {light.state === "On" && <TurnOff onClick={() => this.TurnLightOff(light.id)}></TurnOff>}
                                        {light.state === "Off" && <TurnOn onClick={() => this.TurnLightOn(light.id)}></TurnOn>}
                                    </tr>
                            )
                        }
                    </tbody>
                </table>
            </div>
        )
    }
}

export default LightsController