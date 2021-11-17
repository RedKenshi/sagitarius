import React, { Component } from 'react';
import { Message, Icon } from 'semantic-ui-react';

export class NeedActivation extends Component {
  render() {
    return (
      <div style={{alignSelf:"center",justifyContent:"center",gridColumnStart:"3",gridRowStart:"2"}}>
        <Message color="blue"
            icon='exclamation triangle'
            header='Votre compte est inactif'
            content={'Votre compte doit être activé par un administrateur de la plateforme avant de pouvoir accéder aux fonctionnalités de Workflow'}
        />
      </div>
    )
  }
}

export default NeedActivation
