import React, { Component } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
  Image,
  TouchableOpacity,
  Text,
  AsyncStorage
} from "react-native";

import api from "../svcs/api";

import logo from "../assets/logo.png";
import styled from "styled-components/native";

const StyledView = styled.KeyboardAvoidingView`
  padding: 30px;
  flex: 1;
  background-color: #f5f5f5;
  justify-content: center;
  align-items: center;
`;
const StyledView2 = styled.View`
  justify-content: center;
  align-items: center;
  padding-bottom: 10%;
  width: 100%;
`;

const StyledTextInput = styled.TextInput`
  background: white;
  border: 1px solid #ddd;
  padding: 10px 20px;
  border-radius: 5px;
  align-self: stretch;
  text-align: center;
  margin: 10% 0 5% 0;
  font-size: 16px;
  height: 46px;
  color: #667;
`;
const StyledText = styled.Text`
  color: white;
  font-size: 16px;
`;

const Button = styled.TouchableOpacity`
  border: none;
  color: white;
  letter-spacing: 1px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #df4723;
  font-size: 16px;
  border-radius: 5px;
  align-self: stretch;
  height: 46px;
`;

export default class Login extends Component {
  constructor() {
    super();
    this.state = { user: "lucas" };
  }
  componentDidMount() {
    AsyncStorage.getItem("user").then(user => {
      console.log(user)
      if (user) this.props.navigation.navigate("Main", {
        itemId: user
      });
    });
  }
  handleLogin() {
    api.post("/devs", { username: this.state.user }).then(async res => {
      console.log(res.data._id)
      await AsyncStorage.setItem("user", res.data._id);
      this.props.navigation.navigate("Main", {
        itemId: res.data._id
      });
    });
  }
  render() {
    return (
      <StyledView behavior="padding" enabled={Platform.OS === "ios"}>
        <StyledView2>
          <Image source={logo} />
          <StyledTextInput
            autoCapitalize="none"
            autoCorrect={false}
            value={this.state.user}
            onChangeText={user => this.setState({ user })}
            placeholderTextColor="#aaa"
            placeholder="Digite seu usuário do Github"
          />
          <Button onPress={this.handleLogin.bind(this)}>
            <StyledText>Entrar</StyledText>
          </Button>
        </StyledView2>
      </StyledView>
    );
  }
}
