import React, { Component } from 'react';
import { Redirect, Switch, Route } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import PageBody from './pages/PageBody';
import Menu from './menu/Menu';
import Home from './pages/Home';
import NeedActivation from './pages/NeedActivation';
import { UserContext } from '../contexts/UserContext';

class AppBody extends Component{

    logout = () => {
        Meteor.logout();
        this.props.client.resetStore();
    }

    render(){
        if(this.props.user._id != null){
            if(this.props.user.activated){
                return(
                    <div style={{width:"100vw",minWidth:"780px"}}>
                        <Menu/>
                        <PageBody />
                    </div>
                );
            }else{
                return(
                    <div style={{
                        width:"100vw",
                        margin:"0",
                        padding:"32px 128px 0 160px",
                        display:"flex",
                        backgroundRepeat:"no-repeat",
                        backgroundAttachment:"fixed"
                    }}>
                        <div style={{display:"grid",marginTop:"80px",gridTemplateColumns:"1fr 250px 480px 250px 1fr",gridTemplateRows:"400px 80px 80px",flexWrap:"wrap",justifyContent:"center",width:"100%"}}>
                            <img style={{gridColumnStart:"2",gridColumnEnd:"span 3",placeSelf:"center"}} src={"/res/title.png"} alt="titleLogo"/>
                            <NeedActivation/>
                            <Button basic style={{marginTop:"24px",width:"128px",gridColumnStart:"2",gridColumnEnd:"span 3",placeSelf:"center"}} onClick={this.logout} color="red">
                                Déconnexion
                            </Button>
                        </div>
                    </div>
                );
            }
        }else{
            return(
                <div style={{
                    width:"100vw",
                    height:"100vh",
                    margin:"0",
                    padding:"32px 128px 0 160px",
                    display:"inline-block",
                    backgroundColor: "#000000",
                    backgroundImage: "linear-gradient(315deg, #000000 0%, #212121 74%)",
                    backgroundRepeat:"no-repeat",
                    backgroundAttachment:"fixed"
                  }}>
                  <Switch>
                    <Route path='/' component={Home}/>
                    <Redirect from='*' to={'/'}/>
                  </Switch>
                </div>
            )
        }
    }
}

const withUserContext = WrappedComponent => props => (
    <UserContext.Consumer>
        {ctx => <WrappedComponent {...ctx} {...props}/>}
    </UserContext.Consumer>
  )
  
  export default withUserContext(AppBody);