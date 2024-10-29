import React from 'react';
import { Timeline } from 'antd';
import { SyncOutlined } from '@ant-design/icons';
import '@ui/components/CurrentAndUpcomingAction.scss';

const App: React.FC = () => (
    <div className='currentAndUpcomingActionArea'>
        <Timeline
          items={[
            {
              children: 'Create a services site 2015-09-01',
              dot: <SyncOutlined spin />,
            },
            {
              children: 'Solve initial network problems 2015-09-01',
              color: 'gray',
            },
          ]}
        />
    </div>
);

export default App;