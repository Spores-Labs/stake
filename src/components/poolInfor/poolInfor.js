import React, { useMemo } from 'react';
import './poolInfor.css';
import { AccessTime, Layers, Lock } from '@mui/icons-material';
import { DateTime, Duration } from 'luxon';
import { useSelector } from 'react-redux';
import { contractInfosSelector } from '../../reducers/contractInfos';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const GroupInfo = ({ title, value, icon, isCenterDown, isCenterUp }) => (
  <div className='text-xs md:text-[15px] flex flex-col gap-1'>
    <div
      className='flex gap-1 items-center text-color-primary mb-1'
      style={{ justifyContent: isCenterUp ? 'center' : 'flex-start' }}
    >
      {icon}
      {title}
    </div>
    <div className='font-black' style={{ textAlign: isCenterDown ? 'center' : 'left' }}>
      {value}
    </div>
  </div>
);

const GroupAPR = ({ value, title }) => (
  <div className='text-center font-extrabold'>
    <div className='text-xs md:text-[15px]'>{title}</div>
    <div
      className='bg-clip-text text-transparent break-all text-[28px] md:text-4xl'
      style={{
        background: 'linear-gradient(180deg, #FFF7EA 0%, #A36C02 100%)',
      }}
    >
      {`${value}%`}
    </div>
  </div>
);

const PoolInfor = () => {
  const { isMobile } = useWindowDimensions();
  const { isCalled, ...props } = useSelector(contractInfosSelector);
  const lockDays = useMemo(
    () => Duration.fromObject({ seconds: Number(props.earlyWithdraw) - Number(props.stakingEnds) }).toFormat('d'),
    [props.earlyWithdraw, props.stakingEnds],
  );
  const daysTillMaturity = useMemo(
    () => Duration.fromObject({ seconds: Number(props.earlyWithdraw) - DateTime.now().toSeconds() }).toFormat('d'),
    [props.earlyWithdraw],
  );
  // const aprRaw =
  //   !props.stakedTotal || Number(props.stakedTotal) < 258900 * 1e18
  //     ? 1668
  //     : ((process.env.REACT_APP_TOTAL_REWARD * 1e18) / props.stakedTotal / Number(lockDays)) * 365 * 100 + 101.15;
  // const apr = aprRaw > 1000 ? Math.round(aprRaw) : aprRaw.toFixed(2);

  // const [openTooltip, setOpenTooltip] = useState(false);

  // const handleTooltipClose = () => {
  //   setOpenTooltip(false);
  // };

  // const handleTooltipOpen = () => {
  //   setOpenTooltip(true);
  // };

  // const AlterTooltip = ({ isClickable }) => (
  //   <ClickAwayListener onClickAway={handleTooltipClose}>
  //     <Tooltip
  //       {...(isClickable
  //         ? {
  //             PopperProps: {
  //               disablePortal: true,
  //             },
  //             onClose: handleTooltipClose,
  //             open: openTooltip,
  //             disableFocusListener: true,
  //             disableHoverListener: true,
  //             disableTouchListener: true,
  //           }
  //         : {})}
  //       title={
  //         <div className='text-black font-semibold font-avenir' style={{ maxWidth: 220, fontSize: 15 }}>
  //           The shown APR is an estimated and fluctuating indicator that depends on many factors, including total stake
  //           amount, item prices, etc.
  //           <br />
  //           <br />
  //           The calculated APR includes both OKG token rewards and item bonus earned through the staking pool.
  //         </div>
  //       }
  //       placement='top'
  //       arrow
  //     >
  //       <HelpOutline {...(isClickable ? { onClick: handleTooltipOpen } : {})} style={{ width: 19, height: 19 }} />
  //     </Tooltip>
  //   </ClickAwayListener>
  // );

  const group1 = useMemo(
    () => (
      <div
        className='flex flex-col gap-4 md:gap-6'
        style={{ borderRight: isMobile ? '' : '1px solid rgba(183, 162, 132, 0.2)' }}
      >
        <div className='pb-4 md:pb-0' style={{ borderBottom: isMobile ? '2px solid rgba(183, 162, 132, 0.2)' : '' }}>
          <GroupInfo
            title='Staking Cap'
            value={`${props.stakingCap?.toLocaleString('en-EN')} OKG`}
            icon={<Layers className='text-xs md:text-[15px]' />}
            isCenterDown={isMobile ? true : false}
            isCenterUp={isMobile ? true : false}
          />
        </div>
        <div
          className='grid grid-cols-2 md:flex md:flex-col gap-6 pb-4 md:pb-0'
          style={{ borderBottom: isMobile ? '2px solid rgba(183, 162, 132, 0.2)' : '' }}
        >
          <GroupInfo
            title='Open time'
            value={
              props.stakingStart === '0'
                ? '--/--/----'
                : `${DateTime.fromSeconds(Number(props.stakingStart), { zone: 'utc' }).toFormat(
                    'dd MMM yyyy, Ha',
                  )} (UTC)`
            }
            icon={<AccessTime className='text-xs md:text-[15px]' />}
            isCenterDown={isMobile ? true : false}
            isCenterUp={isMobile ? true : false}
          />
          <GroupInfo
            title='Close time'
            value={
              props.stakingEnds === '0'
                ? '--/--/----'
                : `${DateTime.fromSeconds(Number(props.stakingEnds), { zone: 'utc' }).toFormat(
                    'dd MMM yyyy, Ha',
                  )} (UTC)`
            }
            icon={<AccessTime className='text-xs md:text-[15px]' />}
            isCenterDown={isMobile ? true : false}
            isCenterUp={isMobile ? true : false}
          />
        </div>
      </div>
    ),
    [isMobile, props.stakingCap, props.stakingEnds, props.stakingStart],
  );

  const group2 = useMemo(
    () => (
      <div
        className='flex flex-col gap-4 md:gap-6 justify-center items-center h-full'
        style={{ borderRight: isMobile ? '' : '1px solid rgba(183, 162, 132, 0.2)' }}
      >
        <GroupInfo
          title='Days of mandatory lock'
          value={`${lockDays} days`}
          icon={<Lock className='text-xs md:text-[15px]' />}
          isCenterDown
        />
        <GroupAPR value='15' title='Early reward APR' />
      </div>
    ),
    [isMobile, lockDays],
  );

  const group3 = useMemo(
    () => (
      <div className='flex flex-col gap-4 md:gap-6 justify-center items-center md:items-end h-full'>
        <GroupInfo
          title='Days until maturity'
          value={`${daysTillMaturity < 0 ? 0 : daysTillMaturity} days`}
          icon={<Lock className='text-xs md:text-[15px]' />}
          isCenterDown
        />
        <GroupAPR value='30' title='Maturity reward APR' />
      </div>
    ),
    [daysTillMaturity],
  );

  return (
    <div
      className='p-4 md:px-8 md:py-6 md:grid md:grid-cols-11 md:gap-0 items-center'
      style={{ background: '#3F281CE5', borderRadius: 10 }}
    >
      {isCalled && (
        <>
          {isMobile ? (
            <>
              {group1}
              <div className='grid grid-cols-2 gap-1 pt-4'>
                {group2}
                {group3}
              </div>
            </>
          ) : (
            <>
              <div className='col-span-4 h-full'>{group1}</div>
              <div className='col-span-4 h-full'>{group2}</div>
              <div className='col-span-3 h-full'>{group3}</div>
            </>
          )}
        </>
      )}
    </div>
  );
};
export default PoolInfor;
