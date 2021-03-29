import React from 'react';

import { H1 } from '@awesomecomponents/mux/core/typography';
import UtilityHeader from '@awesomecomponents/mux/core/components/UtilityHeader';
import '@awesomecomponents/mux/core/typography/assets/fonts/fonts.css';
import DoctorsList from './components/DoctorsList';
import PatientList from './components/PatientsList';
import './App.css';

function App(props) {
  return (
    <div className="app">
      <UtilityHeader />
      <H1>Hello, {props.name}</H1>;
      <DoctorsList />
      <PatientList />
    </div>
  );
}

export default App;
