import React from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  ScrollView,
  Linking,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Constants from 'expo-constants';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import Screen from '../components/Screen';
import Favorite from '../components/Favorite';
import GoogleBooksAPI from '../services/GoogleBooksAPI';
import CustomButton from '../components/CustomButton';

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

  openLink(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }
  
  reload() {
    this.setState({ loading: true });
    this.load();
  }

  render() {
    const { book } = this.state;
    let image;
    if (book.volumeInfo.imageLinks) {
      if (book.volumeInfo.imageLinks.thumbnail) image = { uri: book.volumeInfo.imageLinks.thumbnail };
      else if (book.volumeInfo.imageLinks.smallThumbnail) image = { uri: book.volumeInfo.imageLinks.smallThumbnail };
      else if (book.volumeInfo.imageLinks.small) image = { uri: book.volumeInfo.imageLinks.small };
      else if (book.volumeInfo.imageLinks.medium) image = { uri: book.volumeInfo.imageLinks.medium };
      else if (book.volumeInfo.imageLinks.large) image = { uri: book.volumeInfo.imageLinks.large };
      else if (book.volumeInfo.imageLinks.extraLarge) image = { uri: book.volumeInfo.imageLinks.extraLarge };
    }
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
        <Text style={[Styles.text18, Styles.textBold]}>Mais detalhes</Text>
        <View style={Styles.viewDivider} />
        <View style={Styles.inline}>
          {image && <Image source={image} style={{ width: width*0.3, height: width*0.45 }} />}
          <View style={{ width: 15 }} />
          <View>
            {book.saleInfo.saleability === 'NOT_FOR_SALE' && <View>
              <Text style={[Styles.text16, Styles.textBold]}>Não disponível para venda</Text>
              <View style={Styles.viewDivider5} />
            </View>}
            {book.saleInfo.saleability === 'FOR_SALE' && <View>
              <Text style={Styles.text16}>
                <Text style={Styles.textBold}>Preço: </Text>
                {book.saleInfo.listPrice.amount.toString().replace('.',',')} {book.saleInfo.listPrice.currencyCode}
              </Text>
              <View style={Styles.viewDivider5} />
            </View>}
            {book.volumeInfo.pageCount && <View>
              <Text style={Styles.text16}>
                <Text style={Styles.textBold}>Páginas: </Text>
                {book.volumeInfo.pageCount}
              </Text>
              <View style={Styles.viewDivider5} />
            </View>}
            {book.volumeInfo.averageRating !== undefined && <View style={Styles.inline}>
              <Text style={Styles.text16}>
                <Text style={Styles.textBold}>Avaliação: </Text>
                {book.volumeInfo.averageRating.toFixed(2).replace('.',',')}
              </Text>
              <View style={{ width: 2 }} />
              <Icon type='material-community' name='star' size={20} color={Colors.lightText} />
              <View style={Styles.viewDivider5} />
            </View>}
            {book.saleInfo.buyLink && <View style={[Styles.center, { width: (width*0.55)-15 }]}>
              <View style={Styles.viewDivider15} />
              <CustomButton
                width={width*0.4}
                buttonStyle={Styles.btnBorderPrimary}
                textStyle={{ color: Colors.primaryColor }}
                onPress={() => this.openLink(book.saleInfo.buyLink)}
                title='COMPRAR'
              />
            </View>}
          </View>
        </View>
      </ScrollView>
    </Screen>
  }
}
