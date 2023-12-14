import StakeView from '../components/StakeView/StakeView';

const publicRoute = {
  stakeView: {
    path: '/stake-4',
    url: () => `/stake-4`,
    element: <StakeView />,
  },
  // leaderBoard: {
  //   path: '/stake-3/leader-board',
  //   url: () => `/stake-3/leader-board`,
  //   element: <LeaderBoard />,
  // },
};

export default publicRoute;
