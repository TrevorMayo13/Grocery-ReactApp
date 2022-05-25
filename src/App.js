import { Counter } from './features/counter/Counter';
import { NavBar } from './features/NavBar/NavBar';
import { Items } from './features/Items/Items';
import { About } from './features/About/About';
import { Meat } from './features/Meat/Meat';
import { Produce } from './features/Produce/Produce';
import { getView } from './app/DataSet';

import { createStoreHook, useSelector, useStore } from 'react-redux';
import { useState, useEffect } from 'react';
import React from 'react';

import './App.css';
import logo from './logo.svg';

//aws auth
//import { withAuthenticator } from '@aws-amplify/ui-react'
//Databse
//amplify pull, amplify api update, amplify push to update backend
import { listTodos, listItems } from './graphql/queries';
import { createTodo as createNoteMutation, deleteTodo as deleteNoteMutation } from './graphql/mutations';
import { API, Storage } from 'aws-amplify';


const initialFormState = { name: '', description: '' }

function App() {
  const view = useSelector(getView);

  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    fetchNotes();
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
    const notesFromAPI = apiData.data.listItems.items;
    await Promise.all(notesFromAPI.map(async item => {
      if (item.image) {
        const image = await Storage.get(item.image);
        item.image = image;
      }
      return item;
    }))
    setNotes(apiData.data.listItems.items);
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

  //handle image upload
  async function onChange(e) {
    if (!e.target.files[0]) return
    const file = e.target.files[0];
    setFormData({ ...formData, image: file.name });
    await Storage.put(file.name, file);
    fetchNotes();
  }


  return (
    <div className="App">
      <NavBar />
      {
        view === 'home' ? <div><img src={logo} className="App-logo" alt="logo" /> <Counter /></div> :
          view === 'allitems' ? <Items /> :
            view === 'about' ? <About /> :
              view === 'meat' ? <Meat /> :
                view === 'produce' ? <Produce /> : null
      }
      <h1>My Notes App</h1>
      <input
        type="file"
        onChange={onChange}
      />
      <input
        onChange={e => setFormData({ ...formData, 'name': e.target.value })}
        placeholder="Note name"
        value={formData.name}
      />
      <input
        onChange={e => setFormData({ ...formData, 'description': e.target.value })}
        placeholder="Note description"
        value={formData.description}
      />
      <button onClick={createNote}>Create Note</button>
      <div style={{ marginBottom: 30 }}>
        {
          //When mapping over the notes array, render an image if it exists:
          notes.map(note => (
            <div key={note.id || note.name}>
              <h2>{note.name}</h2>
              <p>{note.description}</p>
              <button onClick={() => deleteNote(note)}>Delete note</button>
              {
                note.image && <img src={note.image} style={{ width: 400 }} />
              }
            </div>
          ))
        }
      </div>
    </div>
  );
}
export default App;
//export default withAuthenticator(App);