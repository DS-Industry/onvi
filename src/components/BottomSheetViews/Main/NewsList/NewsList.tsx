import {getNewsList} from '@services/api/news';
import {useInfiniteScroll} from '@hooks/useInfiniteScroll';
import PressableCard from '@components/PressableCard/PressableCard';
import {navigateBottomSheet} from '@navigators/BottomSheetStack';
import {FlatList, View, Image, ActivityIndicator} from 'react-native';
import {dp} from '@utils/dp';

const PAGE_SIZE = 4;

const NewsList = () => {
  const {data, isLoadingInitialData, isLoadingMore, loadMore} =
    useInfiniteScroll({
      fetcher: (page, pageSize) => getNewsList('*', page, pageSize),
      pageSize: PAGE_SIZE,
    });

  // const renderItem = ({item}) => (
  //   <PressableCard
  //     width="48%"
  //     aspectRatio={1}
  //     borderRadius={dp(23)}
  //     overflow="hidden"
  //     onPress={() => navigateBottomSheet('Post', {data: item})}>
  //     <Image
  //       source={{
  //         uri:
  //           item.attributes.vertical_image?.data?.attributes?.url ||
  //           item.attributes.horizontal_image?.data?.attributes?.url,
  //       }}
  //       style={{width: '100%', height: '100%'}}
  //       resizeMode="cover"
  //     />
  //   </PressableCard>
  // );

  const renderFooter = () => {
    if (!isLoadingMore) {
      return null;
    }
    return (
      <View style={{padding: dp(20)}}>
        <ActivityIndicator size="large" color="#0000FF" />
      </View>
    );
  };

  return (
    <>
      {isLoadingInitialData ? (
        <ActivityIndicator size="large" color="#0000FF" />
      ) : (
        <>f</>
        // <FlatList
        //   data={data}
        //   renderItem={renderItem}
        //   keyExtractor={(item, index) => String(item.id || index)}
        //   numColumns={2}
        //   columnWrapperStyle={{gap: dp(11)}}
        //   scrollEnabled={false}
        //   onEndReached={loadMore}
        //   onEndReachedThreshold={0.5}
        //   ListFooterComponent={renderFooter}
        //   contentContainerStyle={{paddingTop: dp(12), paddingBottom: dp(40)}}
        //   ItemSeparatorComponent={() => <View style={{height: dp(11)}} />}
        // />
      )}
    </>
  );
};

export {NewsList};
