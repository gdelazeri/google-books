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
import { SearchBar, ListItem, Icon } from 'react-native-elements';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import Screen from '../components/Screen';
import GoogleBooksAPI from '../services/GoogleBooksAPI';

// Tempo de espera para buscar os livros
const WAIT_INTERVAL = 500;

// Largura da tela
const { width } = Dimensions.get('window');

// Quantidade máxima de livros por página
const MAX_RESULTS = 10;

export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadError: false,
      search: '',
      books: [],
      qtyPages: 0,
      page: 0,
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
          const books = await GoogleBooksAPI.listBooks(search, 0, MAX_RESULTS);
          this.setState({ books: books.items, qtyPages: parseInt(books.totalItems/MAX_RESULTS, 10), page: 0 });
          Keyboard.dismiss();
        } catch (e) {
          this.setState({ books: [] });
        }
      }, WAIT_INTERVAL);
    } else {
      this.setState({ books: [] });
    }
  }

  async listPage(page) {
    const { search } = this.state;
    const books = await GoogleBooksAPI.listBooks(search, page, MAX_RESULTS);
    this.setState({ books: books.items, page });
  }

  renderItem(item) {
    let source;
    if (item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail) {
      source = { uri: item.volumeInfo.imageLinks.thumbnail };
    }
    return <TouchableOpacity activeOpacity={0.7} onPress={() => this.props.navigation.navigate('Book', { id: item.id })}>
      <ListItem
        leftElement={<Image source={source} style={{ width: width*0.15, height: width*0.22 }} resizeMode={'cover'} />}
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
    const { page, qtyPages, books, search } = this.state;
    return <Screen loading={this.state.loading} navigation={this.props.navigation} error={this.state.loadError} reload={() => this.reload()}>
      <View style={{ height: Constants.statusBarHeight }} />
      <Text style={[Styles.padding20, Styles.paddingB15, Styles.text24, Styles.textBold, Styles.textPrimary]}>Google Books</Text>
      <View style={{ flex: 1 }}>
        <SearchBar
          platform={Platform.OS}
          placeholder="Buscar livros"
          placeholderTextColor={Colors.lightText}
          onChangeText={(search) => this.updateSearch(search)}
          value={search}
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
          data={books}
          renderItem={({ item }) => this.renderItem(item)}
          ListEmptyComponent={() => <View>
            <View style={Styles.viewDivider} />
            {search.length > 0 && <Text style={Styles.textEmpty}>Nenhum livro encontrado</Text>}
            <View style={Styles.viewDivider} />
          </View>}
          ItemSeparatorComponent={() => <View style={Styles.viewDividerLine} />}
          keyExtractor={(item, index) => item.id}
          ListFooterComponent={books.length > 0 && <View style={{ width: '100%' }}>
            <View style={Styles.viewDividerLine} />
            <View style={[Styles.inline, Styles.spaceAround, Styles.padding5]}>
              <TouchableOpacity disabled={page === 0} onPress={() => this.listPage(page-1)}>
                <Icon type='material-community' name='chevron-left' size={30} color={Colors.lightText} />
              </TouchableOpacity>
              <Text style={[Styles.text15, Styles.textLightText, { paddingTop: 3 }]}>{page+1}/{qtyPages}</Text>
              <TouchableOpacity disabled={page+1 === qtyPages} onPress={() => this.listPage(page+1)}>
                <Icon type='material-community' name='chevron-right' size={30} color={Colors.lightText} />
              </TouchableOpacity>
            </View>
          </View>}
        />
      </View>
    </Screen>
  }
}
