import {StoreSlice} from '../store.ts';
import {CarWash, CarWashLocation} from '../../types/api/app/types.ts';

export interface PosSlice {
  posList: CarWashLocation[];
  setPosList: (values: CarWashLocation[]) => void;
  selectedPos: CarWash | null;
  setSelectedPos: (value: CarWash | null) => void;
  nearByPos: CarWashLocation | null;
  setNearByPos: (value: CarWashLocation) => void;
}

const createPoSSlice: StoreSlice<PosSlice> = set => ({
  posList: [],
  setPosList: (values: any[]) =>
    set(state => {
      return {...state, posList: values};
    }),

  selectedPos: null,
  setSelectedPos: (value: any) =>
    set(state => ({...state, selectedPos: value})),

  nearByPos: null,
  setNearByPos: (value: any) => set(state => ({...state, nearByPos: value})),
});

export default createPoSSlice;
