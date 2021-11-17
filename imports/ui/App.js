import React from 'react';
import AppBody from './AppBody';

const App = ({ loading }) => {

    if(loading) return null;
    return (
        <AppBody style={{
            backgroundColor: "#000000",
            backgroundImage: "linear-gradient(315deg, #000000 0%, #212121 74%)"
        }} />
    )
};

export default App;