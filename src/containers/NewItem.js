import React, { useRef, useState } from "react";
import { Form, Button } from "react-bootstrap";
import config from "../config";
import "./NewItem.css";
import { API } from "aws-amplify";
import { Auth } from "aws-amplify";

export default function NewItem(props) {
  const [name, setName] = useState("");
  const [isRecipe, setIsRecipe] = useState("");
  const [category, setCategory] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validateForm() {
    return name.length > 0 &&
           category != "";
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setIsLoading(true);

    try {
        await createItem({ 
            "name": name,
            "isRecipe": (isRecipe ? "true" : "false"),
            "category": category
         });
        props.history.push("/items");
      } catch (e) {
        alert(e);
        setIsLoading(false);
      }
    }

  async function createItem(item) {
    console.log(item);
    return API.post("foodItems", "/foodItems", { 
        body: item
    });
  }

  return (
    <div className="NewItem">
      <form onSubmit={handleSubmit}>
        <Form.Group controlId="name">
          <Form.Label>Food Item Name</Form.Label>
          <Form.Control
            value={name}
            onChange={e => setName(e.target.value)}
          />
        </Form.Group>
        <Form.Group controlId="category">
        <Form.Label>Category</Form.Label>
        <Form.Control as="select" inputRef={ el => this.category=el } value={category} onChange={e => setCategory(e.target.value)}>
            <option>Select...</option>
            <option>Protein</option>
            <option>Vegetables</option>
            <option>Nuts & Oils</option>
            <option>Canned Goods</option>
            <option>Sauce</option>
            <option>Spices & Seasonings</option>
        </Form.Control>
        </Form.Group>
        <Form.Group controlId="isRecipe">
            <Form.Label>Is Recipe</Form.Label>
            <input type="checkbox" onChange={e => setIsRecipe(e.target.checked)}/>
        </Form.Group>
       
        <Button block bssize="large" disabled={!validateForm()} type="submit">
          Create
        </Button>
      </form>
    </div>
  );
}