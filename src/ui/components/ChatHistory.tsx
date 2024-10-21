import React from 'react';
import { Divider, Flex, Tag } from 'antd';
import '@ui/components/ChatHistory.scss'

const App: React.FC = () => (
  <div className='chatHistory'>
    <Divider orientation="left">Without icon</Divider>
    <Flex gap="4px 0" wrap>
      <Tag color="processing">processing</Tag>
      <Tag color="default">default</Tag>
    </Flex>
  </div>
);

export default App;