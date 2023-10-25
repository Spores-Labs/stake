import StakeView from '../components/StakeView/StakeView';

const publicRoute = {
  stakeView: {
    path: '/stake-3',
    url: () => `/stake-3`,
    element: <StakeView />,
  },
  // leaderBoard: {
  //   path: '/stake-3/leader-board',
  //   url: () => `/stake-3/leader-board`,
  //   element: <LeaderBoard />,
  // },
};

export default publicRoute;
