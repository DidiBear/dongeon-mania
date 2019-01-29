import slash from "assets/img/slash.png";
import backslash from "assets/img/backslash.png";
import { NB_LINES } from "Constant";
import _ from "lodash";
import { inject, observer } from 'mobx-react';
import { PowerLinesState, SlashProgression } from "phases/game/PowerLines/PowerLinesState";
import React from "react";
// Constants

const MARGIN = 3
const LINE_HEIGHT = (100 - MARGIN * (NB_LINES + 1)) / NB_LINES


const PowerLines = () => <>
  {_.range(NB_LINES).map(i =>
    <rect key={"line " + i} x={0} y={`${MARGIN + i * (LINE_HEIGHT + MARGIN)}%`}
      width="100%" height={`${LINE_HEIGHT}%`}
      fill="#AAA" />)}
</>

const Slash = (props: { line: number, slash: SlashProgression, enemy: boolean }) => <circle 
  cx={`${props.slash.progression}%`} cy={`${props.line * (LINE_HEIGHT + MARGIN) + MARGIN + LINE_HEIGHT/2}%`}
  r={`${LINE_HEIGHT/6}%`} fill={props.enemy ? "red" : "blue"} />

export default inject("powerLinesState")(observer(({ powerLinesState }: { powerLinesState?: PowerLinesState }) => {

  return <div style={{ width: "70%", height: "70%", display: "inline-block" }}>
    <svg width="100%" height="100%">

      <PowerLines />
      {powerLinesState!.mapPlayerSlashs((line, slash) => <Slash key={`enemy slash ${line} ${slash.progression}`} line={line} slash={slash} enemy={false} />)}
      {powerLinesState!.mapEnemySlashs((line, slash) => <Slash key={`enemy slash ${line} ${slash.progression}`} line={line} slash={slash} enemy={true} />)}
    </svg>
  </div>
}))
