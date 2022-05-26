
import { createStoreHook, useSelector, useStore } from 'react-redux';
import { useState, useEffect } from 'react';
import React from 'react';

//aws auth
//import { withAuthenticator } from '@aws-amplify/ui-react'
//Databse
//amplify pull, amplify api update, amplify push to update backend
import { listTodos, listItems } from '../../graphql/queries';
import { createTodo as createNoteMutation, deleteTodo as deleteNoteMutation } from '../../graphql/mutations'
import { createItem as createItemMutation, deleteItem as deleteItemMutation } from '../../graphql/mutations'
import { API, Storage, Auth } from 'aws-amplify';

import { withAuthenticator } from '@aws-amplify/ui-react';

function AddItemPage({ signOut, user }) {
    const initialFormState = { name: '', description: '' }
    const [notes, setNotes] = useState([]);
    const [formData, setFormData] = useState(initialFormState);

    const [items, setItems] = useState([]);

    useEffect(() => {
        //fetchNotes();
        fetchItems();
    }, []);

    //fetch image if there is an image associated with a note
    async function fetchNotes() {
        const apiData = await API.graphql({ query: listTodos });
        console.log(apiData);
        const notesFromAPI = apiData.data.listTodos.items;
        await Promise.all(notesFromAPI.map(async note => {
            if (note.image) {
                const image = await Storage.get(note.image);
                note.image = image;
            }
            return note;
        }))
        setNotes(apiData.data.listTodos.items);
    }

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

    async function createItem() {
        if (!formData.name || !formData.description) return;
        await API.graphql({ query: createItemMutation, variables: { input: formData } });
        if (formData.image) {
            const image = await Storage.get(formData.image);
            formData.image = image;
        }
        setItems([...items, formData]);
        setFormData(initialFormState);
    }

    //Update the createNote function to add the image to the local image array if an image is associated with the note
    async function createNote() {
        if (!formData.name || !formData.description) return;
        await API.graphql({ query: createNoteMutation, variables: { input: formData } });
        if (formData.image) {
            const image = await Storage.get(formData.image);
            formData.image = image;
        }
        setNotes([...notes, formData]);
        setFormData(initialFormState);
    }

    async function deleteNote({ id }) {
        const newNotesArray = notes.filter(note => note.id !== id);
        setNotes(newNotesArray);
        await API.graphql({ query: deleteNoteMutation, variables: { input: { id } } });
    }

    async function deleteItem({ id }) {
        const newItemsArray = items.filter(item => item.id !== id);
        setItems(newItemsArray);
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

    return (
        <div>
            <h1>Add Item Page</h1>
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
            <button onClick={createItem}>Create Item</button>
            <div style={{ marginBottom: 30 }}>
                {
                    //When mapping over the notes array, render an image if it exists:
                    items.map(item => (
                        <div key={item.id || item.name}>
                            <h2>{item.name}</h2>
                            <p>{item.description}</p>
                            <button onClick={() => deleteItem(item)}>Delete item</button>
                            {
                                item.image && <img src={item.image} style={{ width: 400 }} />
                            }
                        </div>
                    ))
                }
            </div>
        </div>
    );
}

export default withAuthenticator(AddItemPage);