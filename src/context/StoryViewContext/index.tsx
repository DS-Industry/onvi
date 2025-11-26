import { createContext, useContext } from "react";

export const StoryViewContext = createContext<{
  openStoryView: (stories: any, initialIndex: number) => void;
  closeStoryView: () => void;
}>({
  openStoryView: () => { },
  closeStoryView: () => { },
});

export const useStoryView = () => useContext(StoryViewContext);