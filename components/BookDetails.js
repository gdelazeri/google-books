import React from 'react';
import {
  Text,
  View,
  Image,
  Dimensions,
  Linking,
} from 'react-native';
import { Icon } from 'react-native-elements';
import Styles from '../constants/Styles';
import Colors from '../constants/Colors';
import CustomButton from '../components/CustomButton';

// Largura da tela
const { width } = Dimensions.get('window');

export default class BookDetails extends React.Component {
  openLink(url) {
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  }

  render() {
    const book = this.props.book;
    let image;
    if (book.volumeInfo.imageLinks) {
      if (book.volumeInfo.imageLinks.thumbnail) image = { uri: book.volumeInfo.imageLinks.thumbnail };
      else if (book.volumeInfo.imageLinks.smallThumbnail) image = { uri: book.volumeInfo.imageLinks.smallThumbnail };
      else if (book.volumeInfo.imageLinks.small) image = { uri: book.volumeInfo.imageLinks.small };
      else if (book.volumeInfo.imageLinks.medium) image = { uri: book.volumeInfo.imageLinks.medium };
      else if (book.volumeInfo.imageLinks.large) image = { uri: book.volumeInfo.imageLinks.large };
      else if (book.volumeInfo.imageLinks.extraLarge) image = { uri: book.volumeInfo.imageLinks.extraLarge };
    }
    return <View>
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
    </View>
  }
}
