import React from 'react';
import {
  TouchableOpacity,
  Text,
  View,
  StyleSheet,
  StyleProp,
  TextStyle,
} from 'react-native';
import {horizontalScale, moderateScale, verticalScale} from '@utils/metrics.ts';

interface ITile {
  label: string;
  description?: string;
  labelStyles?: StyleProp<TextStyle>;
  descriptionStyles?: StyleProp<TextStyle>;
  labelFontSize?: number; // New prop for label font size
  descriptionFontSize?: number; // New prop for description font size
  onClick?: () => void;
  disabled?: boolean;
  active: boolean;
  width?: number;
  height?: number;
  borderRadius?: number;
}

const Tile: React.FC<ITile> = ({
  label = '',
  description = '',
  onClick = () => null,
  disabled = false,
  active = false,
  width = horizontalScale(92),
  height = verticalScale(92),
  borderRadius = moderateScale(21),
  labelFontSize = moderateScale(18),
  descriptionFontSize = moderateScale(12),
  labelStyles = {},
  descriptionStyles = {},
}) => {
  return (
    <TouchableOpacity
      onPress={onClick}
      disabled={disabled}
      style={[
        styles.tile,
        active ? styles.active : styles.inactive,
        {width, height, borderRadius},
      ]}>
      <View style={styles.content}>
        <Text style={[styles.label, {fontSize: labelFontSize}, labelStyles]}>
          {label}
        </Text>
        {description && (
          <Text
            style={[
              styles.description,
              {fontSize: descriptionFontSize},
              descriptionStyles,
            ]}>
            {description}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );
};

export {Tile};

// Styles
const styles = StyleSheet.create({
  tile: {
    margin: moderateScale(8),
    justifyContent: 'center',
    alignItems: 'center',
    padding: moderateScale(10),
  },
  active: {
    backgroundColor: 'rgba(191, 250, 0, 1)', // Active background
  },
  inactive: {
    backgroundColor: 'rgba(245, 245, 245, 1)', // Inactive background
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontWeight: '700',
    color: '#000',
    textAlign: 'center',
  },
  description: {
    fontWeight: '500',
    color: '#000',
    textAlign: 'center',
    marginTop: moderateScale(5),
  },
});
