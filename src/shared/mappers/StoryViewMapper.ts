import {IContentData} from '../../types/api/story-view/res/IGetStoryViewResponse.ts';
import {Story, UserStoriesList} from '../../types/Stories.ts';

export const transformContentDataToUserStories = (
  contentData: IContentData[],
): UserStoriesList => {
  return contentData.map(content => {
    const {id, attributes} = content;

    // Transform stories from IStoryAttributes to Story
    const transformedStories: Story[] = attributes.stories.data.map(story => ({
      id: story.id,
      url: story.attributes.url,
      type: story.attributes.type,
      duration: story.attributes.duration,
      isReadMore: story.attributes.isReadMore,
      storyId: story.attributes.storyId,
      showOverlay: story.attributes.showOverlay,
      link: story.attributes.link || undefined, // Ensure optional fields are included
      isSeen: false, // Set default value for isSeen (optional)
    }));

    // Return the transformed object
    return {
      id,
      username: attributes.username,
      title: attributes.title,
      profile: attributes.profile || '',
      icon: attributes.icon,
      stories: transformedStories,
    };
  });
};
