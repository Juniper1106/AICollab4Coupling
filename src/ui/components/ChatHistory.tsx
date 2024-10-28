import React, { useState, useEffect, useRef } from 'react'
import styles from '@ui/components/ChatHistory.module.scss'
import { message } from 'antd'
import { Button, Image} from 'antd'
import { RetweetOutlined } from '@ant-design/icons'
import Message from './Message'

interface ChatMessage {
  text: string
  img_url: string
  sender: 'sent' | 'received'
}

interface ChatBoxProps {
  messages: ChatMessage[]
  addAItext: (str: string) => void  // 定义传入的函数类型
}

const ChatHistory: React.FC<ChatBoxProps> = ({messages, addAItext}) => {
    
    const [inputText, setInputText] = useState('')

    const [messageApi, contextHolder] = message.useMessage()

    // 从后端恢复数据
    // const restoreData = async () => {
    //     const msg_response = await fetch('http://127.0.0.1:5010/api/getMessages')
    //     const savedMsg = await msg_response.json()
    //     setMessages(savedMsg)
    // }

    // 将数据保存到后端
    // const saveData = async () => {
    //     await fetch('http://127.0.0.1:5650/api/saveMessages', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(messages),
    //     })
    // }

    // useEffect(() => {
    //     // 组件挂载时恢复数据
    //     restoreData()
    // }, [])

    

    const Addmsg = (text: string) => {
        addAItext(text)
    }

    const messagesEndRef = useRef<HTMLDivElement | null>(null)

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    return (
      <div className={styles['chatHistory']}>
        {messages.map(msg => (
          <div className={styles[`message-row-${msg.sender}`]}>
            <Message text={msg.text} img_url={msg.img_url} sender={msg.sender}/>
            {(msg.sender === 'received')&&<Button className={styles['icon-button']} shape="circle" type='text' icon={<RetweetOutlined/>} size='small' onClick={() => Addmsg(msg.text)}/>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    )
}

export default ChatHistory
