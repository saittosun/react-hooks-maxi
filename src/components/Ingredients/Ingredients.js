// jshint esversion: 9
import React, { useState, useEffect, useCallback, useReducer } from 'react';
import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';

// if you followed through the redux section the word reducer already tells you something with users are functions that take some input and returns and output in the end and useReducer uses that to give you a clearly defined way of the finding state changes in state updates and it will then also manage that state for you. So react will do that.
// whilst the concept of reducer functions is similar, useReducer() has absolutely NO connection to the redux library.
// It all starts with you to finding a reducer and you typically do that outside of your component so that this reduce or function isn't recreated when every component we render is because the reducer function often is decoupled from what's happening inside your component actually.
const ingredientReducer = (currentIngredients, action) => {
  // ingredients currently stored by react and an action that actually will become important for updating the state.
  switch (action.type) {
    case 'SET':
      // I expect to get an ingredients property which should be an array of ingredients which will replace the old state.
      return action.ingredients;
    // in the add case here we all do want to return a new state snapshot 
    case 'ADD':
      // I expect to get an ingredients property which should be an array of ingredients which will replace the old state.
      return [...currentIngredients, action.ingredient];
    //  in the delete case here. We need to return our updated list of ingredients.
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('should not get there');
  }
}


const Ingredients = () => {
  // We now need to initialize it by calling use reduce or use it utilize it by calling useReducer. userReducer takes our reducer function. So the ingredient reducer in this case here and userReducer also takes an optional second argument which is the starting state and in our case that's an empty array. So that's what will be passed in as current ingredients. The first time does reducer runs and for subsequent runs current ingredients will be our current state.Initially it's an empty array and use reducer like used state returns something. Something although it is an array but now not with state and set state but with state. So our user ingredients. So we can comment out this use a state called here user ingredients. But the second argument is now not a method to set our user ingredients. Instead we're doing the setting in our reducer. Instead it's a dispatch function. It's still a function which we can call and you can name does whatever you want the named dispatch is just one that makes sense because it's a function which will call to dispatch these actions later.So where you dispatched these action objects which are then handled by the reducer so I'll temporarily again still import use state so that the arrow code still works.
  const [userIngredients, dispatch] = useReducer(ingredientReducer, [])
  // const [userIngredients, setUserIngredients] = useState([]);
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
      // setUserIngredients(prevIngredients => {
      //   return prevIngredients.filter((ingredient) => {
      //     return ingredient.id !== ingredientId;
      //   });
      // });
      dispatch({type: 'DELETE', id: ingredientId});
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
    // setUserIngredients(filteredIngredients);
    // we can't use yukaridaki kodu anymore we're not managing user ingredients with you state instead here we now dispatch for a setting the ingredients.
    //  with that we're using dispatch to update our user ingredients.
    dispatch({type: 'SET', ingredients: filteredIngredients})
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
      //setUserIngredients(prevIngredients => [
        //  here the idea will be to call set user ingredients and now important we'll need to update the existing list of ingredients and add a new one. Now that means we depend on the current state and they offer it's best if we use the functional forum where we're guaranteed to get the latest state. So we get our previous ingredients here our older array basically the current state. This is a spread operator taking all elements of our old array and adding them as elements to this new Array which I'm constructing with the square brackets. And then to add one new element here and that's the ingredient we're getting now important ingredient we're getting from the ingredient form we'll have a title and an amount.
       // ...prevIngredients, 
        // we can access code name here has nothing to do with react or with the fetch API that's just firebase it returns some data which the end is a javascript object which has a name property and that name property will have that unique I.D. which was generated by firebase.
       // {id: responseData.name,
          // we can again use to spread operator on ingredient now. So on this argument we're getting because this argument will be an object let's say the spread operator then takes all key value pairs from that object and adds key and value pairs to this new object. So now we're adding a new object with an I.D. title in amount to our list of ingredients here.
      //    ...ingredient}
     // ]);
     dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
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
