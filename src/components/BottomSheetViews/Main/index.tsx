import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import {useTranslation} from 'react-i18next';
import useStore from '@state/store.ts';
import {BLACK} from '@utils/colors.ts';
import {dp} from '@utils/dp.ts';
import {
  BottomSheetScrollView,
  BottomSheetScrollViewMethods,
} from '@gorhom/bottom-sheet';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {useFocusEffect} from '@react-navigation/native';
import Carousel, {
  ICarouselInstance,
  Pagination,
} from 'react-native-reanimated-carousel';
import useSWR from 'swr';
import {getCampaignList} from '@services/api/campaign';
import CampaignPlaceholder from './CampaignPlaceholder';
import {useNavStore} from '@state/useNavStore/index.ts';
import {NewCampaign, CarWashWithLocation} from '@app-types/api/app/types.ts';
import {getStoryView} from '@services/api/story-view';
import {StoryViewPlaceholder} from '@components/StoryView/StoryViewPlaceholder.tsx';
import {transformContentDataToUserStories} from '@shared/mappers/StoryViewMapper.ts';
import {StoryView} from '@components/StoryView';
// import {useCombinedTheme} from '@hooks/useCombinedTheme';
import PressableCard from '@components/PressableCard/PressableCard.tsx';
import {useSharedValue} from 'react-native-reanimated';
import {CarWashCard} from '@components/CarWashCard/CarWashCard.tsx';
import CarwashesPlaceholder from '../CarwashesPlaceholder/index.tsx';
import {NewsList} from './NewsList/NewsList.tsx';
import { useStoryView } from '@context/StoryViewContext/index.tsx';

const Main = () => {
  const {t} = useTranslation();
  const {
    bottomSheetRef,
    bottomSheetSnapPoints,
    setSelectedPos,
    setBusiness,
    pinnedCarwashes,
    originalPosList,
    loadLatestCarwashes,
  } = useStore.getState();
  const {latestCarwashesIsLoading, latestCarwashes} = useStore();
  const ref = useRef<ICarouselInstance>(null);
  const progress = useSharedValue<number>(0);
  
  const {openStoryView} = useStoryView();

  const onPressPagination = (index: number) => {
    ref.current?.scrollTo({
      count: index - progress.value,
      animated: true,
    });
  };
  
  const {setIsMainScreen} = useNavStore.getState();
  const scrollViewRef = useRef<BottomSheetScrollViewMethods>(null);
  const [latestCarwashesData, setLatestCarwashesData] = useState<CarWashWithLocation[]>([]);

  const {isLoading: campaignLoading, data: campaignData} = useSWR(
    ['getCampaignList'],
    () => getCampaignList(),
  );

  const {
    isLoading: storyLoading,
    data: storyData,
    error: storyError,
  } = useSWR(['getStoryViw'], () => getStoryView('*'));

  const paginationData = [...new Array(campaignData?.length || 0).keys()];

  useFocusEffect(
    useCallback(() => {
      setIsMainScreen(true);
      setSelectedPos(null);
      setBusiness(null);

      if (latestCarwashes.length === 0) {
        loadLatestCarwashes();
      }

      if (scrollViewRef.current) {
        scrollViewRef.current.scrollTo({y: 0, animated: false});
      }
      return () => {
        setIsMainScreen(false);
      };
    }, []),
  );

  useEffect(() => {
    if (latestCarwashes.length > 0 && originalPosList.length > 0) {
      const carwashMap = new Map();

      const carwashesList = originalPosList.flatMap(pose =>
        pose.carwashes.map(carwash => ({
          ...carwash,
          location: pose.location,
          distance: pose.distance,
        }))
      );

      carwashesList.forEach(carwash => {
        const id = Number(carwash?.id) || undefined;
          carwashMap.set(id, carwash);
      });
      
      const result: CarWashWithLocation[] = [];
      if (pinnedCarwashes && pinnedCarwashes.length > 0) {
        pinnedCarwashes.forEach(id => {
          const carwash = carwashMap.get(id);
          if (carwash) {
            result.push(carwash);
            carwashMap.delete(id);
          }
        });
      }
      latestCarwashes.forEach(id => {
        const carwash = carwashMap.get(id);
        if (carwash) {
          result.push(carwash);
        }
      });
      
      setLatestCarwashesData(result.slice(0, 3));
    }
  }, [latestCarwashes, pinnedCarwashes, originalPosList]);

  const handleCampaignItemPress = (data: NewCampaign) => {
    navigateBottomSheet('Campaign', {
      data,
    });
  };

  const renderCampaignItem = useCallback(
    ({item}: {item: NewCampaign}) => (
      <PressableCard
        unstyled
        onPress={() => handleCampaignItemPress(item)}
        style={localStyles.campaigns}>
        <Image
          source={{uri: item.mobileDisplay?.imageLink}}
          style={{
            width: dp(340),
            height: dp(190),
            resizeMode: 'cover',
            borderRadius: dp(12),
          }}
        />
      </PressableCard>
    ),
    [],
  );

  return (
    <BottomSheetScrollView
      contentContainerStyle={{
        flexGrow: 1,
        // paddingBottom: Platform.OS === 'ios' ? dp(0) : dp(40),
      }}
      ref={scrollViewRef}
      nestedScrollEnabled={false}
      scrollEnabled={true}>
      <View style={{minHeight: '100%'}}>
        <View
          style={[
            localStyles.card,
          ]}>
          <View style={localStyles.searchContainer}>
            <TouchableOpacity
              style={localStyles.searchInput}
              onPress={() => {
                navigateBottomSheet('Search', {});
                bottomSheetRef?.current?.snapToPosition(
                  bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
                );
              }}>
              <Image
                source={require('../../../assets/icons/Search.png')}
                style={{width: dp(26), height: dp(26)}}
              />
              <Text
                style={[
                  localStyles.searchText,
                  {marginLeft: dp(7), flex: 1},
                ]}>
                {t('app.main.search')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigateBottomSheet('Filters', {});
                  bottomSheetRef?.current?.snapToPosition(
                    bottomSheetSnapPoints[bottomSheetSnapPoints.length - 1],
                  );
                }}>
                <Image
                  source={require('../../../assets/icons/Settings-adjust.png')}
                  style={{width: dp(26), height: dp(26)}}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
          <View>
            <Text style={[localStyles.sectionTitle, {marginTop: dp(16)}]}>
              {t('app.latestCarwashes.latest')}
            </Text>
            {latestCarwashesIsLoading ? (
              <>
                <View style={{marginTop: dp(12)}} />
                <CarwashesPlaceholder />
              </>
            ) : (
              <>
                <View style={{marginTop: dp(12), gap: dp(8)}}>
                  {
                    latestCarwashesData.map((item, index) => (
                      <CarWashCard
                        key={index}
                        carWash={item}
                        showDistance={false}
                        longPressPinAction={true}
                        enablePinIcon={true}
                      />
                    ))
                  }
                </View>
              </>
            )}
          </View>
        </View>
        <View
          style={[
            localStyles.card,
            {
              marginTop: dp(8),
            },
          ]}>
          {storyLoading || storyError ? (
            <StoryViewPlaceholder />
          ) : (
            <>
              {storyData && (
                <StoryView
                  stories={transformContentDataToUserStories(storyData)}
                  onStoryOpen={(index) => {
                    openStoryView(transformContentDataToUserStories(storyData), index);
                  }}
                />
              )}
            </>
          )}
          <View style={localStyles.promotionsHeader}>
            <Text style={localStyles.sectionTitle}>{t('app.main.PromotionsForYou')}</Text>
          </View>
          <View style={{flex: 1, marginTop: dp(12)}}>
            {campaignLoading ? (
              <CampaignPlaceholder />
            ) : (
              <View style={{flex: 1}}>
                {campaignData && campaignData.length > 0 && (
                  <>
                    <Carousel
                      ref={ref}
                      loop
                      vertical={false}
                      width={dp(350)}
                      height={dp(200)}
                      enabled
                      autoPlay={true}
                      autoPlayInterval={3000}
                      data={campaignData}
                      pagingEnabled={true}
                      renderItem={renderCampaignItem}
                      onProgressChange={progress}
                    />
                    <Pagination.Basic
                      progress={progress}
                      data={paginationData}
                      dotStyle={{
                        backgroundColor: 'rgba(0,0,0,0.2)',
                        borderRadius: 50,
                      }}
                      activeDotStyle={{
                        backgroundColor: 'rgba(11, 104, 225, 1)',
                      }}
                      containerStyle={{gap: 5}}
                      onPress={onPressPagination}
                    />
                  </>
                )}
              </View>
            )}
          </View>
          <View>
            <Text style={[localStyles.sectionTitle, {marginTop: dp(12)}]}>
              {t('app.main.freshNews')}
            </Text>
            <NewsList />
          </View>
        </View>
      </View>
    </BottomSheetScrollView>
  );
};

const {width} = Dimensions.get('window');

const localStyles = StyleSheet.create({
  card: {
    padding: dp(16),
    borderRadius: dp(22),
    backgroundColor: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: dp(16),
  },
  searchInput: {
    flex: 1,
    backgroundColor: '#D8D9DD',
    borderRadius: dp(12),
    paddingHorizontal: dp(16),
    height: dp(45),
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchText: {
    color: '#000',
    fontSize: dp(16),
    fontWeight: '600',
    opacity: 0.15,
  },
  sectionTitle: {
    color: BLACK,
    fontSize: dp(24),
    fontWeight: '600',
  },
  promotionsHeader: {
    justifyContent: 'space-between',
  },
  campaigns: {
    width: width,
    justifyContent: 'center',
  },
  campaignBadge: {
    position: 'absolute',
    top: dp(12),
    left: dp(12),
    backgroundColor: 'rgba(11, 104, 225, 0.9)',
    paddingHorizontal: dp(12),
    paddingVertical: dp(6),
    borderRadius: dp(16),
  },
  campaignBadgeText: {
    color: 'white',
    fontSize: dp(14),
    fontWeight: '600',
  },
});

export {Main};
