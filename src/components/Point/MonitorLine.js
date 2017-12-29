

import React, { PureComponent } from 'react';

import {
  View,
  Dimensions,
} from 'react-native';
import { connect } from 'react-redux';
import { VictoryChart, VictoryLine, VictoryGroup, VictoryScatter, VictoryTooltip, VictoryVoronoiContainer, VictoryCursorContainer } from 'victory-native';
import { VictoryTheme } from 'victory-core';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


@connect(({ point, monitordata }) => ({ dataType: monitordata.dataType,
  pollutant: monitordata.pollutant,
  selectedpoint: point.selectedpoint,
  lineData: monitordata.lineData }))
class MonitorLine extends PureComponent {
  render() {
    return (
      <VictoryChart
        width={SCREEN_WIDTH}
        height={SCREEN_HEIGHT / 2 - 100}
        containerComponent={<VictoryVoronoiContainer radius={25} voronoiPadding={2} />}

        animate={{
          duration: 2000,
          onLoad: { duration: 1000 },
        }}
        theme={VictoryTheme.material}
        padding={{ top: 10, left: 25, right: 25, bottom: 40 }}
        domain={{ y: [0, 10] }}
      >
        <VictoryGroup
          color="#4f6aea"
          style={{
            data: {
              stroke: '#4f6aea',
              strokeWidth: (d, active) => { return active ? 2 : 1; },
            },
          }}
          labelComponent={
            <VictoryTooltip
              style={{ fontSize: 13 }}
              cornerRadius={0}
              pointerLength={3}
              flyoutStyle={{
                fill: '#fff',
                stroke: '#4f6aea',
              }}
            />
          }
          labels={d => `时间:${d.x}\n 监控值:${d.y}`}

          data={this.props.lineData}
        >
          <VictoryLine />
          <VictoryScatter
            size={(d, a) => { return a ? 3 : 1; }}
          />
        </VictoryGroup>
      </VictoryChart>
    );
  }
}
export default MonitorLine;
