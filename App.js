import React, { Component } from 'react';
import { StyleSheet, Animated, Easing,Text, View, Button, Dimensions } from 'react-native';

import Constants from './constants/Constants';
import Cell from './components/Cell'

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FDB822'
  },
  button: {
    width: '70%',
  },
  viewContainer: {
    opacity: 0.8,
    alignItems: 'center',
    width: Constants.BOARD_SIZE*Constants.CELL_SIZE < 120 ? 120: Constants.BOARD_SIZE*Constants.CELL_SIZE,
    height: Constants.BOARD_SIZE*Constants.CELL_SIZE < 120 ? 120: Constants.BOARD_SIZE*Constants.CELL_SIZE,
    backgroundColor: "#61dafb",
    position: "absolute",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 10,
    marginBottom: 30,
    textAlign: "center",
  },
  mainContainer: {
    flex: 2,
    justifyContent: "flex-start",
    alignItems: "center"
  },
});

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showPopup: false,
      gameResult: '',
    };
    
    this.viewTranslateYValue = new Animated.Value(0);
    this.viewScaleValue = new Animated.Value(0);
    
    this.numBombs =0;
    this.numopenedCells =0;
    this.numUnopenedCells = Constants.BOARD_SIZE* Constants.BOARD_SIZE - this.numopenedCells;
    
    this.boardWidth = Constants.CELL_SIZE * Constants.BOARD_SIZE;
    this.grid = Array(Constants.BOARD_SIZE).fill(null).map((el, index) => {
      return Array(Constants.BOARD_SIZE).fill(null).map((el, index) => {
        return null;
      });
    });
  }
  
  animate = ()=>{
    this.viewTranslateYValue.setValue(0);
    this.viewScaleValue.setValue(0);
    Animated.parallel([
      Animated.timing(this.viewTranslateYValue, {
        toValue: 1,
        duration: 1000,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(this.viewScaleValue, {
        toValue: 2,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ]).start();    
  }
  onUpdate = () => {
    this.numBombs = 0;
    for (let i = 0; i < Constants.BOARD_SIZE; i++) {
      for (let j = 0; j < Constants.BOARD_SIZE; j++) {
        if (this.grid[i][j].state && this.grid[i][j].state.isMine) {
          this.numBombs++;
        }
      }
    }
    this.numopenedCells++;
    this.numUnopenedCells = Constants.BOARD_SIZE * Constants.BOARD_SIZE - this.numopenedCells;
    if (this.numUnopenedCells === this.numBombs) {
      // console.warn('WIN onUpdate numBombs ===  numUnopenedCells');
      this.onWin();
    }
  }
  
  onWin = () => {
    // console.warn('You Win ');
    this.setState({
      showPopup:true,
      gameResult:'You Win',
    });
    
    for (let i = 0; i < Constants.BOARD_SIZE; i++) {
      for (let j = 0; j < Constants.BOARD_SIZE; j++) {
        this.grid[i][j].revealWithoutCallback();
      }
    }
    this.animate();
  }
  
  onLose = () => {
    // console.warn('You Lose!');
    this.setState({
      showPopup: true,
      gameResult: 'You Lose',
    });
    
    for (let i = 0; i < Constants.BOARD_SIZE; i++) {
      for (let j = 0; j < Constants.BOARD_SIZE; j++) {
        this.grid[i][j].revealWithoutCallback();
      }
    }
    this.animate();
  }
  revealNeighbors = (x, y) => {
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if ((i !== 0 || j !== 0) && x + i >= 0 && x + i <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1) {
          this.grid[x + i][y + j].onReveal(false);
        }
      }
    }
  };
  onReveal = (x, y) => {
    let neighbors = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (x + i >= 0 && x + i <= Constants.BOARD_SIZE - 1 && y + j >= 0 && y + j <= Constants.BOARD_SIZE - 1) {
          if (this.grid[x + i][y + j] && this.grid[x + i][y + j].hasOwnProperty('state') && this.grid[x + i][y + j].state.isMine) {
            neighbors++;
          }
        }
      }
    }
    if (neighbors) {
      this.grid[x][y].setState({
        neighbors: neighbors
      });
    } else {
      this.revealNeighbors(x, y);
    }
  }
  
  renderGameBoard = () => {
    return Array(Constants.BOARD_SIZE).fill(0).map((el, rowIndex) => {
      let cellList = Array(Constants.BOARD_SIZE).fill(0).map((el, colIndex) => {
        return <Cell
          onReveal={this.onReveal}
          onLose={this.onLose}
          onWin={this.onWin}
          onUpdate={this.onUpdate}
          key={colIndex}
          width={Constants.CELL_SIZE}
          height={Constants.CELL_SIZE}
          x={colIndex}
          y={rowIndex}
          ref={(ref) => {
            this.grid[colIndex][rowIndex] = ref
          }} />
      });
      
      return <View key={rowIndex}
        style={{
          width: this.boardWidth,
          height: Constants.CELL_SIZE,
          flexDirection: 'row'
        }}>
        {cellList}
      </View>
    });
  }
  onResetGame = () => {
    this.numBombs = 0;
    this.numopenedCells = 0;
    this.numUnopenedCells = Constants.BOARD_SIZE * Constants.BOARD_SIZE - this.numopenedCells;
    // console.warn('onResetGame numopenedCells ', this.numopenedCells);
    // console.warn('onResetGame numUnopenedCells ', this.numUnopenedCells);
    
    this.setState({
      showPopup: false,
    })
    
    for (let i = 0; i < Constants.BOARD_SIZE; i++) {
      for (let j = 0; j < Constants.BOARD_SIZE; j++) {
        this.grid[i][j].reset();
      }
    }
    
  }
  render() {
    const { showPopup , gameResult} = this.state;
    
    const viewMoveY = this.viewTranslateYValue.interpolate({
      inputRange:  [0,  1],
      outputRange: [height,  -0.5]
    });
    const viewScale = this.viewScaleValue.interpolate({
      inputRange:  [0, 1, 1.1, 2],
      outputRange: [1, 1, 1.4, 1]
    });
    const viewTransformStyle = {
      transform: [{ translateY: viewMoveY }, { scale: viewScale }]
    };
    
    return (
      <View style={styles.container}>
        <View style={{
          width: this.boardWidth,
          height: this.boardWidth,
          backgroundColor: '#888888',
          flexDirection: 'column'
        }}>
          {this.renderGameBoard()}
          
          { showPopup &&
            <Animated.View style={[styles.viewContainer, viewTransformStyle]} >
              <Text style={styles.title}>{gameResult}</Text>
              <Button style={{width: this.boardWidth}} title={`Retry`} onPress={() => {
                this.onResetGame();
              }}/>
            </Animated.View>
          }
          
        </View>
      </View>
    );
  }
}

