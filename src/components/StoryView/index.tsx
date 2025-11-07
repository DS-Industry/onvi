import React, {useEffect, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
// import {MultiStoryContainer} from 'react-native-story-view';
import {dp} from '@utils/dp.ts';
import {UserStoriesList} from '../../types/Stories.ts';
import {X} from 'react-native-feather';

// Get screen dimensions for full-screen stories
const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface StoryViewProps {
  stories: UserStoriesList;
}

const StoryView: React.FC<StoryViewProps> = ({stories}) => {
  const [isStoryViewVisible, setIsStoryViewVisible] = useState(false);
  const [pressedIndex, setPressedIndex] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [_, setLoadedImages] = useState<Record<string, boolean>>({});

  const openStories = (index: number) => {
    if (!loading) {
      setIsStoryViewVisible(true);
      setPressedIndex(index);
    }
  };

  // Pre-cache story images to ensure they display properly
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = stories.flatMap(userStory =>
        userStory.stories.map(async story => {
          if (story.type === 'image' && story.url) {
            try {
              // Mark this image URL as loaded
              setLoadedImages(prev => ({
                ...prev,
                [story.url]: true,
              }));
              return true;
            } catch (error) {
              return false;
            }
          }
          return true;
        }),
      );

      await Promise.all(imagePromises);
      setLoading(false);
    };

    // Start preloading and set a timeout fallback
    preloadImages();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000); // Fallback in case preloading takes too long

    return () => clearTimeout(timer);
  }, [stories]);

  return (
    <View style={styles.container}>
      <FlatList
        horizontal
        data={stories}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        keyExtractor={item => item?.id?.toString()}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() => openStories(index)}
            disabled={loading}
            activeOpacity={0.8}
            style={[
              styles.storyThumbnailContainer,
              {opacity: loading ? 0.5 : 1},
            ]}>
            <Image source={{uri: item.icon}} style={styles.storyThumbnail} />
          </TouchableOpacity>
        )}
      />

      {isStoryViewVisible && ( 
        <View></View>
        // <MultiStoryContainer
        //   enableProgress={true}
        //   visible={isStoryViewVisible}
        //   viewedStories={[]}
        //   stories={stories}
        //   userStoryIndex={pressedIndex}
        //   duration={5000} // Set a longer duration (5 seconds) for each story
        //   onComplete={() => setIsStoryViewVisible(false)}
        //   renderHeaderComponent={() => (
        //     <View style={styles.headerContainer}>
        //       <TouchableOpacity
        //         style={styles.closeButton}
        //         onPress={() => setIsStoryViewVisible(false)}
        //         activeOpacity={0.7}>
        //         <X stroke={'white'} width={dp(24)} height={dp(24)} />
        //       </TouchableOpacity>
        //     </View>
        //   )}
        //   renderFooterComponent={() => <View></View>}
        //   storyContainerViewProps={{
        //     style: styles.storyContainer,
        //   }}
        //   imageStyle={styles.storyImage}
        // />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingHorizontal: dp(5),
    paddingVertical: dp(5),
  },
  storyThumbnailContainer: {
    marginRight: dp(10),
    width: dp(92),
    height: dp(92),
    borderRadius: dp(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyThumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    position: 'absolute',
    top: dp(50),
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
  },
  storyImage: {
    width: screenWidth,
    height: screenHeight,
    resizeMode: 'cover',
  },
});

export {StoryView};
