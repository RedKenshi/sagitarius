import React, { Component } from 'react'
import { Button, Input, Icon, Modal, Form, Message } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import Planet from "../models/Planet";

export class Home extends Component {

  state={
    email:"",
    pass:"",
    open:false,
    firstname:"",
    lastname:"",
    password:"",
    passwordAgain:"",
    error:false,
    errorContent:"",
    mail:"",
  }

  handleChange = e => {
    this.setState({
        [e.target.name] : e.target.value
    })
  }

  popModal = () => {
    this.setState({
        open:true
    })
  }

  close = () => {
    this.setState({
        open:false
    })
  }

  createAccount = error => {
    Accounts.createUser({
      email: this.state.mail,
      password: this.state.password,
      profile: {
          firstname: this.state.firstname,
          lastname: this.state.lastname
      },
      settings:{
        isAdmin:false,
        isOwner:false
      }
    },
    error=>{
        if(!error){
          this.props.client.resetStore();
        }
        console.log(error);
    });
  }

  loginUser = () => {
    Meteor.loginWithPassword(this.state.email, this.state.pass,
        error=>{
            if(!error){
              this.props.client.resetStore();
            }
            console.log(error);
        }
    );
  }

  getModalLabel = ({error,errorContent}) => {
    if(error){
      return(
      <Modal.Actions style={{display:"flex",justifyContent:"space-between"}}>
        <Message style={{margin:"0"}} color="blue" content={errorContent}/>
        <Button disabled color="grey" size="small" style={{margin:"0 16px",cursor:"pointer"}} content='Créer' icon='plus' labelPosition='right'/>
      </Modal.Actions>
      )
    }else{
      return(
        <Modal.Actions>
          <Button color="blue" size="small" style={{margin:"0 16px",cursor:"pointer"}} onClick={()=>{this.createAccount(error);this.close();}} content='Créer' icon='plus' labelPosition='right'/>
        </Modal.Actions>
      )
    }
  }

  render() {
    const { firstname,lastname,password,passwordAgain,mail } = this.state;
    let error = false;
    let errorContent = "";
    if(password != passwordAgain){
      error = true;
      errorContent = "Les mots de passe sont different";
    }
    if(firstname == "" || lastname == "" || password == "" || passwordAgain == "" || mail == ""){
      error = true;
      errorContent = "Tous les champs doivent être renseignés";
    }
    if(this.props.user._id != null){//PAGE D'ACCUEIL
      return (
        <div style={{position:"relative",overflow:"hidden",width:"100%",height:"100vh",zIndex:"4"}}>
          <div id='stars' style={{zIndex:"1"}}></div>
          <div id='stars2' style={{zIndex:"2"}}></div>
          <div id='stars3' style={{zIndex:"3"}}></div>
          <Planet/>
        </div>
      )
    }else{//PANNEAU DE CONNEXION ET CREATION DE COMPTE
      return (
        <div style={{display:"grid",gridTemplateColumns:"1fr 250px 480px 250px 1fr",marginTop:"40px",gridTemplateRows:"320px 80px 80px 64px 64px",flexWrap:"wrap",justifyContent:"center",width:"100%"}}>
          <img style={{gridColumnStart:"2",gridColumnEnd:"span 3",placeSelf:"center",width:"256px",height:"256px"}} src={"/res/title.png"} alt="titleLogo"/>
          <Input onChange={this.handleChange} name="email" type="email" style={{gridRowStart:"2",gridColumnStart:"3",alignSelf:"center"}} icon="user" size='huge' placeholder='Adresse mail' />
          <Input onChange={this.handleChange} name="pass" type="password" style={{gridRowStart:"3",gridColumnStart:"3",alignSelf:"center"}} icon="key" size='huge' placeholder='Mot de passe' />
          <Button basic size="small" style={{gridRowStart:"4",gridColumnStart:"3",alignSelf:"center",fontSize:"1.2em",justifyContent:"stretch",cursor:"pointer"}} onClick={()=>{this.loginUser()}} color="red" animated='fade'>
            <Button.Content visible>Connexion</Button.Content>
            <Button.Content hidden><Icon name='arrow right'/></Button.Content>
          </Button>
          <Button basic size="small" style={{gridRowStart:"5",gridColumnStart:"3",alignSelf:"center",fontSize:"1.2em",justifyContent:"stretch",cursor:"pointer"}} onClick={()=>{this.popModal()}} color="red" animated="fade">
            <Button.Content visible>Créer un compte</Button.Content>
            <Button.Content hidden><Icon name='edit outline'/></Button.Content>
          </Button>
          <Modal closeOnDimmerClick={true} size="small" open={this.state.open} onClose={this.close} closeIcon>
            <Modal.Header>
              Créer un compte :
            </Modal.Header>
            <Modal.Content >
              <Form autoComplete="off">
                <Form.Input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="off" size="big" labelPosition="left" icon='user' label='Prénom' placeholder='Prénom' name="firstname" onChange={this.handleChange}/>
                <Form.Input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="off" size="big" labelPosition="left" icon='user outline' label='Nom' placeholder='Nom' name="lastname" onChange={this.handleChange}/>
                <Form.Input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="off" size="big" labelPosition="left" icon='mail' label='Mail' placeholder='Mail' name="mail" onChange={this.handleChange}/>
                <Form.Input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="off" size="big" labelPosition="left" icon='key' type="password" label='Mot de passe' placeholder='Mot de passe' name="password" onChange={this.handleChange}/>
                <Form.Input readOnly={true} onFocus={e=>{e.target.removeAttribute('readonly')}} autoComplete="off" size="big" labelPosition="left" icon='key' type="password" label='Confirmez le mot de passe' placeholder='Confirmez le mot de passe' name="passwordAgain" onChange={this.handleChange}/>
              </Form>
            </Modal.Content>
            {this.getModalLabel({error:error,errorContent:errorContent})}
          </Modal>
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

export default wrappedInUserContext = withUserContext(Home);