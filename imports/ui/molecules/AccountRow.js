import React, { Component } from 'react'
import { Table, Label, Dropdown, Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import gql from 'graphql-tag';

export class AccountRow extends Component {

    state={
        user:this.props.user,
        activated:this.props.user.activated,
        isAdmin:this.props.user.isAdmin,
        toggleAdminQuery:gql`mutation toggleAdmin($admin: String!,$_id: String!){
            toggleAdmin(admin: $admin,_id: $_id){
                _id
                isAdmin
            }
        }`,
        toggleActiveQuery:gql`mutation toggleActive($admin: String!,$_id: String!){
            toggleActive(admin: $admin,_id: $_id){
                _id
                activated
            }
        }`
    }

    deleteAccount = _id => {
        this.props.deleteAccount(_id);
    }

    setAdmin = _id =>{
        this.props.client.mutate({
          mutation : this.state.toggleAdminQuery,
          variables:{
              admin:Meteor.userId(),
              _id:_id
            }
        }).then(({data})=>{
          this.setState({
            isAdmin:data.toggleAdmin.isAdmin
          });
        })
      }
    
    activateAccount = _id =>{
    this.props.client.mutate({
        mutation : this.state.toggleActiveQuery,
        variables:{
        admin:Meteor.userId(),
        _id:_id
        }
    }).then(({data})=>{
        this.setState({
            activated:data.toggleActive.activated
        });
    })
    }

  render() {
    const { user,activated,isAdmin } = this.state;
    return (
        <Table.Row>
        <Table.Cell>{user.firstname + " " + user.lastname}</Table.Cell>
        <Table.Cell>{new Date(parseInt(user.createdAt)).getDate() + "/" + ("00"+(parseInt(new Date(parseInt(user.createdAt)).getMonth())+1).toString()).slice(-2) + "/" + new Date(parseInt(user.createdAt)).getFullYear() + " - " + ("00"+(parseInt(new Date(parseInt(user.createdAt)).getHours())).toString()).slice(-2) + ":" + ("00"+(parseInt(new Date(parseInt(user.createdAt)).getMinutes())).toString()).slice(-2) + ":" + ("00"+(parseInt(new Date(parseInt(user.createdAt)).getSeconds())).toString()).slice(-2)}</Table.Cell>
        <Table.Cell>{user.email}</Table.Cell>
        <Table.Cell style={{textAlign:"center"}}>
          {(user.isOwner ?
            <Label style={{textAlign:"center"}} color="blue">Propriétaire</Label>
            :
            (isAdmin ?
                <Label style={{textAlign:"center"}} color="yellow">
                    oui
                    <Label.Detail>
                        <Icon name='check'/>
                    </Label.Detail>
                </Label>
            :
                <Label style={{textAlign:"center"}}>
                    non
                    <Label.Detail>
                        <Icon name='delete'/>
                    </Label.Detail>
                </Label>
            )
          )}
        </Table.Cell>
        <Table.Cell style={{textAlign:"center"}}>
          {(user.isOwner ?
            <Label style={{textAlign:"center"}} color="blue">Propriétaire</Label>
            :
            (activated ?
                <Label style={{textAlign:"center"}}>
                    actif
                    <Label.Detail>
                        <Icon name='check'/>
                    </Label.Detail>
                </Label>
            :
                <Label style={{textAlign:"center"}} color="black">
                    inactif
                    <Label.Detail>
                        <Icon name='delete'/>
                    </Label.Detail>
                </Label>
            )
          )}
        </Table.Cell>
        <Table.Cell style={{textAlign:"center"}}>
        {(user.isOwner ?
          ""
        :
          <Dropdown style={{margin:"0",padding:"6px"}} text='Actions ...' floating labeled button className='icon'>
            <Dropdown.Menu>
                {(isAdmin ?
                    <Dropdown.Item icon='delete' color="orange" text="Retirer les droits d'admin" onClick={()=>{this.setAdmin(user._id)}}/>
                :
                    <Dropdown.Item icon='certificate' color="gree" text="Donner les droits d'admin" onClick={()=>{this.setAdmin(user._id)}}/>
                )}
                {(activated ?
                    <Dropdown.Item icon='delete' color="orange" text='Désactiver le compte' onClick={()=>{this.activateAccount(user._id)}}/>
                :
                    <Dropdown.Item icon='check' color="green" text='Activer le compte' onClick={()=>{this.activateAccount(user._id)}}/>
                )}
                <Dropdown.Item icon='trash' color="red" text='Supprimer le compte' onClick={()=>{this.deleteAccount(user._id)}}/>
            </Dropdown.Menu>
          </Dropdown>
        )}
        </Table.Cell>
      </Table.Row>
    )
  }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
export default wrappedInUserContext = withUserContext(AccountRow);