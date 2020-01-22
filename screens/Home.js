import React from 'react';
import {
  Text,
  View,
} from 'react-native';
import Constants from 'expo-constants';
import { SearchBar } from 'react-native-elements';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import Screen from '../components/Screen';

// Tempo de espera para buscar os livros
const WAIT_INTERVAL = 600;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      refreshing: false,
      loadError: false,
      books: [],
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


  async updateSearch(search) {
    clearTimeout(this.timer);
    this.setState({ search });
    if (search.length > 0) {
      this.timer = setTimeout(async () => {
        // const books = await GoogleBooksAPI.listBooks();
        this.setState({ books, filtering: false });
        Keyboard.dismiss();
      }, WAIT_INTERVAL);
    } else {
      this.setState({ books: [] });
    }
  }

  reload() {
    this.setState({ loading: true });
    this.load();
  }

  render() {
    return <Screen loading={this.state.loading} navigation={this.props.navigation} error={this.state.loadError} reload={() => this.reload()}>
      <View style={{ height: Constants.statusBarHeight }} />
      <Text style={[Styles.padding20, Styles.text24, Styles.textBold]}>Google Books</Text>
      <View style={{ flex: 1 }}>
        <SearchBar
          platform={Platform.OS}
          placeholder="Buscar livros"
          placeholderTextColor={Colors.lightText}
          onChangeText={(search) => this.updateSearch(search)}
          value={this.state.search}
          round={true}
          lightTheme={true}
          containerStyle={{ backgroundColor: 'white' }}
          inputContainerStyle={{ backgroundColor: Colors.background, padding: 0, margin: 0, borderRadius: 10 }}
          containerStyle={
            Platform.OS === 'android' ?
            { marginLeft: 0, marginRight: 0, paddingLeft: 10, paddingRight: 10, backgroundColor: 'white' } :
            { margin: 0, padding: 0, paddingLeft: 5, backgroundColor: 'white' }
          }
          onCancel={() => this.updateSearch('')}
          onClear={() => this.updateSearch('')}
          cancelButtonTitle='Cancelar'
          cancelButtonProps={{ buttonTextStyle: { fontSize: 16 } }}
          inputStyle={{ fontSize: 16, color: Colors.defaultText }}
        />
      </View>
    </Screen>
  }
}
