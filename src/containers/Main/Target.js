

import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Animated,
  Platform
} from 'react-native';
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import ParallaxScrollView from 'react-native-parallax-scroll-view';
import { NavigationActions } from '../../utils';
import LoadingComponent from '../../components/Common/LoadingComponent';
import TargetImageComponent from '../../components/Target/TargetImageComponent';
import TargetMapComponent from '../../components/Target/TargetMapComponent';
import TargetBaseMessage from '../../components/Target/TargetBaseMessage';
import TargetMonitorPoint from '../../components/Target/TargetMonitorPoint';

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;


@connect(({ target }) => ({ targetBase: target.targetBase, loading: target.loading }))
class Target extends PureComponent {
  static navigationOptions = {
    header: null,
    title: '监测目标',
    headerTintColor: '#fff',
    headerBackTitle: null,
    headerStyle: { backgroundColor: '#4f6aea' },
  }
  state: {
    yOffset: Animated,
  };
  constructor(props) {
    super(props);

    this.state = {
      yOffset: new Animated.Value(0),
      isShow: true,
      backcolor: '#717172',
      scrollenabled: false
    };
  }


onScroll=(e) => {
  const { yOffset } = this.state;
  const { nativeEvent: { contentOffset: { y: offsetY } } } = e;
  if (offsetY < PARALLAX_HEADER_HEIGHT - 50) {
    yOffset.setValue(offsetY);
  } else {
    this.setState({
      backcolor: '#fff'
    });
  }
  if (offsetY <= 0) {
    this.setState({ isShow: false, scrollenabled: false, backcolor: '#717172' });
  } else {
    this.setState({ isShow: true, scrollenabled: true });
  }
}
render() {
  return (
    <View style={styles.layout}>
      {
        this.props.loading || this.props.targetBase === null ?
          <LoadingComponent Message="正在加载数据" />
          :
          <ParallaxScrollView
            onScroll={this.onScroll}
            ref="Parallax"
            headerBackgroundColor="#fff"
            contentBackgroundColor="#fff"
            scrollEnabled={this.state.scrollenabled}
            backgroundColor="#fff"
            stickyHeaderHeight={STICKY_HEADER_HEIGHT}
            parallaxHeaderHeight={PARALLAX_HEADER_HEIGHT}
            backgroundSpeed={10}
            renderBackground={() => (
              <View key="background" style={{ backgroundColor: '#fff', width: SCREEN_WIDTH, height: SCREEN_HEIGHT }} />
            )}
            renderForeground={() => (
              <View style={{ flex: 1 }}>
                <TargetMapComponent />
              </View>
            )}
            renderStickyHeader={() => (
              <View
                key="sticky-header"
                style={{ flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#4f6aea',
                  height: Platform.OS === 'ios' ? 70 : 60 }}
              >
                <View style={{ alignItems: 'center', }}>
                  <Text style={{ fontSize: 17, color: '#fff' }}>{'监测目标'}</Text>
                </View>
              </View>
            )}
            renderFixedHeader={() => (
              <TouchableOpacity
                style={{ position: 'absolute', left: 15, top: 16 }}
                onPress={() => {
                  this.props.dispatch(NavigationActions.back());
                }}
              >
                <Icon name={'ios-arrow-back'} size={35} color={this.state.backcolor} />
              </TouchableOpacity>
            )}
          >
            <View ref="panView" style={{ flex: 1 }} >

              <Animated.View style={{
                height: this.state.yOffset.interpolate({// 映射到0.0,1.0之间
                  inputRange: [0, PARALLAX_HEADER_HEIGHT - 50],
                  outputRange: [0, SCREEN_HEIGHT / 3],

                }),
                width: SCREEN_WIDTH,

              }}
              >
                {this.state.isShow ? <TargetImageComponent /> : null}
              </Animated.View>
              <TouchableOpacity onPress={() => {
                this.refs.Parallax.scrollTo({ x: 0, y: PARALLAX_HEADER_HEIGHT - 50 });
                this.setState({
                  scrollenabled: true,
                  backcolor: '#fff'
                });
              }}
              >
                <TargetBaseMessage />
              </TouchableOpacity>


              <TargetMonitorPoint />

            </View>
          </ParallaxScrollView>
      }

    </View>
  );
}
}
const PARALLAX_HEADER_HEIGHT = Platform.OS === 'ios' ? SCREEN_HEIGHT / 2 + 180 : SCREEN_HEIGHT / 2 + 130;
const STICKY_HEADER_HEIGHT = 60;
const styles = StyleSheet.create({
  layout: {
    flex: 1
  }
});
export default Target;
