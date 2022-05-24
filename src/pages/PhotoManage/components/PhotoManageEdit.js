import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Upload, Modal, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { beforeUpload, tailFormItemLayout, statusType } from '@/utils/commonData';

const { Option } = Select;

function AdvertManageEdit(props) {
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState([]);

  useEffect(() => {
    console.log('props');
    console.log(props);
  }, []);

  const onFinish = (value) => {
    console.log('value');
    console.log(value);
  };

  const handlePreview = (file) => {
    const { url } = file;
    setPreviewImage(url);
    setPreviewVisible(true);
  };

  const handleChangefileList = ({ file, files }) => {
    const flag = beforeUpload(file);
    let messageInfo;
    if (flag) {
      const fileItems = files.map((item) => {
        const temp = { ...item };
        if (item.response) {
          if (item.response.data) {
            temp.url = item.response.data;
          } else {
            messageInfo = item.response.message;
          }
        }
        return temp;
      });
      if (messageInfo) {
        message.warning(messageInfo);
        setFileList([]);
      } else {
        setFileList(fileItems);
      }
    }
  };

  // 删除图片
  const handleRemove = () => setFileList([]);

  const handleCancelPic = () => setPreviewVisible(false);

  return (
    <div style={{ paddingTop: '10px' }}>
      <Form
        onFinish={onFinish}
        name="edit"
        initialValues={{
          id: props.detailOne ? props.detailOne.id : '',
          name: props.detailOne ? props.detailOne.name : '',
          status: props.detailOne ? props.detailOne.status : undefined,
        }}
      >
        <Form.Item name="id" label="id" hidden={true}>
          <Input />
        </Form.Item>
        {/* 照片名称 */}
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
        {/* 照片 */}
        <Form.Item
          name="photo"
          label={
            <span>
              <span
                style={{
                  marginRight: 4,
                  color: '#f5222d',
                  fontSize: '14px',
                  fontFamily: 'SimSun, sans-serif',
                }}
              >
                *
              </span>
              照片
            </span>
          }
        >
          <div className="clearfix">
            <Upload
              action="/smc/uploadUserImg"
              listType="picture-card"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChangefileList}
              onRemove={handleRemove}
            >
              {fileList.length >= 1 ? null : (
                <div>
                  <PlusOutlined />
                  <div className="ant-upload-text">上传</div>
                </div>
              )}
            </Upload>
            <Modal visible={previewVisible} footer={null} width="300px" onCancel={handleCancelPic}>
              <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
          </div>
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

export default AdvertManageEdit;
