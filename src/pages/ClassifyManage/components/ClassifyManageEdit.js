import React, { useEffect, useRef } from 'react';
import { Form, Input, Button, Select } from 'antd';
import { tailFormItemLayout, statusType } from '@/utils/commonData';

const { Option } = Select;

function ClassifyManageEdit(props) {
  const contentRef = useRef();

  useEffect(() => {
    console.log('props');
    console.log(props);
  }, []);

  const onFinish = (value) => {
    console.log('value');
    console.log(value);
    console.log(contentRef.current.getContent());
  };

  return (
    <div style={{ paddingTop: '10px' }}>
      <Form
        onFinish={onFinish}
        name="edit"
        initialValues={{
          id: props.detailOne ? props.detailOne.id : '',
          name: props.detailOne ? props.detailOne.name : '',
          status: props.detailOne ? props.detailOne.status : '',
        }}
      >
        <Form.Item name="id" label="id" hidden={true}>
          <Input />
        </Form.Item>
        {/* 分类名称 */}
        <Form.Item
          name="name"
          label="名称"
          rules={[
            {
              required: true,
              message: '名称不能为空！',
            },
          ]}
        >
          <Input placeholder="请输入名称" />
        </Form.Item>
        {/* 分类状态 */}
        <Form.Item
          name="status"
          label="状态"
          rules={[
            {
              required: true,
              message: '状态不能为空！',
            },
          ]}
        >
          <Select placeholder="请选择状态" allowClear>
            {statusType.map((item) => {
              return (
                <Option key={item.code} value={item.code}>
                  {item.name}
                </Option>
              );
            })}
          </Select>
        </Form.Item>
        {/* 新增按钮 */}
        <Form.Item {...tailFormItemLayout} style={{ textAlign: 'center' }}>
          <Button type="primary" className="saveBtn" htmlType="submit" style={{ marginRight: 5 }}>
            保存
          </Button>
          <Button
            className="returnBtn"
            onClick={() => {
              props.pageShow('home');
            }}
          >
            返回
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}

export default ClassifyManageEdit;
