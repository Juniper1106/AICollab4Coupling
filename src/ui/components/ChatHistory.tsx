import React, { useState, useEffect, useRef } from 'react'
import styles from '@ui/components/ChatHistory.module.scss'
import { message } from 'antd'
import { Button, Image} from 'antd'
import { RetweetOutlined, CloseCircleOutlined, CheckCircleOutlined } from '@ant-design/icons'
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

async function commitUserAttitude(msg: ChatMessage, attitude: boolean) {
  const payload = {
    text: msg.text,
    img_url: msg.img_url,
    attitude: attitude,
    timeStamp: new Date().getTime()
  }
  console.log('sending user attitude', payload)
  await fetch(
	  'http://127.0.0.1:5010/save_attitude',
	  {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json'
		},
		body: JSON.stringify(payload)
	  }
	).then(
	  response => response.text()
	).then(
	  text => console.log(text)
	).catch(
	  error => console.error(error)
	)
}

const ChatHistory: React.FC<ChatBoxProps> = ({messages, addAItext}) => {
    
    const [inputText, setInputText] = useState('')

    const [messageApi, contextHolder] = message.useMessage()

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
            {/* {(msg.sender === 'received')&&<Button className={styles['icon-button-accept']} shape="circle" type='text' icon={<CheckCircleOutlined />} size='small' onClick={() => commitUserAttitude(msg, true)}/>}
            {(msg.sender === 'received')&&<Button className={styles['icon-button-deny']} shape="circle" type='text' icon={<CloseCircleOutlined />} size='small' onClick={() => commitUserAttitude(msg, false)}/>} */}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
    )
}

export default ChatHistory
