
import { createStoreHook, useSelector, useStore } from 'react-redux';
import { useState, useEffect } from 'react';
import React from 'react';
import './AddItemPage.css';
//aws auth
//import { withAuthenticator } from '@aws-amplify/ui-react'
//Databse
//amplify pull, amplify api update, amplify push to update backend
import { listItems } from '../../graphql/queries';
import jsonObject from '../../groceryitems.json';
import { createItem as createItemMutation, deleteItem as deleteItemMutation } from '../../graphql/mutations'
import { API, Storage, Auth, graphqlOperation } from 'aws-amplify';

import { DataGrid, GridSelectionModel } from '@mui/x-data-grid';

import { withAuthenticator } from '@aws-amplify/ui-react';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

function AddItemPage({ signOut, user }) {
    //Initial Form
    const initialFormState = { name: '', description: '', price: '', category: '' }
    const [formData, setFormData] = useState(initialFormState);
    const [selectionModel, setSelectionModel] = useState([]);
    const [items, setItems] = useState([]);
    const [isMultiple, setIsMultiple] = useState('Select Items');

    //On state update
    useEffect(() => {
        fetchItems();
    }, []);

    //Fetch Items
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
    //Create Item
    async function createItem() {
        if (!formData.name || !formData.description) return;
        await API.graphql({ query: createItemMutation, variables: { input: formData } });
        console.log('Stored item in database');
        if (formData.image) {
            const image = await Storage.get(formData.image);
            formData.image = image;
        }
        fetchItems();
        setFormData(initialFormState);
    }
    //Delete Item
    async function deleteItem({ id }) {
        const newItemsArray = items.filter(item => item.id !== id);
        setItems(newItemsArray);
        console.log(deleteItemMutation);
        await API.graphql({ query: deleteItemMutation, variables: { input: { id } } });
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

    const columns = [
        { field: 'id', headerName: 'ID', width: 90 },
        {
            field: 'name',
            headerName: 'Name',
            width: 150,
            editable: true,
        },
        {
            field: 'description',
            headerName: 'Description',
            width: 150,
            editable: true,
        },
        {
            field: 'category',
            headerName: 'Category',
            width: 150,
            editable: true,
        },
        {
            field: 'price',
            headerName: 'Price',
            width: 150,
            editable: true,
        },
        {
            field: 'image',
            headerName: 'Image Link',
            width: 110,
            editable: true,
        },
    ];
    async function handleDeleteRow() {
        //Doesn't run if there is nothing selected.
        if (selectionModel.length == 0) {
            return;
        }
        //This creates a custom mutation string to delete all models, that will be run in API.
        let mutationString = "";
        for (let i in selectionModel) {
            mutationString += `mutation${i}: deleteItem(input: {id: "${selectionModel[i]}"}) {
                id
            }
            `;
        }
        await API.graphql(
            graphqlOperation(`
            mutation batchMutation {
              ${mutationString}
        }
        `)
        );
        //Fetch Items to sync local items to database items, which updates.
        fetchItems();
    };

    //Fills Database with grocery items
    async function createMultiple(tempArray) {
        let mutationString = "";
        for (let i in tempArray) {
            console.log(tempArray[i]);
            console.log(`${JSON.stringify(tempArray[i])}`);
            mutationString += `mutation${i}: createItem(input: ${JSON.stringify(tempArray[i])}) {
            id
              name
              description
              image
              price
              category
            }
            `;
        }

        console.log(mutationString);
        const unquoted = mutationString.replace(/"([^"]+)":/g, '$1:');
        console.log(unquoted);

        await API.graphql(
            graphqlOperation(`
            mutation batchMutation {
              ${ unquoted }
        }
        `)
        );
        fetchItems();
    }


    function importGroceryItems() {
        console.log(jsonObject);
        let tempArray = [];
        for (let key in jsonObject) {
            if (jsonObject[key]) {
                delete jsonObject[key].width;
                delete jsonObject[key].height;
                delete jsonObject[key].rating;
                tempArray.push(jsonObject[key]);
            }
        }
        console.log(tempArray);
        createMultiple(tempArray);
    }

    return (
        <div className="page-container">
            <h1>Add Item Page</h1>
            <div style={{ height: 100 }}></div>
            <div style={{ height: 400, width: '100%' }}>
                <Stack
                    sx={{ width: '100%', mb: 1 }}
                    direction="row"
                    alignItems="flex-start"
                    columnGap={1}
                >
                    <Button size="small" onClick={handleDeleteRow}>
                        {isMultiple}
                    </Button>
                    <Button size="small" onClick={importGroceryItems}>
                        Import JSON Test Objects
                    </Button>
                </Stack>
                <Box sx={{ height: 361, bgcolor: 'background.paper' }}>
                    <DataGrid
                        rows={items}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        rowHeight={25} 
                        checkboxSelection
                        disableSelectionOnClick
                        onSelectionModelChange={(newSelectionModel) => {
                            if (newSelectionModel.length === 1) {
                                setIsMultiple('Delete Item');
                            } else if (newSelectionModel.length === 0) {
                                setIsMultiple('Select Items');
                            } else {
                                setIsMultiple('Delete All Selected');
                            }
                            setSelectionModel(newSelectionModel);
                        }}
                        selectionModel={selectionModel}
                    />
                </Box>
            </div>
            <div style={{ height: 100 }}></div>
            <input
                type="file"
                onChange={onChange}
            />
            <input
                onChange={e => setFormData({ ...formData, 'name': e.target.value })}
                placeholder="Item name"
                value={formData.name}
            />
            <input
                onChange={e => setFormData({ ...formData, 'description': e.target.value })}
                placeholder="Item description"
                value={formData.description}
            />
            <input
                onChange={e => setFormData({ ...formData, 'category': e.target.value })}
                placeholder="Ex. Meat"
                value={formData.category}
            />
            <input
                onChange={e => setFormData({ ...formData, 'price': e.target.value })}
                placeholder="Price"
                value={formData.price}
            />
            <button onClick={createItem}>Create Item</button>
        </div>

    );
}

export default withAuthenticator(AddItemPage);