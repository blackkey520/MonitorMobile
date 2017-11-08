

import React, { Component, PureComponent } from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Text
} from 'react-native';

class LinkingTouchable extends PureComponent {
  render() {
    return (

      <TouchableOpacity onPress={() => {
        Linking.canOpenURL(this.props.url).then((supported) => {
          if (supported) {
            return Linking.openURL(this.props.url);
          }
        }).catch(err => console.error('An error occurred', err));
      }}
      >

        <Text>
          {this.props.title}
        </Text>
      </TouchableOpacity>

    );
  }
}


export default LinkingTouchable;
