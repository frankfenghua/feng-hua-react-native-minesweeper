import { Dimensions } from 'react-native';
const Constants = {
  MAX_WIDTH: Dimensions.get('screen').width,
  MAX_HEIGHT: Dimensions.get('screen').height,
  BOARD_SIZE: 10,
  CELL_SIZE: 30
}
export default Constants;
