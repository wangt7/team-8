import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Container, Row, Col, Card, Table, Button, Spinner, Form, FormLabel} from 'react-bootstrap'
import '../css/DoorController.css'
import DoorService from '../services/DoorService'
import LightService from '../services/LightService';
import DoorClosedI from 'mdi-react/DoorClosedIcon';
import DoorOpenI from 'mdi-react/DoorOpenIcon';
import NavBar from './NavBar';

function DoorShut(){
    return <td ><DoorClosedI></DoorClosedI></td>
}
function DoorOpen(){
    return <td ><DoorOpenI></DoorOpenI></td>
}

class DoorController extends Component {
    constructor(props) {
        super(props)
        this.state = {
            doors: [],
            log: [],
            loading: false,
            viewLogIds: []
        }
        this.refreshDoors = this.refreshDoors.bind(this);
        this.viewLogSelected = this.viewLogSelected.bind(this);
        this.refreshLog = this.refreshLog.bind(this);
    }
    componentDidMount(){
        this.refreshDoors();
    }

    refreshDoors(){
        // this.setState({loading: true});
        DoorService.getAllDoors().then(response=>{
            console.log(response.data['msg'])
            let responseDoors = [];
            for(let door in response.data['msg']){
                let tmpDoor = {};
                tmpDoor['name'] = response.data['msg'][door]['name'];
                tmpDoor['state'] = response.data['msg'][door]['state'];
                tmpDoor['id'] = door;
                responseDoors.push(tmpDoor);
            }
            this.setState({doors: responseDoors, loading: false});
        });
    }
    refreshLog(doorId){
        console.log(doorId);
        DoorService.getLog(doorId).then(response=>{
            let tmpLogs = [];
            for(let logMsg of response.data['msg']){
                
                console.log(logMsg);
                let tmpLog = {};
                tmpLog['dateTime'] = logMsg['date_time']
                if(logMsg['status'] ===  'Open!'){
                    tmpLog['status'] = true;
                }
                else{
                    tmpLog['status'] = false;
                }
                tmpLogs.push(tmpLog);
            }
            this.setState({'log': tmpLogs});
            console.log(this.state.log)
        })
    }

    viewLogSelected(event){
        let currentLogs = this.state.viewLogIds;
        if(currentLogs.includes(event.target.id)){
            currentLogs = currentLogs.filter(e => e!== event.target.id);
            this.setState({viewLogIds: currentLogs});
        }
        else{
            currentLogs.push(event.target.id);
            this.setState({viewLogIds: currentLogs});
            this.refreshLog(event.target.id)
        }
    }

    render() {
        return(
        <Container>
            <NavBar />
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,700;1,600&display=swap" rel="stylesheet"/>
            <Row className="justify-content-md-center my-3">
                <Col className="text-center" xs={6} md={6} >
                    <h1 className="DoorControllerTitle">Door Controller</h1>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <Card className="my-3">
                        {!!!this.state.loading && <Table hover>
                            <thead>
                                <tr>
                                    <th><span className="DoorControllerLogRowTitle">DeviceName</span></th>
                                    <th><span className="DoorControllerLogRowTitle">State</span></th>
                                    <th><span className="DoorControllerLogRowTitle">View Log</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                  this.state.doors.map(
                                      door => 
                                          <tr key = {door.id}>
                                              <td>{door.name}</td>
                                              {!!!door.state && <DoorShut></DoorShut>}
                                              {door.state && <DoorOpen></DoorOpen>}
                                              <td><Form.Check type="checkbox" id={door.id} onChange={this.viewLogSelected}></Form.Check></td>  
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
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <Card className="my-3">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th><span className="DoorControllerLogRowTitle">Date/Time</span></th>
                                    <th><span className="DoorControllerLogRowTitle">State</span></th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                  this.state.log.map(
                                      log => 
                                          <tr>
                                              <td>{log.dateTime}</td>
                                              {!!!log.status && <DoorShut></DoorShut>}
                                              {log.status && <DoorOpen></DoorOpen>} 
                                          </tr>
                                  )  
                                }
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </Row>
        </Container>
        )
    }
}

export default DoorController