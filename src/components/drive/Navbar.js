import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function NavbarComponent() {
  return (
    <Navbar bg="light" expand="xl">
      <Navbar.Brand as={Link} to="/">
        XYZ Drive
      </Navbar.Brand>
      <Nav>
        <Nav.Link as={Link} to="/user">
          <b style={{ color: "darkblue" }}>Profile</b>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
