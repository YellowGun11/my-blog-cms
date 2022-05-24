// import { stringify } from 'querystring';
// import { history } from 'umi';
import { getClassify, addClassify, editClassify, delClassify } from '@/services/classify';
// import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'classify',
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
    // 获取分类列表数据
    *getClassifyList({ payload }, { call, put, select }) {
      const { pagination } = yield select((state) => state.classify);
      const { current: preCurrent, pageSize: prePageSize } = pagination;
      let { current, pageSize } = payload;
      current = current || preCurrent;
      pageSize = pageSize || prePageSize;
      const response = yield call(getClassify, payload);
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

    // 新增分类
    *addClassifyData({ payload }, { call, put, select }) {
      const response = yield call(addClassify, payload);
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

    // 编辑分类
    *editClassifyData({ payload }, { call, put, select }) {
      const response = yield call(editClassify, payload);
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

    // 删除分类
    *delClassifyData({ payload }, { call, put, select }) {
      const { id } = payload;
      const response = yield call(delClassify, id);
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
