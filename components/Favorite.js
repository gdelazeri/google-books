import React from 'react';
import { AsyncStorage, TouchableOpacity } from 'react-native';
import { Button, Icon } from 'react-native-elements'
import Colors from '../constants/Colors'

export default class Favorite extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      favorite: false,
    }
  }

  async componentDidMount() {
    this.id = this.props.id;
    const favorites = await AsyncStorage.getItem('favorites');
    if (favorites) {
      const favoriteList = JSON.parse(favorites);
      if (favoriteList.includes(this.id)) {
        this.setState({ favorite: true });
      } else {
        this.setState({ favorite: false });
      }
    } else {
      this.setState({ favorite: false });
    }
  }

  async press() {
    const favorites = await AsyncStorage.getItem('favorites');
    let favoriteList = [];
    if (favorites) {
      favoriteList = JSON.parse(favorites);
      if (favoriteList.includes(this.id)) {
        this.setState({ favorite: false });
        favoriteList = favoriteList.filter(f => f !== this.id);
      } else {
        this.setState({ favorite: true });
        favoriteList.push(this.id);
      }
    } else {
      this.setState({ favorite: true });
      favoriteList.push(this.id);
    }
    await AsyncStorage.setItem('favorites', JSON.stringify(favoriteList));
  }

  render() {
    const { favorite } = this.state;
    return <TouchableOpacity onPress={() => this.press()}>
      <Icon type='material-community' name={favorite ? 'heart' : 'heart-outline'} size={40} color={favorite ? Colors.red : Colors.lightText} />
    </TouchableOpacity>
  }
}