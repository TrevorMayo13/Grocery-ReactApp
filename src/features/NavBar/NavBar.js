import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button } from 'react-bootstrap';
import { setView } from '../../app/DataSet';
export function NavBar() {
    const dispatch = useDispatch();

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
                    </Nav>
                    <Form className="d-flex">
                        <FormControl
                            type="search"
                            placeholder="Search"
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-success">Search</Button>
                    </Form>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}
