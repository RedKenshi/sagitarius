
import { ApolloServer, gql } from 'apollo-server-express'
import { WebApp } from 'meteor/webapp'
import { getUser } from 'meteor/apollo'
import merge from 'lodash/merge';

import UserSchema from '../api/user/User.graphql';
import UserResolvers from '../api/user/resolvers.js';

import CalendarSchema from '../api/calendar/Calendar.graphql';
import CalendarResolvers from '../api/calendar/resolvers.js';

import EconomySchema from '../api/economy/Economy.graphql';
import EconomyResolvers from '../api/economy/resolvers.js';

import CurrencySchema from '../api/currency/Currency.graphql';
import CurrencyResolvers from '../api/currency/resolvers.js';

import CostSchema from '../api/cost/Cost.graphql';
import CostResolvers from '../api/cost/resolvers.js';

//Putain de bug de tes morts mersscccssssazaer

const typeDefs = [
    UserSchema,
    CalendarSchema,
    EconomySchema,
    CurrencySchema,
    CostSchema
];

const resolvers = merge(
    UserResolvers,
    CalendarResolvers,
    EconomyResolvers,
    CurrencyResolvers,
    CostResolvers
);

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
        const token = req.headers["meteor-login-token"] || '';
        const user = await getUser(token);
        return { user };
    }
})

const corsOptions = {
    origin: 'http://localhost:3000',
    credentials: true
}

server.applyMiddleware({
    app: WebApp.connectHandlers,
    path: '/graphql',
    cors: corsOptions
})

WebApp.rawConnectHandlers.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Authorization,Content-Type");
    return next();
});
  
WebApp.connectHandlers.use('/graphql', (req, res) => {
    if (req.method === 'GET') {
        res.end()
    }
})