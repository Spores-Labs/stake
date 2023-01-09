import StakeView from '../components/StakeView/StakeView';

const publicRoute = {
  stakeView: {
    path: '/stake-2',
    url: () => `/stake-2`,
    element: <StakeView />,
  },
  // leaderBoard: {
  //   path: '/stake-2/leader-board',
  //   url: () => `/stake-2/leader-board`,
  //   element: <LeaderBoard />,
  // },
};

export default publicRoute;
