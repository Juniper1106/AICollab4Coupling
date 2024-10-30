import React from 'react'
import styles from './Message.module.scss'
import {Image} from "antd"

interface MessageProps {
    text: string
    img_url: string
    sender: 'sent' | 'received'
}

const Message: React.FC<MessageProps> = ({ text, img_url, sender }) => (
    <div className={styles[`message-${sender}`]}>
        {(text !== '')&&<div className={styles[`text`]} dangerouslySetInnerHTML={{ __html: text.replace(/(\n|\r|\r\n)/g, '<br />') }} />}
        {(img_url !== '')&&<Image width={80} src={img_url}/>}
    </div>
)

export default Message