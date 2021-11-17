import React, { Fragment,Component } from 'react'
import { Link } from 'react-router-dom';

class MenuItemList extends Component {
  render() {
    const { menuItems } = this.props;
    const list = menuItems.map((item) =>
        <Fragment key={item.name}>
          <Link to={'/'+ item.name} style={{ textDecoration: 'none' }}>
            <li style={{cursor:"pointer",marginTop:'16px'}} name={item.name}>
              <img style={{width:"56px",height:"56px"}} src={"/res/menu/"+item.img+".png"} alt={item.label+" item logo"}/>
              <p style={{
                  margin:"0 0 6px 0",
                  fontSize:"1.7em",
                  letterSpacing:".2rem",
                  backgroundColor:"#99201c",
                  backgroundImage: "linear-gradient(315deg, #c7ecee 0%, #465F7F 100%)",
                  WebkitBackgroundClip:"text",
                  WebkitTextFillColor:"transparent",
                  fontWeight:"700",
                  fontFamily: "'Teko'"
                }}>{item.label}</p>
            </li>
          </Link>
        </Fragment>
    );
    return (
      list
    );
  }
}

export default MenuItemList
