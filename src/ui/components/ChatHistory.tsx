import React, { useState, useEffect, useRef, useLayoutEffect } from 'react'
import { Button, Dropdown, Flex, Image, message } from 'antd';
import styles from '@ui/components/ChatHistory.module.scss'
import { RetweetOutlined, EllipsisOutlined } from '@ant-design/icons'
import Message from './Message'
import { NetworkMessages } from "@common/network/messages";
import notifyAudio from '@ui/assets/audio/notify.mp3'

interface ChatMessage {
  id: number
  text: string
  img_url: string
  sender: 'sent' | 'received' | 'loading' | 'server'
}

interface ChatBoxProps {
  messages: ChatMessage[]
  scrollToMessageId: number
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

const ChatHistory: React.FC<ChatBoxProps> = ({ messages, scrollToMessageId }) => {

  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // const scrollToBottom = () => {
  //   messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  // }

  // useEffect(() => {
  //   scrollToBottom()
  // }, [messages])

  useLayoutEffect(() => {
    console.log(messageRefs.current)
    if (scrollToMessageId && messageRefs.current[scrollToMessageId]) {
      console.log(scrollToMessageId)
      messageRefs.current[scrollToMessageId]?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [scrollToMessageId, messages]);

  const items = [
    {
      key: '1',
      label: '添加到画布',
    },
    {
      key: '2',
      label: '添加到工作区',
    },
    {
      key: '3',
      label: '拒绝',
    }
  ];

  const handleMenuClick = (msg: ChatMessage) => async (e: any) => {
    console.log('Menu item clicked:', e.key);
    const lastReceived = messages.filter(msg => msg.sender === 'received').pop()
    if (msg === lastReceived && (e.key === '1' || e.key === '2')) {
      console.log('last received message')
      const response = await fetch('http://127.0.0.1:5010/recount')
      const res = await response.json()
      console.log(res)
    }
    if (e.key === '1') {
      NetworkMessages.ADD_CONTENT.send({ text: msg.text, img_url: msg.img_url })
      commitUserAttitude(msg, true)
      const audio = new Audio(notifyAudio);
      audio.play();
    } else if (e.key === '2') {
      NetworkMessages.ADD_CONTENT_IN_AI.send({ text: msg.text, img_url: msg.img_url })
      commitUserAttitude(msg, true)
      const audio = new Audio(notifyAudio);
      audio.play();
    } else if (e.key === '3') {
      commitUserAttitude(msg, false)
    }
  };

  return (
    <div className={styles['chatHistory']}>
      {messages.map(msg => (
        <div
            key={msg.id}
            ref={(el) => (messageRefs.current[msg.id] = el)}
            className={styles[`message-row-${msg.sender}`]}
        >
          <Message text={msg.text} img_url={msg.img_url} sender={msg.sender} />
          {(msg.sender === 'received' || msg.sender === 'server') && (
            <Dropdown menu={{ items, onClick: handleMenuClick(msg) }} >
              <Button className={styles['icon-button']} shape="circle" type='text' icon={<EllipsisOutlined />} size='small' />
            </Dropdown>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  )
}

export default ChatHistory
