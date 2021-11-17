import React, { Component } from 'react';
import { Grid,Table } from 'semantic-ui-react';
import Calendar from '../pages/Calendar';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

class Progress extends Component {

  state={
    selectedDay:new Date().getDate(),
    getPrestationsOfDay: gql`query getPrestationsOfDay($day: Int!,$month: Int!,$year: Int!) {
      getPrestationsOfDay(day:$day,month:$month,year:$year){
          _id
          name
          client{
            _id
            firstname
            lastname
            avatar
          }
          deliveryDay
          deliveryMonth
          deliveryYear
          step
          facturation
          paid
          archived
      }
    }`
  }

  loadPrestationOfDay = ({d,m,y}) => {
    this.setState({selectedDay:d})
  }

  render() {
    return (
      <div style={{margin:"0"}}>
        <Grid>
          <Grid.Column width={9}>
            <Calendar loadPrestationOfDay={this.loadPrestationOfDay}/>
          </Grid.Column>
          <Grid.Column style={{padding:"86px 0 0 0"}} width={7}>
            <div style={{overflowY:"auto",height:"735px"}}>
              <Table striped inverted compact>
                <Table.Header>
                  <Table.Row textAlign='center'>
                    <Table.HeaderCell width={4}></Table.HeaderCell>
                    <Table.HeaderCell width={6}>Client</Table.HeaderCell>
                    <Table.HeaderCell width={2}>Facturé</Table.HeaderCell>
                    <Table.HeaderCell width={2}>Étape</Table.HeaderCell>
                    <Table.HeaderCell width={2}></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>
                  
                </Table.Body>
              </Table>
            </div>
          </Grid.Column>
        </Grid>
      </div>
    )
  }
}

export default Progress;