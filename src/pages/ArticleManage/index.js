import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Button, Input, Modal } from 'antd';
import { SearchOutlined, PlusCircleOutlined } from '@ant-design/icons';
import TableContainer from '@/components/TableContainer';
import { statusType } from '@/utils/commonData';
import { getClassify } from '@/services/classify';
import ArticleManageEdit from './components/ArticleManageEdit';

// const ArticleManageEdit = React.lazy(() => import('./components/ArticleManageEdit'));

@connect(({ article }) => ({
  article,
}))
class ArticleManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      whichPageShow: 'home',
      detailOne: {},
      clasifyList: [],
    };
  }

  componentDidMount() {
    this.getList({}, {});
    this.getClassifyList();
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
    this.props.dispatch({ type: 'article/getArticleList', payload });
  };

  getClassifyList = async () => {
    console.log('分类');
    const response = await getClassify();
    const { list } = response.data;
    this.setState({
      clasifyList: list,
    });
  };

  // 查询按钮操作事件
  searchData = (values) => {
    const { title } = values;
    this.getList({ title }, {});
    this.setState((preState) => (preState.title === title ? null : { title }));
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
      type: 'article/addArticleData',
      payload,
    });
    this.setState({
      whichPageShow: 'home',
    });
  };

  // 删除
  handleRemove = (record) => {
    this.props.dispatch({
      type: 'article/delArticleData',
      payload: {
        id: record.id,
      },
    });
  };

  // 分页工具改变触发
  handleTableChange = (pagination) => {
    const { title } = this.state;
    this.getList({ title }, pagination);
  };

  render() {
    const { whichPageShow, detailOne, clasifyList } = this.state;
    const { article } = this.props;
    const { dataList, pagination } = article;
    return (
      <div>
        {/* 查询 */}
        <div style={{ textAlign: 'left', height: '60px' }}>
          <Form onFinish={this.searchData} onFinishFailed={this.onFinishFailed} layout="inline">
            <Form.Item colon={false} style={{ marginBottom: 0 }} name="title">
              <Input style={{ textAlign: 'left', width: '260px' }} placeholder="请输入文章名称" />
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
              { title: '文章名称', dataIndex: 'title', width: '10%' },
              {
                title: '描述',
                dataIndex: 'des',
                width: '10%',
                convert: { type: 'content' },
              },
              {
                title: '分类',
                dataIndex: 'tag',
                width: '10%',
                convert: { type: 'array' },
              },
              { title: '阅读量', dataIndex: 'readNum', width: '10%' },
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
          title={whichPageShow === 'add' ? '新增文章' : '文章编辑'}
          destroyOnClose="true"
          width="720px"
          onCancel={(e) => {
            e.preventDefault();
            this.pageShow('home');
          }}
          footer={null}
        >
          <ArticleManageEdit
            saveData={this.saveData}
            detailOne={detailOne}
            clasifyList={clasifyList}
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

export default ArticleManage;
