

import React, { PureComponent } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  ListView
} from 'react-native';
import { connect } from 'react-redux';
import pinyin from 'pinyin';
import py from '../../components/Common/alphabetaList/py';
import Head from '../../components/Common/alphabetaList/head';
import MainList from '../../components/Common/alphabetaList/mainList';
import AlphabetaList from '../../components/Common/alphabetaList/alphabetaList';
import LoadingComponent from '../../components/Common/LoadingComponent';
import NoDataComponent from '../../components/Common/NoDataComponent';

@connect(({ app }) => ({ loading: app.loading, contactlist: app.contactlist }))
class ContactList extends PureComponent {
  static navigationOptions = {
    title: '通讯录',
    headerTintColor: '#fff',
    headerStyle: { backgroundColor: '#4f6aea' },
  }

  constructor(props) {
    super(props);

    this.state = {
      dataSource: this.ds.cloneWithRows([]),
      headHeight: 0,
      functionHeight: 0
    };
  }


  getScroll=() => this.refs.myScroll;
  changeFunctionHeight = (h) => {
    this.setState({ functionHeight: h });
  };

  changeHeadHeight=(h) => {
    this.setState({
      headHeight: h
    });
  };
  JsonSort=(array, key) => array.sort((a, b) => {
    if (a && b && a[key] && b[key]) {
      const x = pinyin(a[key].toLowerCase());
      const y = pinyin(b[key].toLowerCase());
      return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    }
  })
  ds = new ListView.DataSource({ rowHasChanged: (v1, v2) => v1 !== v2 });
  render() {
    const temp = this.JsonSort(this.props.contactlist, 'User_Name');
    const data = py(temp);
    return (
      <View style={styles.layout}>
        {
          this.props.loading ?
            <LoadingComponent Message={'正在加载数据'} /> :
            this.props.contactlist.length === 0
              ? <NoDataComponent Message={'没有数据'} /> : <View style={{ flex: 1 }}>
                <Head headHeight={46} changeHeadHeight={e => this.changeHeadHeight(e)} />
                <ScrollView bounces={false} ref="myScroll">
                  <MainList dataSource={this.ds.cloneWithRows(data)} />
                </ScrollView>
                <AlphabetaList
                  scroll={() => this.getScroll()}
                  headHeight={this.state.headHeight}
                  functionHeight={this.state.functionHeight}
                />
              </View>
        }

      </View>
    );
  }
}

const styles = StyleSheet.create({

  layout: {
    flex: 1
  }
});
export default ContactList;
