import React, {createContext , useReducer} from "react";
import api from "./api";

import { getAuthKey } from "../util/";


const Context = createContext({
  data: {},
  status: 0,
  setData: () => {},
});

export default {
  Context,

  read: () => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      user.account = user.username;

      return user;
    } catch (error) {
      return null;
    }
  },

  login: (params) =>
    api.post("newpwa/center.php/index.php", {
      submit_type: "login",
      auth: getAuthKey(),
      ...params,
    }),

  logout: () => {
    return new Promise((resolve, reject) => {
      localStorage.removeItem("user");
      localStorage.removeItem("avatar");

      resolve();
    });
  },

  session: (params) =>
    api.post("newpwa/ajax_data.php/index.php", {
      type: "get_memberinfo",
      auth: getAuthKey(),
      ...params,
    }),

  create: (params) =>
    api.post("newpwa/center.php/index.php", {
      submit_type: "regist",
      auth: getAuthKey(),
      ...params,
    }),

  update: (params) =>
    api.post("newpwa/ajax_data.php/index.php", {
      type: "change_information",
      auth: getAuthKey(),
      ...params,
    }),

  updatePassword: (params) =>
    api.post("newpwa/center.php/index.php", {
      submit_type: "change_password",
      auth: getAuthKey(),
      ...params,
    }),

  retrievePassword: (params) =>
    api.post("newpwa/ajax_datav2.php", {
      auth: getAuthKey(),
      type: 'retrieve_password',
      ...params,
    }),

  setFundsPassword: (params) =>
    api.post("newpwa/center.php/index.php", {
      submit_type: "set_moneypwd",
      auth: getAuthKey(),
      ...params,
    }),

  withdraw: (params) =>
    api.post("newpwa/center.php/index.php", {
      submit_type: "debit",
      auth: getAuthKey(),
      ...params,
    }),

  withdrawCancel(params) {
    return api.post("newpwa/ajax_data.php/index.php", {
      auth: getAuthKey(),
      type: "cancel_debit",
      ...this.read(),
      ...params,
    });
  },

  mobileVerification: (params) =>
    api.post("newpwa/ajax_data.php/index.php", {
      auth: getAuthKey(),
      ...params,
    }),

  uploadImage: (params) => api.post("newpwa/ajax_data.php/index.php", params),

  vipLevel: (params) =>
    api.post("newpwa/ajax_data.php/index.php", {
      type: "get_vip_level",
      auth: getAuthKey(),
      ...params,
    }),

  referralGift: (params) =>
    api.post("newpwa/action.php/", {
      auth: getAuthKey(),
      ...params,
    }),

  collection: (params) =>
    api.post("newpwa/ajax_data.php/index.php", {
      type: "washcodeself_list",
      auth: getAuthKey(),
      ...params,
    }),

  receiveBonus: (params) =>
    api.post("newpwa/ajax_data.php/index.php", {
      type: "washcodeself_receive",
      auth: getAuthKey(),
      ...params,
    }),
};
