'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  Image,
  TouchableOpacity
} from 'react-native';
import { connect } from 'dva'
import { createAction, NavigationActions } from '../../utils'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import Echarts from 'native-echarts';
@connect(({ point,monitordata }) => ({ dataType:monitordata.dataType,pollutant:monitordata.pollutant,selectedpoint:point.selectedpoint }))
class MonitorChart extends PureComponent {
  render() {
    let { xAxis, data} = this.props;
        let option = {
            title: {
                text: 'So2浓度趋势图',
                show: false
            },
            tooltip: {
                trigger: 'axis',
                formatter: '监测时间:{b0}<br />监测值:{c0} {a0} '
            },
            toolbox: {},
            grid: {
                left: '1%',
                right: '5%',
                bottom: '0%',
                top: '2%',
                width:SCREEN_WIDTH-30,
                height:SCREEN_HEIGHT/2-150,
                containLabel: true
            },
            xAxis: [
                {
                    name: '时间',
                    type: 'category',
                    boundaryGap: false,
                    data: xAxis
                }
            ],
            yAxis: [
                {
                    name: this.props.pollutant.Unit,
                    type: 'value',
                    scale: false,
                    boundaryGap: ['50%', '50%']
                }
            ],
            dataZoom: [
                // {
                //
                //     show: true,
                //     "height": 20,
                //     "xAxisIndex": [0],
                //     bottom: 20,
                //     "start": 0,
                //     "end": 50
                // },
                {
                    "type": "inside",
                    "show": true,
                    "height": 10,
                    "xAxisIndex": [0],
                    "start": 1,
                    "end": 35
                }
            ],
            series: [
                {
                    name: this.props.pollutant.Unit,
                    type: 'line',
                    stack: this.props.pollutant.Unit,
                    label: {
                        normal: {
                            show: false
                        }
                    },
                    symbolSize: 5,
                    itemStyle: {
                        "normal": {
                            "color": "#3791FF",
                            "barBorderRadius": 0,
                            "label": {
                                "show": true,
                                "position": "top"
                            }
                        }
                    },
                    hoverAnimation: true,
                    lineStyle: {
                        normal: {
                            width: 2,
                            color: '#6EB3DC',
                            shadowColor: 'rgba(112, 155, 233, 0.5)',
                            shadowBlur: 4,
                            shadowOffsetY: 4
                        }
                    },

                    markLine: {
                        data: [],
                        label: {
                            normal: {
                                show: false,
                                position: 'end',
                                formatter: function(e) {}
                            }
                        }
                    },
                    data: data
                }
            ]
        };
        this.props.selectedpoint.MonitorPointPollutant.map((pollutant, i) => {
          if(pollutant.PollutantCode==this.props.pollutant.PolluntCode)
          {
            pollutant.Levels.map((alarmlevel,i)=>{
              let upperStandardItem = {};
              let lowerStandardItem = {};
              upperStandardItem.name = '';
              upperStandardItem.yAxis = alarmlevel.UpperValue;
              upperStandardItem.lineStyle = {};
              upperStandardItem.lineStyle.normal = {};
              upperStandardItem.lineStyle.normal.type = "dashed";
              upperStandardItem.lineStyle.normal.color = alarmlevel.StandardColor;
              lowerStandardItem.name = '';
              lowerStandardItem.yAxis = alarmlevel.LowerValue;
              lowerStandardItem.lineStyle = {};
              lowerStandardItem.lineStyle.normal = {};
              lowerStandardItem.lineStyle.normal.type = "dashed";
              lowerStandardItem.lineStyle.normal.color = alarmlevel.StandardColor;
              option.series.markLine = {};
              option.series.markLine.data = [];
              if (pollutant.AlarmType == 1) {
                  option.series[0].markLine.data.push(upperStandardItem);
              } else if (pollutant.AlarmType == 2) {
                  option.series[0].markLine.data.push(lowerStandardItem);
              } else if (pollutant.AlarmType == 3) {
                  option.series[0].markLine.data.push(upperStandardItem);
                  option.series[0].markLine.data.push(lowerStandardItem);
              }
            })
          }
        })


    return (
      <View >
          <Echarts option={option}  height={SCREEN_HEIGHT/2-100}  width={SCREEN_WIDTH}  />
      </View>
    );
  }
}
export default MonitorChart;
