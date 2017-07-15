import React, {Component} from 'react';
import {ActivityIndicator, FlatList} from 'react-native';
import {ListItem, List, ListView} from 'react-native-elements';
import {firebaseApp} from './App';
import TabBar from './Tab';
import { Container, Header, Title, Content, Footer, FooterTab, Button, Left, Right, Body, Icon} from 'native-base';
import Edit from './EditPage';

export default class MyEventsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      loading: true,
      viewEdit: false,
      curItem: null,
    };
    this.itemsRef = firebaseApp.database().ref().child('items');
    console.ignoredYellowBox = ['Setting a timer'];
  }

  // manages whether to display edit page or not
  onViewMyEvent = (item) => {
    this.setState({
      viewEdit: true,
      curItem: item,
    })
  };

  goBack = () => {
    this.setState({
      viewEdit: false
    })
  }

  listenForItems(itemsRef) {
    itemsRef.on('value', (snap) => {
      // get children as an array
      var items = [];
      snap.forEach((parent) => {
        parent.forEach((child) => {
        items.push({
          "key": child.key,
          "name": child.val().name,
          "startTime": child.val().startTime,
          "endTime": child.val().endTime,
          "date": parent.key,
          "who": child.val().who,
          "where": child.val().where,
          "what": child.val().what
        });
      });

      });
      this.setState({
        data: items,
        loading: false
      });
    });
  }

  // autoupdates on new event
  componentDidMount() {
    this.listenForItems(this.itemsRef);
  }

  // removes listener
  componentWillUnmount() {
    this.itemsRef.off();
  }

  render() {
    var styles = require('./Styles');
    if(!this.state.viewEdit) {
    const {navigate} = this.props.navigation;
    return (
      <Container>
        <Header>
          <Body>
          <Title>My Events</Title>
          </Body>
        </Header>
        <Content style={{backgroundColor: 'white'}}>
          {this.state.loading && <ActivityIndicator size="large" style={{marginTop: 200}}/>}
            {!this.state.loading && <FlatList data={this.state.data} renderItem={({item}) =>
              <ListItem style={styles.item} title={item.name} subtitle={item.startTime} containerStyle={{
              borderBottomWidth: 0
            }} onPress={() => this.onViewMyEvent(item)}/>} keyExtractor={(item) => item.key}/>}
        </Content>
      </Container>
    );
  }
  else {
    return(
    <Edit goBack={this.goBack} item={this.state.curItem}/>
   );
  }
 }
}
