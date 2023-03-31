import { create } from 'zustand';

interface LocationState {
  startPoint: object;
  endPoint: object;
  setStartPoint: (data: { lng: number; lat: number }) => void;
  setEndPoint: (data: { lng: number; lat: number }) => void;
}
const useLocation = create<LocationState>()((set) => ({
  startPoint: {},
  endPoint: {},
  setStartPoint: (data) => set(() => ({ startPoint: data })),
  setEndPoint: (data) => set(() => ({ endPoint: data })),
}));

export default useLocation;
