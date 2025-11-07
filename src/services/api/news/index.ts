import {
  NewsPost,
  NewsPostSuccessRequestPayload,
  PaginatedResponse,
} from '../../../types/api/app/types.ts';
import {contentApiInstance} from '@services/api/axiosConfig.ts';

const PAGE = 1;
const PAGE_SIZE = 4;

enum NEWS {
  GET_NEWS_LIST = 'api/posts',
  GET_NEWS_BY_ID = 'api/posts',
}

export async function getNewsList(
  populate: Record<string, any> | '*' = {},
  page: number = PAGE,
  pageSize: number = PAGE_SIZE,
): Promise<PaginatedResponse<NewsPost>> {
  const params: Record<string, any> = {
    'pagination[page]': page,
    'pagination[pageSize]': pageSize,
  };

  if (populate === '*') {
    // If user wants to populate everything
    params.populate = '*';
  } else {
    // Dynamically add specific populate fields
    for (const [key, value] of Object.entries(populate)) {
      params[`populate[${key}]`] = value;
    }
  }

  const response = await contentApiInstance.get<{
    data: NewsPost[];
    meta: {pagination: any};
  }>(NEWS.GET_NEWS_LIST, {params});

  return {
    data: response.data.data,
    meta: response.data.meta,
  };
}

export async function getNewsById(
  id: number,
  populate: Record<string, any> | '*' = {},
): Promise<NewsPost> {
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

  const response = await contentApiInstance.get<NewsPostSuccessRequestPayload>(
    NEWS.GET_NEWS_BY_ID + `/${id}`,
    {params},
  );

  return response.data.data;
}
