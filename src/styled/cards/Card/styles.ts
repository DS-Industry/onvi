import {Dimensions} from 'react-native';

const styles = {
  // card skeleton
  skeleton: {
    display: 'flex',
    flex: 1,
    width: Dimensions.get('screen').width,
    backgroundColor: 'white',
    borderRadius: 3,
    marginLeft: 1,
    marginRight: 1,
  },

  // card sizes
  small: {
    height: 150,
  },
  medium: {
    height: 200,
  },
  large: {
    height: 500,
  },
  flexible: {},
};

export default styles;
