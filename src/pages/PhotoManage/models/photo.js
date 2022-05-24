// import { stringify } from 'querystring';
// import { history } from 'umi';
import { getPhoto, addPhoto, editPhoto, delPhoto } from '@/services/photo';
// import { setAuthority } from '@/utils/authority';
// import { getPageQuery } from '@/utils/utils';
import { message } from 'antd';

const Model = {
  namespace: 'photo',
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
    // 获取照片列表数据
    *getPhotoList({ payload }, { call, put, select }) {
      const { pagination } = yield select((state) => state.photo);
      const { current: preCurrent, pageSize: prePageSize } = pagination;
      let { current, pageSize } = payload;
      current = current || preCurrent;
      pageSize = pageSize || prePageSize;
      const response = yield call(getPhoto, payload);
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

    // 新增照片
    *addPhotoData({ payload }, { call, put, select }) {
      const response = yield call(addPhoto, payload);
      if (response && response.code === 0) {
        const { pagination } = yield select((state) => state.photo);
        const text = response.message;
        message.success(text);
        yield put({
          type: 'getPhotoList',
          payload: {
            ...pagination,
          },
        });
      } else {
        message.error(response.message);
      }
    },

    // 编辑照片
    *editPhotoData({ payload }, { call, put, select }) {
      const response = yield call(editPhoto, payload);
      if (response && response.code === 0) {
        const { pagination } = yield select((state) => state.photo);
        const text = response.message;
        message.success(text);
        yield put({
          type: 'getPhotoList',
          payload: {
            ...pagination,
          },
        });
      } else {
        message.error(response.message);
      }
    },

    // 删除照片
    *delPhotoData({ payload }, { call, put, select }) {
      const { id } = payload;
      const response = yield call(delPhoto, id);
      if (response && response.code === 0) {
        const { pagination } = yield select((state) => state.photo);
        const text = response.message;
        message.success(text);
        yield put({
          type: 'getPhotoList',
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
