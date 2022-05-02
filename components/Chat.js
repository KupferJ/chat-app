import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';
import * as firebase from "firebase/compat";
import "firebase/compat/firestore";


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
      }
    }

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

  onCollectionUpdate = (querySnapshot) => {
    const messages = [];
    //goes through each document
    querySnapshot.forEach((doc) => {
      //gets the QueryDocumentSnapshot's data
      let data = doc.data();
      messages.push({
        _id: data._id, 
        createdAt: data.createdAt.toDate(),
        text: data.text,
        user: {
          _id: data.user._id,
          name: data.user.name,
          avatar: data.user.avatar
        }
      });
    });
    this.setState({
      messages: messages
    });
  };

  componentDidMount() {
    //const to set the 'name' for the individualized texts to the entered username from the "start.js"
    const name = this.props.route.params.name;

    //firebase anonymous authentication
    this.authUnsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        firebase.auth().signInAnonymously();
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

    this.unsubscribe = this.referenceChatMessages
      .orderBy("createdAt", "desc")
      .onSnapshot(this.onCollectionUpdate);
    });
  }

  componentWillUnmount() {
    this.authUnsubscribe();
    this.unsubscribe();
  }


 //adds the messages to the database
 addMessage() {
  const message = this.state.messages[0];
  
    this.referenceChatMessages.add({
      _id: message._id,
      createdAt: message.createdAt,
      text: message.text,
      user: this.state.user
    });
  }

  //calls addMessage whenever a new message is sent
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }), () => {
      this.addMessage();
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

  render() {
    let name = this.props.route.params.name;
    this.props.navigation.setOptions({ title:name });

    const { backgroundColor } = this.props.route.params;

    return (
      <View style={{ flex:1, backgroundColor: backgroundColor }}>
      <GiftedChat
        renderBubble={this.renderBubble.bind(this)}
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
