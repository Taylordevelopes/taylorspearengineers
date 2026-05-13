"use client";

import { useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

function Header() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

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
              onChange={(e) => {
                setIsAdmin(e.target.checked);
                handleShow();
              }}
            />
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" placeholder="Enter email" autoFocus />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" />
            </Form.Group>
            <div className="text-end">
              <a href="#" style={{ fontSize: "0.875rem" }}>
                Forgot password?
              </a>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="dark" onClick={handleClose}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Header;
