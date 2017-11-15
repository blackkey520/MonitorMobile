// import liraries
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;
@connect(({ app, point }) => ({ pollutanttype: app.pollutanttype, page: point.page }))
class PollutantType extends Component {
  render() {
    const count = this.props.pollutanttype.length <= 4 ? this.props.pollutanttype.length : 4;
    const itemwidth = (SCREEN_WIDTH / count);

    return (
      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-around',
        backgroundColor: '#fff',
        borderBottomColor: '#e7e5e6',
        height: 45,
        borderBottomWidth: 1 }}
      >
        {this.props.pollutanttype.map((item, key) => {
          let color = '#484747';
          if (this.props.page === key) {
            color = '#526deb';
          }
          return (<TouchableOpacity
            key={item.ID}
            onPress={() => {
              this.props.press(key);
            }}
            style={{
              height: 45,
              width: itemwidth,
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              borderBottomColor: this.props.page === key ? '#526deb' : '#fff',
              borderBottomWidth: 1,
              backgroundColor: '#fff' }}
          >
            <View style={{ borderRightColor: '#b1b4b6',
              alignItems: 'center',
              justifyContent: 'center',
              borderRightWidth: 1,
              width: itemwidth }}
            >
              <Text style={{ color }}>{item.Name}</Text>
            </View>
          </TouchableOpacity>);
        })}
      </View>
    );
  }
}

// make this component available to the app
export default PollutantType;
