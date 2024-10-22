import React, { useState } from 'react';
import { Button, Input, Space, Segmented } from 'antd';
import { MessageOutlined, HistoryOutlined } from '@ant-design/icons';
import '@ui/components/HistoryArea.scss'
import HistoryActions from "./HistoryActions";
import ChatHistory from "./ChatHistory"

const { TextArea } = Input;

const App: React.FC = () => {
    const [value, setValue] = useState('History');

    function switchPage() {
        if (value === 'History') {
            return <HistoryActions />;
        } else {
            return <ChatHistory />
        }
    }

    return (
        <div>
            <Space.Compact style={{ width: '100%' }} className='inputArea'>
                <Segmented
                    options={[
                        { value: 'History', icon: <HistoryOutlined /> },
                        { value: 'Chat', icon: <MessageOutlined /> },
                    ]}
                    value={value}
                    onChange={(val) => setValue(val)}
                />
                <TextArea placeholder="给AI发送消息" autoSize />
                <Button type="primary">发送</Button>
            </Space.Compact>
            {switchPage()}
        </div>
    );
}

export default App;