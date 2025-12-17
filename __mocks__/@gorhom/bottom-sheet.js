const React = require('react');
const { View, FlatList } = require('react-native');

function BottomSheet({ children }) {
  return React.createElement(View, null, children);
}

function BottomSheetScrollView({ children }) {
  return React.createElement(View, null, children);
}

function BottomSheetView({ children }) {
  return React.createElement(View, null, children);
}

module.exports = {
  __esModule: true,
  default: BottomSheet,
  BottomSheetScrollView,
  BottomSheetView,
  BottomSheetFlatList: FlatList,
};
