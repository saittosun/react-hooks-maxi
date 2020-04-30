// jshint esversion: 9
import {useReducer, useCallback} from 'react';

const httpReducer = (currentHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {loading: true, error: null, data: null};
    case 'RESPONSE':
      return {...currentHttpState, loading: false, data: action.responseData};
    case 'ERROR':
      return {loading: false, error: action.errorMessage};
    case 'CLEAR':
      return {...currentHttpState, error: null};
    default:
      throw new Error('should not be reached!');
  }
};

// Each Functional Component gets its own snapshot of this hook so to say so that's a cool thing you can have state full logic in there but the state for logic will then be different for each component where you use that hook so that you can shared a logic not the data. That's the idea behind hooks.
const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, {
    loading: false, 
    error: null,
    data: null
  });
  const sendRequest = useCallback((url, method, body) => {
    dispatchHttp({type: 'SEND'});
    // let url = `https://react-hooks-a1e9b.firebaseio.com/ingredients/${ingredientId}.json`;
    fetch(
      url, 
      {
        method: method,
        body: body,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    .then(response => {
      return response.json()
    })
    .then(responseData => {
      dispatchHttp({type: 'RESPONSE', responseData: responseData});
    })
    .catch(err => {
      dispatchHttp({type: 'ERROR', errorMessage: err.message});
    });
  }, []);
  
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest: sendRequest
  };
};

export default useHttp;