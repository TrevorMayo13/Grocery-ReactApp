import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getView } from '../../app/DataSet';
import { setView } from '../../app/DataSet';
import './Home.css';
import cheesecake from './cheesecake.jpeg';
import wagyu from './wagyu.jpg';
import watermelon from './watermelon.jpg';

//create featured items

function Home() {
  //const featured = useSelector(getFeatured); //3 items
  const featuredItems = [
    { id: 1, name: 'Strawberry Cheesecake', description: 'The cheesecake is nestled in a simple graham cracker base that adds a touch of texture to each bite.', image: cheesecake, price: '9.99' },
    { id: 2, name: 'Wagyu Steak', description: 'Thanks to the marbled texture and high percentage of fat, Wagyu beef is moist, tender, and mouth-wateringly flavoursome.', image: wagyu, price: '42.99' },
    { id: 3, name: 'Watermelon', description: 'Sweet, organic watermelon sourced directly from neighboring farms.', image: watermelon, price: '8.99' }
  ];

  const dispatch = useDispatch();

  return (
    <div className="home-wrapper">
      {/* <img className="fruit-pic" src={fruit}>/ */}
      <div className="fruit-pic">
        <div className="pop-out">
          <h2>Celebrate Memorial Day with our new Deals!</h2>
          <p>Tons of tasty treats for your family and friends!</p>
          <button onClick={() => dispatch(setView('allitems'))}>Shop Now</button>
        </div>
      </div>
      <div className="div2">
        <h1>Featured Items</h1>
        <div className="featured-grid-container">
          {featuredItems.map(item => (
            <div className="featured-card">
              <img src={item.image}></img>
              <h2>{item.name}</h2>
              <p>{item.description}</p>
              <div>${item.price}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;