import StakeView from '../components/StakeView/StakeView';
import { LeaderBoard } from '../components/LeaderBoard';

const publicRoute = {
  stakeView: {
    path: '/stake2/stake',
    url: () => `/stake2/stake`,
    element: <StakeView />,
  },
  leaderBoard: {
    path: '/stake2/leader-board',
    url: () => `/stake2/leader-board`,
    element: <LeaderBoard />,
  },
};

export default publicRoute;
