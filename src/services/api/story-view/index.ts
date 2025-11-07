import {
  IContentData,
  IGetStoryViewResponse,
} from '../../../types/api/story-view/res/IGetStoryViewResponse.ts';
import {contentApiInstance} from '@services/api/axiosConfig.ts';

enum STORYVIEW {
  GET_STORY_VIEW = 'api/story-views',
}

export async function getStoryView(
  populate: Record<string, any> | '*' = {},
): Promise<IContentData[]> {
  const params: Record<string, any> = {};

  if (populate === '*') {
    // If user wants to populate everything
    params.populate = '*';
  } else {
    // Dynamically add specific populate fields
    for (const [key, value] of Object.entries(populate)) {
      params[`populate[${key}]`] = value;
    }
  }

  const response = await contentApiInstance.get<IGetStoryViewResponse>(
    STORYVIEW.GET_STORY_VIEW,
    {params},
  );

  return response.data.data;
}
