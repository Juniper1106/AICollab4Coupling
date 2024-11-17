import React from 'react';
import { useState, useEffect } from "react";
import { UserOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import "@ui/styles/main.scss";
import SliderArea from "./components/SliderArea";
import HistoryArea from "./components/HistoryArea";
import DropDownArea from './components/DropDownArea';
import { CouplingStyleProvider } from '@ui/contexts/CouplingStyle';
import { socket } from './components/socket';

function App() {
  const [login, setLogin] = useState(false);
  useEffect(() => {
    // 插件关闭时，通知后端停止任务
    const handlePluginClose = () => {
      if (login) {
        socket.emit('stop_background_task');
        // 短暂延迟，确保消息发送成功
        socket.disconnect();  // 手动断开连接
      }
    };

    // 监听插件关闭事件
    window.addEventListener('beforeunload', handlePluginClose);

    return () => {
      window.removeEventListener('beforeunload', handlePluginClose);
    };
  }, [login]);

  const LoginPageForProbe: React.FC = () => {
    const [userName, setUserName] = useState('');

    async function handleLogin(username: string) {
      if (login === false) {
        const sendData = { "username": username }
        const response = await fetch('http://127.0.0.1:5010/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json', // 设置请求头为 JSON
          },
          body: JSON.stringify(sendData), // 将数据对象转换为 JSON 字符串并发送
        })

        if (response.ok) {
          const receivedData = await response.json()
          setLogin(true)
          console.log(receivedData.message)
          socket.emit('start_background_task');
        }
        else {
          console.error('Failed to send data');
        }
      }
    }
    return (
      <div className="loginPageForProbe">
        <Input size="large" placeholder="请输入被试编号" prefix={<UserOutlined />} value={userName} onChange={(e) => setUserName(e.target.value)} />
        <br />
        <br />
        <Button type="primary" onClick={() => { handleLogin(userName) }}>提交</Button>
      </div>
    )
  };

  function switchPage() {
    if (login === false)
      return <LoginPageForProbe />
    else return (
      <>
        <DropDownArea />
        <SliderArea />
        <HistoryArea />
      </>
    )
  }

  return (
    <CouplingStyleProvider>
      <div className="homepage">
        {switchPage()}
      </div>
    </CouplingStyleProvider>
  );
}

export default App;
