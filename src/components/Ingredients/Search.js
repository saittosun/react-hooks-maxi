// jshint esversion: 9
import React, { useState, useEffect, useRef } from 'react';

import Card from '../UI/Card';
import './Search.css';

const Search = React.memo(props => {
  //Object destructuring. We have curly braces in this case on the left side of the equal sign on the right side we have to object which we want to destructure or from which we want to extract properties. And then here between the curly braces on the left side you specify the names of the keys in that object(props object) which you want to extract and which you want to store in separate variables.
  const {onLoadIngredients} = props;
  const [enteredFilter, setEnteredFilter] = useState('');
  // how do we get to current value.Well we get that current value with a reference for that react also has a hook use ref.
  const inputRef = useRef();

    // Use effect has to name because it is there for you to manage side effects in HTTP requests are a typical side effect. side effect basically means that you have some logic that runs that does affect your application for example we are fetching some data here but it's not getting finished in this current renderer cycle or maybe it affects something which is outside of the scope of your jsx code down there maybe you're setting the document title anything like that. So anything you can not manage with your normal this component is getting rendered flow use effect and that's important by default gets executed right after important after every component render a cycle. So after this component has been rendered to first time. function you pass to use effect because you have to parse a function there will get executed. So this runs when ever this component got re rendered. And that's really important to keep in mind after and for every render cycle these are two important pieces not before not simultaneously but after and for every render cycle.
  // Actually all it takes a second argument. The first argument is this function which it executes after every render cycle. The second argument is an array with the dependencies of your function and only when such a dependency changed only then the function will rerun. So this allows you to control how often does function runs by default for every render cycle.
  useEffect(() => {
    const timer = setTimeout(() => {
      // if entered filter is the same as the entered value five hundred milliseconds ago. How can we do that. For that it's important to understand how closures work in JavaScript entered filter here will actually be locked in when we set the timer. So it will not be the value the user has entered after this time are expired. It will be the value the user entered when we set this timer. That's important that's how javascript works. So entered filter here will not be the current value the user entered. It will be the old value 500 milliseconds ago basically when use effect executed. And when we then set the time or date for that's what entered filter will be will not be the current input of the old one so to say.
      // esitligi sagi that will be the current value because input ref is defined outside of the closure so that's not locked in or anything like that.
      if (enteredFilter === inputRef.current.value) {
        const query = enteredFilter.length === 0 ? '' : `?orderBy="title"&equalTo="${enteredFilter}"`;
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
            onLoadIngredients(loadedIngredients);
          });
      }
    }, 500);
    // after the if statement and after the timer (settimeout)still inside of that function we pass to use effects. At the end of this function we can return something and thus far we haven't returned anything and use effect. Now you don't need to return anything but you can return something. But when you do return something it always has to be a function. And this is a cleanup function. It's a function that will run right before this same use affect functional run next time. So not often does function is done but before the next time it will run.
    // So on the first(returnden once ki kisim yani yukarisi) render does executes and this (return bolumu) does not execute but then on the first keystroke we clean up the old effect run a new one on the second keystroke. We clean up (bunu return deki function yapiyor) that previous effect run a new one ends on and that's how it is works.
    // if you have [] dependencies (i.e. the effect only runs once), the cleanup function runs when the component gets unmounted.
    return () => {
      // Cleanup will run for the previous effect before the new effect is applied. So this cleans up the old timer before it sets a new one and this ensures that we always only have one ongoing timer which is of course better because we don't have all these redundant timers in memory.
      clearTimeout(timer);
    }
    // we can use string interpolation to dynamically inject values
    // this useEffect function here actually has no external dependencies(with external dependencies I mean variables or data you're using which you define in your component outside of the use affect function.) and so we can add an empty array but we have to do that admitting it is not an option.
    // used like this (with [] as a second argument), useEffect() acts like componentDidMount: it runs ONLY ONCE (after the first render)
    // one important note here input ref. Therefore now of course all is a dependency of our effect here because I'm using input ref in the useeffect and therefore that's all to add. Input ref here to make sure that we also rerun the effect if we should change what's stored in input ref with that.
  }, [enteredFilter, onLoadIngredients]);

  return (
    <section className="search">
      <Card>
        <div className="search-input">
          <label>Filter by Title</label>
          <input 
            type="text"
            ref={inputRef}
            value={enteredFilter}
            onChange={event => setEnteredFilter(event.target.value)} />
        </div>
      </Card>
    </section>
  );
});

export default Search;
