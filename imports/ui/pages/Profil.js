import React, { Component } from 'react';
import { Header } from 'semantic-ui-react';

export class Profil extends Component {
  render() {
    return (
      <div>
        <Header style={{display:"inline-block",position:"relative",top:"7px"}} as="h1">
            Profil
        </Header>
      </div>
    )
  }
}

export default Profil
