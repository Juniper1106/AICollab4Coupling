import { List, Typography } from 'antd';
import "@ui/components/HistoryActions.scss"

const data = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  // {
  //   title: 'Ant Design Title 3',
  // },
  // {
  //   title: 'Ant Design Title 4',
  // },
];

const { Title } = Typography;

function HistoryActions() {
    return (
        <div className='historyActions'>
          <Title level={5}>AI行为历史</Title>
          <List
            itemLayout="horizontal"
            dataSource={data}
            renderItem={(item, index) => (
              <List.Item>
                <List.Item.Meta
                  title={<a href="https://ant.design">{item.title}</a>}
                  description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                />
              </List.Item>
            )}
          />
        </div>
    )
}

export default HistoryActions;