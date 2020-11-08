import React, { Component } from 'react';
import LightService from '../services/LightService'
import 'bootstrap/dist/css/bootstrap.css';
import {Container, Row, Col, Card, Table, Button, Spinner, Form} from 'react-bootstrap'
import Power from 'mdi-react/PowerPlugOutlineIcon'
import Power_off from 'mdi-react/PowerPlugOffOutlineIcon'
import Info_outline from 'mdi-react/InfoCircleOutlineIcon'
import info_filled from 'mdi-react/InfoCircleIcon'
import Exit from 'mdi-react/CloseIcon'
import Plus from 'mdi-react/PlusIcon'

function TurnOff(props){
    return <td><Button className="mx-auto" variant="outline-danger" onClick={props.onClick}><Power_off /></Button></td>;
}
function TurnOn(props){
    return <td><Button className="mx-auto" variant="outline-success" onClick={props.onClick}><Power /></Button></td>;
}
class LightsController extends Component{
    constructor(props){
        super(props)
        this.state = {
            loading: false,
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
            ],
            selectedLightId: null,
            selectedLight: [{
                "name": "",
                "apiEndpoint": "",
                "apiSecurity": ""
            }],
            pendingChanges: {},
            isPendingChanges: false
        }
        this.refreshLights = this.refreshLights.bind(this)
        this.setLightId = this.setLightId.bind(this)
        this.turnLightOn = this.turnLightOn.bind(this)
        this.turnLightOff = this.turnLightOff.bind(this)
        this.pendingChange = this.pendingChange.bind(this)
    }

    componentDidMount() {
        this.refreshLights();
    }

    refreshLights(){
        this.setState({loading: true});
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
            this.setState({lights: responseLights, loading: false});
        });
    }

    turnLightOn(id){
        console.log('Turning On Light Id: ' + id);
        this.setState({loading: true})
        LightService.turnOnLight(id).then(response =>{
            this.refreshLights();
        });
    }
    turnLightOff(id){
        console.log('Turning Off Light Id: ' + id);
        this.setState({loading: true})
        LightService.turnOffLight(id).then(response =>{
            this.refreshLights();
        });
    }
    setLightId(id){
        console.log('User Selected Light Id:' + id);
        this.setState({selectedLightId: id, isPendingChanges: false});
        if(id != null){
            LightService.getLightById(id).then(response =>{
                console.log(response);
                let lightInfo = response.data['msg'];
                let lname = lightInfo["name"];
                let apiConn = lightInfo['connection']['baseAPI'];
                let apiSec = "None";
                if('Bearer' in lightInfo['connection']){
                    apiSec = lightInfo['connection']['Bearer'];
                }
                this.setState({selectedLight: [{name: lname, apiEndpoint: apiConn, apiSecurity: apiSec}]})
            });
        }
    }
    pendingChange(e){
        let changeId = e.target.id;
        let changeValue = e.target.value;
        this.setState({isPendingChanges: true});
        if (changeId === 'LightName'){
            this.setState({pendingChanges: {LightName: changeValue}});
        }
        else if (changeId === 'LightApiUrl'){
            this.setState({pendingChanges: {LightApiUrl: changeValue}});
        }
        else if (changeId === 'LightSecurity'){
            this.setState({pendingChanges: {LightSecurity: changeValue}});
        }
    }
    makePendingChanges(){
        let changes = this.state.pendingChanges;
        let light_id = this.state.selectedLightId;
        console.log(light_id);
        console.log(changes);
    }

    render() {
        return (
            <Container>
                <Row className="justify-content-md-center my-3">
                    <Col className="text-center" xs={6} md={4} >
                        <h1>Light Controller</h1>
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col>
                        <Card className="my-3">
                            {!this.state.loading && <Table hover> 
                                <thead>
                                    <tr>
                                        <th>Name</th>
                                        <th>Current State</th>
                                        <th></th>
                                        <th><Button><Plus /></Button></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {
                                    this.state.lights.map(
                                        light =>
                                            <tr key = {light.id}>
                                                <td>{light.name}</td>
                                                <td>{light.state}</td>
                                                {light.state === "On" && <TurnOff onClick={() => this.turnLightOff(light.id)}></TurnOff>}
                                                {light.state === "Off" && <TurnOn onClick={() => this.turnLightOn(light.id)}></TurnOn>}
                                                <td><Button variant="link" onClick={() => this.setLightId(light.id)}><Info_outline /></Button></td>
                                            </tr>
                                    )
                                    }
                                </tbody>
                            </Table>}
                            {this.state.loading && <Spinner animation="border"></Spinner>}
                        </Card>
                        {this.state.selectedLightId != null && 
                        <Card className="my-3">
                            <Card.Body>
                                <Card.Title>
                                    <Row>
                                        <Col sm={11}>
                                            Selected Light
                                        </Col>
                                        <Col sm={1}>
                                            <Button onClick={()=> this.setLightId(null)}><Exit /></Button>
                                        </Col>
                                    </Row>
                                </Card.Title>
                                    {
                                        this.state.selectedLight.map(
                                            light =>
                                                <Form>
                                                    <Form.Group controlId="LightName">
                                                        <Form.Label>Light Name</Form.Label>
                                                        <Form.Control type="text" placeholder={light.name} onChange={this.pendingChange}></Form.Control>
                                                    </Form.Group>
                                                    <Form.Group controlId="LightApiUrl">
                                                        <Form.Label>Light Api Endpoint</Form.Label>
                                                        <Form.Control type="text" placeholder={light.apiEndpoint}></Form.Control>
                                                    </Form.Group>
                                                    <Form.Group controlId="LightSecurity">
                                                        <Form.Label>Light Api Security</Form.Label>
                                                        <Form.Control type="text" placeholder={light.apiSecurity}></Form.Control>
                                                    </Form.Group>
                                                    <Button disabled={!this.state.isPendingChanges} onClick={()=>this.makePendingChanges()}>
                                                        Update Light
                                                    </Button>
                                                </Form>
                                        )
                                    }
                            </Card.Body>
                        </Card>}
                    </Col>
                </Row>
            </Container>
        )
    }
}

export default LightsController