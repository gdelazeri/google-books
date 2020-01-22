import React from 'react';
import {
  Text,
  View,
  Dimensions,
} from 'react-native';
import Constants from 'expo-constants';
import { Overlay, ListItem, Icon } from 'react-native-elements';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import Screen from '../components/Screen';

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      loadError: false,
    }
  }

  static navigationOptions = {
    headerStyle: { elevation: 0, shadowOpacity: 0 },
    header: null,
  }

  async componentDidMount() {
    this.load();
  }

  async load(refreshing = false) {
    try {
      this.setState({ loadError: false, refreshing: false, loading: false });
    } catch (error) {
      this.setState({ loadError: true, refreshing: false, loading: false });
    }
  }

  reload() {
    this.setState({ loading: true });
    this.load();
  }

  render() {
    return <Screen loading={this.state.loading} navigation={this.props.navigation} error={this.state.loadError} reload={() => this.reload()}>
      <View style={{ height: Constants.statusBarHeight }} />
      <Text style={[Styles.paddingL20, Styles.paddingT20, Styles.text24, Styles.textBold]}>Google Books</Text>
    </Screen>
  }
}
