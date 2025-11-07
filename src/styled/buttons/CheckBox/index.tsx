import React, {useState} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  Text,
  TextStyle,
} from 'react-native';
import {dp} from '../../../utils/dp';

interface ICheckboxButtonProps {
  checked?: boolean;
  text?: string;
  disable?: boolean;
  height?: number;
  borderRadius?: number;
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  fontWeight?: TextStyle['fontWeight'];
  onClick: (isChecked: boolean) => void;
}

const CheckBox: React.FC<ICheckboxButtonProps> = ({
  checked = false,
  text,
  height,
  borderRadius,
  backgroundColor,
  textColor,
  fontSize,
  fontWeight,
  onClick,
  disable = false,
}) => {
  const [isChecked, setIsChecked] = useState(checked);

  const handlePress = () => {
    setIsChecked(!isChecked);
    onClick(!isChecked);
  };

  return (
    <TouchableOpacity onPress={handlePress} disabled={disable}>
      <View
        style={[
          styles.buttonContainer,
          {
            height,
            borderRadius,
            backgroundColor: isChecked ? '#BFFA00' : backgroundColor,
          },
        ]}>
        <Text
          style={{
            ...styles.text,
            fontSize,
            color: textColor,
            fontWeight,
          }}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'flex-start',
    paddingRight: dp(10),
    paddingLeft: dp(10),
  },
  text: {
    textAlign: 'center',
  },
});
export {CheckBox};
