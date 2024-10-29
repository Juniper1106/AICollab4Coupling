import React from 'react';
import { useState } from "react";
import { UserOutlined } from '@ant-design/icons';
import { Input, Button } from 'antd';
import "@ui/styles/main.scss";
import "@ui/components/LoginPageForProbe.scss"
import SliderArea from "./components/SliderArea";
import HistoryArea from "./components/HistoryArea";


function App() {
  const [login, setLogin] = useState(false);
  
  const LoginPageForProbe: React.FC = () => (
    <div className="loginPageForProbe">
      <Input size="large" placeholder="请输入被试编号" prefix={<UserOutlined />} />
      <br />
      <br />
      <Button type="primary" onClick={handleLogin}>提交</Button>
    </div>
  );

  function handleLogin() {
    if (login === false) {
      setLogin(true)
    }
  }

  function switchPage() {
    if (login === false)
      return <LoginPageForProbe />
    else return (
      <>
        <SliderArea />
        <HistoryArea />
      </>
    )
  }

  return (
    <div className="homepage">
      {switchPage()}
    </div>
  );
}

export default App;
