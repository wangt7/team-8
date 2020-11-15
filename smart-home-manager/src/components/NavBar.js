import React from 'react'
import { useParams } from "react-router";
import { NavLink } from 'react-router-dom';



function NavBar() {
    const {username} = useParams();
    return (
        <div>
            <nav>
                <div className="logo">Smart Home Manager</div>
                <ul className="nav-links">
                    <li>
                        <NavLink to={"/lights/"+username}>Lights</NavLink>
                    </li>
                    <li>
                        <NavLink to={"/doors/"+username}>Door</NavLink>
                    </li>
                </ul>
            </nav>
        </div>
    )
}

export default NavBar