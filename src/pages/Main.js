/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable prettier/prettier */
import React, { Component } from "react";
import {
  SafeAreaView,
  Platform,
  View,
  Image,
  TouchableOpacity,
  Text,
  AsyncStorage
} from "react-native";

import api from "../svcs/api";
import itsamatch from "../assets/match.png";
import logo from "../assets/logo.png";
import like from "../assets/like.png";
import dislike from "../assets/dislike.png";

import styled from "styled-components/native";

import io from "socket.io-client";

const StyledView = styled.SafeAreaView`
  padding: 30px;
  flex: 1;
  background-color: #f5f5f5;
  justify-content: space-between;
  align-items: center;
`;
const Footer = styled.View`
  padding: 3% 5%;
  height: 30%;
  background-color: #fff;
  justify-content: flex-start;
  align-items: flex-start;
`;
const Name = styled.Text`
  color: #333;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 1.5%;
`;
const Bio = styled.Text`
  color: #667;
  font-size: 15px;
  line-height: 20px;
`;
const CloseMatch = styled.Text`
  margin-top: 2.5%;
  font-size: 20px;
  font-weight: bold;
  color: #fff;
`;
const NameMatch = styled.Text`
  margin-top: 2.5%;
  font-size: 32px;
  font-weight: bold;
  color: #fff;
  margin-bottom: 1%;
`;
const BioMatch = styled.Text`
  font-size: 20px;
  color: rgba(255, 255, 255, 0.8);
  width: 60%;
  text-align: center;
  margin-bottom: 1%;
`;
const Card = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  align-self: stretch;
  border-radius: 10px;
  flex: 1;
  overflow: hidden;
  shadow-color: #000;
  shadow-opacity: 0.9;
  shadow-radius: 2;
  elevation: 1;
`;
const Container = styled.View`
  align-self: stretch;
  height: 75%;
  margin-top: 10%;
`;
const MatchContainer = styled.View`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  flex-direction: column;
  justify-content: space-around;
  padding: 10% 0;
  align-items: center;
  background: rgba(0, 0, 0, 0.8);
  elevation: 2;
`;
const StyledImage = styled.Image`
  height: 70%;
`;
const Avatar = styled.Image`
  height: 200px;
  width: 200px;
  margin-top: 10%;
  border-radius: 100px;
  border: 5px solid white;
`;
const MatchImage = styled.Image`
  height: 60px;
`;
const Buttons = styled.View`
  padding: 30px 0;
  height: 15%;
  background-color: #f5f5f5;
  width: 50%;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
const Button = styled.TouchableOpacity`
  background-color: white;
  width: 50px;
  height: 50px;
  align-items: center;
  justify-content: center;
  border-radius: 25px;
  shadow-color: #000;
  shadow-opacity: 0.8;
  shadow-radius: 5;
  elevation: 2;
`;
const ButtonMatch = styled.TouchableOpacity`
  font-size: 20px;
  background: transparent;
  text-transform: uppercase;
  border: transparent;
  color: rgba(255, 255, 255, 0.8);
  text-align: center;
  margin-bottom: 1%;
  letter-spacing: 2px;
`;
const Empty = styled.Text`
  color: #667;
  font-size: 40px;
  font-weight: bold;
  margin: auto;
  text-align: center;
`;
export default class Main extends Component {
  constructor() {
    super();
    this.state = {
      users: "",
      user: "",
      match: null
    };
  }
  componentDidMount() {
    const itemId = this.props.navigation.getParam("itemId", "NO-ID");

    const socket = io("http://192.168.0.108:3333", {
      query: { user: itemId }
    });

    socket.on("match", dev => {
      console.log(dev)
      this.setState({ match: dev });
    });
    
    this.setState({ user: itemId });
    console.log(itemId);
    api
      .get("/devs", {
        headers: {
          user: itemId
        }
      })
      .then(res => {
        console.log(res.data);
        this.setState({ users: res.data });
      });
  }
  async handleLogout() {
    await AsyncStorage.clear();
    this.props.navigation.navigate("Login");
  }
  handleLike() {
    const [target, ...rest] = this.state.users;
    console.log(target._id);
    console.log(this.state.user);
    api
      .post(`/devs/${target._id}/likes`, null, {
        headers: { user: this.state.user }
      })
      .then(
        this.setState({
          users: rest
        })
      );
  }

  handleDislike() {
    const [target, ...rest] = this.state.users;
    api
      .post(`/devs/${target._id}/dislikes`, null, {
        headers: { user: this.state.user }
      })
      .then(
        this.setState({
          users: rest
        })
      );
  }
  render() {
    const renderUsers = () => {
      return this.state.users.map((user, index) => (
        <Card style={{ zIndex: this.state.users.length - index }}>
          <StyledImage
            source={{
              uri: user.avatar
            }}
          />
          <Footer>
            <Name>{user.name}</Name>
            <Bio numberOfLines={4}>{user.bio}</Bio>
          </Footer>
        </Card>
      ));
    };

    return (
      <StyledView behavior="padding" enabled={Platform.OS === "ios"}>
        <TouchableOpacity onPress={this.handleLogout.bind(this)}>
          <Image source={logo} />
        </TouchableOpacity>

        <Container>
          {this.state.users.length > 0 ? (
            renderUsers()
          ) : (
            <Empty>Nenhum dev para você curtir =(</Empty>
          )}
        </Container>
        {this.state.match && (
          <MatchContainer style={{ zIndex: 999999999999999999999 }}>
            <MatchImage source={itsamatch} alt="" />
            <Avatar
              source={{
                uri: this.state.match.avatar
              }}
            />
            <NameMatch>{this.state.match.name}</NameMatch>
            <BioMatch>{this.state.match.bio}</BioMatch>
            <ButtonMatch onPress={() => this.setState({ match: null })}>
              <CloseMatch> Fechar</CloseMatch>
            </ButtonMatch>
          </MatchContainer>
        )}
        {this.state.users.length > 0 && (
          <Buttons>
            <Button onPress={this.handleDislike.bind(this)}>
              <Image source={dislike} />
            </Button>
            <Button onPress={this.handleLike.bind(this)}>
              <Image source={like} />
            </Button>
          </Buttons>
        )}
      </StyledView>
    );
  }
}
