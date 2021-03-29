import React, { Component } from 'react';
import AddDoctor from './AddDoctor';
import DoctorListItem from './DoctorListItem';

class DoctorsList extends Component {
  constructor(props) {
    super(props);
    this.state = { doctors: [] };
  }

  componentDidMount() {
    fetch(
      'https://rest-example-node.apps.cac.preview.pcf.manulife.com/v1/doctors'
    )
      .then((response) => response.json())
      .then((result) => this.setState({ doctors: result }));
  }

  handleDeleteDocotr(id) {
    const newDoctorsList = this.state.doctors.filter(
      (doctor) => doctor.id !== id
    );
    this.setState({ doctors: newDoctorsList });
  }

  renderDoctors() {
    return this.state.doctors.map((doctor) => (
      <DoctorListItem
        key={doctor.id}
        id={doctor.id}
        name={doctor.name}
        onDeleteDoctor={(id) => this.handleDeleteDocotr(id)}
      />
    ));
  }

  handleAddDoctor(name) {
    const newDoctor = { id: Date.now().toString(), name: name };
    const newDoctorsList = [...this.state.doctors, newDoctor];
    this.setState({ doctors: newDoctorsList });
  }

  render() {
    return (
      <>
        <h2>Doctors List</h2>
        <AddDoctor onAddDoctor={(name) => this.handleAddDoctor(name)} />
        {this.renderDoctors()}
      </>
    );
  }
}

export default DoctorsList;
