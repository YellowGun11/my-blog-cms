import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Modal } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import TableContainer from '@/components/TableContainer';
import { statusType } from '@/utils/commonData';
import PhotoManageEdit from './components/PhotoManageEdit';

@connect(({ photo }) => ({
  photo,
}))
class PhotoManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whichPageShow: 'home',
      detailOne: {},
    };
  }

  componentDidMount() {
    this.getList({}, {});
  }

  // 获取列表数据
  getList = (searchParams, pagination) => {
    let params = {
      current: 1,
      pageSize: 10,
    };
    if (pagination && pagination.current) {
      params = {
        current: pagination.current,
        pageSize: pagination.pageSize,
      };
    }
    const payload = { ...params, ...searchParams };
    this.props.dispatch({ type: 'photo/getPhotoList', payload });
  };

  // 查询按钮操作事件
  searchData = (values) => {
    const { name } = values;
    this.getList({ name }, {});
    this.setState((preState) => (preState.name === name ? null : { name }));
  };

  // 验证失败回调
  onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  pageShow = (page, detailOne) => {
    console.log(page);
    console.log(detailOne);
    if (['add', 'edit', 'remove', 'home', 'see'].includes(page)) {
      this.setState((prevstate) =>
        prevstate.whichPageShow === page ? null : { whichPageShow: page, detailOne },
      );
    }
  };

  // 新增、编辑
  saveData = (payload) => {
    this.props.dispatch({
      type: 'photo/delPhotoData',
      payload,
    });
    this.setState({
      whichPageShow: 'home',
    });
  };

  // 删除
  handleRemove = (record) => {
    this.props.dispatch({
      type: 'photo/delPhoto',
      payload: {
        id: record.id,
      },
    });
  };

  // 分页工具改变触发
  handleTableChange = (pagination) => {
    const { name } = this.state;
    this.getList({ name }, pagination);
  };

  render() {
    const { whichPageShow, detailOne } = this.state;
    const { photo } = this.props;
    const { dataList, pagination } = photo;
    return (
      <div>
        {/* 查询 */}
        <div style={{ textAlign: 'left', height: '60px' }}>
          <Form onFinish={this.searchData} onFinishFailed={this.onFinishFailed} layout="inline">
            <Form.Item colon={false} style={{ marginBottom: 0 }} name="name">
              <Input style={{ textAlign: 'left', width: '260px' }} placeholder="请输入照片名称" />
            </Form.Item>
            <Form.Item>
              <Button icon={<SearchOutlined />} htmlType="submit">
                查询
              </Button>
            </Form.Item>
            <Form.Item>
              <Button
                icon={<PlusCircleOutlined />}
                style={{ marginRight: 16 }}
                onClick={() => {
                  this.pageShow('add');
                }}
              >
                新增
              </Button>
            </Form.Item>
          </Form>
        </div>
        {/* 表格 */}
        <div>
          <TableContainer
            dataList={dataList}
            pagination={pagination}
            pageShow={this.pageShow}
            handleTableChange={this.handleTableChange}
            columnConfig={[
              { title: '照片名称', dataIndex: 'name', width: '10%' },
              {
                title: '照片缩略图',
                dataIndex: 'imgUrl',
                width: '10%',
                convert: { type: 'img' },
              },
              { title: '创建时间', dataIndex: 'createTime', width: '10%' },
              {
                title: '状态',
                dataIndex: 'status',
                width: '6%',
                convert: { type: 'statusType', format: { key: 'code', value: 'name' } },
              },
            ]}
            converts={[{ statusType }]}
            operateConfig={[{ name: 'edit' }, { name: 'remove', func: this.handleRemove }]}
          />
        </div>
        <Modal
          visible={whichPageShow === 'add' || whichPageShow === 'edit'}
          title={whichPageShow === 'add' ? '新增照片' : '照片编辑'}
          destroyOnClose="true"
          width="520px"
          onCancel={(e) => {
            e.preventDefault();
            this.pageShow('home');
          }}
          footer={null}
        >
          <PhotoManageEdit
            saveData={this.saveData}
            detailOne={detailOne}
            pageShow={this.pageShow}
          />
          {/* <Suspense fallback={<div>Loading</div>}>
            <ArticleManageEdit
              saveData={this.saveData}
              detailOne={detailOne}
              pageShow={this.pageShow}
            />
          </Suspense> */}
        </Modal>
      </div>
    );
  }
}

export default PhotoManage;
