import React from 'react';
import {
  Text,
  View,
  Keyboard,
  FlatList,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import Constants from 'expo-constants';
import { SearchBar, ListItem } from 'react-native-elements';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import Screen from '../components/Screen';
import GoogleBooksAPI from '../services/GoogleBooksAPI';

// Tempo de espera para buscar os livros
const WAIT_INTERVAL = 500;

// Largura da tela
const { width } = Dimensions.get('window');

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
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

  async load() {
    try {
      this.setState({ loadError: false, loading: false });
    } catch (error) {
      this.setState({ loadError: true, loading: false });
    }
  }

  async updateSearch(search) {
    clearTimeout(this.timer);
    this.setState({ search });
    if (search.length > 0) {
      // Timeout para aguardar usuário parar de digitar
      this.timer = setTimeout(async () => {
        try {
          const books = await GoogleBooksAPI.listBooks(search);
          this.setState({ books: books.items });
          Keyboard.dismiss();
        } catch (e) {
          this.setState({ books: [] });
        }
      }, WAIT_INTERVAL);
    } else {
      this.setState({ books: [] });
    }
  }

  renderItem(item) {
    const source = item.volumeInfo.imageLinks.thumbnail ? { uri: item.volumeInfo.imageLinks.thumbnail } : undefined;
    return <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Book', { id: item.id })}>
      <ListItem
        leftElement={<Image source={source} style={{ width: width*0.15, height: width*0.2 }} resizeMode={'cover'} />}
        title={item.volumeInfo.title}
        titleStyle={[Styles.text16, Styles.textBold]}
        titleProps={{ numberOfLines: 1 }} 
        subtitle={item.volumeInfo.description}
        subtitleStyle={[Styles.text15, Styles.textLightText]}
        subtitleProps={{ numberOfLines: 3 }}
        bottomDivider={false}
        containerStyle={{ paddingVertical: 10, paddingHorizontal: 10 }}
        chevron={true}
      />
    </TouchableOpacity>
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
        <FlatList
          keyboardShouldPersistTaps='handled'
          data={this.state.books}
          renderItem={({ item }) => this.renderItem(item)}
          ListEmptyComponent={() => <View>
            <View style={Styles.viewDivider} />
            <Text style={Styles.textEmpty}>Nenhum livro encontrado</Text>
            <View style={Styles.viewDivider} />
          </View>}
          ItemSeparatorComponent={() => <View style={Styles.viewDividerLine} />}
          keyExtractor={(item, index) => item.id}
        />
      </View>
    </Screen>
  }
}
