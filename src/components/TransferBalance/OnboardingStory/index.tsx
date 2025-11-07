import React, {useState, useEffect} from 'react';
import {View, StyleSheet, Dimensions, TouchableOpacity} from 'react-native';
// import {MultiStoryContainer} from 'react-native-story-view';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {dp} from '@utils/dp';
import {X} from 'react-native-feather';
import {UserStoriesList} from '../../../types/Stories';

// Get device dimensions for fullscreen story
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

// Storage key for checking if user has seen the onboarding
const TRANSFER_BALANCE_ONBOARDING_KEY = 'has_seen_transfer_balance_onboarding';

// Create onboarding story content with instructions
const onboardingStories: UserStoriesList = [
  {
    id: 101,
    username: 'ONVI',
    title: 'Как перенести баланс',
    profile: '',
    icon: 'https://cdn-icons-png.flaticon.com/512/3722/3722619.png',
    stories: [
      {
        id: 13981,
        url: 'https://storage.yandexcloud.net/onvi-mobile/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8/mobile_app_how_to_transfer_balance_ru_step1.png',
        type: 'image',
        duration: 10, // 5 seconds duration
        storyId: 1,
        isReadMore: false,
      },
      {
        id: 13982,
        url: 'https://storage.yandexcloud.net/onvi-mobile/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8/mobile_app_how_to_transfer_balance_ru_step2.png',
        type: 'image',
        duration: 10,
        storyId: 2,
        isReadMore: false,
      },
      {
        id: 13983,
        url: 'https://storage.yandexcloud.net/onvi-mobile/%D0%98%D1%81%D1%82%D0%BE%D1%80%D0%B8%D0%B8/mobile_app_how_to_transfer_balance_ru_step3.png',
        type: 'image',
        duration: 10,
        storyId: 3,
        isReadMore: false,
      },
    ],
  },
];

interface OnboardingStoryProps {
  onComplete: () => void;
  isManualTrigger?: boolean; // Add prop to indicate manual trigger
}

const TransferBalanceOnboardingStory: React.FC<OnboardingStoryProps> = ({
  onComplete,
  isManualTrigger = false, // Default to false for automatic behavior
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isManualTrigger) {
      // If manually triggered, bypass the AsyncStorage check and show immediately
      setIsVisible(true);
      setLoading(false);
    } else {
      // Otherwise check if user has seen onboarding
      checkIfOnboardingNeeded();
    }
  }, [isManualTrigger]);

  const checkIfOnboardingNeeded = async () => {
    try {
      const hasSeenOnboarding = await AsyncStorage.getItem(
        TRANSFER_BALANCE_ONBOARDING_KEY,
      );
      if (hasSeenOnboarding !== 'true') {
        // User hasn't seen onboarding, show it
        setIsVisible(true);
      } else {
        // User has already seen onboarding, call onComplete
        onComplete();
      }
      setLoading(false);
    } catch (error) {
      // On error, proceed without showing onboarding
      onComplete();
      setLoading(false);
    }
  };

  const handleOnboardingComplete = async () => {
    try {
      // Only save to AsyncStorage if this is not a manual trigger
      if (!isManualTrigger) {
        await AsyncStorage.setItem(TRANSFER_BALANCE_ONBOARDING_KEY, 'true');
      }
      setIsVisible(false);
      onComplete();
    } catch (error) {
      setIsVisible(false);
      onComplete();
    }
  };

  const handleSkip = async () => {
    try {
      // Only save to AsyncStorage if this is not a manual trigger
      if (!isManualTrigger) {
        await AsyncStorage.setItem(TRANSFER_BALANCE_ONBOARDING_KEY, 'true');
      }
      setIsVisible(false);
      onComplete();
    } catch (error) {
      setIsVisible(false);
      onComplete();
    }
  };

  if (loading || !isVisible) {
    return null;
  }

  return (
    <View style={styles.container}>
      {/* <MultiStoryContainer
        enableProgress={true}
        visible={isVisible}
        viewedStories={[]}
        stories={onboardingStories}
        userStoryIndex={0}
        duration={5000}
        onComplete={handleOnboardingComplete}
        renderHeaderComponent={() => (
          <View style={styles.headerContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleSkip}
              activeOpacity={0.7}>
              <X stroke={'white'} width={dp(24)} height={dp(24)} />
            </TouchableOpacity>
          </View>
        )}
        renderFooterComponent={() => <View></View>}
        storyContainerViewProps={{
          style: styles.storyContainer,
        }}
        imageStyle={styles.storyImage}
      /> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end', // Align contents to the right
    alignItems: 'center',
    position: 'absolute',
    top: dp(50),
    left: dp(15),
    right: dp(15),
    zIndex: 999,
  },
  closeButton: {
    width: dp(36),
    height: dp(36),
    borderRadius: dp(18),
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 5,
  },
  storyContainer: {
    width: screenWidth,
    height: screenHeight,
    padding: 0,
    margin: 0,
    backgroundColor: '#000',
  },
  storyImage: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'cover',
  },
});

export default TransferBalanceOnboardingStory;
