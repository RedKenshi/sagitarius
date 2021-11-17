import React, { Component } from 'react'

export class TexturedButton extends Component {
    state={
        style:Object.assign(this.props.style,{cursor:"pointer",padding:"6px",margin:"16px 4px 8px 4px",display:"grid",textAlign:"center",borderRadius:"4px",backgroundColor:'#636e72',fontFamily:"'Teko'"})
    }
  render() {

    return (
        <div style={this.state.style} onClick={this.props.callback}>
            {this.props.content}
        </div>
    )
  }
}

export default TexturedButton
