import './LeaderBoard.css';
import { Container } from '@mui/material';

const LeaderBoard = () => {
  return (
    <div
      style={{
        background: `url('/assets/images/background-leaderBoard.png') no-repeat center top / 100%`,
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Container className='flex flex-col items-center py-20 md:py-28 text-color-secondary custom-container'>
        <div className='font-skadi text-5xl mb-9'>LEADERBOARD OF STAKERS</div>
        <div className='flex gap-5 w-full mb-32'>
          <div className='relative flex-1'>
            <img src='/assets/images/leaderBoard-hero-1.png' alt='hero-1' className='mt-28' />
            <img src='/assets/images/leaderBoard-top-2.png' alt='top-2' className='absolute bottom-0 right-0' />
            <img src='/assets/images/leaderBoard-gold-1.png' alt='gold-1' className='absolute -bottom-20' />
          </div>
          <div>
            <img src='/assets/images/leaderBoard-top-1.png' alt='top-1' />
          </div>
          <div className='relative flex-1 flex justify-end'>
            <img src='/assets/images/leaderBoard-hero-2.png' alt='hero-2' className='mt-28' />
            <img src='/assets/images/leaderBoard-top-3.png' alt='top-3' className='absolute bottom-0 left-0' />
            <img src='/assets/images/leaderBoard-gold-2.png' alt='gold-2' className='absolute -bottom-28 right-10' />
          </div>
        </div>
        <div
          className='bg-color-dark w-full flex flex-col items-center'
          style={{
            background: `url('/assets/images/frame-leaderBoard.png') no-repeat center top`,
            backgroundSize: '100% 100%',
            height: 1025,
            maxWidth: 1240,
          }}
        >
          <div
            style={{
              background: `url('/assets/components/yellow_trapezium.png') no-repeat center top`,
              backgroundSize: '100% 100%',
              fontSize: 35,
              // height: 1025,
              // maxWidth: 1240,
            }}
            className='text-center text-color-secondary font-skadi w-fit py-5 px-32'
          >
            TOP STAKERS
          </div>
        </div>
      </Container>
    </div>
  );
};

export default LeaderBoard;
