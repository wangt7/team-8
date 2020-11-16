import React from 'react'
import { useParams } from "react-router";
import { NavLink } from 'react-router-dom';
import {Navbar, Nav} from 'react-bootstrap';

function NavBar() {
    const {username} = useParams();
    return (
        <Navbar style={{"backgroundColor": "#50C5B780"}}>
            <Navbar.Brand className="text-light">Smart Home Manager</Navbar.Brand>
            <Nav>
                <NavLink className="mx-1" to={"/lights/"+username}>Lights</NavLink>
                <NavLink className="mx-1" to={"/doors/"+username}>Door</NavLink>
            </Nav>
        </Navbar>
    )
}

export default NavBar