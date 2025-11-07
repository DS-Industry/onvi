import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import {View, StyleSheet} from 'react-native';
import {dp} from '../../../utils/dp';

export default function CampaignPlaceholder() {
  return (
    <SkeletonPlaceholder borderRadius={4}>
      <View>
        <SkeletonPlaceholder.Item style={styles.firstItem} />
        <SkeletonPlaceholder.Item style={styles.secondItem} />
      </View>
    </SkeletonPlaceholder>
  );
}

const styles = StyleSheet.create({
  firstItem: {
    marginTop: dp(30),
    width: '100%',
    height: dp(150),
    borderRadius: dp(25),
    alignSelf: 'center',
    marginBottom: dp(10),
  },
  secondItem: {
    width: '100%',
    height: dp(80),
    borderRadius: dp(10),
    alignSelf: 'center',
    marginBottom: dp(10),
  },
});
