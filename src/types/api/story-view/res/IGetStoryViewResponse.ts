// Type for the entire API response
export type IGetStoryViewResponse = {
  data: IContentData[]; // Array of content data
  meta: IMeta; // Metadata for pagination
};

// Type for metadata in the response
export type IMeta = {
  pagination: {
    page: number; // Current page
    pageSize: number; // Number of items per page
    pageCount: number; // Total number of pages
    total: number; // Total number of items
  };
};

// Type for individual content in the "data" array
export type IContentData = {
  id: number; // Unique ID for the content
  attributes: IContentAttributes; // Attributes of the content
};

// Type for individual content attributes
export type IContentAttributes = {
  title: string; // Title of the content or story
  profile: string | null; // Profile image URL or null
  username: string; // Username of the content creator
  createdAt: string; // Timestamp when the content was created
  updatedAt: string; // Timestamp when the content was last updated
  publishedAt: string; // Timestamp when the content was published
  stories: IStories; // Stories associated with the content
  icon: string;
};

// Type for individual story attributes
export type IStoryAttributes = {
  url: string; // Story image or video URL
  type: 'image' | 'video'; // Type of story (image or video)
  duration: number; // Duration of the story in milliseconds
  isReadMore: boolean; // Whether "Read More" should be displayed
  storyId: number; // Unique ID for the story
  showOverlay: boolean; // Whether an overlay is shown on the story
  link: string | null; // Optional link associated with the story
  createdAt: string; // Timestamp when the story was created
  updatedAt: string; // Timestamp when the story was last updated
  publishedAt: string; // Timestamp when the story was published
};

// Type for individual story in the "stories.data" array
export type IStoryData = {
  id: number; // Unique ID for the story
  attributes: IStoryAttributes; // Attributes of the story
};

// Type for the "stories" object in a single content
export type IStories = {
  data: IStoryData[]; // Array of stories
};
