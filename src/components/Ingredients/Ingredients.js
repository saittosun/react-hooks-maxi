// jshint esversion: 9
import React, { useState, useEffect } from 'react';

import IngredientForm from './IngredientForm';
import Search from './Search';
import IngredientList from './IngredientList';

const Ingredients = () => {
  const [userIngredients, setUserIngredients] = useState([]);

  // Use effect has to name because it is there for you to manage side effects in HTTP requests are a typical side effect. side effect basically means that you have some logic that runs that does affect your application for example we are fetching some data here but it's not getting finished in this current renderer cycle or maybe it affects something which is outside of the scope of your jsx code down there maybe you're setting the document title anything like that. So anything you can not manage with your normal this component is getting rendered flow use effect and that's important by default gets executed right after important after every component render a cycle. So after this component has been rendered to first time. function you pass to use effect because you have to parse a function there will get executed. So this runs when ever this component got re rendered. And that's really important to keep in mind after and for every render cycle these are two important pieces not before not simultaneously but after and for every render cycle.
  // Actually all it takes a second argument. The first argument is this function which it executes after every render cycle. The second argument is an array with the dependencies of your function and only when such a dependency changed only then the function will rerun. So this allows you to control how often does function runs by default for every render cycle.
  useEffect(() => {
    fetch('https://react-hooks-a1e9b.firebaseio.com/ingredients.json')
      .then(response => response.json())
      .then(responseData => {
        const loadedIngredients = [];
        for (const key in responseData) {
          loadedIngredients.push({
            id: key,
            title: responseData[key].title,
            amount: responseData[key].amount
          });
        }
        setUserIngredients(loadedIngredients);
      });
      // this useEffect function here actually has no external dependencies(with external dependencies I mean variables or data you're using which you define in your component outside of the use affect function.) and so we can add an empty array but we have to do that admitting it is not an option.
      // used like this (with [] as a second argument), useEffect() acts like componentDidMount: it runs ONLY ONCE (after the first render)
  }, []);

  // I'm not specifying a second argument and therefore this will run for every well rerun or a cycle here.
  // If we add second argument, this means that this function here will now only run when user ingredients changed
  useEffect(() => {
    console.log('rendering ingredients', userIngredients)
  }, [userIngredients]);

  const removeIngredientHandler = (ingredientId) => {
    setUserIngredients(prevIngredients => {
      return prevIngredients.filter((ingredient) => {
        return ingredient.id !== ingredientId;
      });
    });
  };

  const filteredIngredientsHandler = (filteredIngredients) => {
    setUserIngredients(filteredIngredients);
  }

  const addIngredientHandler = (ingredient) => {
    // this is where we want to send our data to and you got to know what have fetched by default will send a get request a firebase once a post request though if we want to store data hence we pass a second argument to fetch and that's an object that allows us to configure this request in on this object we can set the method property to post default the set then you never need to set that but we want to set this to post you then also can add a body property to define what you want to send and that has to be json data which means you can use json which is another thing built into the browser it's a class in the end built in to browsers which has a stringify method. This will take a javascript object or array and convert it into valid json format
    fetch('https://react-hooks-a1e9b.firebaseio.com/ingredients.json', {
      method: 'POST',
      body: JSON.stringify(ingredient),
      headers: {'Content-Type': 'application/json'}
    }).then(response => {
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
  return (
    <div className="App">
      <IngredientForm onAddIngredient={addIngredientHandler}/>
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
