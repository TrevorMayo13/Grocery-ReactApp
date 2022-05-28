import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Navbar, Container, Nav, NavDropdown, Form, FormControl, Button, Dropdown } from 'react-bootstrap';
import { setView, setSearch, getSearch, getView, getCart as getGlobalCart, setCart } from '../../app/DataSet';
import './NavBar.css'
import cartPic from '../../cart.svg'
import trashPic from '../../trash.png'

export function NavBar() {
    const [localSearch, setLocalSearch] = useState('');

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

    const handleSubmit = e => {
        e.preventDefault();
        dispatch(setSearch(localSearch));
        dispatch(setView('allitems'));
    }

    return (
        <div className="navbar">
            <div className="logo-and-links">
                <h4 className="logo">Grocery App</h4>
                <div className="links">
                    <a onClick={() => dispatch(setView('home'))}>Home</a>
                    <a onClick={() => dispatch(setView('about'))}>About</a>
                    <a>Categories</a>
                    {/* <NavDropdown title="Categories" id="navbarScrollingDropdown">
                            <NavDropdown.Item onClick={() => dispatch(setView('meat'))}>Meat</NavDropdown.Item>
                            <NavDropdown.Item onClick={() => dispatch(setView('produce'))}>Produce</NavDropdown.Item>
                        </NavDropdown> */}
                    <a onClick={() => dispatch(setView('allitems'))}>All Items</a>
                    <a onClick={() => dispatch(setView('additem'))}>Add Items</a>
                </div>
            </div>
            <div className="search-cart">
                <form onSubmit={handleSubmit} className="search-form">
                    <input
                        id="search"
                        type="text"
                        value={localSearch}
                        onChange={(e) => setLocalSearch(e.target.value)}
                        placeholder="Search"></input>
                    <button className="search-button" type="submit">Search</button>
                </form>
                <Dropdown className="d-inline mx-2" autoClose="outside">
                    <Dropdown.Toggle variant="outline-success">
                        <img className="cart-picture" src={cartPic}></img>
                        {cart.length}
                    </Dropdown.Toggle>
                    <Dropdown.Menu align="end">
                        {cart.map((item, index) => (
                            <Dropdown.Item href="#">
                                <div className="menu-item">
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
            </div>
        </div>
    );
}
