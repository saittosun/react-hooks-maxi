// jshint esversion: 9
import React, { useState, useEffect } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  //Object destructuring. We have curly braces in this case on the left side of the equal sign on the right side we have to object which we want to destructure or from which we want to extract properties. And then here between the curly braces on the left side you specify the names of the keys in that object(props object) which you want to extract and which you want to store in separate variables.
  const {onLoadIngredients} = props;
  const [enteredFilter, setEnteredFilter] = useState('');

  useEffect(() => {
    // we can use string interpolation to dynamically inject values
    const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo"${enteredFilter}"`;
    fetch('https://react-hooks-a1e9b.firebaseio.com/ingredients.json' + query)
      // sonra firebase de rules bolumunde write in altina bunu ilave ettik => "ingredients": {".indexOn": ["title"]}.  with the setup we can filter for the title.
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
        // I want to trigger something in ingredients.js. Right because that is where we manage our ingredients. That is where we also use the search component. So in the end we should establish a connection between search and this ingredients component to update the ingredients here whenever we fetched new ingredients in search.js.
        // onLoadIngredients(loadedIngredients);
      });
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            type="text"
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
