// jshint esversion: 9
import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

// I'm also using react memo here to wrap this component to a wide unnecessary renders so that this only read renders this component only really renders when the props it depends on changed and not always when the parent component changed. So not always when ingredients changed but only when ingredients changed and we're passing you props to ingredient form which right now we're never doing so right now ingredient form won't re render when ingredients we renders.
const IngredientForm = React.memo(props => {
  // you have to use useState() in your functional component body. use state can be initialized with a default state and that state can be anything can be an object can be an array can be a number it can be a string a boolean can be any value it doesn't have to be an object it can be any value.
  // useState is built in Hook always returns an array with exactly two elements. First element is your current state snapshot. Second element is a function that allows you to update your current state.
  // We can use a feature called array destructuring. It allows you to pull elements out of an array and stored them in separate variables.
  // So by adding them on the left side you're not using them to create a new array or anything like that. That would be the case if you use them on the right side. But instead this now is a javascript syntax that allows you to pull elements out of that array and stored them in variables and you add as many variables here variable names of your choice here between the square brackets on the left side as you have elements the array.
  // The first element will be our data. And the second will be a function to update that data. Typically you name this set input state or asset whatever you named your data because your well setting this to a new value you're not merging it. You're not updating it. You're overwriting it. So you're setting some new data.
  // const [inputState, setInputState] = useState({title: '', amount: ''});
  // in class based components in class based components state had to be an object and react merged it for you automatically and functional components with the useState. State doesn't have to be an object and really doesn't merge it for you but what you can do is you can register multiple states.
  // So now I don't have to manually merge anything because these are managed independently
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');

  const submitHandler = event => {
    event.preventDefault();
    // ...
  };

  return (
    <section className="ingredient-form">
      <Card>
        <form onSubmit={submitHandler}>
          <div className="form-control">
            <label htmlFor="title">Name</label>
            <input 
              type="text" 
              id="title" 
              value={enteredTitle}
              onChange={event => {
                setEnteredTitle(event.target.value)
            }}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input 
              type="number" 
              id="amount" 
              value={enteredAmount}
              onChange={event => {
                setEnteredAmount(event.target.value)
              }}/>
          </div>
          <div className="ingredient-form__actions">
            <button type="submit">Add Ingredient</button>
          </div>
        </form>
      </Card>
    </section>
  );
});

export default IngredientForm;
