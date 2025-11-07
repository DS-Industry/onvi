export type ScreenName =
  | 'Main'
  | 'Search'
  | 'Filters'
  | 'BusinessInfo'
  | 'Boxes'
  | 'Launch'
  | 'Notifications'
  | 'History'
  | 'Payment'
  | 'AddCard'
  | 'Post'
  | 'Campaign'
  | 'PostPayment'
  | 'PostPaymentVacuum';

export type DraggableScreensMap = {
  [key in ScreenName]: boolean;
};
