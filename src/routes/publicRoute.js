import StakeView from '../components/StakeView/StakeView';

const publicRoute = {
  stakeView: {
    path: '/stake',
    url: () => `/stake`,
    element: <StakeView />,
  },
};

export default publicRoute;
