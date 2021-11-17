import React, { Component } from 'react'
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';

export const CalendarContext = React.createContext();

class Provider extends Component {

    state = {
        CalendarQuery : gql`
            query getDaysInMonth($m: Int!,$y: Int!) {
                getDaysInMonth(m:$m,y:$y) {
                    key
                    day
                    month
                    year
                    dow
                    today
                }
            }
        `
    }

    getDaysInMonth = () => {
        this.props.client.query({
            query: this.state.CalendarQuery,
            name:"getDaysInMonth",
            variables:{y:2019,m:1}
        })
    }

    render(){
        return (
            <CalendarContext.Provider value={{
                ...this.state,
                getDaysInMonth:this.getDaysInMonth()
            }}>
                {this.props.children}
            </CalendarContext.Provider>
        );
    }
}

export const CalendarProvider = withApollo(Provider);