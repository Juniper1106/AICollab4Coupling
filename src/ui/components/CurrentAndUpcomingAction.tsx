import React from 'react';
import { Timeline } from 'antd';
import '@ui/components/CurrentAndUpcomingAction.scss';

const App: React.FC = () => (
    <div className='currentAndUpcomingActionArea'>
        <Timeline
          items={[
            {
              children: 'Create a services site 2015-09-01',
            },
            {
              children: 'Solve initial network problems 2015-09-01',
            },
          ]}
        />
    </div>
);

export default App;