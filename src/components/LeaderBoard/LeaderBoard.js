import './StakeView.css';
import { Container } from '@mui/material';

const StakeView = () => {
  return (
    <div
      style={{
        background: `url('/assets/images/background-staking.png') no-repeat center top / 100%}`,
      }}
    >
      <Container className='flex flex-col items-center py-20 md:py-28 text-color-secondary custom-container'></Container>
    </div>
  );
};
export default StakeView;
