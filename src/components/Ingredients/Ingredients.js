// jshint esversion: 9
import React, { useState, useEffect, useCallback } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();

  // I'm not specifying a second argument and therefore this will run for every well rerun or a cycle here.
  // If we add second argument, this means that this function here will now only run when user ingredients changed
  useEffect(() => {
    console.log('rendering ingredients', userIngredients);
  }, [userIngredients]);

  const removeIngredientHandler = (ingredientId) => {
    setIsLoading(true);
    fetch(
      `https://react-hooks-a1e9b.firebaseio.com/ingredients/${ingredientId}.json`, 
      {method: 'DELETE'}
    ).then(response => {
    setIsLoading(false);
      setUserIngredients(prevIngredients => {
        return prevIngredients.filter((ingredient) => {
          return ingredient.id !== ingredientId;
        });
      });
    }      
    ).catch(err => {
      //  these two again will be batched together so it's not to render cycles that are executed to show the error modal and to remove the spinner but it's one of the same render cycle which already has both state updates taken into account. So that's how react Bachus state updates and how you can handle error with a separate state of course where you store errors and then react to them appropriately.
      //every error object by default has a message properties.
      setError(err.message);
      setIsLoading(false);
    });
  };

  // this will now never rerun and therefore what React does is it cashes your function for you so that it survives rerun or cycles and therefore when ingredients component re renders this specific function (useCallback()) is not re created so it will not change. So what we pass to the search component to onLoadIngredients will be the old function the same function as on the previous render cycle and therefore in the search component on the use effect here on this check onLoadIngredients will not have changed and therefore it is a fact will not rerun.
  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }, []);

  const addIngredientHandler = (ingredient) => {
    setIsLoading(true);
    // this is where we want to send our data to and you got to know what have fetched by default will send a get request a firebase once a post request though if we want to store data hence we pass a second argument to fetch and that's an object that allows us to configure this request in on this object we can set the method property to post default the set then you never need to set that but we want to set this to post you then also can add a body property to define what you want to send and that has to be json data which means you can use json which is another thing built into the browser it's a class in the end built in to browsers which has a stringify method. This will take a javascript object or array and convert it into valid json format
    fetch('https://react-hooks-a1e9b.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
      setIsLoading(false);
      // this response actually will get some data back from firebase which contains that automatically generated id response itself however is a more complex object we're interested in the body of that responds and you get that by calling the Jason method there. This will extract the body and convert it from Jason to normal javascript code however this also returns a promise so we'll actually return response Jason here. and move this code into a neighbor then block which a change here which will be my my body
      return response.json();
    }).then(responseData => {
      // I get responseData or body in this function here which I passed the second then block which executes once this body has been parsed and now response data will be an object which has a name property which contains does automatically generated id, that's just how firebase works.
      setUserIngredients(prevIngredients => [
        //  here the idea will be to call set user ingredients and now important we'll need to update the existing list of ingredients and add a new one. Now that means we depend on the current state and they offer it's best if we use the functional forum where we're guaranteed to get the latest state. So we get our previous ingredients here our older array basically the current state. This is a spread operator taking all elements of our old array and adding them as elements to this new Array which I'm constructing with the square brackets. And then to add one new element here and that's the ingredient we're getting now important ingredient we're getting from the ingredient form we'll have a title and an amount.
        ...prevIngredients, 
        // we can access code name here has nothing to do with react or with the fetch API that's just firebase it returns some data which the end is a javascript object which has a name property and that name property will have that unique I.D. which was generated by firebase.
        {id: responseData.name,
          // we can again use to spread operator on ingredient now. So on this argument we're getting because this argument will be an object let's say the spread operator then takes all key value pairs from that object and adds key and value pairs to this new object. So now we're adding a new object with an I.D. title in amount to our list of ingredients here.
          ...ingredient}
      ]);
    })
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={isLoading}/>
      <section>
        {/* we have to specify this prop onLoadIngredients on a search component and there forward a point or add a function that should execute when all load ingredients is called in the search component. */}
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        <IngredientList 
          ingredients={userIngredients}
          onRemoveItem={removeIngredientHandler} />
      </section>
    </div>
  );
}

export default Ingredients;
