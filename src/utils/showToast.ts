import Toast from 'react-native-toast-message';

interface IShowToast {
  type: 'success' | 'error' | 'info';
  position?: 'top' | 'bottom';
  text1: string;
  text2: string;
}

const showToast = ({type, position, text1, text2}: IShowToast) => {
  Toast.show({
    type,
    position: position,
    text1,
    text2,
    visibilityTime: 2000,
    // Styling options
    // style: {
    //   backgroundColor: '#4CAF50', // Background color of the alerts
    //   borderRadius: 10, // Border radius of the alerts
    //   borderWidth: 1, // Border width of the alerts
    //   borderColor: '#FFF', // Border color of the alerts
    //   padding: 10, // Padding inside the alerts
    // },

    // Text styling
    text1Style: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#FFF', // Text color
    },
    text2Style: {
      fontSize: 14,
      color: '#FFF', // Text color
    },
  });
};

export {showToast};
