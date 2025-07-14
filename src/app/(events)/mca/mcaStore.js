import { create } from "zustand";
import { GetEventInfo } from "./serverAction";
import { getCookie, setCookie } from "@/lib/cookie";
import toast from "react-hot-toast";

const useMcaStore = create((set, get) => ({
  eventInfo: null,
  setEventInfo: (info) => set({ eventInfo: info }),
  GetEventInfo: async (seatNumber = null) => {
    try {
      get().setLoading(true);
      seatNumber = seatNumber ? seatNumber : getCookie("seatNumber");
      let res = await GetEventInfo(seatNumber);
      if (res.success) {
        get().setEventInfo(res.data);

        set((prev) => ({
          quizAnswers: {
            quiz1: Array(res.data.quiz1.length).fill(null),
            quiz2: Array(res.data.quiz2.length).fill(null),
          },
        }));

        if (res.data.me != null) {
          setCookie("seatNumber", res.data.me.seat, 1);
        }
        return true;
      } else {
        throw { message: res.message };
      }
    } catch (e) {
      console.log(e);
      toast.error(e.message);
      return false;
    } finally {
      get().setLoading(false);
    }
  },

  loading: false,
  setLoading: (bool) => set({ loading: bool }),

  showLogin: false,
  setShowLogin: (bool) => set({ showLogin: bool }),

  // ✅ Add quiz answer states
  quizAnswers: {
    quiz1: [],
    quiz2: [],
  },

  setQuizAnswer: (quizNo, index, value) =>
    set((state) => {
      const key = `quiz${quizNo}`;
      const newAnswers = [...(state.quizAnswers[key] || [])];
      newAnswers[index] = value;
      return {
        quizAnswers: {
          ...state.quizAnswers,
          [key]: newAnswers,
        },
      };
    }),
}));

export default useMcaStore;
