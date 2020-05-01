// jshint esversion: 9
import React, { useEffect, useCallback, useReducer, useMemo } from 'react';
import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';
import ErrorModal from '../UI/ErrorModal';
import useHttp from '../../hooks/http';

const ingredientReducer = (currentIngredients, action) => {
  // ingredients currently stored by react and an action that actually will become important for updating the state.
  switch (action.type) {
    case 'SET':
      return action.ingredients;
    // in the add case here we all do want to return a new state snapshot 
    case 'ADD':
      return [...currentIngredients, action.ingredient];
    //  in the delete case here. We need to return our updated list of ingredients.
    case 'DELETE':
      return currentIngredients.filter(ing => ing.id !== action.id);
    default:
      throw new Error('should not get there');
  }
};

const Ingredients = () => {
  const {isLoading, data, error, sendRequest, reqExtra, reqIdentifier} = useHttp();
  const [userIngredients, dispatch] = useReducer(ingredientReducer, []);
  useEffect(() => {
    // console.log('rendering ingredients', userIngredients);
    if (!isLoading && !error && reqIdentifier === 'REMOVE_INGREDIENT') {
      dispatch({type: 'DELETE', id: reqExtra});
    } else if (!isLoading && !error && reqIdentifier === 'ADD_INGREDIENT') {
      dispatch({type: 'ADD', ingredient: {id: data.name, ...reqExtra}});
    }
  }, [data, reqExtra, reqIdentifier, isLoading, error]);

  const removeIngredientHandler = useCallback((ingredientId) => {
    sendRequest(
      `https://react-hooks-a1e9b.firebaseio.com/ingredients/${ingredientId}.json`,
      'DELETE',
      null,
      ingredientId,
      'REMOVE_INGREDIENT'
    );
  }, [sendRequest]);

  const filteredIngredientsHandler = useCallback((filteredIngredients) => {
    // setUserIngredients(filteredIngredients);
    // we can't use yukaridaki kodu anymore we're not managing user ingredients with you state instead here we now dispatch for a setting the ingredients.
    //  with that we're using dispatch to update our user ingredients.
    dispatch({type: 'SET', ingredients: filteredIngredients})
  }, []);

  const addIngredientHandler = useCallback((ingredient) => {
    sendRequest(
      'https://react-hooks-a1e9b.firebaseio.com/ingredients.json',
      'POST',
      JSON.stringify(ingredient),
      ingredient,
      'ADD_INGREDIENT'
    );
    // setIsLoading(true);
    // dispatchHttp({type: 'SEND'});
    // fetch('https://react-hooks-a1e9b.firebaseio.com/ingredients.json', {
    //   method: 'POST',
    //   body: JSON.stringify(ingredient),
    //   headers: {'Content-Type': 'application/json'}
    // }).then(response => {
    //   // setIsLoading(false);
    //   dispatchHttp({type: 'RESPONSE'});
    //   return response.json();
    // }).then(responseData => {
    //  dispatch({type: 'ADD', ingredient: {id: responseData.name, ...ingredient}});
    // })
  }, [sendRequest]);

  const clearError = useCallback(() => {
    // setError(null);
    // dispatchHttp({type: 'CLEAR'});
  }, []);

  // use callback was a hook to save a function that doesn't change so that no new function is generated. Use memo is a hook where you can save a value which is saved so that the value isn't re created and that is a no way of memorizing component.
  // So if you have some operation that calculates a more complex value calculates a value which maybe takes a bit longer to calculate than you want to consider wrapping it with the use memo so that it's not recalculated whenever the component renders but really only recalculated when you'd need to recalculate it. That's the idea here.
  const ingredientList = useMemo(() => {
    return (
      <IngredientList 
        ingredients={userIngredients}
        onRemoveItem={removeIngredientHandler} />
    )
    // This tells react when it should rerun this function to create a new object that it should memorize
  }, [userIngredients, removeIngredientHandler]);

  return (
    <div className="App">
      {error && <ErrorModal onClose={clearError}>{error}</ErrorModal>}
      <IngredientForm 
        onAddIngredient={addIngredientHandler}
        loading={isLoading}/>
      <section>
        {/* we have to specify this prop onLoadIngredients on a search component and there forward a point or add a function that should execute when all load ingredients is called in the search component. */}
        <Search onLoadIngredients={filteredIngredientsHandler}/>
        {ingredientList}
      </section>
    </div>
  );
}

export default Ingredients;
