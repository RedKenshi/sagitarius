import React, { Component } from 'react'

export class CurrencyDisplay extends Component {

    state ={
        currency : this.props.currency
    }

    nFormatter = n => {
        return parseInt(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
    }

  render() {
    const { currency } = this.state;
    const stored = parseFloat(currency.stored) + (Math.abs(currency.lastUpdate - Date.now())/1000)*parseFloat(currency.produceMinute/60);
    return (
        <div style={{placeSelf:"center",fontFamily:"'Teko'",fontSize:"1.3em"}} key={currency.name}>
          <span style={{color:"#ecf0f1"}}>
            {currency.name + " : "}
          </span>
          <span style={{color:currency.color,fontWeight:"black",fontSize:"1.5em"}}>
            {this.nFormatter(stored)}
          </span>
        </div>
    )
  }
}

export default CurrencyDisplay
