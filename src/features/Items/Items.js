
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

export function Items() {
  const initialFormState = { name: '', description: '' }
  const [formData, setFormData] = useState(initialFormState);
  const [items, setItems] = useState([]);

  useEffect(() => {
    fetchItems();
  }, []);

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

  return (
    <div>
      <h1>Item Page</h1>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
          {items.map((item, index) => (
            <Grid item xs={2} sm={4} md={4} key={index}>
              <Item style={section}>
                <div>
                  <div>
                    {item.name}
                  </div>
                  <div>
                    {item.description}
                  </div>
                  <div>
                    {`$${item.price}`}
                  </div>
                </div>
              </Item>
            </Grid>
          ))}
        </Grid>
      </Box>
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