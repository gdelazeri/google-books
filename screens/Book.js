import React from 'react';
import {
  Text,
  View,
  Dimensions,
  ScrollView,
} from 'react-native';
import Constants from 'expo-constants';
import Styles from '../constants/Styles';
import Screen from '../components/Screen';
import Favorite from '../components/Favorite';
import GoogleBooksAPI from '../services/GoogleBooksAPI';
import BookDetails from '../components/BookDetails';

// Largura da tela
const { width } = Dimensions.get('window');

export default class Book extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      loadError: false,
      book: {
        volumeInfo: {
          title: '',
          subtitle: '',
          description: '',
          pageCount: undefined,
          publishedDate: undefined,
          averageRating: undefined,
        },
        saleInfo: {
          saleability: undefined,
          listPrice: {
            amount: 0,
            currencyCode: ""
          },
          buyLink: '',
        }
      },
    }
  }

  static navigationOptions = {
    headerStyle: { elevation: 0, shadowOpacity: 0 },
    header: null,
  }

  async componentDidMount() {
    this.id = this.props.navigation.getParam('id');
    this.load();
  }

  async load() {
    try {
      const book = await GoogleBooksAPI.getBook(this.id);
      this.setState({ book, loadError: false, loading: false });
    } catch (error) {
      this.setState({ loadError: true, loading: false });
    }
  }
  
  reload() {
    this.setState({ loading: true });
    this.load();
  }

  render() {
    const { book } = this.state;
    return <Screen loading={this.state.loading} navigation={this.props.navigation} error={this.state.loadError} reload={() => this.reload()}>
      <View style={{ height: Constants.statusBarHeight }} />
      <ScrollView contentContainerStyle={[Styles.padding20]}>
        <Text style={[Styles.text22, Styles.textBold, Styles.textPrimary]}>{book.volumeInfo.title}</Text>
        <View style={[Styles.inline, Styles.spaceBetween]}>
          <View style={{ width: width-20-100 }}>
            {book.volumeInfo.subtitle && <View>
              <View style={Styles.viewDivider5} />
              <Text style={[Styles.text16, Styles.textBold, Styles.textLightText]}>{book.volumeInfo.subtitle}</Text>
            </View>}
            {Array.isArray(book.volumeInfo.authors) && book.volumeInfo.authors.length > 0 && <View>
              <View style={Styles.viewDivider5} />
              <Text style={[Styles.text16, Styles.textBold, Styles.textLightText]}>Autor{book.volumeInfo.authors.length > 1 ? 'es' : ''}: {book.volumeInfo.authors.join(', ')}</Text>
            </View>}
          </View>
          <View>
            <Favorite id={this.id} />
          </View>
        </View>
        <View style={Styles.viewDivider} />
        {book.volumeInfo.description && <Text style={[Styles.text15, Styles.textLightText]}>{book.volumeInfo.description.replace(/<br>/g, '\n')}</Text>}
        <View style={Styles.viewDivider15} />
        <BookDetails book={book} />
      </ScrollView>
    </Screen>
  }
}
