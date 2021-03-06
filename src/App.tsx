import background from 'assets/img/background.png'
import Menu from 'phases/menu/Menu'
import React from 'react'
import FiniteStateMachine from 'utils/FiniteStateMachine'

const backgroundStyle : React.CSSProperties= {
  height: "100vh",
  textAlign: "center",
  backgroundImage: `url(${background})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat',
}


export default class App extends React.Component {

  render = () => <div tabIndex={0} style={backgroundStyle}>
    <FiniteStateMachine startState={new Menu()} />
    {/* <DevTools /> */}
  </div>
}