import React, { Component, Fragment } from 'react';
import { Button, Icon, Modal, Dropdown, Label, Input } from 'semantic-ui-react';
import { withRouter } from 'react-router-dom';

class CalendarTile extends Component {
    state={
        date:new Date(this.props.day.year,this.props.day.month,this.props.day.day),
        day:this.props.day.day,
        month:this.props.day.month,
        year:this.props.day.year,
        dow:this.props.day.dow,
        today:this.props.day.today,
        selected:false,
        selectedName:""
    }

    show = () =>{
      this.setState({ open: true })
    }

    close = () => {
      this.setState({ open: false })
    }

    handleChange = e =>{
      this.setState({
        [e.target.name]:e.target.value
      });
    }

    handleClientSelection = (e,{value}) =>{
      this.setState({
        selectedClient:value
      });
    }

    getDayName = n => {
        return ["","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"][n];
    }

    getMonthName = n =>{
      return ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"][n];
    }

    selectDay = () =>{
      this.props.selectDate(this.state.year,this.state.month,this.state.day);
    }
    
  render() {
    let { dow,day,today,month,year } = this.state;
    let { selected } = this.props;
    let headerColor = "linear-gradient(315deg, #000000 0%, #414141 74%)";
    let bodyColor = "linear-gradient(315deg, #f3e6e8 0%, #d5d0e5 74%)";
    if(today == true){headerColor = "linear-gradient(315deg, #E0A235 0%, #E0861A 74%)";bodyColor = "linear-gradient(315deg, #ECC785 0%, #ECB675 74%)"}
    if(selected == true){
      headerColor = "linear-gradient(315deg, #2a2a72 0%, #009ffd 74%)";
      bodyColor = "linear-gradient(315deg, #000000 0%, #414141 74%)";
      return (
        <div onClick={()=>{this.selectDay()}} style={{cursor:"pointer",justifyItems:"stretch",display:"grid",gridTemplateRows:"32px 1fr",gridColumnStart:dow}}>
          <div style={{backgroundColor:"#000000",borderColor:"#414141",borderWidth:"3px 3px 3px 3px",borderStyle:"solid",backgroundImage:headerColor,borderRadius:"4px 4px 0 0",color:"#fff",display:"flex"}}>
            <p style={{margin:"auto"}}>{this.getDayName(dow).substring(0,3)+" "+('00'+day).slice(-2)}</p>
          </div>
          <div style={{display:"grid",gridTemplateRows:"26px 1fr 26px",gridTemplateColumns:"26px 1fr 26px",borderColor:"#414141",borderWidth:"0 3px 3px 3px",borderStyle:"solid",borderRadius:"0 0 4px 4px",backgroundColor:"#ecf0f1",backgroundImage:bodyColor}}>
          </div>
        </div>
      )
    }else{
      return (
        <div onClick={()=>{this.selectDay()}} style={{cursor:"pointer",justifyItems:"stretch",display:"grid",gridTemplateRows:"32px 1fr",gridColumnStart:dow}}>
          <div style={{backgroundColor:"#000000",borderColor:"#414141",borderWidth:"3px 3px 3px 3px",borderStyle:"solid",backgroundImage:headerColor,borderRadius:"4px 4px 0 0",color:"#fff",display:"flex"}}>
            <p style={{margin:"auto"}}>{this.getDayName(dow).substring(0,3)+" "+('00'+day).slice(-2)}</p>
          </div>
          <div style={{display:"grid",gridTemplateRows:"26px 1fr",gridTemplateColumns:"1fr",justifyContent:"center",alignItems:"center",borderColor:"#414141",borderWidth:"0 3px 3px 3px",borderStyle:"solid",borderRadius:"0 0 4px 4px",backgroundColor:"#ecf0f1",backgroundImage:bodyColor}}>
          </div>
        </div>
      )
    }
  }
}

export default withRouter(CalendarTile);