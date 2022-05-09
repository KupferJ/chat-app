import { GiftedChat, Bubble, InputToolbar } from 'react-native-gifted-chat';
import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import * as firebase from 'firebase/compat';
import 'firebase/compat/firestore';

//to determine whether user is online or not
import NetInfo from '@react-native-community/netinfo';

//react native local storage
import AsyncStorage from "@react-native-async-storage/async-storage";

//import custom CustomActions
import CustomActions from "./CustomActions";
// import MapView from "react-native-maps";
import MapView from 'react-native-maps';

export default class Chat extends React.Component {
  constructor() {
    super();
    this.state= {
      messages: [],
      uid: 0,
      user: {
        _id: "",
        name: "",
        avatar: "",
      },
      isConnected: false,
      image: null,
      location: null,
    };

    //information for the firebase database
    const firebaseConfig = {
      apiKey: "AIzaSyD7E6hPVScUf7qvdK0tHtHfaCUTrDQS5A0",
      authDomain: "chat-app-733c8.firebaseapp.com",
      projectId: "chat-app-733c8",
      storageBucket: "chat-app-733c8.appspot.com",
      messagingSenderId: "1009050992270",
      appId: "1:1009050992270:web:d9ffc6d6cdaa8594e093df",
      measurementId: "G-4F2JLSV1TS"
    };

    if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
    }

    //refernces the database
    this.referenceChatMessages = firebase.firestore().collection("messages");
  }

  
  async getMessages() {
    let messages = '';
    try {
      messages = await AsyncStorage.getItem('messages') || [];
      this.setState({ messages: JSON.parse(messages) });  
    } catch (error) {
      console.log(error.message);
    }
  };

  async saveMessages() {
    try {
      await AsyncStorage.setItem('messages', JSON.stringify(this.state.messages));
    } catch (error) {
      console.log(error.message);
    }
  }
 
  async deleteMessages() {
   try {
     await AsyncStorage.removeItem('messages');
     this.setState({
       messages: []
     })
   } catch (error) {
     console.log(error.message);
   }
  }

  componentDidMount() {
    const name = this.props.route.params.name;
    this.getMessages();

    NetInfo.fetch().then(connection => {
      if (connection.isConnected) {
        this.setState({ isConnected: true });
        console.log('online');
        this.unsubscribe = this.referenceChatMessages
        .orderBy('createdAt', 'desc')
        .onSnapshot(this.onCollectionUpdate);
    
    //user authentication 
    this.authUnsubscribe = firebase.auth().onAuthStateChanged(async user => {
      if (!user) {
        return await firebase.auth().signInAnonymously();
      }

      this.setState({
        uid: user.uid,
        messages: [],
        user: {
          _id: user.uid,
          name: name,
          avatar: "https://placeimg.com/140/140/any"
        }
      });

      
      //referencing the messages of the current user
      this.refMsgsUser = firebase
        .firestore()
        .collection('messages')
        .where('uid', '==', this.state.uid);
      });
      //when user is online
      this.saveMessages();
    } else {
      //when user is offline
      this.setState({ isConnected: false });
      console.log('offline');
      this.getMessages();
    }  
    });
  }

   onCollectionUpdate = QuerySnapshot => {
    const messages = [];
    // go through each document
    QuerySnapshot.forEach(doc => {
      // get the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id,
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        } ,
        image: data.image || null,
        location: data.location || null,
      });
    });
    this.setState({
      messages: messages,
    });
    this.saveMessages();
  };

  componentWillUnmount() {
    NetInfo.fetch().then((connection) => {
      if (connection.isConnected) {
        this.unsubscribe();
        this.authUnsubscribe();
      }
    })
    
  }
   //adds the messages to the database
  addMessages() {
    const message = this.state.messages[0];

    this.referenceChatMessages.add({
      uid: this.state.uid,
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text || "",
      user: this.state.user,
      image: message.image || "",
      location: message.location || null,
    });
  }

  //calls addMessage whenever a new message is sent
  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessages();
      this.saveMessages();
    })
  }

  //renders the chat bubbles (for individualization of the bubble colors)
  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#adc8f5',
          },
          right: {
            backgroundColor: '#57ce5b',
          }
        }}
      />
    )
  }

  //remove input toolbar when offline
  renderInputToolbar(props) {
    if (this.state.isConnected == false) {
    } else {
      return(
        <InputToolbar
        {...props}
        />
      );
    }
  }
  renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  }
  //custom map view
  renderCustomView(props) {
    const { currentMessage } = props;
    if (currentMessage.location) {
      return (
        <MapView
          style={{ width: 150, height: 100, borderRadius: 13, margin: 3 }}
          region={{
            latitude: currentMessage.location.latitude,
            longitude: currentMessage.location.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        />
      );
    }
    return null;
  }

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title:name });

    const { backgroundColor } = this.props.route.params;

    return (
      <View style={{ flex:1, backgroundColor: backgroundColor }}>
      <GiftedChat
        renderInputToolbar={this.renderInputToolbar.bind(this)}
        renderBubble={this.renderBubble.bind(this)}
        renderActions={this.renderCustomActions}
        renderCustomView={this.renderCustomView}
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        user={{
          _id: this.state.user._id,
          name: this.state.name,
          avatar: this.state.user.avatar,
        }}
      />
      {/* using "KeyboardAvoidingView" to fix the keyboard on android phones - on iOS, nothing happens */}
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}
