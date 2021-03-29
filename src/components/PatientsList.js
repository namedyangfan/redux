import React, { useState, useEffect } from 'react';
import { H2 } from '@awesomecomponents/mux/core/typography';

import PatientListItem from './PatientListItem';

const PatientsList = () => {
  const [patients, setPatients] = useState(null);

  const fetchPatients = () => {
    fetch(
      'https://rest-example-node.apps.cac.preview.pcf.manulife.com/v1/patients'
    )
      .then((response) => response.json())
      .then((result) => setPatients(result));
  };

  // only runs once on component mount
  useEffect(() => {
    fetchPatients();
  }, []);

  return (
    <>
      <H2>Patients List</H2>
      {patients &&
        patients.map((patient) => (
          <PatientListItem key={patient.id} patient={patient} />
        ))}
    </>
  );
};

export default PatientsList;
