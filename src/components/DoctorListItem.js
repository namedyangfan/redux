import React, { useState } from 'react';
import PropTypes from 'prop-types';
import DoctorDetails from './DoctorDetails';

function DoctorListItem({ id, name, onDeleteDoctor }) {
  const [details, setDetails] = useState(null);

  function handleLoadDetails() {
    fetch(
      `https://doctor-info.apps.cac.preview.pcf.manulife.com/v1/doctor/${id}`
    )
      .then((response) => response.json())
      .then((response) => setDetails(response));
  }

  function renderDoctorDetails() {
    if (!details) {
      return;
    }
    return (
      <DoctorDetails
        dob={details.dob}
        specialty={details.specialty}
        address={details.address}
      />
    );
  }

  function handleDeleteDoctor() {
    onDeleteDoctor(id);
  }

  return (
    <div>
      <a href="#" onClick={handleLoadDetails}>
        {name}
      </a>
      <button onClick={handleDeleteDoctor}>X</button>
      {renderDoctorDetails()}
    </div>
  );
}

DoctorListItem.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default DoctorListItem;
