import { create } from "zustand";
import {
  GetEventInfo as GetEventInfoServer,
  AddGuest as AddGuestServer,
  UpdateGuest as UpdateGuestServer,
  DeleteGuest as DeleteGuestServer,
  UpdateEventStatus as UpdateEventStatusServer,
  UpdateQuizWinner as UpdateQuizWinnerServer,
} from "./serverAction";
import toast from "react-hot-toast";

const useMcaAdminStore = create((set, get) => ({
  eventInfo: null,
  setEventInfo: (info) => set({ eventInfo: info }),
  GetEventInfo: async () => {
    try {
      get().setLoading(true);
      let res = await GetEventInfoServer();
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
      const existing = get().eventInfo.guests.find((g) => g.seat === info.seat);
      if (existing) {
        throw { message: "Guest with this seat already exists" };
      }

      let res = await AddGuestServer(info);
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
        toast.success(`Added ${info.seat}, ${info.name} from ${info.brand}`);
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
      let res = await UpdateGuestServer(info);
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

  DeleteGuest: async (info) => {
    try {
      get().setLoading(true);
      let res = await DeleteGuestServer(info);
      if (res.success) {
        get().setEventInfo({
          ...get().eventInfo,
          guests: get().eventInfo.guests.filter(
            (guest) => guest.seat != info.seat && guest.name != info.name
          ),
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

  UpdateEventStatus: async (status) => {
    try {
      get().setLoading(true);
      let res = await UpdateEventStatusServer(status);
      if (res.success) {
        get().setEventInfo({
          ...get().eventInfo,
          status: status,
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

  //{ quizNo, winner }
  UpdateQuizWinner: async (info) => {
    try {
      get().setLoading(true);
      let res = await UpdateQuizWinnerServer(info);
      if (res.success) {
        get().setEventInfo({
          ...get().eventInfo,
          winner: {
            ...get().eventInfo.winner,
            [`quiz${info.quizNo}`]: info.winner,
          },
        });
        toast.success(res.message);
      } else {
        throw { message: res.message };
      }
    } catch (e) {
      toast.error(e.message);
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
