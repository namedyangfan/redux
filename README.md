# redux-exercises

## Redux

Remember, React is the view layer. In order to build a proper single page application, we need state and
data management. This is where Redux comes in. Redux is a framework, often used with React, to
create applications with uni-directional data flow.

A unique feature of Redux is that it has a single store for the entire application. This makes the
application state easy to understand, and simplifies development.

In Redux, the view reflects data in the store. The view cannot make changes directly to the store, it
must do so implicitly with actions and reducers. This reduces unintentional side effects that plagued
older SPA frameworks like Angular 1.x.

## Local setup

Ensure the following Chrome extension is installed before starting this exercise:

- Redux DevTools

Before you begin either create a new git repo for the Redux exercise or branch the previous exercise. That way you will have a reference to a pure React app vs a React-Redux app.

## Install packages

- install Redux dependencies `npm i redux react-redux redux-thunk`

  - [redux](https://www.npmjs.com/package/redux) - npm package for Redux
  - [react-redux](https://react-redux.js.org/) - Official React bindings for Redux
  - [redux-thunk](https://www.npmjs.com/package/redux-thunk) - Middleware that allows you to write action creators that return a function instead of an action. The thunk can be used to delay the dispatch of an action, or to dispatch only if a certain condition is met.

- install optional dev dependencies `npm i -D redux-devtools-extension`. This is required for Redux DevTools.

## Creating a store

1. In `./src/App.js`, add the following imports:

   ```javascript
   import { Provider } from 'react-redux';
   import store from './store';
   ```

1. Attach the store to the `App` component. To do this, wrap the `App` component inside the `Provider` component.

   ```javascript
   function App(props) {
     return (
       <Provider store={store}>
         <UtilityHeader />
         <H1>Hello, {props.name}</H1>
         <PatientsList />
         <DoctorsList />
       </Provider>
     );
   }
   ```

1. Create a new file called `store.js` in the `src` folder. In `./src/store.js`, add the code snippet below. We will explain what each line is doing.

   - Create a store by combining middleware (extra functionality for Redux `dispatch`) and enhancers (extra functionality for Redux store)
   - Only one reducer, `rootReducer`, can be specified in store creation

   ```javascript
   import { createStore, applyMiddleware } from 'redux';
   import thunk from 'redux-thunk';
   import { composeWithDevTools } from 'redux-devtools-extension';
   import rootReducer from './reducers';

   const initialState = {};

   // apply middleware (thunk) for async dispatch
   const middlewareEnhancer = applyMiddleware(thunk);

   // compose our middleware into an enhancer
   // add Redux dev tools enhancer for use with Chrome extension
   const composedEnhancers = composeWithDevTools(middlewareEnhancer);

   const store = createStore(rootReducer, initialState, composedEnhancers);

   export default store;
   ```

## Creating a reducer

1. With the Redux data store setup, we need to create at least one reducer. In the `src` folder, create a folder called `reducers`.

1. In the `reducers` folder, create a file called `index.js` and add the code snippet below:

   - Only one reducer can be provided to `createStore`, so multiple reducers need to be combined with `combineReducers`
   - Later on, you will be adding a reducer for patients.

   ```javascript
   import { combineReducers } from 'redux';
   import doctorReducer from './doctorReducer';

   export default combineReducers({
     doctors: doctorReducer
   });
   ```

1. In the `reducers` folder, create a file called `doctorReducer.js` and add the following code to it:

   We will go over what this code is doing.

   Note that the reducer takes in “state” as the input, and returns a new “state”. All reducers in Redux follow this pattern.

   ```javascript
   import { FETCH_DOCTORS, ADD_DOCTOR } from '../actions/types';

   const initialState = {
     items: []
   };

   export default function(state = initialState, action) {
     switch (action.type) {
       case FETCH_DOCTORS:
         return {
           ...state,
           items: action.data
         };

       case ADD_DOCTOR:
         return {
           ...state,
           items: [...state.items, action.data]
         };

       default:
         return state;
     }
   }
   ```

## Creating actions

1. Now it's time to define actions. In the `src` folder, create a folder called `actions`.

1. In the `actions` folder, create a file called `types.js` and add the following code to it:

   ```javascript
   export const FETCH_DOCTORS = 'FETCH_DOCTORS';
   export const ADD_DOCTOR = 'ADD_DOCTOR';
   ```

1. In the `actions` folder, create a file called `doctorActions.js` and add the following code to it:

   ```javascript
   import { FETCH_DOCTORS, ADD_DOCTOR } from './types';

   // https://redux.js.org/basics/actions
   //
   // This file contains "action creators", which are simply functions that return actions.
   // There are two types of action creators, synchronous and asynchronous.
   // Plain Redux only supports synchronous action creators. Asynchronous support is added via 'redux-thunk' middleware.
   //
   // Here's a comparison:
   // 1) A synchronous action creator takes some data parameters and returns an action object.
   // 2) An asynchronous action creator takes some data parameters and returns a function that takes 'dispatch'
   //    as a parameter then actually dispatches the action after the asynchronous calls are done.
   //
   // In this class, 'fetchDoctors' is asynchronous, whereas 'addDoctor' is synchronous.

   export const fetchDoctors = () => dispatch => {
     fetch(
       'https://rest-example-node.apps.cac.preview.pcf.manulife.com/v1/doctors'
     )
       .then(res => res.json())
       .then(doctors =>
         dispatch({
           type: FETCH_DOCTORS,
           data: doctors
         })
       );
   };

   export const addDoctor = doctor => ({
     type: ADD_DOCTOR,
     data: doctor
   });
   ```

## Using Redux in your app

## Fetching the list of doctors with Redux

1. In `./src/components/DoctorsList.js`, add the following imports:

   ```javascript
   import PropTypes from 'prop-types';
   import { connect } from 'react-redux';
   import { fetchDoctors } from '../actions/doctorActions';
   ```

1. In `./src/components/DoctorsList.js`, replace the export statement with:

   ```javascript
   export default connect(mapStateToProps, mapDispatchToProps)(DoctorsList);
   ```

   This creates a container that maps not only the doctors array to props, but also the action function fetch doctors.

1. Above the export statement add the following code:

   ```javascript
   // maps Redux store (state) to props
   const mapStateToProps = state => ({
     doctors: state.doctors.items
   });

   // maps the dispatch of an action to props
   // to dispatch fetchDoctors we can now call this.props.fetchDoctors() within our component
   const mapDispatchToProps = {
     fetchDoctors
   };

   DoctorsList.propTypes = {
     fetchDoctors: PropTypes.func.isRequired,
     doctors: PropTypes.array.isRequired
   };
   ```

1. Remove the contents of the `componentDidMount` function, and replace it with the following code:

   ```javascript
   componentDidMount() {
     this.props.fetchDoctors();
   }
   ```

1. Now we need to update the `renderDoctors` function since we're using Redux to map state to props. Replace every reference to state in this function to props instead:

   ```javascript
   renderDoctors() {
     return this.props.doctors.map(doctor => (
       <DoctorListItem
         key={doctor.id}
         id={doctor.id}
         name={doctor.name}
         onDeleteDoctor={(id) => this.handleDeleteDoctor(id)}
       />
     ));
   }
   ```

1. The last thing we need to do to this component is to remove the constructor function since React is no longer managing state.

1. Now run your application and make sure it works.

1. Demo: Redux DevTools to see the store and how actions are dispatched and the time-travel feature.

## Using Hooks with Redux

As of version `4.0` of **Redux** and `7.1` of **react-redux**, we can use Hooks to access and interact with the Redux store. This eliminates the need for using `connect` higher-order component (HOC) to expose data from the Redux store and to dispatch action, and allows us to use hooks for a simpler approach.

The two hooks we'll be uitilizing are `useSelector` and `useDispatch`.

- `useSelector` is used to access data from the store
- `useDispatch` is used to dispatch actions

**NOTE:** Keep in mind that, just like with other React hooks, you should only be using them in functional components!

### Accessing data from the store with useSelector

`useSelector` allows us to access data from the store without having to wrap the component with `connect` HOC. First, you import the hook:

```javascript
import { useSelector } from 'react-redux';
```

To access the data, you can simply do:

```javascript
const doctors = useSelector(state => state.doctors.items);
```

The `doctors` variable will now contain the data from the Redux store.

### Dispatching actions with useDispatch

To dispatch the action creators we defined earlier, we can utilize the `useDispatch` hook. The process is very similar to the `useSelector` hook above. First, you need to import:

```javascript
import { useDispatch } from 'react-redux';
```

And then expose the `dispatch` function from the Redux store by writing:

```javascript
const dispatch = useDispatch();
```

We can now dispatch our action creators by calling dispatch method from above:

```javascript
dispatch(fetchDoctors());
```

## Adding a new doctor with Redux

Using what you've learned we can now update the `AddDoctor` component to use Redux

1. In `./src/components/AddDoctor.js`, add the following imports:

   ```javascript
   import { useDispatch } from 'react-redux';
   import { addDoctor } from '../actions/doctorActions';
   ```

1. In the component, we expose the `dispatch` function from the Redux store by adding:

   ```javascript
   const dispatch = useDispatch();
   ```

1. In the `onClick` handler of the Add button, we invoke `dispatch` and pass the value of the new doctor:

   ```javascript
   // for the uncontrolled component
   dispatch(
     addDoctor({ id: Date.now().toString(), name: doctorNameInputRef.current.value })
   );

   // for the controlled component
   dispatch(addDoctor({ id: Date.now().toString(), name: doctorName }));
   ```

## Individual Exercises

Using what you've learned, you can:

- Set up patients in the store

- Replace local state with Redux state for `PatientsList`, fetching a list of patients with Redux

- Replace local state with Redux state for fetching a doctor's details. Think about how you want your store to look like with this new data.

- Replace local state with Redux state for fetching a patient's list of doctors. Think about how you want your store to look like with this new data.

- (Optional) If you completed the features for deleting a doctor, use Redux state to handle this
