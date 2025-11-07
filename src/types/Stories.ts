// Define a type for a single story
export type Story = {
  id: number; // Unique ID of the story
  url: string; // URL of the story content
  type: 'image' | 'video'; // Type of story (image or video)
  duration: number; // Duration of the story in milliseconds
  isReadMore: boolean; // Flag to show "read more" option
  storyId: number; // Associated story ID
  isSeen?: boolean; // Optional: Whether the story has been seen
  showOverlay?: boolean; // Optional: Whether to show an overlay
  link?: string; // Optional: Link associated with the story
};

// Define a type for a user or infraction that contains stories
export type StoryViews = {
  id: number; // Unique ID for the user or infraction
  username: string; // Username associated with the stories
  title: string; // Title for the stories (e.g., "Parked in a no-parking zone")
  profile: string; // Profile image URL
  stories: Array<Story>;
  icon: string;
};

// Define the full array type
export type UserStoriesList = Array<StoryViews>;
