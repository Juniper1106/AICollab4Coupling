import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Segmented } from 'antd';
import { MessageOutlined, HistoryOutlined } from '@ant-design/icons';
import '@ui/components/HistoryArea.scss'
import HistoryActions from "./HistoryActions";
import ChatHistory from "./ChatHistory"

const { TextArea } = Input;

interface ChatMessage {
    text: string
    img_url: string
    sender: 'sent' | 'received'
}

const UserAttitudeTest: ChatMessage = {
    text: '为了设计番茄采摘机器人，建议设计GPS导航模块',
    img_url: 'https://img79.jc35.com/9/20210928/637684201785624684382.jpg',
    sender: 'received'
}

const App: React.FC = () => {
    const [value, setValue] = useState('History');
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    // const [messages, setMessages] = useState<ChatMessage[]>([UserAttitudeTest]);

    const addAItext = () => {

    }

    // const restoreData = async () => {
    //     const msg_response = await fetch('http://127.0.0.1:5010/getMessages')
    //     const savedMsg = await msg_response.json()
    //     setMessages(savedMsg)
    // }

    // useEffect(() => {
    //     // 组件挂载时恢复数据
    //     restoreData()
    // }, [])

    const gptChatFunction = async (question: string) => {
        // 创建要发送的数据对象
        const sendData = { "prompt": question }
        const response = await fetch('http://127.0.0.1:5010/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json', // 设置请求头为 JSON
            },
            body: JSON.stringify(sendData), // 将数据对象转换为 JSON 字符串并发送
        })

        const receivedData = await response.json()
        console.log(receivedData.image)
        const reply: ChatMessage = {
            text: receivedData.text,
            img_url: receivedData.image,
            sender: 'received'
        }
        setMessages(prevMessages => [...prevMessages, reply])
    }

    const handleSend = (txt:string) => {
        if (txt !== '') {
            setValue('Chat')
            const newMessage: ChatMessage = {
                text: txt,
                img_url: "",
                sender: 'sent'
            }
            setMessages(prevMessages => [...prevMessages, newMessage])
            console.log('将发送消息:', inputText);
            setInputText('');
            gptChatFunction(newMessage.text)
        }
    }

    function switchPage() {
        if (value === 'History') {
            return <HistoryActions />;
        } else {
            return <ChatHistory messages={messages} addAItext={addAItext}/>
        }
    }

    return (
        <div className='historyArea'>
            {switchPage()}
            <div className='inputArea'>
                <Space.Compact className='input'>
                    <Segmented
                        options={[
                            { value: 'History', icon: <HistoryOutlined /> },
                            { value: 'Chat', icon: <MessageOutlined /> },
                        ]}
                        value={value}
                        onChange={(val) => setValue(val)}
                    />
                    <TextArea 
                        placeholder="给AI发送消息"
                        value = {inputText}
                        onChange = {(e) => setInputText(e.target.value)}
                        autoSize={{ maxRows: 4 }}
                    />
                    <Button type="primary" onClick={() => {handleSend(inputText)}}>发送</Button>
                </Space.Compact>
            </div>
        </div>
    );
}

export default App;