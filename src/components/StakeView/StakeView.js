import React, { useCallback, useEffect, useRef, useState } from 'react';
import './StakeView.css';
import {
  Container,
  Tooltip,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  ClickAwayListener,
  IconButton,
} from '@mui/material';
import { QuestionMark, ExpandMore } from '@mui/icons-material';
import Stake from '../stake/Stake';
import PoolInfor from '../poolInfor/poolInfor';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Mousewheel, Keyboard, Autoplay } from 'swiper';
import { useSelector } from 'react-redux';
import { contractInfosSelector } from '../../reducers/contractInfos';
import { DateTime } from 'luxon';
import { useMemo } from 'react';
import useWindowDimensions from '../../hooks/useWindowDimensions';

export const tierList = [
  {
    code: 'tier-1',
    name: 'TIER 1',
    reward: 2500,
    image: 'assets/stake-4/images/bonus-tier-1.png',
    imageMobile: 'assets/stake-4/images/bonus-tier-1-mobile.png',
    isBestValue: false,
  },
  {
    code: 'tier-2',
    name: 'TIER 2',
    reward: 5000,
    image: 'assets/stake-4/images/bonus-tier-2.png',
    imageMobile: 'assets/stake-4/images/bonus-tier-2-mobile.png',
    isBestValue: false,
  },
  {
    code: 'tier-3',
    name: 'TIER 3',
    reward: 10000,
    image: 'assets/stake-4/images/bonus-tier-3.png',
    imageMobile: 'assets/stake-4/images/bonus-tier-3-mobile.png',
    isBestValue: false,
  },
  {
    code: 'tier-4',
    name: 'TIER 4',
    reward: 20000,
    image: 'assets/stake-4/images/bonus-tier-4.png',
    imageMobile: 'assets/stake-4/images/bonus-tier-4-mobile.png',
    isBestValue: false,
  },
  {
    code: 'tier-5',
    name: 'TIER 5',
    reward: 40000,
    image: 'assets/stake-4/images/bonus-tier-5.png',
    imageMobile: 'assets/stake-4/images/bonus-tier-5-mobile.png',
    isBestValue: false,
  },
  {
    code: 'tier-6',
    name: 'TIER 6',
    reward: 60000,
    image: 'assets/stake-4/images/bonus-tier-6.png',
    imageMobile: 'assets/stake-4/images/bonus-tier-6-mobile.png',
    isBestValue: false,
  },
  {
    code: 'tier-7',
    name: 'TIER 7',
    reward: 80000,
    image: 'assets/stake-4/images/bonus-tier-7.png',
    imageMobile: 'assets/stake-4/images/bonus-tier-7-mobile.png',
    isBestValue: false,
  },
  {
    code: 'tier-8',
    name: 'TIER 8',
    reward: 100000,
    image: 'assets/stake-4/images/bonus-tier-8.png',
    imageMobile: 'assets/stake-4/images/bonus-tier-8-mobile.png',
    isBestValue: false,
  },
  {
    code: 'tier-9',
    name: 'TIER 9',
    reward: 200000,
    image: 'assets/stake-4/images/bonus-tier-9.png',
    imageMobile: 'assets/stake-4/images/bonus-tier-9-mobile.png',
    isBestValue: true,
  },
];

const CustomAccord = styled(Accordion)`
  color: #b7a284;
  & .Mui-expanded {
    color: #f1e9dc !important;
  }
`;

const CustomSwiper = styled(Swiper)`
  & .swiper-wrapper {
    padding: 0px !important;
  }
`;

const stakeStatuses = ['coming soon', 'open', 'filled'];

export const poolStatuses = ['waiting', 'live', 'lock', 'expired'];

const getChangeTime = (nextTime, prevTime = DateTime.now().toSeconds()) => {
  return (nextTime - prevTime) * 1000;
};

const componentIds = ['stake-section', 'item-rewards'];

const scrollToComponent = (id) => {
  const com = document.getElementById(id);
  const destination = com.offsetTop - 100;
  document.body.scrollTop = destination;
  document.documentElement.scrollTop = destination;
};

const accordContents = [
  {
    title: '1.What is OKG staking pool? ',
    description: (
      <div>
        OKG staking pool is the program to reward OKG holders by offering high earning yields of OKG token.
        <br />
        <br />
        In addition, the benefits from OKG staking program are{' '}
        <span className='font-black'>
          not only from the OKG token rewards (APR) but also from the valuable NFT & in-game items.
        </span>
        <br />
        <br />
        See item rewards scheme{' '}
        <span className='underline cursor-pointer' onClick={() => scrollToComponent(componentIds[1])}>
          here
        </span>
        .
      </div>
    ),
  },
  {
    title: '2. How can I received token rewards?',
    description: (
      <div>
        Rewards will be calculated based on your staked amount, and is automatically added when you unstake your token{' '}
        <span className='font-black'>at the expiry time.</span>
        <br />
        <br />
        OKG token rewards = your staked amount * APR * days staked/365
      </div>
    ),
  },
  {
    title: '3. How can I receive the in-game & NFT item rewards?',
    description: (
      <div>
        The in-game item rewards will be transferred into your game account. You should link your wallet with this game
        account to receive these in-game items.
        <br />
        <br />
        The NFT item & KAB token rewards will be airdropped into your wallet.
        <br />
        <br />
        The detailed reward schedule will be announced on Ookeenga social media channel.
      </div>
    ),
  },
  {
    title: '4. When can I unstake my OKG token?',
    description: 'You are able to unstake your token at the expiry time.',
  },
  {
    title: '5. How can I stake OKG?',
    description: (
      <div>
        Step 1. Go to{' '}
        <span className='underline cursor-pointer' onClick={() => scrollToComponent(componentIds[0])}>
          OKG staking page
        </span>
        <br />
        Step 2. Connect your wallet
        <br />
        Step 3. Input amount to stake
        <br />
        Step 4: Sign on your wallet to confirm the transaction
      </div>
    ),
  },
  {
    title: '6. How can I unstake OKG?',
    description: (
      <div>
        Step 1. Go to{' '}
        <span className='underline cursor-pointer' onClick={() => scrollToComponent(componentIds[0])}>
          OKG staking page
        </span>
        <br />
        Step 2. Connect your wallet
        <br />
        Step 3. Click unstake
        <br />
        Step 4: Sign on your wallet to confirm the transaction
      </div>
    ),
  },
];

const slides = [
  'assets/images/slide-image-1.png',
  'assets/images/slide-image-2.png',
  'assets/images/slide-image-3.png',
];

const SingleAccord = ({ title, description }) => (
  <CustomAccord className='bg-color-browny shadow-none'>
    <AccordionSummary
      className='font-black text-[13px] md:text-base p-0'
      expandIcon={<ExpandMore className='text-white' />}
    >
      {title}
    </AccordionSummary>
    <AccordionDetails
      className='rounded-lg p-6 md:p-8 text-color-secondary whitespace-pre-wrap text-xs md:text-base'
      style={{ background: '#463831', border: '1px solid #7B593A' }}
    >
      {description}
    </AccordionDetails>
  </CustomAccord>
);

const StakeView = () => {
  const { isMobile } = useWindowDimensions();
  // const { yourStakedBalance } = useSelector(profileSelector);
  const { isCalled: isCalledContract, ...props } = useSelector(contractInfosSelector);
  const timerRef = useRef();
  const [activeTier, setActiveTier] = useState(0);
  const [stakeStatus, setStakeStatus] = useState();
  const [poolStatus, setPoolStatus] = useState();
  const [triggerRender, setTriggerRender] = useState({});
  const [openTooltip, setOpenTooltip] = useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  const getPoolStatus = useCallback(() => {
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
  }, [props.earlyWithdraw, props.stakingEnds, props.stakingStart]);

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
  }, [getPoolStatus, props.earlyWithdraw, props.stakingEnds, props.stakingStart]);

  // const getTierReward = useCallback(() => {
  //   let tierCode = tierList[0].code;
  //   tierList.forEach((tier) => {
  //     if (yourStakedBalance * 1 >= tier.reward) {
  //       tierCode = tier.code;
  //     }
  //   });
  //   setActiveTier(tierCode);
  // }, [yourStakedBalance]);

  const getStakeStatus = useCallback(() => {
    if (props.stakingCap === props.stakedBalance || (!!poolStatus && poolStatuses.indexOf(poolStatus) > 1)) {
      setStakeStatus(stakeStatuses[2]);
    } else if (poolStatuses.indexOf(poolStatus) === 1) {
      setStakeStatus(stakeStatuses[1]);
    } else if (poolStatuses.indexOf(poolStatus) === 0) {
      setStakeStatus(stakeStatuses[0]);
    }
  }, [poolStatus, props.stakedBalance, props.stakingCap]);

  useEffect(() => {
    const task = tasks.shift();
    if (!task) return;

    // clearTimeout(timerRef.current);
    timerRef.current = setTimeout(...task);

    // return () => {
    //   clearTimeout(timerRef.current);
    // };
  }, [tasks, triggerRender]);

  useEffect(() => {
    getStakeStatus();
  }, [getStakeStatus]);

  // useLayoutEffect(() => {
  //   getTierReward();
  // }, [getTierReward]);

  const sliderRef = useRef(null);
  const sliderBonusRef = useRef(null);

  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slidePrev();
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    sliderRef.current.swiper.slideNext();
  }, []);

  const handleNextTier = useCallback(() => {
    sliderBonusRef.current.swiper.slideNext();
  }, []);

  const handlePrevTier = useCallback(() => {
    sliderBonusRef.current.swiper.slidePrev();
  }, []);

  const AlterTooltip = ({ isClickable }) => (
    <ClickAwayListener onClickAway={handleTooltipClose}>
      <Tooltip
        {...(isClickable
          ? {
              PopperProps: {
                disablePortal: true,
              },
              onClose: handleTooltipClose,
              open: openTooltip,
              disableFocusListener: true,
              disableHoverListener: true,
              disableTouchListener: true,
            }
          : {})}
        title={<img src='assets/stake-4/images/bonus-tooltip.png' alt='bonus-tooltip' />}
        placement={`${isClickable ? 'left' : 'right'}-start`}
      >
        <div
          className='absolute top-1/2 right-0 md:left-0 flex justify-center items-center h-5 md:h-7 w-5 md:w-7 bg-color-dark rounded-full'
          style={{ transform: 'translateY(-50%)' }}
          {...(isClickable ? { onClick: handleTooltipOpen } : {})}
        >
          <QuestionMark className='text-color-primary text-xl md:text-2xl' />
        </div>
      </Tooltip>
    </ClickAwayListener>
  );

  return (
    <div
      style={{
        background: `url('assets/images/background-staking.png') no-repeat center top ${isMobile ? '' : '/ 100%'}`,
      }}
    >
      <Container className='flex flex-col items-center py-20 md:py-28 text-color-secondary container-page'>
        <div className='font-skadi text-xl md:text-giant mb-2 md:mb-0'>OKG STAKING POOL 4</div>
        <div
          className='mb-4'
          style={{
            width: isMobile ? 84 : 192,
            height: isMobile ? 25 : 38,
          }}
        >
          {isCalledContract && (
            <div
              className='flex justify-center items-center w-full h-full font-bold capitalize text-xs md:text-base'
              style={{
                background: stakeStatus === stakeStatuses[2] ? '#D73432' : '#6FAF51',
                borderRadius: 16,
              }}
            >
              {stakeStatus ?? ''}
            </div>
          )}
        </div>
        <div
          className='mb-10 md:mb-[72px] text-sm text-center md:text-lg text-white py-2 px-14'
          style={{
            background:
              'linear-gradient(90deg, rgba(209, 148, 57, 0) 0%, #CE933A 15.63%, #FF7B31 49.48%, #D8AA64 84.9%, rgba(206, 147, 59, 0) 100%)',
          }}
        >
          30,000 KAB and 40 Treasure Chests are Waiting for Level 9 Staker
        </div>
        <div className='flex flex-col-reverse md:grid md:grid-cols-2 gap-4 md:gap-5 mb-8 md:mb-9 w-full'>
          <Stake poolStatus={poolStatus} id={componentIds[0]} />
          <PoolInfor />
        </div>
        <div
          className='py-8 md:py-16 px-8 md:px-32'
          id={componentIds[1]}
          style={{
            background: `url('${
              isMobile ? 'assets/stake-4/images/background-bonus-mobile.png' : 'assets/images/background-bonus.png'
            }') no-repeat center top / 100% 100%`,
            height: isMobile ? 'auto' : 743,
            width: '100%',
          }}
        >
          <div className='relative font-skadi text-center' style={{ fontSize: isMobile ? 20 : 32 }}>
            {isMobile ? <AlterTooltip isClickable /> : <AlterTooltip />}
            BONUS REWARDS
          </div>
          <div className='text-center mb-3 md:mb-4 text-xs md:text-base'>
            Stake OKG Token to receive Genesis Cocoons, KAB token & valuable ingame items
          </div>
          <div className='relative mb-12'>
            <CustomSwiper
              ref={sliderBonusRef}
              onActiveIndexChange={(swiper) => {
                var activeIndex = swiper?.activeIndex ?? 0;
                if (activeIndex > tierList.length) {
                  activeIndex = 1;
                }
                setActiveTier(activeIndex - 1);
              }}
              {...{
                pagination: false,
              }}
              mousewheel
              keyboard
              loop
              modules={[Pagination, Mousewheel, Keyboard, Autoplay]}
              autoplay={{ delay: 5000, pauseOnMouseEnter: true, disableOnInteraction: false }}
            >
              {tierList.map((slide, index) => (
                <SwiperSlide key={index}>
                  <img src={isMobile ? slide.imageMobile : slide.image} alt='slide' className='w-full' />
                </SwiperSlide>
              ))}
            </CustomSwiper>
            <IconButton
              className='flex justify-start items-center md:hidden absolute top-28 left-3 h-8 w-8 z-50'
              style={{ background: 'rgba(183, 162, 132, 0.2)' }}
              onClick={handlePrevTier}
            >
              <img src='assets/images/prev-arrow.png' alt='prev-arrow' className='w-3' />
            </IconButton>
            <IconButton
              className='flex justify-end items-center md:hidden absolute top-28 right-3 h-8 w-8 z-50'
              style={{ background: 'rgba(183, 162, 132, 0.2)' }}
              onClick={handleNextTier}
            >
              <img src='assets/images/next-arrow.png' alt='next-arrow' className='w-3' />
            </IconButton>
          </div>
          <div className='hidden md:flex justify-center items-center px-6'>
            <div
              className='relative grid grid-cols-8'
              style={{
                background: `url('assets/images/bonus-bar-deactive.png') no-repeat center center / cover`,
                width: '100%',
                height: 12,
              }}
            >
              {tierList.map((tier, index) => {
                const isActiveBar = index < activeTier;
                const active = index === activeTier;
                const left = `${(index / (tierList.length - 1)) * 100}%`;

                return (
                  <div
                    key={index}
                    style={{
                      background: isActiveBar
                        ? `url('assets/images/bonus-bar-active.png') no-repeat center center / cover`
                        : '',
                      height: 12,
                    }}
                  >
                    {active && (
                      <img
                        src={`assets/images/bonus-arrow-down.png`}
                        alt={tier.name}
                        className='absolute -top-12'
                        style={{
                          transform: `translateX(-10px)`,
                          left,
                        }}
                      />
                    )}
                    <img
                      src={`assets/stake-4/images/${
                        tier.isBestValue ? 'best' : active ? 'active' : 'deactive'
                      }-bonus-tier.png`}
                      alt={tier.name}
                      className={`absolute top-1/2 cursor-pointer ${tier.isBestValue || active ? '' : 'h-6'}`}
                      style={{
                        transform: `translate(${tier.isBestValue ? -26.5 : active ? -58 : -18}px,-50%)`,
                        left,
                      }}
                      onClick={() => {
                        sliderBonusRef.current.swiper.slideTo(index + 1);
                      }}
                    />
                    <div
                      className='text-center absolute -bottom-20 font-semibold'
                      style={{
                        transform: `translateX(-38px)`,
                        left,
                      }}
                    >
                      <div className='text-sm '>{tier.name}</div>
                      <div className='whitespace-nowrap'>{`${tier.reward.toLocaleString()} OKG`}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className='text-color-primary mb-8 md:mb-20 text-xs md:text-base text-center'>
          <span style={{ color: '#FF613F' }}>*</span> Item rewards will be transferred into your game account. Don’t
          forget to link game account into wallet.
        </div>
        <div className='relative w-full h-full md:mb-32'>
          <Swiper
            ref={sliderRef}
            {...{
              pagination: isMobile
                ? false
                : {
                    clickable: true,
                  },
            }}
            mousewheel
            keyboard
            loop
            modules={[Pagination, Mousewheel, Keyboard, Autoplay]}
            autoplay={{ delay: 10000, pauseOnMouseEnter: true, disableOnInteraction: false }}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <img src={slide} alt='slide' style={{ borderRadius: 16 }} />
              </SwiperSlide>
            ))}
          </Swiper>
          <img
            src='assets/images/prev-arrow.png'
            alt='prev-arrow'
            className='hidden md:block absolute top-1/2 -translate-y-1/2 -left-14 cursor-pointer'
            onClick={handlePrev}
          />
          <img
            src='assets/images/next-arrow.png'
            alt='next-arrow'
            className='hidden md:block absolute top-1/2 -translate-y-1/2 -right-14 cursor-pointer'
            onClick={handleNext}
          />
        </div>
        <div className='font-skadi mb-4 md:mb-8' style={{ fontSize: isMobile ? 20 : 32 }}>
          FAQs
        </div>
        <div className='bg-color-browny px-4 py-2.5 md:px-8 md:py-5' style={{ borderRadius: 10, maxWidth: 1120 }}>
          {accordContents.map((accord, index) => (
            <SingleAccord key={index} title={accord.title} description={accord.description} />
          ))}
        </div>
      </Container>
    </div>
  );
};
export default StakeView;
