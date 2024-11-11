import React, { useState } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Typography, Tooltip } from 'antd';
import { InfoCircleTwoTone, InfoCircleOutlined, TeamOutlined } from "@ant-design/icons";
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
  const inital = 'DISC'
  const [selectedLabel, setSelectedLabel] = useState(inital);

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    setSelectedLabel(e.key);
  };

  return (
    <div className="dropDownContainer">
      <div className='label'>
      <TeamOutlined />
      <Typography>
        耦合范式
      </Typography>
      </div>
      <Dropdown
        menu={{
          items,
          selectable: true,
          defaultSelectedKeys: [inital],
          onClick: handleMenuClick,
        }}
      >
        <Typography.Link>
          <Space>
            {selectedLabel}
            <DownOutlined />
          </Space>
        </Typography.Link>
      </Dropdown>
    </div>
  );
};

export default DropDownArea;