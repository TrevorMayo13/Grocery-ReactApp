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
import AddItemPage from './features/addItemPage/AddItemPage';


function App() {
  const view = useSelector(getView);

  return (
    <div className="App">
      <NavBar />
      {
        view === 'home' ? <div><img src={logo} className="App-logo" alt="logo" /> <Counter /></div> :
          view === 'allitems' ? <Items /> :
            view === 'about' ? <About /> :
              view === 'meat' ? <Meat /> :
                view === 'produce' ? <Produce /> :
                  view === 'additem' ? <AddItemPage /> : null
      }
    </div>
  );
}
export default App;
//export default withAuthenticator(App);