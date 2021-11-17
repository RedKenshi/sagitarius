import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { ApolloLink, from } from 'apollo-link';
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { BrowserRouter } from 'react-router-dom';

import { UserProvider } from '../../contexts/UserContext';

import App from '../../ui/App';

const httpLink = new HttpLink({
    uri: Meteor.absoluteUrl('graphql')
});

const authLink  = new ApolloLink((operation, forward)=>{
    const token = Accounts._storedLoginToken();
    operation.setContext(() => ({
        headers: {
            'meteor-login-token': token
        }
    }));
    return forward(operation)
});

const cache = new InMemoryCache();

const client  = new ApolloClient({
    link: from([authLink, httpLink]),
    cache
});

const ApolloApp = () => (
    <ApolloProvider client={client}>
        <BrowserRouter>
            <UserProvider>
                <App/>
            </UserProvider>
        </BrowserRouter>
    </ApolloProvider>
)

Meteor.startup(()=>{
    render(<ApolloApp />, document.getElementById("app"));
});