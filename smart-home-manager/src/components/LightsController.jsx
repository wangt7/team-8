import React, { Component } from 'react';
import LightService from '../services/LightService'
import 'bootstrap/dist/css/bootstrap.css';
import {Container, Row, Col, Card, Table, Button, Spinner, Form, FormLabel, Navbar, Nav} from 'react-bootstrap'
import Power from 'mdi-react/PowerPlugOutlineIcon'
import Power_off from 'mdi-react/PowerPlugOffOutlineIcon'
import Info_outline from 'mdi-react/InfoCircleOutlineIcon'
import info_filled from 'mdi-react/InfoCircleIcon'
import Exit from 'mdi-react/CloseIcon'
import Plus from 'mdi-react/PlusIcon'
import { CompactPicker } from 'react-color';
import { useParams } from "react-router";
import NavBar from './NewNavBar';

function User(){
    const {username} = useParams();
    return username
}
function TurnOff(props){
    return <td><Button style={{"borderColor": "#C90E3A"}} className="mx-auto" variant="outline" onClick={props.onClick}><Power_off style={{"color": "#C90E3A"}} /></Button></td>;
}
function TurnOn(props){
    return <td><Button style={{"borderColor": "#31E981"}} className="mx-auto" variant="outline-success" onClick={props.onClick}><Power style={{"color": "#31E981"}} /></Button></td>;
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
            isPendingChanges: false,
            addNewLight: false,
            NewLightType: "Hue"
        }
        this.refreshLights = this.refreshLights.bind(this)
        this.setLightId = this.setLightId.bind(this)
        this.turnLightOn = this.turnLightOn.bind(this)
        this.turnLightOff = this.turnLightOff.bind(this)
        this.pendingChange = this.pendingChange.bind(this)
        this.openNewLight = this.openNewLight.bind(this)
        this.closeNewLight = this.closeNewLight.bind(this)
        this.updateNewLightFormParam = this.updateNewLightFormParam.bind(this)
        this.handleColorUpdate = this.handleColorUpdate.bind(this)
    }

    componentDidMount() {
        this.refreshLights();
    }
    refreshLights(){
        this.setState({loading: true});
        console.log('loading');
        let userId = this.props.match.params.username;
        LightService.getAllLights(userId).then(response =>{
            console.log('here');
            let responseLights = [];
            console.log(response.data['msg']);
            for(let light in response.data['msg']){
                let tmpLight = {};
                tmpLight['name'] = response.data['msg'][light]['name'];
                tmpLight['id'] = light;
                let color = response.data['msg'][light]['color'];
                let tmpColor = {'r':color['red'], 'b':color['blue'], 'g':color['green']}
                tmpLight['color'] = tmpColor;
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
        this.setState({[e.target.id]: e.target.value});
    }
    makePendingChanges(){
        let changes = {};
        if (this.state.PendingLightName != undefined){
            changes['name'] = this.state.PendingLightName
        }
        if (this.state.PendingLightApiUrl != undefined){
            changes['baseAPI'] = this.state.PendingLightApiUrl
        }
        if (this.state.PendingLightSecurity != undefined){
            changes['Bearer'] = this.state.PendingLightSecurity
        }
        let light_id = this.state.selectedLightId;
        console.log(light_id);
        console.log(changes);
        LightService.updateLight(light_id,changes).then(response=>{
            this.setLightId(null);
            this.refreshLights();
        });
    }
    openNewLight(){
        this.setState({addNewLight: true})
    }
    closeNewLight(){
        this.setState({addNewLight: false})
    }
    updateNewLightFormParam(event){
        this.setState({[event.target.id]: event.target.value});
    }
    addNewLight(){
        let new_light_name = this.state.NewLightName;
        let new_light_type = this.state.NewLightType;
        let new_light_api = this.state.NewLightApi;
        let new_light_bearer = this.state.NewLightSecurity;
        console.log(new_light_name);
        console.log(new_light_type);
        console.log(new_light_api);
        console.log(new_light_bearer);
        LightService.addNewLight(new_light_name,new_light_type,new_light_api,new_light_bearer);
    }
    handleColorUpdate(name,color){
        let rgb = color['rgb'];
        this.setState({loading: true})
        LightService.updateLightColor(name,rgb['r'],rgb['g'],rgb['b']).then(response => {
            this.refreshLights();
        });
    }


    render() {
        return (
            <div>
                <NavBar />
                <Container>
                    <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,700;1,600&display=swap" rel="stylesheet"/>
                    <Row className="justify-content-md-center my-3">
                        <Col className="text-center" xs={6} md={6} >
                            <h1 style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "600"}}>Light Controller</h1>
                        </Col>
                    </Row>
                    <Row className="my-3">
                        <Col>
                            <Card className="my-3">
                                {!this.state.loading && <Table hover> 
                                    <thead>
                                        <tr>
                                            <th><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "700"}}>Name</span></th>
                                            <th><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "700"}}>Current State</span></th>
                                            <th><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "700"}}>Color</span></th>
                                            <th></th>
                                            <th><Button style={{"backgroundColor": "#FFC759", "borderColor": "#FFC759"}} onClick={()=>this.openNewLight()}><Plus /></Button></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                        this.state.lights.map(
                                            light =>
                                                <tr key = {light.id}>
                                                    <td><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "300"}}>{light.name}</span></td>
                                                    <td><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "300"}}>{light.state}</span></td>
                                                    <td><CompactPicker color={light.color} onChangeComplete={(color)=>this.handleColorUpdate(light.id,color)}/></td>
                                                    {light.state === "On" && <TurnOff onClick={() => this.turnLightOff(light.id)}></TurnOff>}
                                                    {light.state === "Off" && <TurnOn onClick={() => this.turnLightOn(light.id)}></TurnOn>}
                                                    <td><Button variant="link" onClick={() => this.setLightId(light.id)}><Info_outline style={{"color": "#331E38"}}/></Button></td>
                                                </tr>
                                        )
                                        }
                                    </tbody>
                                </Table>}
                                {this.state.loading && 
                                <Row className="justify-content-center">
                                    <Spinner className="m-3" style={{'width':'7vh','height':'7vh','color': '#058ED9'}} animation="border"></Spinner>
                                </Row>}
                            </Card>
                            {this.state.selectedLightId != null && 
                            <Card className="my-3">
                                    <Card.Title className="p-3">
                                        <Row>
                                            <Col sm={11}>
                                                <h3 style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "600"}}>Light Info</h3>
                                            </Col>
                                            <Col sm={1}>
                                                <Button style={{"borderColor": "#C90E3A", "backgroundColor": "#C90E3A"}} onClick={()=> this.setLightId(null)}><Exit /></Button>
                                            </Col>
                                        </Row>
                                    </Card.Title>
                                    <Card.Body>
                                        {
                                            this.state.selectedLight.map(
                                                light =>
                                                    <Form>
                                                        <Form.Group controlId="PendingLightName">
                                                            <Form.Label><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "400"}}>Light Name</span></Form.Label>
                                                            <Form.Control style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "300"}} type="text" placeholder={light.name} onChange={this.pendingChange}></Form.Control>
                                                        </Form.Group>
                                                        <Form.Group controlId="PendingLightApiUrl">
                                                            <Form.Label><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "400"}}>Light Api Endpoint</span></Form.Label>
                                                            <Form.Control style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "300"}} type="text" placeholder={light.apiEndpoint} onChange={this.pendingChange}></Form.Control>
                                                        </Form.Group>
                                                        <Form.Group controlId="PendingLightSecurity">
                                                            <Form.Label><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "400"}}>Light Api Security</span></Form.Label>
                                                            <Form.Control style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "300"}} type="text" placeholder={light.apiSecurity} onChange={this.pendingChange}></Form.Control>
                                                        </Form.Group>
                                                        <Button style={{"backgroundColor": "#331E38","borderColor": "#331E38", "fontFamily": "Poppins, sans-serif", "fontWeight": "500"}} disabled={!this.state.isPendingChanges} onClick={()=>this.makePendingChanges()}>
                                                            Update Light
                                                        </Button>
                                                    </Form>
                                            )
                                        }
                                </Card.Body>
                            </Card>}
                            {this.state.addNewLight &&
                                <Card className="my-3">
                                    <Card.Title className="p-3">
                                        <Row>
                                            <Col sm={11}>
                                                <h3 style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "600"}}>Add New Light</h3>
                                            </Col>
                                            <Col sm={1}>
                                                <Button style={{"borderColor": "#C90E3A", "backgroundColor": "#C90E3A"}} onClick={()=>this.closeNewLight()}><Exit /></Button>
                                            </Col>
                                        </Row>
                                    </Card.Title>
                                    <Card.Body>
                                        <Form>
                                            <Form.Group controlId="NewLightName">
                                                <Form.Label><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "400"}}>New Light Name</span></Form.Label>
                                                <Form.Control style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "300"}} type="text" onChange={this.updateNewLightFormParam}></Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="NewLightType">
                                                <Form.Label><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "400"}}>New Light Type</span></Form.Label>
                                                <Form.Control style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "300"}} as="select" onChange={this.updateNewLightFormParam}>
                                                    <option>Hue</option>
                                                    <option>Fake</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="NewLightApi">
                                                <Form.Label><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "400"}}>Api Endpoint</span></Form.Label>
                                                <Form.Control style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "300"}} type="text" onChange={this.updateNewLightFormParam}></Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="NewLightSecurity">
                                                <Form.Label><span style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "400"}}>Bearer Token</span></Form.Label>
                                                <Form.Control style={{"fontFamily": "Poppins, sans-serif", "fontWeight": "300"}} type="text" onChange={this.updateNewLightFormParam}></Form.Control>
                                            </Form.Group>
                                            <Button style={{"borderColor": "#FFC759", "backgroundColor": "#FFC759", "fontFamily": "Poppins, sans-serif", "fontWeight": "500"}} onClick={()=>this.addNewLight()}>
                                                Add New Light
                                            </Button>
                                        </Form>
                                    </Card.Body>
                                </Card>
                            }
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}

export default LightsController