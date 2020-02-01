import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Auth } from "aws-amplify";
import "./Login.css";

export default function Login(props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  function validateForm() {
    return username.length > 0 && password.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
  
    try {
      await Auth.signIn(username, password);
      alert("Logged in");
    } catch (e) {
      alert(e.message);
    }
  }

  return (
    <div className="Login">
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="username" bsSize="large">
          <Form.Control
            autoFocus
            type="username"
            value={username}
            onChange={e => setUsername(e.target.value)} 
            placeholder="Username"
          />
        </Form.Group>
        <Form.Group controlId="password" bsSize="large">
          <Form.Control
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password" 
            placeholder="Password"
          />
        </Form.Group>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Login
        </Button>
      </Form>
    </div>
  );
}