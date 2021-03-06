import './Layout.css'

import {
  ENEMY_ATTACK_PERIOD_TIME,
  FRAME_DURATION,
  MAXIMAL_SPEED_REDUCE as MAXIMAL_ENEMY_PERIOD_REDUCE,
  MONSTER_NAMES,
  NB_LEVELS,
} from 'Constant'
import { Provider } from 'mobx-react'
import Menu from 'phases/menu/Menu'
import Settings from 'phases/menu/Settings'
import React from 'react'
import { KeyboardState } from 'utils/events/KeyboardState'
import FiniteStateMachine, { MachineState } from 'utils/FiniteStateMachine'

import { GameUpdater } from './GameUpdater'
import { OpponentsState } from './Opponents/OpponentsState'
import { EnemyLife, EnemySprite, PlayerLife, PlayerSprite } from './Opponents/OpponentsViews'
import { PowerLinesState } from './PowerLines/PowerLinesState'
import PowerLines from './PowerLines/PowerLinesView'
import { RhythmSequenceState } from './RhythmSequence/RhythmSequenceState'
import RhythmSequence from './RhythmSequence/RhythmSequenceView'

// import sound from 'assets/sound/yey.mp3'


export default class Game implements MachineState {
  intervals: NodeJS.Timeout[] = []

  constructor(private level: number) { }

  stores = {
    keyboardState: new KeyboardState(),
    rhythmTileState: new RhythmSequenceState(),
    powerLinesState: new PowerLinesState(),
    opponentsState: new OpponentsState(ENEMY_ATTACK_PERIOD_TIME * (1 - MAXIMAL_ENEMY_PERIOD_REDUCE * this.level / (NB_LEVELS-1)))
  }
  gameUpdater = new GameUpdater(this.level, this.stores.rhythmTileState, this.stores.powerLinesState, this.stores.opponentsState)

  handleKeyDown = (event: KeyboardEvent) => {
    this.stores.keyboardState.downKeys.set(event.key, true)
    this.gameUpdater.handleKeyEvent(event.key)
  }

  handleKeyUp = (event: KeyboardEvent) => {
    this.stores.keyboardState.downKeys.delete(event.key)
  }

  init = (context: FiniteStateMachine) => {
    document.addEventListener('keydown', this.handleKeyDown)
    document.addEventListener('keyup', this.handleKeyUp)
    this.intervals.push(setInterval(() => !document.hidden && this.gameUpdater.update(context), FRAME_DURATION))
  }

  cleanup = () => {
    document.removeEventListener('keydown', this.handleKeyDown)
    document.removeEventListener('keyup', this.handleKeyUp)
    this.intervals.forEach(id => clearInterval(id))
  }

  render = () =>
    <Provider {...this.stores} >
      <div id="game-layout">
        <div className="rhythm-sequence"><RhythmSequence /></div>
        <div className="power-lines"><PowerLines /></div>

        <div className="player-sprite"><PlayerSprite /></div>
        <div className="enemy-sprite"><EnemySprite level={this.level}/></div>

        <div className="player-life"><PlayerLife /></div>
        <div className="enemy-life"><EnemyLife /></div>
      </div>
    </Provider>
}

export class Start implements MachineState {

  constructor(private level: number) { }

  render = (context: FiniteStateMachine) => <div style={{paddingTop: "10%"}}>
    <h1>LEVEL {this.level + 1} : {MONSTER_NAMES[this.level]}</h1>
    <button onClick={() => context.changeState(new Game(this.level))}>Play</button>
    <button onClick={() => context.changeState(new Settings())}>Settings</button>
  </div>
}

export class Win implements MachineState {

  render = (context: FiniteStateMachine) => <div style={{paddingTop: "10%"}}>
    <h1>YOU WIN !</h1>
    <button onClick={() => context.changeState(new Menu())}>Back</button>
  </div>
}