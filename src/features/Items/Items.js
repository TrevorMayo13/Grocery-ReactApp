
import { createStoreHook, useSelector, useStore } from 'react-redux';
import { useState, useEffect } from 'react';
import React from 'react';

//Databse
//amplify pull, amplify api update, amplify push to update backend
import { listItems } from '../../graphql/queries';
import { API, Storage } from 'aws-amplify';

import { experimentalStyled as styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import './Items.css';
import { Icon } from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import {getSearch} from '../../app/DataSet'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export function Items() {
  const initialFormState = { name: '', description: '' }
  const [formData, setFormData] = useState(initialFormState);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const searchInput = useSelector(getSearch);

  //Handling Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [modalItem, setModalItem] = useState({});

  useEffect(() => {
    fetchItems();
    filterItems();
  }, []);

  useEffect(() => {
    filterItems();
  }, [items]);

  useEffect(() => {
    filterItems();
  }, [searchInput]);

  async function fetchItems() {
    const apiData = await API.graphql({ query: listItems });
    console.log(apiData);
    const itemsFromAPI = apiData.data.listItems.items;
    await Promise.all(itemsFromAPI.map(async item => {
      if (item.image) {
        const image = await Storage.get(item.image);
        item.image = image;
      }
      return item;
    }))
    setItems(apiData.data.listItems.items);
  }

  //handle image upload
  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    //fetchNotes();
    fetchItems();
  }

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));

  const section = {
    height: "300px",
    paddingTop: 5,
    backgroundColor: "#fff"
  };


  const handleAddToCart = (e, item) => {
    handleOpen();
    setModalItem(item);
  }

  const filterItems = () => {
    const tempArray = items.filter(item => item.name.includes(searchInput));
    setFilteredItems(tempArray);
  }

  return (
    <div className="container">
      <h1>Item Page</h1>
      <div className="grid-container">
        {filteredItems.length > 0 ? filteredItems.map((item) => (
          <div className="grid-card">
            <img src="https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg" className="item-img"></img>
            <h5 className='item-name'>
              {item.name}
            </h5>
            <p className="item-price">
              {`$${item.price}`}
            </p>
            <Button onClick={(e) => handleAddToCart(e, item)} variant="contained" color="success">Add to Cart</Button>
          </div>
        )) : <div className="no-results"><h4>No results</h4></div>}
      </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img src="https://cdn.britannica.com/94/151894-050-F72A5317/Brown-eggs.jpg" className="item-img"></img>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {modalItem.name}
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            {modalItem.description}
          </Typography>
          <Typography id="modal-modal-price" sx={{ mt: 2 }}>
            {modalItem.price}
          </Typography>
        </Box>
      </Modal>
      {/* <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {items.map((item, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Item style={section}>
                <div>
                  {item.name}
                </div>
                <div>
                  {item.description}
                </div>
                <div>
                  {`$${item.price}`}
                </div>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box> */}
      {/* <div style={{ marginBottom: 30 }}>
        {
          //When mapping over the notes array, render an image if it exists:
          items.map(item => (
            <div key={item.id || item.name}>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              {
                item.image && <img src={item.image} style={{ width: 400 }} />
              }
            </div>
          ))
        }
      </div> */}
    </div>
  );
}