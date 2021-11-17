import React, { Component } from 'react'
import { Route, Switch, Redirect } from 'react-router-dom';
import Home from './Home';
import Economy from './Economy';
import progress from './Progress';
import Admin from './Admin';
import { UserContext } from '../../contexts/UserContext';

class PageBody extends Component {

  getAvailableRoutes = () =>{
    if(this.props.user.isAdmin){
      return(
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/economy' component={Economy}/>
          <Route exact path='/progress/:y/:m' component={progress}/>
          <Route exact path='/admin' component={Admin}/>
          <Redirect from='*' to={'/'}/>
        </Switch>
      );
    }else{
      return(
        <Switch>
          <Route exact path='/' component={Home}/>
          <Route exact path='/economy' component={Economy}/>
          <Route exact path='/progress/:y/:m' component={progress}/>
          <Redirect from='*' to={'/'}/>
        </Switch>
      );
    }
  }

  render() {
    return (
      <div id="pageBody" style={{
        width:"calc(100vw - 160px)",
        margin:"0 0 0 160px",
        backgroundColor: "#000000",
        background: "radial-gradient(ellipse at bottom, #1b2735 0%, #090a0f 100%)",
        backgroundRepeat:"no-repeat",
        backgroundAttachment:"fixed",
        minHeight:"100vh"
      }}>
        {this.getAvailableRoutes()}
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default withUserContext(PageBody);