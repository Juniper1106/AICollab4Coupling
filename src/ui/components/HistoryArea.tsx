import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Space, Segmented } from 'antd';
import { MessageOutlined, HistoryOutlined } from '@ant-design/icons';
import '@ui/components/HistoryArea.scss'
import HistoryActions from "./HistoryActions";
import ChatHistory from "./ChatHistory"
import { socket } from './socket';
import notifyAudio from '@ui/assets/audio/notify.mp3'
import { NetworkMessages } from '@common/network/messages';
import { useCouplingStyle } from '@ui/contexts/CouplingStyle';

const { TextArea } = Input;

interface ChatMessage {
    id: number
    text: string
    img_url: string
    sender: 'sent' | 'received' | 'loading' | 'server'
}

interface AI_action {
    id: number
    msg_id: number | null
    node_id: string
    title: string
    action: string
    description: string
}

// const UserAttitudeTest: ChatMessage = {
//     text: '为了设计番茄采摘机器人，建议设计GPS导航模块',
//     img_url: 'https://img79.jc35.com/9/20210928/637684201785624684382.jpg',
//     sender: 'received'
// }

const App: React.FC = () => {
    const couplingStyle = useCouplingStyle();               // 读取全局 CouplingStyle 值
    const couplingStyleRef = useRef(couplingStyle);         // 用 useRef 保存 couplingStyle 的引用

    const [value, setValue] = useState('History');
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [lastUpdateTime, setLastUpdateTime] = useState<number>(Date.now());
    const messagesRef = useRef<ChatMessage[]>(messages);
    // const [messages, setMessages] = useState<ChatMessage[]>([UserAttitudeTest]);
    const [selectedMessageId, setSelectedMessageId] = useState<number|null>(null);
    const [actions, setActions] = useState<AI_action[]>([]);
    // const socket = io('http://127.0.0.1:5010')

    useEffect(() => {
        const intervalId = setInterval(async () => {
            // console.log(`已等待 ${(Date.now() - lastUpdateTime)/1000} 秒无打字操作`);
            if (Date.now() - lastUpdateTime >= 15000) {
                console.log('已等待15秒，发送inactive_update请求');
                const response = await fetch('http://127.0.0.1:5010/inactive_update')
                const res = await response.json()
                console.log(res)
                setLastUpdateTime(Date.now());
            }
        }, 1000); // 每秒检查一次
    
        // 清除定时器
        return () => clearInterval(intervalId);
      }, [lastUpdateTime]);
    
    useEffect(() => {
        messagesRef.current = messages;
    }, [messages]);

    const restoreData = async () => {
        const msg_response = await fetch('http://127.0.0.1:5010/getMessages')
        const savedMsg = await msg_response.json()
        setMessages(savedMsg)
        const action_response = await fetch('http://127.0.0.1:5010/getActions')
        const savedAction = await action_response.json()
        setActions(savedAction)
    }

    useEffect(() => {
        // 组件挂载时恢复数据
        restoreData()
    }, [])

    const handleAIMessage = (data: any) => {
        const reply: ChatMessage = {
            id: data["id"],
            text: data["text"],
            img_url: data["img_url"],
            sender: 'server'
        }
        if (couplingStyleRef.current != 'SGP') {
            const audio = new Audio(notifyAudio);
            audio.play();
        } 
        setMessages(prevMessages => [...prevMessages, reply])
        setSelectedMessageId(data["id"])
        const action = actions.find(action => action.msg_id === data["id"]);
        if (couplingStyleRef.current === 'SIDC') {
            NetworkMessages.ADD_CONTENT.send({ id: action?.id, server: true, text: data["text"], img_url: data["img_url"] });
        } else if (couplingStyleRef.current === 'SGP') {
            NetworkMessages.ADD_CONTENT_IN_AI.send({ id: action?.id, server: true, text: data["text"], img_url: data["img_url"] });
        }
    }

    const handleAIConclude = async (data: any) => {
        NetworkMessages.ADD_CONTENT.send({ id: data["id"], server: true, text: data["text"], img_url: data["img_url"] })
        const audio = new Audio(notifyAudio);
        audio.play();

        // 获取最后两条‘received’消息
        console.log("all messages:", messagesRef.current);
        const receivedMessages = messagesRef.current.filter(msg => msg.sender === 'received');
        const lastTwoReceived = receivedMessages.slice(-2);
        
        for (const msg of lastTwoReceived) {
            if (msg.img_url) {
                NetworkMessages.ADD_CONTENT.send({ id: data["id"], server: true, text: "", img_url: msg.img_url });
                const audio = new Audio(notifyAudio);
                audio.play();
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }
    }

    useEffect(() => {
        couplingStyleRef.current = couplingStyle;           // 每次 couplingStyle 更新时，同步到 ref
    }, [couplingStyle]);

    useEffect(() => {
        // 连接后端并监听消息
        socket.on('AI_message', handleAIMessage);

        socket.on('AI_conclude', handleAIConclude);

        socket.on('AI_action', (data) => {
            setActions(prevActions => [data, ...prevActions])
        });

        socket.on('update_action', (data) => {
            setActions(prevActions =>
                prevActions.map(action => 
                    action.id === data['action_id']
                        ? { ...action, node_id: data['node_id'] } // 替换 node_id 的新对象
                        : action // 其他元素保持不变
                )
            );
        });

        socket.on('reload', async () => {
            restoreData()
        });

        // 清理事件监听器
        return () => {
            socket.off('AI_message');
        };
    }, []);

    const gptChatFunction = async (question: string) => {
        // 创建一个加载中的消息
        const res = await fetch('http://127.0.0.1:5010/getMsgId')
        const id = await res.json()
        const loadingMessage: ChatMessage = {
            id: id["id"],
            text: '', // 内容为空
            img_url: '', // 图片为空
            sender: 'loading', // 设置一个特殊的发送者标识
        }

        // 先把loading状态的消息添加到messages
        setMessages(prevMessages => [...prevMessages, loadingMessage])
        setSelectedMessageId(id["id"])

        // 创建要发送的数据对象
        const sendData = { "id": loadingMessage.id, "prompt": question }
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
            id: receivedData.id,
            text: receivedData.text,
            img_url: receivedData.image,
            sender: 'received'
        }
        const audio = new Audio(notifyAudio);
        audio.play();
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
                const updatedMessages = [...prevMessages];
                updatedMessages[lastIndex] = {
                    ...updatedMessages[lastIndex],
                    sender: 'received',
                    text: reply.text,
                    img_url: reply.img_url
                };
                return updatedMessages;
            }

            // 如果没有找到 'loading' 的消息，直接添加 reply
            return [...prevMessages, reply];
        })
        setSelectedMessageId(receivedData.id)
    }

    const handleSend = async (txt:string) => {
        if (txt !== '') {
            setValue('Chat')
            const response = await fetch('http://127.0.0.1:5010/getMsgId')
            const new_id = await response.json()
            const newMessage: ChatMessage = {
                id: new_id["id"],
                text: txt,
                img_url: "",
                sender: 'sent'
            }
            setMessages(prevMessages => [...prevMessages, newMessage])
            console.log('将发送消息:', inputText);
            setInputText('');
            setSelectedMessageId(new_id["id"])
            gptChatFunction(newMessage.text)
        }
    }      

    const handleTitleClick = (msg_id: number | null, node_id: string) => {
        if(msg_id !== null){
            setSelectedMessageId(msg_id);
            setValue('Chat');
        }
        if(node_id !== ""){
            NetworkMessages.FIND_NODE.send({ nodeId: node_id });
        }
    };

    function switchPage() {
        if (value === 'History') {
            return <HistoryActions actions={actions} onTitleClick={handleTitleClick} />;
        } else {
            return <ChatHistory messages={messages} scrollToMessageId={selectedMessageId}/>
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
                        value={inputText}
                        onChange={(e) => {
                            setInputText(e.target.value);
                            setLastUpdateTime(Date.now());
                        }}
                        autoSize={{ maxRows: 4 }}
                    />
                    <Button type="primary" onClick={() => { handleSend(inputText) }}>发送</Button>
                </Space.Compact>
            </div>
        </div>
    );
}

export default App;