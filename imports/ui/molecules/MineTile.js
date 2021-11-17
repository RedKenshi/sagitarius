import React, { Component, Fragment } from 'react'
import { Icon } from 'semantic-ui-react';
import { UserContext } from '../../contexts/UserContext';
import TexturedButton from '../atoms/TexturedButton';
import chroma from 'chroma-js';
import moment from 'moment';
import gql from 'graphql-tag';

class MineTile extends Component {

    state={
        currency : this.props.c,
        levelupCurrencyQuery:gql`
            mutation levelupCurrency($user:String!,$currency:String!){
                levelupCurrency(user:$user,currency:$currency)
            }
        `
    }

    levelUpCurrency = currency =>{
        this.props.client.mutate({
            mutation: this.state.levelupCurrencyQuery,
            variables:{
                user:Meteor.userId(),
                currency:currency
            }
        }).then(()=>{
            this.props.loadEconomy();
        })
    }

    getNextProd = () => {
        return this.nFormatter(parseInt(this.state.currency.produceMinute*(1+(((2-(2/(this.state.currency.level+1)))/2.5)-0.2))-this.state.currency.produceMinute)*60);
    }

    getPrice = co => {
        let base = this.state.currency.cost[co]
        for (let i = 1; i <= this.state.currency.level+1; i++) {
            base = base*(1+((2-(2/i))/2.5));
        }
        return base;
    }

    nFormatter = n => {
        return parseInt(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

    render() {
        const { currency } = this.state;
        const stored = currency.newStored;
        return (
            <div style={{height:"96vh",border:"6px solid #2d3436",backgroundColor:"#2d3436",color:"#ecf0f1",fontSize:"1.2em"}} key={currency.name}>
                <div style={{width:"100%",height:"100%",padding:"16px 8px",display:"grid",gridTemplateColumns:"2fr 2fr 48px 2fr 1fr 1fr",gridTemplateRows:"48px 32px 48px 2fr 32px 48px 80px auto"}}>
                    <div style={{placeSelf:"center",width:"100%",gridColumnEnd:"span 2",color:currency.color,fontWeight:"black",fontFamily:"'Teko'"}}>
                        <p style={{textAlign:"center"}}>{currency.name}</p>
                    </div>
                    <img style={{margin:"auto",width:"48px",height:"48px"}} src={"/res/materials/"+currency.name+".png"}/>
                    <div style={{width:"100%",placeSelf:"center",gridRowStart:"1",gridColumnStart:"4",gridColumnEnd:"span 3",fontWeight:"black",fontFamily:"'Teko'"}}>
                        <p style={{textAlign:"center"}}>lvl. {currency.level}</p>
                    </div>
                    <hr style={{alignSelf:"center",gridRowStart:"2",gridColumnEnd:"span 6",width:"100%",borderColor:"#1e272e",borderWidth:"2px"}}/>
                    <div style={{placeSelf:"center",gridRowStart:"3",gridColumnStart:"2",gridColumnEnd:"span 3",fontFamily:"'Teko'",fontSize:"2em",color:currency.color,letterSpacing:"0.15rem",fontWeight:"black"}}>
                        {this.nFormatter(stored)}
                    </div>

                    <div style={{placeSelf:"start center",display:"grid",gridGap:"8px 16px",gridTemplateColumns:"1fr 1fr",gridRowStart:"4",gridColumnEnd:"span 5",fontFamily:"'Teko'",fontSize:"1em",marginTop:"4px",color:currency.color,letterSpacing:"0.15rem",fontWeight:"black",color:"#dff9fb"}} key={currency.name}>
                        <div style={{placeSelf:"center end",color:"#b2bec3"}}>Production : </div>
                        <div style={{placeSelf:"center start"}}>{this.nFormatter(currency.produceMinute*60)}/h</div>
                        <div style={{placeSelf:"center end",color:"#b2bec3"}}>Max capacity : </div>
                        <div style={{placeSelf:"center start"}}>{this.nFormatter(currency.max)}</div>
                    </div>

                    <div style={{display:"grid",gridTemplateRows:"1fr "+Math.floor((stored/currency.max)*100)+"%",placeSelf:"stretch",backgroundColor:"#2d3436",gridRowStart:"3",gridColumnStart:"6",gridRowEnd:"span 2",borderRadius:"4px",border:"2px solid "+currency.color}}>
                        <div className={"progress-"+currency.name} style={{gridRowStart:"2",placeSelf:"stretch",background:chroma(currency.color).darken(0.5),background:"linear-gradient(to top, "+chroma(currency.color).darken(0.8)+" , "+chroma(currency.color).darken(0.2)+")"}}>
                        </div>
                    </div>
                    <hr style={{alignSelf:"center",gridRowStart:"5",gridColumnEnd:"span 6",width:"100%",borderColor:"#1e272e",borderWidth:"2px"}}/>
                    <div style={{placeSelf:"center start",gridRowStart:"6",gridColumnStart:"1",gridColumnEnd:"span 3",fontSize:"1.5em",fontFamily:"'Teko'",marginBottom:"16px"}}>Upgrade to lvl.{currency.level+1}</div>
                    <div style={{placeSelf:"center end",gridRowStart:"6",gridColumnStart:"4",gridColumnEnd:"span 3",fontSize:"1.5em",fontFamily:"'Teko'",marginBottom:"16px"}}>+ {this.getNextProd()}/h</div>
                    <div style={{display:"grid",gridColumnEnd:"span 6",gridRowStart:"7",gridTemplateRows:"auto auto",gridTemplateColumns:"48px 32px 2fr 1fr"}}>
                        {Object.keys(currency.cost).map(co=>{
                            if(parseInt(currency.cost[co])>0){
                                return(
                                    <Fragment key={"b"+currency.name+"c"+co}>
                                        <img style={{gridColumnStart:"2",width:"32px",height:"32px",alignSelf:"start"}} src={"/res/materials/"+co+".png"}/>
                                        <p style={{gridColumnStart:"3",margin:"0",fontSize:"1.4em",borderRadius:"8px",lineHeight:"1",placeSelf:"center",whiteSpace:"nowrap",fontFamily:"'Teko'"}}>{this.nFormatter(this.getPrice(co))}</p>
                                        {this.props.haveEnough({name:co,q:this.getPrice(co)})}
                                    </Fragment>
                                )
                            }
                        })}
                    </div>
                    <TexturedButton style={{placeSelf:"center stretch",gridRowStart:"8",fontSize:"1.4em",fontWeight:"300",gridColumnStart:"1",gridColumnEnd:"span 6",fontFamily:"'Teko'"}} content={this.props.getTimeBeforeUpgrade(currency.cost)} callback={()=>{this.levelUpCurrency(currency.name)}}/>
                </div>
            </div>
        )
    }
}

const withUserContext = WrappedComponent => props => {
    return(
        <UserContext.Consumer>
            {ctx => <WrappedComponent {...ctx} {...props}/>}
        </UserContext.Consumer>
    )
}
  
export default wrappedInUserContext = withUserContext(MineTile);
  
  