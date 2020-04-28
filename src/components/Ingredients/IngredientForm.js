// jshint esversion: 9
import React, { useState } from 'react';

import Card from '../UI/Card';
import './IngredientForm.css';

// I'm also using react memo here to wrap this component to a wide unnecessary renders so that this only read renders this component only really renders when the props it depends on changed and not always when the parent component changed. So not always when ingredients changed but only when ingredients changed and we're passing you props to ingredient form which right now we're never doing so right now ingredient form won't re render when ingredients we renders.
const IngredientForm = React.memo(props => {
  // you have to use useState() in your functional component body. use state can be initialized with a default state and that state can be anything can be an object can be an array can be a number it can be a string a boolean can be any value it doesn't have to be an object it can be any value.
  // useState is built in Hook always returns an array with exactly two elements. First element is your current state snapshot. Second element is a function that allows you to update your current state.
  const inputState = useState({title: '', amount: ''});
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
              value={inputState[0].title}
              onChange={event => {
                const newTitle = event.target.value
                inputState[1]((prevInputState) => ({
                title: newTitle, 
                amount: prevInputState.amount
              }))
            }}/>
          </div>
          <div className="form-control">
            <label htmlFor="amount">Amount</label>
            <input 
              type="number" 
              id="amount" 
              value={inputState[0].amount}
              onChange={event => {
                // simply because we're using a closure here and we want to make sure that we're generating a new amount for every keystroke. And then this will automatically be considered by this inner function instead of reusing that same event object all the time.
                const newAmount = event.target.value
                inputState[1]((prevInputState) => ({
                amount: newAmount,
                title: prevInputState.title
                }))
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
