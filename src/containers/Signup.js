import React, { useState } from "react";
import {
  Form,
  Button
} from "react-bootstrap";
import { useFormFields } from "../libs/hooksLib";
import "./Signup.css";
import { Auth } from "aws-amplify"; 

export default function Signup(props) {
  const [fields, handleFieldChange] = useFormFields({
    username: "",
    password: "",
    email: "",
    confirmPassword: "",
    confirmationCode: ""
  });
  const [newUser, setNewUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return (
      fields.username.length > 0 &&
      fields.password.length > 0 &&
      fields.password === fields.confirmPassword
    );
  }

  function validateConfirmationForm() {
    return fields.confirmationCode.length > 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
        const newUser = await Auth.signUp({
          username: fields.username,
          password: fields.password,
          attributes: {
              email: fields.email
          }
        });
        setIsLoading(false);
        setNewUser(newUser);
      } catch (e) {
        alert(e.message);
        setIsLoading(false);
      }

    setIsLoading(false);
  }

  async function handleConfirmationSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
        await Auth.confirmSignUp(fields.username, fields.confirmationCode);
        await Auth.signIn(fields.username, fields.password);
    
        props.userHasAuthenticated(true);
        props.history.push("/");
      } catch (e) {
        alert(e.message);
        setIsLoading(false);
      }
  }

  function renderConfirmationForm() {
    return (
      <form onSubmit={handleConfirmationSubmit}>
        <Form.Group controlId="confirmationCode" bsSize="large">
          <Form.Label>Confirmation Code</Form.Label>
          <Form.Control
            autoFocus
            type="tel"
            onChange={handleFieldChange}
            value={fields.confirmationCode}
          />
        </Form.Group>
        <Button block bsSize="large" disabled={!validateConfirmationForm()} type="submit">
          Verify
        </Button>
      </form>
    );
  }

  function renderForm() {
    return (
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="username" bsSize="large">
          <Form.Label>Username</Form.Label>
          <Form.Control

            autoFocus
            type="username"
            value={fields.username}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="email" bsSize="large">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            value={fields.email}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="password" bsSize="large">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            value={fields.password}
            onChange={handleFieldChange}
          />
        </Form.Group>
        <Form.Group controlId="confirmPassword" bsSize="large">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            onChange={handleFieldChange}
            value={fields.confirmPassword}
          />
        </Form.Group>
        <Button block bsSize="large" disabled={!validateForm()} type="submit">
          Signup
        </Button>
      </form>
    );
  }

  return (
    <div className="Signup">
      {newUser === null ? renderForm() : renderConfirmationForm()}
    </div>
  );
}