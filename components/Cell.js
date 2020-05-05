import React, { Component } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';

import Images from './../assets/Images';

export default class Cell extends Component {
  constructor(props) {
    super(props);
    this.state = {
      revealed: false,
      isMine: Math.random() < 0.2,
      neighbors: null,
    };
  }
  revealWithoutCallback = () => {
    if (this.state.revealed) {
      return;
    }
    this.setState({
      revealed: true
    })
  }
  onReveal = (userInitiated) => {
    if (this.state.revealed) {
      return;
    }
    if (!userInitiated && this.state.isMine) {
      return;
    }
    
    this.setState({
      revealed: true
    }, () => {
      if (this.state.isMine) {
        this.props.onLose();
      } else {
        this.props.onUpdate();
        this.props.onReveal(this.props.x, this.props.y);
      }
    });
  }
  reset = () => {
    this.setState({
      revealed: false,
      isMine: Math.random() < 0.2,
      neighbors: null
    });
  }
  render() {
    const { width, height } = this.props;
    const { revealed, isMine, neighbors } = this.state;
    if (!revealed) {
      return (
        <TouchableOpacity 
          onPress={() => {
            this.onReveal(true);}
          }
        >
          <View style={[styles.cell, {
            width,
            height,
          }]}>

          </View>
        </TouchableOpacity>
      );
    } else {
      let content = null;
      if (isMine) {
        content = (<Image source={Images.mine}
          style={{
            width: width / 2,
            height: height / 2
          }}
          resizeMode="contain" />)
      } else if (neighbors) {
        content = <Text>{neighbors}</Text>
      }
      return (
        <View style={[styles.cellRevealed, {
          width,
          height,
        }]}>
          {content}
        </View>
      );
    }
  }
}
const styles = StyleSheet.create({
  cell: {
    backgroundColor: '#bdbdbd',
    borderWidth: 3,
    borderTopColor: '#ffffff',
    borderLeftColor: '#ffffff',
    borderRightColor: '#7d7d7d',
    borderBottomColor: '#7d7d7d'
  },
  cellRevealed: {
    backgroundColor: '#bdbdbd',
    borderWidth: 1,
    borderColor: '#7d7d7d',
    alignItems: 'center',
    justifyContent: 'center',
  }
})
