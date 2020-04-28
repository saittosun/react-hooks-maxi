// jshint esversion: 9
import React, { useState } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  const addIngredientHandler = (ingredient) => {
    setUserIngredients(prevIngredients => [
      //  here the idea will be to call set user ingredients and now important we'll need to update the existing list of ingredients and add a new one. Now that means we depend on the current state and they offer it's best if we use the functional forum where we're guaranteed to get the latest state. So we get our previous ingredients here our older array basically the current state. This is a spread operator taking all elements of our old array and adding them as elements to this new Array which I'm constructing with the square brackets. And then to add one new element here and that's the ingredient we're getting now important ingredient we're getting from the ingredient form we'll have a title and an amount.
      ...prevIngredients, 
      {id: Math.random().toString(),
        // we can again use to spread operator on ingredient now. So on this argument we're getting because this argument will be an object let's say the spread operator then takes all key value pairs from that object and adds key and value pairs to this new object. So now we're adding a new object with an I.D. title in amount to our list of ingredients here.
        ...ingredient}
    ]);
  };
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>
      <section>
        <Search />
        <IngredientList 
          ingredients={userIngredients}
          onRemoveItem={() => {}} />
      </section>
    </div>
  );
}

export default Ingredients;
