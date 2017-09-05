'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  TouchableOpacity,
  Linking,
  Text
} from 'react-native';

class LinkingTouchable extends PureComponent {
  constructor(props){

    super(props);

  }

  protoTypes:{

    url:react.ProtoTypes.string

  }

  render (){

    return(

      <TouchableOpacity onPress={()=>{

        Linking.canOpenURL(this.props.url).then(supported => {

          if (!supported) {
 

          } else {

            return Linking.openURL(this.props.url);

          }

        }).catch(err => console.error('An error occurred', err));

        }}>

        <Text>
          {this.props.title}
        </Text>
      </TouchableOpacity>

    )

  }
}

const styles = StyleSheet.create({

});


export default LinkingTouchable;
