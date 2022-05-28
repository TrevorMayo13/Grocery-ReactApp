import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button, Dropdown } from 'react-bootstrap';
import { setView, setSearch, getSearch, getView, getCart as getGlobalCart, setCart } from '../../app/DataSet';
import './NavBar.css'
import cartPic from '../../cartPic.jpg'
import trashPic from '../../trash.png'

export function NavBar() {
    const dispatch = useDispatch();

    const onFormSubmit = e => {
        e.preventDefault()
        const formData = new FormData(e.target),
            formDataObj = Object.fromEntries(formData.entries())
        dispatch(setSearch(formDataObj.myInput));
        dispatch(setView('allitems'));
    }

    const cart = useSelector(getGlobalCart);

    const deleteItem = (index) => {
        const tempCart = [...cart];
        tempCart.splice(index, 1)
        dispatch(setCart(tempCart));
    }

    return (
        <Navbar bg="light" expand="lg">
            <Container fluid>
                <Navbar.Brand>Grocery App</Navbar.Brand>
                <Navbar.Toggle aria-controls="navbarScroll" />
                <Navbar.Collapse id="navbarScroll">
                    <Nav
                        className="me-auto my-2 my-lg-0"
                        style={{ maxHeight: '100px' }}
                        navbarScroll
                    >
                        <Nav.Link onClick={() => dispatch(setView('home'))}>Home</Nav.Link>
                        <Nav.Link onClick={() => dispatch(setView('about'))}>About</Nav.Link>
                        <NavDropdown title="Categories" id="navbarScrollingDropdown">
                            <NavDropdown.Item onClick={() => dispatch(setView('meat'))}>Meat</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => dispatch(setView('produce'))}>Produce</NavDropdown.Item>
                        </NavDropdown>
                        <Nav.Link onClick={() => dispatch(setView('allitems'))}>All Items</Nav.Link>
                        <Nav.Link onClick={() => dispatch(setView('additem'))}>Add Items</Nav.Link>
                    </Nav>
                    <Form className="d-flex" onSubmit={onFormSubmit}>
                        <FormControl
                            type="search"
                            name="myInput"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success" type="submit">Search</Button>
                        <Dropdown className="d-inline mx-2" autoClose="outside">
                            <Dropdown.Toggle variant="outline-success">
                                {`Cart ${cart.length}`}
                            </Dropdown.Toggle>
                            <Dropdown.Menu align="end">
                                {cart.map((item, index) => (
                                    <Dropdown.Item href="#">
                                        <div className="menuItem">
                                            {`${item.name} $${item.price}`}
                                            <img className="cartPic" src={trashPic} onClick={() => deleteItem(index)}></img>
                                        </div>
                                    </Dropdown.Item>
                                ))}
                                {/* <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                                <Dropdown.Item href="#">Menu Item</Dropdown.Item>
                                <Dropdown.Item href="#">Menu Item</Dropdown.Item> */}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
