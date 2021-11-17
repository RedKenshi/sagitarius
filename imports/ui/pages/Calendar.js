import React, { Component } from 'react';
import { Header, Image } from 'semantic-ui-react';
import CalendarTile from "../molecules/CalendarTile";
import { withRouter } from 'react-router-dom';
import { graphql, Query, withApollo } from 'react-apollo';
import gql from 'graphql-tag';


class Calendar extends Component {
  state={
    y : parseInt(this.props.match.params.y),
    m : parseInt(this.props.match.params.m),
    clientsMappedList : [],
    selected:null,
    DaysQuery : gql`query getPrestationsByDays($m: Int!,$y: Int!) {
      getDaysInMonth(m:$m,y:$y){
        key
        day
        month
        year
        dow
        today
      }
    }`
  }

  dateIsSelected = ({ d,m,y }) => {
    const date = new Date (y,m,d);
    if(this.state.selected != null){
      if(date.getDate() == this.state.selected.getDate() && date.getMonth() == this.state.selected.getMonth() && date.getFullYear() == this.state.selected.getFullYear()){
        return true
      }else{
        return false
      }
    }else{
      return false;      
    }
  }

  getMonthName = n =>{
    return ["Janvier","Fevrier","Mars","Avril","Mai","Juin","Juillet","Aout","Septembre","Octobre","Novembre","Decembre"][n-1];
  }

  navigateToPrevMonth = () => {
    let { y,m } = this.state;
    if(m<=1){
      y=y-1;
      m=12;
    }else{
      m=m-1;
    }
    this.props.history.push("/progress/"+y+"/"+m)
    this.setState({y:y,m:m})
  }

  navigateToNextMonth = () => {
    let { y,m } = this.state;
    if(m>=12){
      y=y+1;
      m=1;
    }else{
      m=m+1;
    }
    this.props.history.push("/progress/"+y+"/"+m)
    this.setState({y:y,m:m})
  }

  selectDate = (y,m,d) =>{
    this.setState({
      selected:new Date(y,m,d)
    })
  }


  render() {
    const { m,y } = this.state;
    return (
      <div>
        <div style={{margin:"16px auto 16px auto",width:"338px"}}>
          <Image onClick={()=>{this.navigateToPrevMonth()}} style={{cursor:"pointer",width:"32px",height:"32px",margin:"0 16px",display:"inline-block"}} src="/res/right-chevron.png"/>
          <div style={{width:"210px",padding:"auto",display:"inline-block"}}>
            <Header as="h1" textAlign='center' style={{margin:"0 auto",position:"relative",top:"7px"}} as="h1">{this.getMonthName(m)+" "+y}</Header>
          </div>
          <Image onClick={()=>{this.navigateToNextMonth()}} style={{cursor:"pointer",width:"32px",height:"32px",margin:"0 16px",transform:"rotate(180deg)",display:"inline-block"}} src="/res/right-chevron.png"/>
        </div>
        <div style={{margin:"16px auto 16px auto",display:"grid",gridGap:"8px",gridTemplateColumns:"1fr 1fr 1fr 1fr 1fr",gridTemplateRows:"144px 144px 144px 144px 144px"}}>
          <Query fetchPolicy={"network-only"} query={this.state.DaysQuery} variables={{ m:parseInt(this.props.match.params.m), y:parseInt(this.props.match.params.y) }}>
            {({ loading, error, data }) => {
              if (loading) return null;
              return data.getDaysInMonth.map(day => (
                <CalendarTile key={day.key} clientsMappedList={[]} selected={this.dateIsSelected({d:day.day,m:day.month,y:day.year})} day={day} selectDate={this.selectDate} />
              ))
            }}
          </Query>
        </div>
      </div>
    )
  }
}

const withRouterContext = withRouter(Calendar);

export default withApollo(withRouterContext)