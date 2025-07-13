import { create } from "zustand";
import { GetEventInfo, AddGuest, EditGuest } from "./serverAction";

const useMcaAdminStore = create((set, get) => ({
  eventInfo: null,
  setEventInfo: (info) => set({ eventInfo: info }),
  GetEventInfo: async () => {
    try {
      get().setLoading(true);
      let res = await GetEventInfo();
      if (res.success) {
        get().setEventInfo(res.data);
      } else {
        throw { message: res.message };
      }
    } catch (e) {
      alert(e.message);
    } finally {
      get().setLoading(false);
    }
  },

  AddGuest: async (info) => {
    try {
      get().setLoading(true);
      let res = await AddGuest(info);
      if (res.success) {
        get().setEventInfo({
          ...get().eventInfo,
          guests: [
            ...get().eventInfo.guests,
            {
              ...info,
              quiz1: null,
              quiz2: null,
            },
          ],
        });
      } else {
        throw { message: res.message };
      }
    } catch (e) {
      alert(e.message);
    } finally {
      get().setLoading(false);
    }
  },

  UpdateGuest: async (info) => {
    try {
      get().setLoading(true);
      let res = await EditGuest(info);
      if (res.success) {
      } else {
        throw { message: res.message };
      }
    } catch (e) {
      alert(e.message);
    } finally {
      get().setLoading(false);
    }
  },

  loading: false,
  setLoading: (bool) => set({ loading: bool }),

  showLogin: false,
  setShowLogin: (bool) => set({ showLogin: bool }),
}));

export default useMcaAdminStore;
