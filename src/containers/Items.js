import React, { useState, useEffect } from "react";
import { Table, Button, Container, Row, Col, Modal } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { API } from "aws-amplify";
import "./Items.css";

export default function Items(props) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [deleteIsConfirmed, setDeleteIsConfirmed] = React.useState(false);

  async function showModal() {
    setModalIsOpen(true);
  };

  async function hideModal (deleteConfirmed){
    setDeleteIsConfirmed(deleteConfirmed)
    setModalIsOpen(false);
  };

  useEffect(() => {
    async function onLoad() {
      if (!props.isAuthenticated) {
        props.history.push("/login");
        return;
      }
  
      try {
        const items = await loadItems();
        setItems(items);
      } catch (e) {
        alert(e);
      }
  
      setIsLoading(false);
    }
  
    onLoad();
  }, [props.isAuthenticated]);
  
  function loadItems() {
    return API.get("foodItems", "/foodItems");
  }

  function deleteItem(id) {
    return API.del("foodItems", `/foodItems/${id}`)
    .then(setIsDeleting(false))
    .then(setItems(loadItems()));
  }
  
  async function handleDelete(event, id) {
    event.preventDefault()
  
    showModal()
  
    if (!deleteIsConfirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteItem(id);
    } catch (e) {
      alert(e);
      setIsDeleting(false);
    }
  }

  function renderNotesList(items) {
    return ([{}].concat(items).map((item, i) =>
     item.name == undefined ? null : (
        <tr key={item.foodItemId}>
            <td>{item.name}</td>
            <td>{item.category}</td>
            <td>{item.isRecipe}</td>
            <td>{new Date(item.createdAt).toLocaleString()}</td>
            <td><Button onClick={(event) => handleDelete(event, item.foodItemId)} value={item.foodItemId} variant="danger" size="sm">Delete</Button></td>
        </tr>
     ))
   );
  }

  return (
    <div className="items">
        <Container>
            <Row>
                <Col><h1>Food Items</h1></Col>
                <Col text-right>
                    <LinkContainer key="new"  className="float-right" to="/items/new">
                        <Button id="NewItemButton" variant="primary" size="lg">
                        <b>{"\uFF0B"}</b> New Item
                        </Button>
                    </LinkContainer>
                </Col>
            </Row>
        </Container>
        <Table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Category</th>
                <th>Is Recipe</th>
                <th>Created</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
          {!isLoading && renderNotesList(items)}
        </tbody>
        </Table>
        <Modal show={modalIsOpen}>
            <Modal.Header closeButton>
            <Modal.Title>Modal heading</Modal.Title>
            </Modal.Header>
            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => hideModal(false)}>
                Close
            </Button>
            <Button variant="primary" onClick={() => hideModal(true)}>
                Save Changes
            </Button>
            </Modal.Footer>
        </Modal>
        
    </div>
  );
}