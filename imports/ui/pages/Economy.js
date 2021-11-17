import React, { Component, Fragment } from 'react';
import { UserContext } from '../../contexts/UserContext';
import MineTile from '../molecules/MineTile';
import { Icon } from 'semantic-ui-react';
import gql from 'graphql-tag';

export class Economy extends Component {
  state={
    currencies:[],
    currenciesQuery:gql`
      query currencies($user:String!){
        currencies(user:$user){
          name
          stored
          lastUpdate
          color
          produceMinute
          level
          max
          cost{
            iron
            steel
            carbon
            cristal
          }
        }
      }
    `,
    updateStoredQuery:gql`
      mutation updateStored($user:String!){
        updateStored(user:$user)
      }
    `,
  }

  updateStored = () => {
    this.props.client.mutate({
      mutation: this.state.updateStoredQuery,
      variables:{user:Meteor.userId()}
    })
  }

  nFormatter = n => {
    return parseInt(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  }

  haveEnough = ({name,q}) => {
    if(this.state.currencies.length != 0){
      if(this.state.currencies.filter(x=> x.name == name)[0].newStored  > q){
        return (
          <div style={{gridColumnStart:"4",lineHeight:"1",height:"16px",width:"16px",borderRadius:"8px",placeSelf:"center start",fontSize:"0.95em",color:"#2ecc71",whiteSpace:"nowrap",fontFamily:"'Teko'"}}>
            <Icon name='check' color='green'/>
          </div>
        )
      }else{
        return(
          <div style={{gridColumnStart:"4",lineHeight:"1",height:"16px",width:"16px",borderRadius:"8px",placeSelf:"center start",fontSize:"0.95em",color:"#e74c3c",whiteSpace:"nowrap",fontFamily:"'Teko'"}}>
            <p>- {this.nFormatter(Math.abs(this.state.currencies.filter(x=> x.name == name)[0].newStored - q))}</p>
          </div>
        )
      }
    }else{
      return <div style={{gridColumnStart:"4",height:"16px",width:"16px",borderRadius:"8px",placeSelf:"center start",fontSize:"0.95em",color:"#c7ecee",fontFamily:"'Teko'"}}>-</div>;
    }
  }

  timeBeforeReaching = ({name,q}) => {
    const cs = this.state.currencies.filter(c=> c.name == name)[0];
    for (let i = 1; i <= cs.level+1; i++) {
      q=q*(1+((2-(2/i))/2.5));
    }
    let newStored = parseFloat(cs.stored) + (Math.abs(cs.lastUpdate - Date.now())/1000)*parseFloat(cs.produceMinute/60);
    const t = (q-newStored)/(cs.produceMinute/60);
    if(t>0){
      return t;
    }else{
      return 0;
    }
  }

  formatSecond = s => {
    let minutes = Math.floor(s / 60);
    s = s%60;
    let hours = Math.floor(minutes/60)
    minutes = minutes%60;
    let days = Math.floor(hours/24)
    hours = hours%24;
    return `${this.pad(days)}:${this.pad(hours)}:${this.pad(minutes)}:${this.pad(s)}`;
  }

  pad = num => {
    return ("0"+num).slice(-2);
  }

  getTimeBeforeUpgrade = costs => {
    let times = []
    if(costs.iron != 0){times.push(this.timeBeforeReaching({name:"iron",q:costs.iron}));}
    if(costs.steel != 0){times.push(this.timeBeforeReaching({name:"steel",q:costs.steel}));}
    if(costs.carbon != 0){times.push(this.timeBeforeReaching({name:"carbon",q:costs.carbon}));}
    if(costs.cristal != 0){times.push(this.timeBeforeReaching({name:"cristal",q:costs.cristal}));}
    if(parseInt(Math.max.apply(Math,times)) == 0){
      return "UPGRADE";
    }else{
      return this.formatSecond(parseInt(Math.max.apply(Math,times)));
    }
  }

  loadEconomy = () =>{
    this.props.client.query({
      query: this.state.currenciesQuery,
      variables:{user:Meteor.userId()}
    }).then(({data}) => {
      data.currencies.map(c=>{
        c.newStored = 0;
      })
      this.setState({
        currencies : data.currencies
      })
      this.updateStored();
    })
  }

  produce = () => {
    let currencies = this.state.currencies;
    currencies.map(c=>{
      c.newStored = parseInt(parseFloat(c.stored) + (Math.abs(c.lastUpdate - Date.now())/1000)*parseFloat(c.produceMinute/60))
      if(c.newStored > c.max){
        c.newStored = c.max;
      }
    })
    this.setState({
      currencies:currencies
    });
    setTimeout(this.produce,1000);
  }

  componentDidMount = () =>{
    this.loadEconomy();
    this.produce();
  }

  render() {
    const { currencies } = this.state;
    return (
      <div style={{width:"100%",maxWidth:"1304px",display:"grid",gridTemplateRows:"72px 1fr",height:"100%"}}>
        <div style={{padding:"16px 32px 40px 32px",width:"100%",height:"100%",display:"grid",gridTemplateColumns:"repeat(auto-fill, minmax(256px, 1fr))",gridGap:"16px",justifyContent:"center"}}>
          {currencies.map(c=>{
            return(
              <MineTile key={"b"+c.name} c={c} loadEconomy={this.loadEconomy} haveEnough={this.haveEnough} getTimeBeforeUpgrade={this.getTimeBeforeUpgrade}/>
            )
          })}

        </div>
      </div>
    )
  }
}

const withUserContext = WrappedComponent => props => (
  <UserContext.Consumer>
      {ctx => <WrappedComponent {...ctx} {...props}/>}
  </UserContext.Consumer>
)

export default wrappedInUserContext = withUserContext(Economy);

