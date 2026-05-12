"use client";

import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";

function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  return (
    <>
      <Navbar expand="lg" bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/">Spearitual Tech</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link href="/applications">Applications</Nav.Link>
              <Nav.Link href="/blog">Blogs</Nav.Link>
              <Nav.Link href="/music">+Music</Nav.Link>
            </Nav>
            <Form.Check
              type="switch"
              id="admin-switch"
              label={isAdmin ? "Admin" : "Guest"}
              checked={isAdmin}
              onChange={(e) => setIsAdmin(e.target.checked)}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default Header;
