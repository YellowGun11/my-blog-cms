/* eslint-disable radix,no-script-url,no-undef-init,react/no-array-index-key,no-else-return,no-unused-expressions,consistent-return,camelcase,react/destructuring-assignment,no-shadow */
import React from 'react';
import { Table, Popconfirm, Tooltip } from 'antd';
import { EyeOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import AuthorizedElements from '@/components/AuthorizedElements';

const maps = {
  see: '详情',
  remove: '删除',
  edit: '编辑',
};

const TableContainer = (props) => {
  const tableColumns = () => {
    const { columnConfig = [], operateConfig = [], converts = [], pageShow } = props;
    const dataColumns = columnConfig.map((item) => {
      const { title, dataIndex, width, convert, sorter } = item;
      if (convert) {
        const { type, format } = convert;
        // 时间类型
        if (type === 'time') {
          return {
            title,
            dataIndex,
            width,
            render(text) {
              if (text) {
                return moment(parseInt(text)).format(format || 'YYYY-MM-DD HH:mm:ss');
              }
            },
          };
        }
        // 照片类型
        if (type === 'img') {
          return {
            title,
            dataIndex,
            width,
            render(text) {
              if (text) {
                return <img src={text} width="30" height="30"></img>;
              }
            },
          };
        }
        // 内容需省略展示
        if (type === 'content') {
          return {
            title,
            dataIndex,
            width,
            ellipsis: {
              showTitle: false,
            },
            render: (text) => (
              <Tooltip placement="topLeft" title={text}>
                {text}
              </Tooltip>
            ),
          };
        }
        // 数组以字符串形式展示
        if (type === 'array') {
          return {
            title,
            dataIndex,
            width,
            ellipsis: {
              showTitle: false,
            },
            render: (text) => <span>{text && text.length > 0 && text.join('，')}</span>,
          };
        }
        const obj = converts.find((ele) => ele[type]);
        if (obj) {
          const arr = obj[type];
          if (format) {
            const { key, value, multi } = format;
            return {
              title,
              dataIndex,
              width,
              render(text) {
                if (arr.length > 0) {
                  // 多匹配，中间以逗号隔开
                  if (multi && text) {
                    let arrText = text.split(',');
                    arrText = arrText.reduce((array, current) => {
                      const arrObj = arr.find((ele) => ele[key] === current);
                      if (arrObj) {
                        array.push(arrObj[value]);
                      }
                      return array;
                    }, []);
                    return <div>{arrText.join(',')}</div>;
                  } else {
                    // 单匹配
                    const arrItem = arr.find((ele) => ele[key] === text);
                    if (arrItem) {
                      return <div>{arrItem[value]}</div>;
                    }
                  }
                }
              },
            };
          }
        }
      }
      // 不存在转换
      return {
        title,
        dataIndex,
        width,
        sorter,
      };
    });
    let operateColumns;
    if (operateConfig.length > 0) {
      operateColumns = {
        title: '操作',
        dataIndex: 'action',
        width: '7%',
        render(text, record) {
          const operates = operateConfig.map((obj, index) => {
            const { name, func, auth } = obj;
            const title = maps[name];
            return (
              <span key={index}>
                {name === 'edit' && (
                  <AuthorizedElements authority={auth}>
                    <a
                      href="javascript:void(0);"
                      onClick={(e) => {
                        e.preventDefault();
                        // func(record);
                        pageShow('edit', record);
                      }}
                      style={{ padding: '0 4px' }}
                    >
                      {/* {title} */}
                      <Tooltip title={title}>
                        <EditOutlined style={{ fontSize: '16px', color: '#666' }} />
                      </Tooltip>
                    </a>
                  </AuthorizedElements>
                )}
                {name === 'see' && (
                  <a
                    href="javascript:void(0);"
                    onClick={(e) => {
                      e.preventDefault();
                      pageShow && pageShow('see');
                    }}
                    style={{ padding: '0 4px' }}
                  >
                    {/* {title} */}
                    <Tooltip title={title}>
                      <EyeOutlined style={{ fontSize: '16px', color: '#666' }} />
                    </Tooltip>
                  </a>
                )}
                {name === 'remove' && (
                  <AuthorizedElements authority={auth}>
                    <Popconfirm
                      title="确认删除该条数据?"
                      onConfirm={() => {
                        func(record);
                      }}
                      onCancel={() => {}}
                      okText="删除"
                      cancelText="取消"
                    >
                      <a href="javascript:void(0);" style={{ padding: '0 4px' }}>
                        <Tooltip title={title}>
                          <DeleteOutlined style={{ fontSize: '16px', color: '#666' }} />
                        </Tooltip>
                        {/* {title} */}
                      </a>
                    </Popconfirm>
                  </AuthorizedElements>
                )}
              </span>
            );
          });
          return operates;
        },
      };
    }
    if (operateColumns) {
      return [...dataColumns, operateColumns];
    }
    return [...dataColumns];
  };

  const { dataList, pagination, handleTableChange } = props;
  const paginationProps = {
    size: 'small',
    showSizeChanger: true, // 分页信息配置
    showQuickJumper: true,
    pageSizeOptions: ['5', '10', '20', '50'],
    showTotal: (total, range) => `第 ${range[0]} ~ ${range[1]} 条， 共 ${total} 条`,
    ...pagination,
  };
  return (
    <div>
      <Table
        columns={tableColumns()}
        dataSource={dataList}
        rowKey="id"
        size="middle"
        pagination={paginationProps}
        onChange={(pagin) => handleTableChange(pagin)}
        style={{ wordBreak: 'break-all' }}
      />
    </div>
  );
};

export default TableContainer;
