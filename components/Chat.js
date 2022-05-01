import { GiftedChat, Bubble } from 'react-native-gifted-chat';
import React from 'react';
import { View, Platform, KeyboardAvoidingView } from 'react-native';


export default class Chat extends React.Component {
  constructor() {
    super();
    this.state= {
      messages: [],
    }
  }

  componentDidMount() {
    //const to set the 'name' for the individualized texts to the entered username from the "start.js"
    const name = this.props.route.params.name;

    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello ' + name + ', long time no see!',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        //system message appearing when the user enters the chatroom
        {
          _id: 2,
          text: name + ' has joined the chat!',
          createdAt: new Date(),
          system: true,
         },
      ],
    })
  }

  //function to add new messages to the state
  onSend(messages = []) {
    this.setState((previousState) => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  //renders the chat bubbles
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
        user={{ _id: 1 }}
      />
      {/* using "KeyboardAvoidingView" to fix the keyboard on android phones - on iOS, nothing happens */}
      { Platform.OS === 'android' ? <KeyboardAvoidingView behavior="height" /> : null }
      </View>
    );
  }
}
