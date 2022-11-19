import "./styles.css";
import deepFreeze from "deep-freeze";
import expect from "expect";
// import { createStore } from "redux";

const cart = (state, action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return {
        id: action.id,
        title: action.title,
        quantity: action.quantity
      };
    case "INCREMENT_QUANTITY":
      if (state.id === action.id) {
        return {
          ...state,
          quantity: state.quantity + 1
        };
      }
      return state;
    case "DECREMENT_QUANTITY":
      if (state.id === action.id) {
        return {
          ...state,
          quantity: state.quantity - 1
        };
      }
      return state;
    default:
      return state;
  }
};

const shoppingCart = (state = [], action) => {
  switch (action.type) {
    case "ADD_ITEM":
      return [...state, cart(undefined, action)];
    case "REMOVE_ITEM":
      return state.filter(item => item.id !== action.id);
    case "INCREMENT_QUANTITY":
      return state.map(i => cart(i, action));
    case "DECREMENT_QUANTITY":
      return state.map(i => cart(i, action));
    default:
      return state;
  }
};

const createStore = reducer => {
  let state;
  let listeners = [];

  const getState = () => state;

  const dispatch = action => {
    state = reducer(state, action);
    listeners.forEach(listener => listener());
  };

  const subscribe = listener => {
    listeners.push(listener);
    return () => {
      listeners = listeners.filter(l => l !== listener);
    };
  };

  dispatch({});

  return { getState, dispatch, subscribe };
};

const store = createStore(shoppingCart);

const testAddItem = () => {
  const stateBefore = store.getState();
  console.log("state before", stateBefore);
  console.log("Dispatching ADD_ITEM");
  store.dispatch({
    type: "ADD_ITEM",
    id: 1,
    title: "White gel pen",
    quantity: 1
  });
  const stateAfter = [
    {
      id: 1,
      title: "White gel pen",
      quantity: 1
    }
  ];
  console.log("state after", stateAfter);
  deepFreeze(stateBefore);
  expect(store.getState()).toEqual(stateAfter);
};

const testIncrementQuantity = () => {
  const stateBefore = store.getState();
  console.log("state before", stateBefore);
  console.log("Dispatching INCREMENT_QUANTITY");
  store.dispatch({
    type: "INCREMENT_QUANTITY",
    id: 1
  });
  const stateAfter = [
    {
      id: 1,
      title: "White gel pen",
      quantity: 2
    }
  ];
  console.log("state after", stateAfter);
  deepFreeze(stateBefore);
  expect(store.getState()).toEqual(stateAfter);
};

const testDecrementQuantity = () => {
  const stateBefore = store.getState();
  console.log("state before", stateBefore);
  console.log("Dispatching DECREMENT_QUANTITY");
  store.dispatch({
    type: "DECREMENT_QUANTITY",
    id: 1
  });
  const stateAfter = [
    {
      id: 1,
      title: "White gel pen",
      quantity: 1
    }
  ];
  deepFreeze(stateBefore);
  expect(store.getState()).toEqual(stateAfter);
};

const testRemoveItem = () => {
  const stateBefore = store.getState();
  console.log("state before", stateBefore);
  console.log("Dispatching REMOVE_ITEM");
  store.dispatch({
    type: "REMOVE_ITEM",
    id: 1
  });
  const stateAfter = [];
  console.log("state after", stateAfter);
  deepFreeze(stateBefore);
  expect(store.getState()).toEqual(stateAfter);
};

testAddItem();
testIncrementQuantity();
testDecrementQuantity();
testRemoveItem();

console.log("All tests are passed");
