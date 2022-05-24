/* eslint-disable react/no-deprecated, react/no-string-refs */
import React, { Component } from 'react';
import E from 'wangeditor';

/**
 * 富文本编辑器方法和参数说明
 * name - type  -  参数
 *
 * initContent : string  内容区域的初始值 html的字符串
 * contenteditable : boolean  内容区域是否可编辑 默认true
 * onchangeTimeout : number 自定义 contentOnChange 触发的延迟时间 单位毫秒
 * zIndex : number  编辑区域的 z-index 值
 *
 * */
export default class RichEditor extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      pictures: [], // 上传的图片集合
      editorContent: '',
    };
  }

  componentDidMount() {
    const self = this;
    const { contenteditable = true, onchangeTimeout = 400, zIndex = 100 } = this.props;
    const elem = this.refs.editorElem;
    this.editor = new E(elem);
    // 自定义菜单配置
    this.editor.config.menus = [
      'head', // 标题
      'bold', // 粗体
      'fontSize', // 字号
      'fontName', // 字体
      'italic', // 斜体
      'underline', // 下划线
      'strikeThrough', // 删除线
      'foreColor', // 文字颜色
      'backColor', // 背景颜色
      'link', // 插入链接
      'list', // 列表
      'justify', // 对齐方式
      'quote', // 引用
      // 'emoticon', // 表情
      'image', // 插入图片
      'table', // 表格
      // 'video', // 插入视频
      'code', // 插入代码
      'undo', // 撤销
      'redo', // 反撤销
    ];
    // 使用 onchange 函数监听内容的变化
    this.editor.config.onchange = (html) => {
      self.contentOnChange(html);
    };
    // 自定义 onchange 触发的延迟时间
    this.editor.config.onchangeTimeout = onchangeTimeout; // 单位 ms
    // 配置编辑区域的 z-index
    this.editor.config.zIndex = zIndex;
    // 关闭粘贴样式的过滤
    this.editor.config.pasteFilterStyle = false;
    // 配置不能粘贴图片
    this.editor.config.pasteIgnoreImg = false;
    // 自定义配置颜色（字体颜色、背景色）
    this.editor.config.colors = [
      '#000000',
      '#eeece0',
      '#1c487f',
      '#4d80bf',
      '#c24f4a',
      '#8baa4a',
      '#7b5ba1',
      '#46acc8',
      '#f9963b',
      '#faad14',
      '#f513f7',
      '#b6d264',
    ];
    // 上传图片到服务器
    this.editor.config.uploadImgServer = '/app/file/web_upload_files';
    this.editor.config.uploadImgParams = {
      fileBucket: 'dataResources',
      type: 3,
      source: 2,
    };
    // 强制命名上传的 file 名
    this.editor.config.uploadFileName = 'file';
    // 监听函数在上传图片的不同阶段
    this.editor.config.uploadImgHooks = {
      success: (xhr, edi, result) => {
        // 图片上传并返回结果，图片插入成功之后触发

        // xhr 是 XMLHttpRequst 对象，editor 是编辑器对象，result 是服务器端返回的结果
        self.saveUploadPic(result.data[0]);
      },
    };
    // 将图片大小限制为 5M
    this.editor.config.uploadImgMaxSize = 5 * 1024 * 1024;
    // 限制一次最多能传5张图片
    this.editor.config.uploadImgMaxLength = 5;
    // 将 timeout 时间改为 30s
    this.editor.config.uploadImgTimeout = 30000;
    // 隐藏“网络图片”tab
    this.editor.config.showLinkImg = true;
    // create
    this.editor.create();
    // 设置内容区域是否可编辑
    this.editor.$textElem.attr('contenteditable', contenteditable);
    // 清空编辑区域
    // editor.txt.clear();
    //
    const { initContent } = this.props;
    if (initContent) {
      this.setContent(initContent);
      this.editor.txt.clear();
      this.editor.txt.html(initContent);
    }
  }

  setContent = (editorContent) => {
    this.setState({
      editorContent,
    });
  };

  // 返货编辑区域内容
  getContent = () => {
    const { editorContent } = this.state;
    return editorContent;
  };

  // 返回已上传的图片
  getUploadPictures = () => {
    const { pictures } = this.state;
    return [...pictures];
  };

  // 保存上传的图片
  saveUploadPic = (picAddress) => {
    const { pictures } = this.state;
    if (picAddress && picAddress !== '' && !pictures.includes(picAddress)) {
      pictures.push(picAddress);
    }
    this.setState({
      pictures: [...pictures],
    });
  };

  // 内容change事件
  contentOnChange = (html) => {
    this.setState({
      editorContent: html,
    });
  };

  render() {
    return <div ref="editorElem" style={{ minWidth: '400px' }} />;
  }
}
