import {StoreSlice} from '../store.ts';
import {CarWash, CarWashLocation} from '../../types/api/app/types.ts';
import { CarWashWithLocation } from '@components/Map/index.tsx';

export interface PosSlice {
  posList: CarWashLocation[];
  setPosList: (values: CarWashLocation[]) => void;
  originalPosList: CarWashLocation[];
  setOriginalPosList: (values: CarWashLocation[]) => void;
  resetPosList: () => void;
  selectedPos: CarWash | null;
  setSelectedPos: (value: CarWash | null) => void;
  nearByPos: CarWashLocation | null;
  setNearByPos: (value: CarWashLocation) => void;
  carwashesList: CarWashWithLocation[];
  setCarwashesList: (values: CarWashWithLocation[]) => void;
  filteredCarwashesList: CarWashWithLocation[];
  setFilteredCarwashesList: (values: CarWashWithLocation[]) => void;
}

const createPoSSlice: StoreSlice<PosSlice> = set => ({
  posList: [],
  originalPosList: [], 
  carwashesList: [],
  filteredCarwashesList: [],
  
  setPosList: (values: any[]) =>
    set(state => {
      return {...state, posList: values};
    }),

  setOriginalPosList: (values: CarWashLocation[]) =>
    set(state => {
      return {...state, originalPosList: values};
    }),

  resetPosList: () =>
    set(state => {
      return {...state, posList: state.originalPosList};
    }),

  setCarwashesList: (values: CarWashWithLocation[]) =>
    set(state => {
      return {...state, carwashesList: values};
    }),

  setFilteredCarwashesList: (values: CarWashWithLocation[]) =>
    set(state => {
      return {...state, filteredCarwashesList: values};
    }),

  selectedPos: null,
  setSelectedPos: (value: any) =>
    set(state => ({...state, selectedPos: value})),

  nearByPos: null,
  setNearByPos: (value: any) => set(state => ({...state, nearByPos: value})),
});

export default createPoSSlice;
