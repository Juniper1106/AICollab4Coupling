import React from 'react';
import { Button, Input, Space, Segmented } from 'antd';
import type { SegmentedProps } from 'antd';
import { MessageOutlined, HistoryOutlined } from '@ant-design/icons';
import '@ui/components/InputBox.scss'

const { TextArea } = Input;

const App: React.FC = () => (
    <div className='inputArea'>
        <Space.Compact style={{ width: '100%' }} className='inputAreaSpace'>
            <Segmented
                options={[
                    { value: 'History', icon: <HistoryOutlined /> },
                    { value: 'Chat', icon: <MessageOutlined /> },
                ]}
            />
            <TextArea placeholder="给AI发送消息" autoSize />
            <Button type="primary">发送</Button>
        </Space.Compact>
    </div>
);

export default App;