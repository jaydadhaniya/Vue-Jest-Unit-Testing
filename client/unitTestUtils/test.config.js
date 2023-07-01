/* eslint-disable no-console */
import Vue from 'vue';
import Antd from "ant-design-vue";

Vue.use(Antd);

// Log unhandled rejections and retrow to make test run fail
process.on('unhandledRejection', error => {
  console.error(error);
  // throw error;
});
