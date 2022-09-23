import StakeView from '../components/StakeView/StakeView';
import { LeaderBoard } from '../components/LeaderBoard';

const publicRoute = {
  stakeView: {
    path: '/stake',
    url: () => `/stake`,
    element: <StakeView />,
  },
  leaderBoard: {
    path: '/leader-board',
    url: () => `/leader-board`,
    element: <LeaderBoard />,
  },
};

export default publicRoute;
