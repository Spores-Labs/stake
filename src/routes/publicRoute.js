import StakeView from '../components/StakeView/StakeView';

const publicRoute = {
  stakeView: {
    path: '/stake2',
    url: () => `/stake2`,
    element: <StakeView />,
  },
  // leaderBoard: {
  //   path: '/stake2/leader-board',
  //   url: () => `/stake2/leader-board`,
  //   element: <LeaderBoard />,
  // },
};

export default publicRoute;
