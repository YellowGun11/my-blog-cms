import { message } from 'antd';

export const statusType = [
  {
    code: 1,
    name: '启用',
  },
  {
    code: 0,
    name: '禁用',
  },
];

export const pictureConfig = {
  picSize: '5', // 图片最大5M
  picFormat: ['.jpg', '.jpeg', '.png', '.JPG'],
};

export const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 5 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

export const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 12,
      offset: 5,
    },
  },
};

// 上传图片前做校验
export const beforeUpload = (file) => {
  if (file && file.name) {
    const point = file.name.lastIndexOf('.');
    const type = file.name.substr(point);
    const isPic = pictureConfig.picFormat.includes(type);
    if (!isPic) {
      message.error('上传图片格式为jpg,jpeg,png!');
      return false;
    }
    const isLt2M = file.size / 1024 / 1024 < pictureConfig.picSize;
    if (!isLt2M) {
      message.error(`上传图片最大为${pictureConfig.picSize}M!`);
      return false;
    }
  }
  return true;
};
