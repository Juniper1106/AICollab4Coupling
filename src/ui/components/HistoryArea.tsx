import React, { useState, useEffect } from 'react';
import { Button, Input, Space, Segmented } from 'antd';
import { MessageOutlined, HistoryOutlined } from '@ant-design/icons';
import '@ui/components/HistoryArea.scss'
import HistoryActions from "./HistoryActions";
import ChatHistory from "./ChatHistory"
import { socket } from './socket';
const { TextArea } = Input;

interface ChatMessage {
    text: string
    img_url: string
    sender: 'sent' | 'received' | 'loading' | 'server'
}

interface AI_action {
    title: string
    action: string
    description: string
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

    const [actions, setActions] = useState<AI_action[]>([]);
    // const socket = io('http://127.0.0.1:5010')
    useEffect(() => {
      socket.on('AI_action', (data) => {
        setActions(prevActions => [data, ...prevActions])
      })
    }, [])

    const addAItext = () => {

    }

    const restoreData = async () => {
        const msg_response = await fetch('http://127.0.0.1:5010/getMessages')
        const savedMsg = await msg_response.json()
        setMessages(savedMsg)
    }

    useEffect(() => {
        // 组件挂载时恢复数据
        restoreData()
    }, [])

    useEffect(() => {
        // 连接后端并监听消息
        socket.on('AI_message', (data) => {
            const reply: ChatMessage = {
                text: data.text,
                img_url: data.image,
                sender: 'server'
            }
            setMessages(prevMessages => [...prevMessages, reply])
        });

        // 清理事件监听器
        return () => {
            socket.off('AI_message');
        };
    }, []);

    const gptChatFunction = async (question: string) => {
        // 创建一个加载中的消息
        const loadingMessage: ChatMessage = {
            text: '', // 内容为空
            img_url: '', // 图片为空
            sender: 'loading', // 设置一个特殊的发送者标识
        }

        // 先把loading状态的消息添加到messages
        setMessages(prevMessages => [...prevMessages, loadingMessage])

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
        // setMessages(prevMessages => [...prevMessages, reply])
        // 替换掉最后一个loading消息为真实的回复
        setMessages(prevMessages => {
            // 查找最后一个 sender 为 'loading' 的消息的索引
            const lastIndex = (() => {
                for (let i = prevMessages.length - 1; i >= 0; i--) {
                    if (prevMessages[i].sender === 'loading') {
                        return i;
                    }
                }
                return -1; // 如果没有找到，返回 -1
            })();
            
            if (lastIndex !== -1) {
                // 移除该消息，并在末尾添加新的 reply
                return [...prevMessages.slice(0, lastIndex), ...prevMessages.slice(lastIndex + 1), reply];
            }

            // 如果没有找到 'loading' 的消息，直接添加 reply
            return [...prevMessages, reply];
        })
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
            return <HistoryActions actions={actions}/>;
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