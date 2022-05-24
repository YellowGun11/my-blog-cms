// import { stringify } from 'querystring';
// import { history } from 'umi';
import { getAbout, addAbout, editAbout } from '@/services/about';
// import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'about',
  state: {
    dataList: [],
    pagination: {
      current: 1,
      pageSize: 10,
      total: 0,
    },
    detailData: {},
  },
  effects: {
    // 获取文章列表数据
    *getAboutList({ payload }, { call, put, select }) {
      const { pagination } = yield select((state) => state.about);
      const { current: preCurrent, pageSize: prePageSize } = pagination;
      let { current, pageSize } = payload;
      current = current || preCurrent;
      pageSize = pageSize || prePageSize;
      const response = yield call(getAbout, payload);
      if (response && response.code === 0) {
        const { data } = response;
        yield put({
          type: 'saveData',
          payload: {
            dataList: data.list,
            pagination: {
              current,
              pageSize,
              total: data.total,
            },
          },
        });
      } else {
        message.error(response.message);
      }
    },

    // 新增关于
    *addAboutData({ payload }, { call, put, select }) {
      const response = yield call(addAbout, payload);
      if (response && response.code === 0) {
        const { pagination } = yield select((state) => state.classify);
        const text = response.message;
        message.success(text);
        yield put({
          type: 'getClassifyList',
          payload: {
            ...pagination,
          },
        });
      } else {
        message.error(response.message);
      }
    },

    // 编辑文章
    *editAboutData({ payload }, { call, put, select }) {
      const response = yield call(editAbout, payload);
      if (response && response.code === 0) {
        const { pagination } = yield select((state) => state.about);
        const text = response.message;
        message.success(text);
        yield put({
          type: 'getArticleList',
          payload: {
            ...pagination,
          },
        });
      } else {
        message.error(response.message);
      }
    },
  },

  reducers: {
    saveData(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
export default Model;
