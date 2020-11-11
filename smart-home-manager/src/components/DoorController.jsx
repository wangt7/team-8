import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import {Container, Row, Col, Card, Table, Button, Spinner, Form, FormLabel} from 'react-bootstrap'
import '../css/DoorController.css'

class DoorController extends Component {
    constructor(props) {
        super(props)
        this.state = {

        }
    }
    render() {
        return(
        <Container>
            <link href="https://fonts.googleapis.com/css2?family=Poppins:ital,wght@0,300;0,400;0,500;0,700;1,600&display=swap" rel="stylesheet"/>
            <Row className="justify-content-md-center my-3">
                <Col className="text-center" xs={6} md={6} >
                    <h1 className="DoorControllerTitle">Door Controller</h1>
                </Col>
            </Row>
            <Row className="my-3">
                <Col>
                    <Card className="my-3">
                        <Table hover>
                            <thead>
                                <tr>
                                    <th><span className="DoorControllerLogRowTitle">DeviceName</span></th>
                                    <th><span className="DoorControllerLogRowTitle">State</span></th>
                                    <th><span className="DoorControllerLogRowTitle"></span></th>
                                </tr>
                            </thead>
                            <tbody>

                            </tbody>
                        </Table>
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
                                    <th><span className="DoorControllerLogRowTitle">Device</span></th>
                                    <th><span className="DoorControllerLogRowTitle">State</span></th>
                                </tr>
                            </thead>
                            <tbody>

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