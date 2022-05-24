// import { stringify } from 'querystring';
// import { history } from 'umi';
import { getArticle, addArticle, editArticle, delArticle } from '@/services/article';
// import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'article',
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
    *getArticleList({ payload }, { call, put, select }) {
      const { pagination } = yield select((state) => state.article);
      const { current: preCurrent, pageSize: prePageSize } = pagination;
      let { current, pageSize } = payload;
      current = current || preCurrent;
      pageSize = pageSize || prePageSize;
      const response = yield call(getArticle, payload);
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

    // 新增文章
    *addArticleData({ payload }, { call, put, select }) {
      const response = yield call(addArticle, payload);
      if (response && response.code === 0) {
        const { pagination } = yield select((state) => state.article);
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

    // 编辑文章
    *editArticleData({ payload }, { call, put, select }) {
      const response = yield call(editArticle, payload);
      if (response && response.code === 0) {
        const { pagination } = yield select((state) => state.article);
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

    // 删除文章
    *delArticleData({ payload }, { call, put, select }) {
      const { id } = payload;
      const response = yield call(delArticle, id);
      if (response && response.code === 0) {
        const { pagination } = yield select((state) => state.article);
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
