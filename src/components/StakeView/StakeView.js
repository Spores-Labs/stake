import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './StakeView.css';
import { Container, Tooltip, styled, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import { QuestionMark, ExpandMore } from '@mui/icons-material';
import Stake from '../stake/Stake';
import PoolInfor from '../poolInfor/poolInfor';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../reducers/profile';
import { contractInfosSelector } from '../../reducers/contractInfos';
import { DateTime } from 'luxon';
import { useMemo } from 'react';

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

export const poolStatuses = ['waiting', 'live', 'lock', 'expired'];

const getChangeTime = (nextTime, prevTime = DateTime.now().toSeconds()) => {
  return (nextTime - prevTime) * 1000;
};

const accordContents = [
  {
    title: '1.What is OKG staking pool? ',
    description:
      'OKG staking pool is the program to reward for long term OKG holders by offering the high earning yields by OKG token.\n\nIn addition, the benefits from OKG staking program are not only from the OKG token rewards (APR) but also the bonus valuable in-game items.\n\nItem rewards scheme here.',
  },
  {
    title: '2. How can I receive the OKG token rewards?',
    description:
      'Rewards will be calculated based on your staked amount, then automatically added when you un-stake your token at the expiry time.\n\nYour reward = Your Staked Amount * APR / 365\n\nAPR is up to ....%. APR is totally dependent on the total amount of investment in the pool.',
  },
  {
    title: '3. How can I receive the in-game item rewards?',
    description:
      'The in-game item rewards will be transferred into your game account which linked your wallet after the game launched.\n\nMore details about the use of items here.',
  },
  {
    title: '4. When can I un-stake my OKG token?',
    description: 'You are able to un-stake your token at the expiry time.',
  },
  {
    title: '5. How to stake?',
    description:
      'Step 1. Go to OKG staking page (hyperlink: .....)\nStep 2. Connect your crypto wallet\nStep 3. Input amount to stake\nStep 4: Sign on metamask to confirm the transaction',
  },
  {
    title: '6. How to unstake?',
    description:
      'Step 1. Go to OKG staking page (hyperlink: .....)\nStep 2. Connect your crypto wallet\nStep 3. Click unstake\nStep 4: Sign on metamask to confirm the transaction',
  },
];

const SingleAccord = ({ title, description }) => (
  <CustomAccord className='bg-color-browny shadow-none'>
    <AccordionSummary className='font-black text-xl p-0' expandIcon={<ExpandMore className='text-white' />}>
      {title}
    </AccordionSummary>
    <AccordionDetails
      className='rounded-lg p-8 text-color-secondary whitespace-pre-wrap'
      style={{ background: '#463831', border: '1px solid #7B593A' }}
    >
      {description}
    </AccordionDetails>
  </CustomAccord>
);

const StakeView = () => {
  const { yourStakedBalance } = useSelector(profileSelector);
  const props = useSelector(contractInfosSelector);
  const timerRef = useRef();
  const [activeTier, setActiveTier] = useState(tierList[0].code);
  const [stakeStatus, setStakeStatus] = useState();
  const [poolStatus, setPoolStatus] = useState();

  const [triggerRender, setTriggerRender] = useState({});

  const getPoolStatus = () => {
    const now = DateTime.now().toSeconds();
    let status = poolStatuses[0];
    if (now > props.stakingStart * 1 && now <= props.stakingEnds * 1) {
      status = poolStatuses[1];
    } else if (now > props.stakingEnds * 1 && now <= props.earlyWithdraw * 1) {
      status = poolStatuses[2];
    } else if (now > props.earlyWithdraw * 1) {
      status = poolStatuses[3];
    }
    setPoolStatus(status);
    setTriggerRender({});
  };

  const tasks = useMemo(() => {
    const tasksTmp = [[getPoolStatus, 0]];
    if (getChangeTime(Number(props.stakingStart)) > 0) {
      tasksTmp.push([getPoolStatus, getChangeTime(Number(props.stakingStart))]);
      tasksTmp.push([getPoolStatus, getChangeTime(Number(props.stakingEnds), Number(props.stakingStart))]);
      tasksTmp.push([getPoolStatus, getChangeTime(Number(props.earlyWithdraw), Number(props.stakingEnds))]);
    } else {
      if (getChangeTime(Number(props.stakingEnds)) > 0) {
        tasksTmp.push([getPoolStatus, getChangeTime(Number(props.stakingEnds))]);
        tasksTmp.push([getPoolStatus, getChangeTime(Number(props.earlyWithdraw), Number(props.stakingEnds))]);
      } else {
        if (getChangeTime(Number(props.earlyWithdraw)) > 0) {
          tasksTmp.push([getPoolStatus, getChangeTime(Number(props.earlyWithdraw))]);
        }
      }
    }

    return tasksTmp;
  }, [props.stakingEnds, props.earlyWithdraw]);

  const getTierReward = useCallback(() => {
    let tierCode = tierList[0].code;
    tierList.forEach((tier) => {
      if (yourStakedBalance * 1 >= tier.reward) {
        tierCode = tier.code;
      }
    });
    setActiveTier(tierCode);
  }, [yourStakedBalance]);

  const getStakeStatus = useCallback(() => {
    if (props.stakingCap === props.stakedBalance || (!!poolStatus && poolStatuses.indexOf(poolStatus) > 1)) {
      setStakeStatus(stakeStatuses[1]);
    } else {
      setStakeStatus(stakeStatuses[0]);
    }
  }, [poolStatus, props.stakedBalance, props.stakingCap]);

  useEffect(() => {
    const task = tasks.shift();
    if (!task) return;

    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(...task);

    return () => {
      clearTimeout(timerRef.current);
    };
  }, [tasks, triggerRender]);

  useEffect(() => {
    getStakeStatus();
  }, [getStakeStatus]);

  useLayoutEffect(() => {
    getTierReward();
  }, [getTierReward]);

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
      <Container className='flex flex-col items-center py-28 text-color-secondary custom-container'>
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
          <Stake poolStatus={poolStatus} />
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
          {accordContents.map((accord, index) => (
            <SingleAccord key={index} title={accord.title} description={accord.description} />
          ))}
        </div>
      </Container>
    </div>
  );
};
export default StakeView;
