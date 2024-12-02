import React from 'react';
import { Timeline } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import '@ui/components/CurrentAndUpcomingAction.scss';

interface AI_action {
  id: number
  msg_id: number | null
  node_id: string
  title: string
  action: string
  description: string
}

interface CurrentActionProps {
  currentAction: AI_action | null
  isCurrentActionFinish: boolean
  isCurrentActionSuccess: boolean
  nextAction: string
}

const App: React.FC<CurrentActionProps> = ({currentAction, isCurrentActionFinish, isCurrentActionSuccess, nextAction}) => {
  const getActionDescription = (title: string | undefined): string => {
    if(isCurrentActionFinish){
      if(isCurrentActionSuccess){
        if (title === "主动交流" || title === "生成回复" || title === "主动交流&编辑画布") {
          return "分析已完成！当前空闲";
        } else if (title === "编辑画布") {
          return "操作画布已完成！当前空闲";
        }
      }
      else{
        return "发生错误！";
      }
    }
    else{
      if (title === "主动交流" || title === "生成回复" || title === "主动交流&编辑画布") {
        return "分析中";
      } else if (title === "编辑画布") {
        return "操作画布中";
      }
    }
    return title || "暂无操作"; // 默认显示 `title`，如果 `title` 为 undefined，则显示 "未知操作"
  };

  return (
    <div className='currentAndUpcomingActionArea'>
      <Timeline
        items={[
          {
            children: getActionDescription(currentAction?.title),
            dot: isCurrentActionFinish ? undefined : <SyncOutlined spin />,
            color: isCurrentActionFinish
              ? currentAction
                ? isCurrentActionSuccess
                  ? "green" // 成功时绿色
                  : "red"   // 失败时红色
                : "gray"
              : undefined, // 未完成时无颜色
          },
          {
            children: `即将进行：${nextAction}`,
            color: 'gray',
          },
        ]}
      />
    </div>
  )
}

export default App;