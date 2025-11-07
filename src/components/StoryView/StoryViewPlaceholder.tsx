import React from 'react';
import {View, StyleSheet} from 'react-native';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {dp} from '@utils/dp.ts';

const StoryViewPlaceholder = () => {
  return (
    <View style={styles.container}>
      <SkeletonPlaceholder borderRadius={10}>
        <View style={styles.placeholderRow}>
          {/* Render 3 rectangles of size 104x104 pixels */}
          {[...Array(3)].map((_, index) => (
            <View key={index} style={styles.rectangle} />
          ))}
        </View>
      </SkeletonPlaceholder>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  placeholderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rectangle: {
    width: dp(85), // Fixed width for the rectangle
    height: dp(85), // Fixed height for the rectangle
    marginRight: dp(16), // Space between placeholders
    borderRadius: dp(10), // Slightly rounded corners
  },
});

export {StoryViewPlaceholder};
