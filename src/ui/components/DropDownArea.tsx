import React, { useState, useEffect } from 'react';
import { DownOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Dropdown, Space, Typography, Button, Tooltip } from 'antd';
import { TeamOutlined, ReloadOutlined, CloseOutlined } from "@ant-design/icons";
import { useCouplingStyle, useCouplingStyleUpdate } from '@ui/contexts/CouplingStyle';
import "@ui/components/DropDownArea.scss";
import { socket } from './socket';
import notifyAudioStyleChangeTimeout from '@ui/assets/audio/style_change_timeout.mp3';

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
  const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());

  useEffect(() => {
      const intervalId = setInterval(async () => {
          if (Date.now() - lastUpdateTime >= 90000) {
              console.log('已等待90秒，发送inactive_update请求');
              const audio = new Audio(notifyAudioStyleChangeTimeout);
              audio.play();
              setLastUpdateTime(Date.now());
          }
      }, 1000); // 每秒检查一次
  
      // 清除定时器
      return () => clearInterval(intervalId);
    }, [lastUpdateTime]);
    
  const handleMenuClick: MenuProps['onClick'] = async (e) => {
    setCouplingStyle(e.key);  // 使用全局更新方法更新 CouplingStyle
    setLastUpdateTime(Date.now());
    await fetch(
      'http://127.0.0.1:5010/style_change',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({style: e.key})
      }
    ).then(
      response => response.text()
    ).then(
      text => console.log(text)
    ).catch(
      error => console.error(error)
    )
  };

  const stopbackend = () => {
    socket.emit('stop_background_task');
  }

  const refresh = () => {
    socket.emit('refresh');
  }

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
      <Tooltip title="刷新">
        <Button type="primary" shape="circle" icon={<ReloadOutlined />} size='small' onClick={refresh}/>
      </Tooltip>
      <Tooltip title="终止主动回复">
        <Button type="primary" shape="circle" icon={<CloseOutlined /> } size='small' onClick={stopbackend}/>
      </Tooltip>
    </div>
  );
};

export default DropDownArea;