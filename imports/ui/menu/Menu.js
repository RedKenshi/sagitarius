import React, { Component } from 'react'
import MenuItemList from './MenuItemList';
import { Link } from 'react-router-dom';
import { Button,Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';

class Menu extends Component {

  state={
    menuItems:[
      {
        name:"economy",
        img:"economy",
        label:"Economy"
      },{
        name:"units",
        img:"units",
        label:"Units"
      },{
        name:"laboratory",
        img:"laboratory",
        label:"Laboratory"
      },{
        name:"battlefield",
        img:"battlefield",
        label:"Battlefield"
      },{
        name:"ranking",
        img:"ranking",
        label:"Ranking"
      },{
        name:"rewards/"+new Date().getFullYear()+"/"+parseInt(new Date().getMonth()+1),
        img:"rewards",
        label:"Rewards"
      }
    ],
    menuItemsAdmin:[
      {
        name:"economy",
        img:"economy",
        label:"Economy"
      },{
        name:"units",
        img:"units",
        label:"Units"
      },{
        name:"laboratory",
        img:"laboratory",
        label:"Laboratory"
      },{
        name:"battlefield",
        img:"battlefield",
        label:"Battlefield"
      },{
        name:"ranking",
        img:"ranking",
        label:"Ranking"
      },{
        name:"rewards/"+new Date().getFullYear()+"/"+parseInt(new Date().getMonth()+1),
        img:"rewards",
        label:"Rewards"
      },{
        name:"admin",
        img:"admin",
        label:"Admin"
      }
    ]
  }

  getMenuItemsList = () =>{
    if(this.props.user.isAdmin){
        return (this.state.menuItemsAdmin);
    }else{
        return (this.state.menuItems);
      }
  }

  render() {
    return (
      <div style={{
        width:"160px",
        height:"100%",
        position:"absolute",
        top:'0',
        left:'0',
        backgroundColor: "#000000",
        backgroundImage: "linear-gradient(315deg, #000000 0%, #212121 74%)",
        boxShadow:"1px 0 5px black"
      }}>
        <ul style={{padding:"0",listStyle:"none",textAlign:"center"}}>
          <Link to={'/'} style={{ textDecoration: 'none' }}>
            <li style={{cursor:"pointer",marginTop:'32px'}}>
              <p style={{
                  margin:"0 0 6px 0",
                  letterSpacing:".2rem",
                  fontSize:"1.9em",
                  backgroundColor:"#99201c",
                  backgroundImage: "linear-gradient(315deg, #c7ecee 0%, #465F7F 100%)",
                  WebkitBackgroundClip:"text",
                  WebkitTextFillColor:"transparent",
                  fontWeight:"800",
                  fontFamily: "'Teko'"
                }}>{"deepCosmos"}
              </p>
            </li>
          </Link>
          <hr style={{textDecoration:"none",margin:'16px 10%'}}/>
          <MenuItemList menuItems={this.getMenuItemsList()}/>
          <Button style={{marginTop:"16px",width:"128px"}} inverted onClick={()=>{Meteor.logout();this.props.client.resetStore();}} color="red" animated='fade'>
            <Button.Content visible><Icon name='cancel' /></Button.Content>
            <Button.Content hidden>Déconnexion</Button.Content>
          </Button>
        </ul>
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Menu);