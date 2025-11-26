import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  Dimensions,
  TouchableOpacity,
  Text,
  Animated,
  StatusBar,
  Platform,
} from 'react-native';
import {dp} from '@utils/dp.ts';
import {UserStoriesList} from '../../types/Stories.ts';
import {X} from 'react-native-feather';
import {GestureHandlerRootView, TapGestureHandler, PanGestureHandler} from 'react-native-gesture-handler';

const {width: screenWidth, height: screenHeight} = Dimensions.get('window');

interface StoryViewProps {
  stories: UserStoriesList;
  initialUserIndex?: number;
  onClose?: () => void;
  onStoryOpen?: (index: number) => void;
  isFullScreen?: boolean;
}

const StoryView: React.FC<StoryViewProps> = ({ 
  stories, 
  initialUserIndex = 0,
  onClose,
  onStoryOpen,
  isFullScreen = false
}) => {
  const [isStoryViewVisible, setIsStoryViewVisible] = useState(isFullScreen);
  const [currentUserIndex, setCurrentUserIndex] = useState(initialUserIndex);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [progressAnimations, setProgressAnimations] = useState<Animated.Value[]>([]);
  const [loading, setLoading] = useState(true);
  const [dimensions, setDimensions] = useState({width: screenWidth, height: screenHeight});
  
  const currentAnimationRef = useRef<Animated.CompositeAnimation | null>(null);
  const isHandlingTapRef = useRef(false);

  useEffect(() => {
    if (isFullScreen && stories.length > 0 && stories[initialUserIndex]) {
      initializeProgressBars(stories[initialUserIndex].stories.length);
    }
  }, [isFullScreen, stories, initialUserIndex]);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({window}) => {
      setDimensions({width: window.width, height: window.height});
    });
    return () => subscription?.remove();
  }, []);

  const openStories = (index: number) => {
    if (!loading) {
      if (!isFullScreen) {
        onStoryOpen?.(index);
      } else {
        setIsStoryViewVisible(true);
        setCurrentUserIndex(index);
        setCurrentStoryIndex(0);
        initializeProgressBars(stories[index].stories.length);
      }
    }
  };

  const initializeProgressBars = (storyCount: number) => {
    const animations = Array(storyCount).fill(0).map(() => new Animated.Value(0));
    setProgressAnimations(animations);
  };

  const startProgressAnimation = (storyIndex: number) => {
    if (currentAnimationRef.current) {
      currentAnimationRef.current.stop();
    }

    if (progressAnimations[storyIndex]) {
      // Сбрасываем прогресс для новой истории
      progressAnimations[storyIndex].setValue(0);
      
      currentAnimationRef.current = Animated.timing(progressAnimations[storyIndex], {
        toValue: 1,
        duration: 5000,
        useNativeDriver: false,
      });

      currentAnimationRef.current.start(({finished}) => {
        if (finished) {
          nextStory();
        }
        currentAnimationRef.current = null;
      });
    }
  };

  const stopCurrentAnimation = () => {
    if (currentAnimationRef.current) {
      currentAnimationRef.current.stop();
      currentAnimationRef.current = null;
    }
  };

  const nextStory = () => {
    if (isHandlingTapRef.current) return;
    isHandlingTapRef.current = true;
    
    stopCurrentAnimation();
    
    const currentUser = stories[currentUserIndex];
    if (!currentUser) {
      isHandlingTapRef.current = false;
      return;
    }

    // Заполняем прогресс текущей истории перед переходом
    if (progressAnimations[currentStoryIndex]) {
      progressAnimations[currentStoryIndex].setValue(1);
    }

    if (currentStoryIndex < currentUser.stories.length - 1) {
      const nextIndex = currentStoryIndex + 1;
      setCurrentStoryIndex(nextIndex);
    } else if (currentUserIndex < stories.length - 1) {
      const nextUserIndex = currentUserIndex + 1;
      setCurrentUserIndex(nextUserIndex);
      setCurrentStoryIndex(0);
    } else {
      closeStories();
    }
    
    setTimeout(() => {
      isHandlingTapRef.current = false;
    }, 300);
  };

  const previousStory = () => {
    if (isHandlingTapRef.current) return;
    isHandlingTapRef.current = true;

    // Проверяем, является ли текущая история первой в блоке
    if (currentStoryIndex === 0) {
      // Если это первая история, НЕ останавливаем анимацию и просто выходим
      setTimeout(() => {
        isHandlingTapRef.current = false;
      }, 300);
      return;
    }

    // Только если это не первая история, останавливаем анимацию и переходим
    stopCurrentAnimation();

    // Сбрасываем прогресс текущей истории перед переходом назад
    if (progressAnimations[currentStoryIndex]) {
      progressAnimations[currentStoryIndex].setValue(0);
    }

    // Переходим на предыдущую историю в текущем пользователе
    const prevIndex = currentStoryIndex - 1;
    // Сбрасываем прогресс предыдущей истории (чтобы она началась заново)
    if (progressAnimations[prevIndex]) {
      progressAnimations[prevIndex].setValue(0);
    }
    setCurrentStoryIndex(prevIndex);
    
    setTimeout(() => {
      isHandlingTapRef.current = false;
    }, 300);
  };

  const closeStories = () => {
    stopCurrentAnimation();
    setIsStoryViewVisible(false);
    setCurrentUserIndex(0);
    setCurrentStoryIndex(0);
    onClose?.();
  };

  const onTap = (event: any) => {
    const {x} = event.nativeEvent;
    
    if (isHandlingTapRef.current) return;
    
    if (x < dimensions.width / 3) {
      // Левая часть экрана - предыдущая история
      previousStory();
    } else {
      // Правая часть экрана - следующая история
      nextStory();
    }
  };

  // Обработчик клика на крестик - предотвращает всплытие события
  const handleClosePress = () => {
    closeStories();
  };

  // Автозапуск анимации при изменении текущей истории
  useEffect(() => {
    if (isStoryViewVisible && progressAnimations.length > 0 && stories[currentUserIndex]) {
      const currentUserStories = stories[currentUserIndex].stories;
      if (currentStoryIndex < currentUserStories.length) {
        startProgressAnimation(currentStoryIndex);
      }
    }
  }, [isStoryViewVisible, progressAnimations.length, currentStoryIndex, currentUserIndex]);

  // Инициализация прогресс-баров при смене пользователя
  useEffect(() => {
    if (isStoryViewVisible && stories[currentUserIndex]) {
      initializeProgressBars(stories[currentUserIndex].stories.length);
    }
  }, [currentUserIndex, isStoryViewVisible]);

  // Pre-cache story images
  useEffect(() => {
    const preloadImages = async () => {
      const imagePromises = stories.flatMap(userStory =>
        userStory.stories.map(async story => {
          if (story.type === 'image' && story.url) {
            return new Promise((resolve) => {
              Image.prefetch(story.url).then(resolve).catch(resolve);
            });
          }
          return Promise.resolve();
        }),
      );

      await Promise.all(imagePromises);
      setLoading(false);
    };

    preloadImages();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [stories]);

  const renderProgressBars = () => {
    const currentUser = stories[currentUserIndex];
    if (!currentUser) return null;

    return (
      <View style={[styles.progressContainer, {top: Platform.OS === 'ios' ? 60 : 40}]}>
        {currentUser.stories.map((_, index) => (
          <View key={index} style={styles.progressBarBackground}>
            <Animated.View
              style={[
                styles.progressBarForeground,
                {
                  width: progressAnimations[index]?.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                  }) || '0%',
                },
              ]}
            />
          </View>
        ))}
      </View>
    );
  };

  const renderCurrentStory = () => {
    const currentUser = stories[currentUserIndex];
    if (!currentUser) return null;

    const currentStory = currentUser.stories[currentStoryIndex];
    if (!currentStory) return null;

    return (
      <View style={styles.storyContent}>
        {currentStory.type === 'image' && (
          <Image
            source={{uri: currentStory.url}}
            style={[
              styles.storyImage,
              {
                width: dimensions.width,
                height: dimensions.height,
              }
            ]}
            resizeMode="cover"
          />
        )}
      </View>
    );
  };

  // Рендерим только превью, если это не полноэкранный режим и не открыт полноэкранный просмотр
  if (!isFullScreen && !isStoryViewVisible) {
    return (
      <GestureHandlerRootView style={styles.container}>
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
      </GestureHandlerRootView>
    );
  }

  // Рендерим полноэкранный режим
  return (
    <>
      <StatusBar 
        hidden={true} 
        backgroundColor="black" 
        barStyle="light-content" 
      />
      <View style={[
        styles.storyOverlay, 
        {
          width: dimensions.width,
          height: dimensions.height,
        }
      ]}>
        <PanGestureHandler
          onHandlerStateChange={({nativeEvent}) => {
            if (nativeEvent.state === 5) {
              if (nativeEvent.translationY > 100) {
                closeStories();
              }
            }
          }}>
          <TapGestureHandler 
            onHandlerStateChange={onTap}
            maxDurationMs={1000}
          >
            <View style={[
              styles.storyContainer,
              {
                width: dimensions.width,
                height: dimensions.height,
              }
            ]}>
              {renderProgressBars()}
              {renderCurrentStory()}
            </View>
          </TapGestureHandler>
        </PanGestureHandler>
        
        {/* Крестик вынесен отдельно и не находится внутри TapGestureHandler */}
        <View style={[
          styles.headerContainer,
          {top: Platform.OS === 'ios' ? 90 : 70} // Опустили крестик еще ниже
        ]}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleClosePress}
            activeOpacity={0.7}>
            <X stroke={'white'} width={dp(24)} height={dp(24)} />
          </TouchableOpacity>
        </View>
      </View>
    </>
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
    borderRadius: dp(5),
  },
  storyOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: 'black',
    zIndex: 1000,
  },
  storyContainer: {
    flex: 1,
    backgroundColor: 'black',
  },
  progressContainer: {
    flexDirection: 'row',
    position: 'absolute',
    left: dp(10),
    right: dp(10),
    height: dp(3),
    zIndex: 1001,
  },
  progressBarBackground: {
    flex: 1,
    height: dp(3),
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    marginHorizontal: dp(2),
    borderRadius: dp(1.5),
    overflow: 'hidden',
  },
  progressBarForeground: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: dp(1.5),
  },
  headerContainer: {
    position: 'absolute',
    right: dp(15),
    zIndex: 1002,
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
  storyContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  storyImage: {
    // Размеры задаются динамически через dimensions
  },
});

export {StoryView};