import $axios from "../services/axios";
import Auth from "../services/auth";

export default {
  state: {
    user: {},
    patientList: [],
  },
  getters: {},
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setPatientList(state, patientList) {
      state.patientList = patientList;
    },
  },
  actions: {
    async logIn({ commit }, user) {
      const { data } = await $axios.post(
        `/${user.type === "admin" ? "adminLogin" : "login"}`,
        {
          username: user.username,
          password: user.password,
        }
      );

      Auth.login(data);

      commit("setUser", data.user);
    },

    async resetPassword({ commit }, user) {
      const { data } = await $axios.post(
        `/reset-password`,
        {
          username: user.username,
          password: user.password,
        }
      );

      Auth.login(data);

      commit("setUser", data.user);
    },

    async getPatientList({ commit }) {
      const { data } = await $axios.get("/patient/all");
      commit("setPatientList", data);
    },

    async addPatient({ commit, dispatch }, patientDetails) {
      await $axios.post(`/patient/add`, { ...patientDetails });
      dispatch("getPatientList");
    },

    async updatePatient({ commit, dispatch }, patientDetails) {
      await $axios.put(`/patient/${patientDetails.id}`, { ...patientDetails });
      dispatch("getPatientList");
    },

    async removePatient({ commit, dispatch }, patientId) {
      await $axios.delete(`/patient/${patientId}`);
      dispatch("getPatientList");
    },
  },
};
