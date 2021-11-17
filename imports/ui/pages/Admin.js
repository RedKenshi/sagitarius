import React, { Component } from 'react';
import { Input, Table } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import AccountRow from '../molecules/AccountRow';
import gql from 'graphql-tag';

import moment from 'moment';
import 'moment/locale/fr';

export class Admin extends Component {

  state = {
    usersQuery:gql`
      query Users{
        users{
          _id
          email
          isAdmin
          isOwner
          verified
          firstname
          lastname
          createdAt
          lastLogin
          activated
        }
      }
    `,
    users:[],
    usersFilter: null,
    deleteAccountQuery:gql`mutation deleteAccount($admin: String!,$_id: String!){
      deleteAccount(admin: $admin,_id: $_id){
        _id
        email
        isAdmin
        isOwner
        verified
        firstname
        lastname
        createdAt
        lastLogin
        activated
      }
    }`
  }

  handleFilter = e => {
    this.setState({
      usersFilter : e.target.value
    })
  }

  deleteAccount = _id =>{
    this.props.client.mutate({
      mutation : this.state.deleteAccountQuery,
      variables:{
          admin:Meteor.userId(),
          _id:_id
        }
    }).then(({data})=>{
      this.setState({
        users:data.deleteAccount
      });
    })
  }

  componentDidMount = () => {
    moment.locale('fr');
    this.props.client.query({
      query: this.state.usersQuery
    }).then(({data}) => {
      this.setState({
        users:data.users
      })
    })
  }

  render() {
    return (
      <div>
        <div style={{display:"flex",justifyContent:"center",marginBottom:"32px"}}>
          <Input name="usersFilter" onChange={this.handleFilter} size='massive' icon='search' placeholder='Rechercher un compte ...' />
        </div>
          <Table inverted compact selectable>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell width={4}>Nom</Table.HeaderCell>
                <Table.HeaderCell width={4}>Compte créé le</Table.HeaderCell>
                <Table.HeaderCell width={4}>E-mail</Table.HeaderCell>
                <Table.HeaderCell style={{textAlign:"center"}} width={1}>Admin</Table.HeaderCell>
                <Table.HeaderCell style={{textAlign:"center"}} width={1}>Compte actif</Table.HeaderCell>
                <Table.HeaderCell style={{textAlign:"center"}} width={2}></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.users.map(u=>(
                <AccountRow deleteAccount={this.deleteAccount} key={u._id} user={u}/>
              ))}
            </Table.Body>
          </Table>
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Admin);
