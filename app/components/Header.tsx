"use client";

import { useEffect, useState } from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { useAuth } from "../context/AuthContext";

function Header() {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { handleLogin, user, handleLogout, loading } = useAuth();

  // Sync toggle with actual auth state
  const isAdmin = !!user;

  const handleCloseLogin = () => {
    setShowLoginModal(false);
    setEmail("");
    setPassword("");
  };

  const handleCloseLogout = () => {
    setShowLogoutModal(false);
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    try {
      e.preventDefault();
      await handleLogin(email, password);
      setShowLoginModal(false);
      setEmail("");
      setPassword("");
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleLogoutSubmit = () => {
    handleLogout();
    setShowLogoutModal(false);
  };

  const handleToggleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      // User wants to switch to Admin - show login modal
      setShowLoginModal(true);
    } else {
      // User wants to logout - show confirmation modal
      setShowLogoutModal(true);
    }
  };

  useEffect(() => {
    console.log("Updated auth user:", user);
  }, [user]);

  return (
    <>
      <Navbar expand="lg" bg="light" data-bs-theme="light">
        <Container>
          <Navbar.Brand href="/">Spearitual LLC</Navbar.Brand>
          <Navbar.Toggle aria-controls="main-nav" />
          <Navbar.Collapse id="main-nav">
            <Nav className="me-auto">
              <Nav.Link href="/applications">Applications</Nav.Link>
              <Nav.Link href="/blog">Blog</Nav.Link>
            </Nav>
            {!loading && (
              <Form.Check
                type="switch"
                id="admin-switch"
                label={isAdmin ? "Admin" : "Guest"}
                checked={isAdmin}
                onChange={handleToggleChange}
              />
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal */}
      <Modal show={showLoginModal} onHide={handleCloseLogin} centered>
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3" controlId="loginEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter email"
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="loginPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <div className="text-end">
              <a href="#" style={{ fontSize: "0.875rem" }}>
                Forgot password?
              </a>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="dark" onClick={handleLoginSubmit}>
            Login
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Logout Confirmation Modal */}
      <Modal show={showLogoutModal} onHide={handleCloseLogout} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to logout from admin mode?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseLogout}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleLogoutSubmit}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Header;
