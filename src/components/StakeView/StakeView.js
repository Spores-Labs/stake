import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './StakeView.css';
import withWallet from '../HOC/hoc';
import { Container, Tooltip, styled, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { QuestionMark, ExpandMore } from '@mui/icons-material';
import Stake from '../stake/Stake';
import PoolInfor from '../poolInfor/poolInfor';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper';

export const tierList = [
  { code: 'tier-1', name: 'TIER 1', reward: 5000, image: '/assets/images/bonus-tier-1.png' },
  { code: 'tier-2', name: 'TIER 2', reward: 10000, image: '/assets/images/bonus-tier-2.png' },
  { code: 'tier-3', name: 'TIER 3', reward: 20000, image: '/assets/images/bonus-tier-3.png' },
  { code: 'tier-4', name: 'TIER 4', reward: 30000, image: '/assets/images/bonus-tier-4.png' },
  { code: 'tier-5', name: 'TIER 5', reward: 50000, image: '/assets/images/bonus-tier-5.png' },
];

const CustomAccord = styled(Accordion)`
  color: #b7a284;
  & .Mui-expanded {
    color: #f1e9dc !important;
  }
`;

const stakeStatuses = ['open', 'filled'];

const StakeView = (props) => {
  console.log(props)
  // props.onAccountChange();
  const [activeTier, setActiveTier] = useState(tierList[0].code);
  const [stakeStatus, setStakeStatus] = useState();

  const getTierReward = useCallback(() => {
    let tierCode = tierList[0].code;
    tierList.forEach((tier) => {
      if (props.yourStakedBalance * 1 >= tier.reward) {
        tierCode = tier.code;
      }
    });
    setActiveTier(tierCode);
  }, [props.yourStakedBalance]);

  const getStakeStatus = useCallback(() => {
    if (props.stakingCap === props.stakedBalance) {
      setStakeStatus(stakeStatuses[1]);
    } else {
      setStakeStatus(stakeStatuses[0]);
    }
  }, [props.stakedBalance, props.stakingCap]);

  useLayoutEffect(() => {
    getTierReward();
  }, [getTierReward]);

  useEffect(() => {
    getStakeStatus();
  }, [getStakeStatus]);

  const sliderRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  return (
    <div style={{ background: `url('/assets/images/background-staking.png') no-repeat center top / 100%` }}>
      <Container className='flex flex-col items-center py-28 text-color-secondary' style={{ maxWidth: 1364 }}>
        <div className='font-skadi text-giant'>OKG STAKING</div>
        <div
          className='flex justify-center items-center font-bold mb-16 capitalize'
          style={{
            background: stakeStatus === stakeStatuses[0] ? '#6FAF51' : '#615955',
            width: 192,
            height: 38,
            borderRadius: 16,
          }}
        >
          {stakeStatus ?? ''}
        </div>
        <div className='grid grid-cols-2 gap-5 mb-9 w-full'>
          <Stake />
          <PoolInfor />
        </div>
        <div
          className='py-16 px-32'
          style={{
            background: `url('/assets/images/background-bonus.png') no-repeat center top / cover`,
            height: 743,
            width: '100%',
          }}
        >
          <div className='relative font-skadi text-center' style={{ fontSize: 32 }}>
            <Tooltip title={<img src='/assets/images/bonus-tooltip.png' alt='bonus-tooltip' />} placement='right-start'>
              <div
                className='absolute top-1/2 flex justify-center items-center h-7 w-7 bg-color-dark rounded-full'
                style={{ transform: 'translateY(-50%)' }}
              >
                <QuestionMark className='text-color-primary' />
              </div>
            </Tooltip>
            BONUS INGAME ITEMS
          </div>
          <div className='text-center mb-4'>Stake OKG Token to receive ingame items</div>
          <img src={tierList.find((tier) => tier.code === activeTier).image} alt={activeTier} />
          <div className='flex justify-center items-center'>
            <div
              className='relative'
              style={{
                background: `url('/assets/images/bonus-bar.png') no-repeat center center / 100%`,
                width: 884,
                height: 108,
              }}
            >
              {tierList.map((tier, index) => {
                const active = tier.code === activeTier;
                const left = `${(index / (tierList.length - 1)) * 100}%`;

                return (
                  <div key={index}>
                    {active && (
                      <img
                        src={`/assets/images/bonus-arrow-down.png`}
                        alt={tier.name}
                        className='absolute top-0'
                        style={{
                          transform: `translateX(-10px)`,
                          left,
                        }}
                      />
                    )}
                    <img
                      src={`/assets/images/${active ? 'active' : 'deactive'}-bonus-tier.png`}
                      alt={tier.name}
                      className='absolute top-1/2 cursor-pointer'
                      style={{
                        transform: `translate(${active ? -58 : -18}px,-50%)`,
                        left,
                      }}
                      onClick={() => setActiveTier(tier.code)}
                    />
                    <div
                      className='text-center absolute -bottom-8 font-semibold'
                      style={{
                        transform: `translateX(-38px)`,
                        left,
                      }}
                    >
                      <div className='text-sm '>{tier.name}</div>
                      <div className='whitespace-nowrap'>{`${tier.reward} OKG`}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='text-color-primary mb-20'>
          <span style={{ color: '#FF613F' }}>*</span> Item rewards will be transferred into your game account at
          mm/dd/yyyy. Don’t forget to link game account into wallet.
        </div>
        <div className='relative w-full h-full mb-32'>
          <Swiper
            ref={sliderRef}
            pagination={{
              clickable: true,
            }}
            mousewheel
            keyboard
            loop
            modules={[Pagination, Mousewheel, Keyboard, Autoplay]}
            autoplay={{ delay: 10000, pauseOnMouseEnter: true, disableOnInteraction: false }}
          >
            <SwiperSlide>
              <img src='/assets/images/slide-image-1.png' alt='slide' />
            </SwiperSlide>
            <SwiperSlide>
              <img src='/assets/images/slide-image-1.png' alt='slide' />
            </SwiperSlide>
          </Swiper>
          <img
            src='/assets/images/prev-arrow.png'
            alt='prev-arrow'
            className='absolute top-1/2 -translate-y-1/2 -left-14 cursor-pointer'
            onClick={handlePrev}
          />
          <img
            src='/assets/images/next-arrow.png'
            alt='next-arrow'
            className='absolute top-1/2 -translate-y-1/2 -right-14 cursor-pointer'
            onClick={handleNext}
          />
        </div>
        <div className='font-skadi mb-8' style={{ fontSize: 32 }}>
          FAQs
        </div>
        <div className='bg-color-browny px-8 py-5' style={{ borderRadius: 10, maxWidth: 1120 }}>
          <CustomAccord className='bg-color-browny shadow-none'>
            <AccordionSummary className='font-black text-xl p-0' expandIcon={<ExpandMore className='text-white' />}>
              1. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint.
            </AccordionSummary>
            <AccordionDetails
              className='rounded-lg p-8 text-color-secondary'
              style={{ background: '#463831', border: '1px solid #7B593A' }}
            >
              Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Amet minim mollit non deserunt
              ullamco est sit aliqua dolor do amet sint. Amet minim mollit non deserunt ullamco est sit aliqua dolor do
              amet sint. Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet sint. Amet minim mollit non
              deserunt ullamco est sit aliqua dolor do amet sint. Amet minim mollit non deserunt ullamco est sit aliqua
              dolor do amet sint.
            </AccordionDetails>
          </CustomAccord>
        </div>
      </Container>
    </div>
  );
};
export default withWallet(StakeView);
