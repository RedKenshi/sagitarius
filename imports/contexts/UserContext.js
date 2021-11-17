import React, { Component } from 'react'
import gql from 'graphql-tag';
import { graphql, withApollo, compose } from 'react-apollo';
import { withRouter } from 'react-router-dom';

export const UserContext = React.createContext();

const userQuery = gql`
    query User{
        user{
            _id
            email
            isAdmin
            activated
        }
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
`;

class Provider extends Component {

    render(){
        return (
            <UserContext.Provider value={{
                user: (this.props.user == null ? {_id:null} : this.props.user),
                users : this.props.users,
                client : this.props.client
            }}>
                {this.props.children}
            </UserContext.Provider>
        );
    }
}

export const UserProvider =
    graphql(userQuery,{
        props:({data}) =>({...data})
    })
(withApollo(withRouter(Provider)))
