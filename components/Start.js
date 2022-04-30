import React, { useEffect, useState } from 'react';
import { ImageBackground, StyleSheet, Text, TextInput, View, TouchableOpacity, Pressable } from 'react-native';
import BackgroundImage from '../assets/background-image.png';


export default class Start extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: "",
      backgroundColor: this.colors.black,
    };
  }

  changeBackgroundColor = (updatedColor) => {
    this.setState({ backgroundColor: updatedColor});
  };

  //background colors
  colors = {
    black: '#090C08',
    purple: '#474056',
    gray: '#8A95A5',
    green: '#B9C6AE'
  };

  render() {
    return (
      <View style={styles.container}>
        <ImageBackground source={ BackgroundImage } style={styles.bgImage}>
        
        <Text style={styles.title}>Chat-App</Text>
        <View style={styles.inputBox}>

        <TextInput style={styles.inputField} onChangeText={(text) => this.setState({ name: text })} value={this.state.name}
          placeholder='Your name ...'
        />
        <Text style={styles.bgText}>Choose Background Color:</Text>
          <View style={styles.colorContainer}>
            <TouchableOpacity style={styles.bgBlack} onPress={() => this.changeBackgroundColor(this.colors.black)}>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bgPurple} onPress={() => this.changeBackgroundColor(this.colors.purple)}>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bgGray} onPress={() => this.changeBackgroundColor(this.colors.gray)}>
            </TouchableOpacity>

            <TouchableOpacity style={styles.bgGreen} onPress={() => this.changeBackgroundColor(this.colors.green)}>
            </TouchableOpacity>
          </View>

          {/* Open the chatroom with username and background color as props */}
          <Pressable style={styles.button} onPress={() => this.props.navigation.navigate(
            "Chat", { name: this.state.name, backgroundColor: this.state.backgroundColor, }
            )}
          >
            <Text style={styles.buttonText}>Start Chatting</Text>
          </Pressable>
        </View>
        </ImageBackground>
      </View>
    )
  }
}

//Stylesheet
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgImage: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  title: {
    fontSize: 45,
    fontWeight: '600',
    color: '#ffffff',
  },
  inputBox: {
    width: '88%',
    backgroundColor: 'white',
    alignItems: 'center',
    height: '44%',
    justifyContent: 'space-evenly',
  },
  inputField: {
    height: 40,
    width: '88%',
    opacity: .5,
    fontSize: 16,
    fontWeight: '300',
    color: '#757083',
    borderColor: 'gray',
    borderWidth: 1,
    paddingHorizontal: 15,
  },
  bgText: {
    color: '#757083',
    fontSize: 16,
    fontWeight: '300',
  },
  colorContainer: {
    width: '88%',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  bgBlack: {
    backgroundColor: "#090C08",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bgPurple: {
    backgroundColor: "#474056",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bgGray: {
    backgroundColor: "#8A95A5",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  bgGreen: {
    backgroundColor: "#B9C6AE",
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  button: {
    width: "88%",
    marginTop: 10,
    height: 60,
    borderRadius: 5,
    backgroundColor: "#757083",
    alignItems: "center",
    justifyContent: "center",
  },

  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
})