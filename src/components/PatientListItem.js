import React, { useState } from 'react';

const PatientListItem = ({ patient }) => {
  const [doctorsList, setDoctorsList] = useState(null);

  const handleLoadDoctors = () => {
    const variables = { id: patient.id };
    const GQL_API = `https://graphql-doctor-patient.apps.cac.preview.pcf.manulife.com/`;
    const GQL_QUERY = `
      query($id: ID!) {
        patient(id: $id) {
          doctors {
            id
            name
          }
      }
    }`;

    fetch(GQL_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: GQL_QUERY,
        variables,
      }),
    })
      .then((response) => response.json())
      .then((result) => setDoctorsList(result.data.patient.doctors));
  };

  return (
    <div>
      <a href="#" onClick={handleLoadDoctors}>
        {patient.name}
      </a>
      {doctorsList &&
        doctorsList.map((doctor) => <div key={doctor.id}>{doctor.name}</div>)}
    </div>
  );
};

export default PatientListItem;
