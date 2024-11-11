import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Typography } from 'antd';
import { TeamOutlined } from "@ant-design/icons";
import { useCouplingStyle, useCouplingStyleUpdate } from '@ui/contexts/CouplingStyle';
import "@ui/components/DropDownArea.scss";

const items: MenuProps['items'] = [
  {
    key: 'DISC',
    label: 'DISC',
  },
  {
    key: '待机',
    label: '待机',
  },
  {
    key: 'SIDC',
    label: 'SIDC',
  },
  {
    key: 'SGP',
    label: 'SGP',
  }
];

const DropDownArea: React.FC = () => {
  const couplingStyle = useCouplingStyle();               // 读取全局 CouplingStyle 值
  const setCouplingStyle = useCouplingStyleUpdate();      // 获取更新 CouplingStyle 的方法

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setCouplingStyle(e.key);  // 使用全局更新方法更新 CouplingStyle
  };

  return (
    <div className="dropDownContainer">
      <div className='label'>
        <TeamOutlined />
        <Typography>耦合范式</Typography>
      </div>
      <Dropdown
        menu={{
          items,
          selectable: true,
          defaultSelectedKeys: [couplingStyle],
          onClick: handleMenuClick,
        }}
      >
        <Typography.Link>
          <Space>
            {couplingStyle}
            <DownOutlined />
          </Space>
        </Typography.Link>
      </Dropdown>
    </div>
  );
};

export default DropDownArea;