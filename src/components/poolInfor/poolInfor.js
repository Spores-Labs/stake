import React from 'react';
import './poolInfor.css';
import { AccessTime, HelpOutline, Layers, Lock } from '@mui/icons-material';
import { DateTime, Duration } from 'luxon';
import { Tooltip } from '@mui/material';
import { useSelector } from 'react-redux';
import { contractInfosSelector } from '../../reducers/contractInfos';
import useWindowDimensions from '../../hooks/useWindowDimensions';

const GroupInfo = ({ title, value, icon }) => (
  <div className='text-xs md:text-base'>
    <div className='flex gap-1 items-center text-color-primary mb-1'>
      {icon}
      {title}
    </div>
    <div className='font-black'>{value}</div>
  </div>
);

const PoolInfor = () => {
  const { isMobile } = useWindowDimensions();
  const props = useSelector(contractInfosSelector);
  const lockDays = Duration.fromObject({ seconds: Number(props.earlyWithdraw) - Number(props.stakingEnds) }).toFormat(
    'd',
  );
  const apr =
    !props.stakedTotal || Number(props.stakedTotal) < 100000 * 1e18
      ? 4055
      : (((process.env.REACT_APP_TOTAL_REWARD * 1e18) / props.stakedTotal / Number(lockDays)) * 365 * 100).toFixed(2);

  const Group1 = () => (
    <div className='flex flex-col gap-6 pr-7 md:pr-0' style={{ borderRight: '1px solid #B7A284' }}>
      <GroupInfo
        title='Staking Cap'
        value={`${props.stakingCap?.toLocaleString('en-EN')} OKG`}
        icon={<Layers className='text-xs md:text-base' />}
      />
      <GroupInfo title='Lock period' value={`${lockDays} days`} icon={<Lock className='text-xs md:text-base' />} />
    </div>
  );

  const Group2 = () => (
    <div className='flex flex-col gap-6 pl-7 md:pl-0' style={{ borderRight: isMobile ? '' : '1px solid #B7A284' }}>
      <GroupInfo
        title='Open time'
        value={DateTime.fromSeconds(Number(props.stakingStart)).toFormat('MM/dd/yyyy')}
        icon={<AccessTime className='text-xs md:text-base' />}
      />
      <GroupInfo
        title='Close time'
        value={DateTime.fromSeconds(Number(props.stakingEnds)).toFormat('MM/dd/yyyy')}
        icon={<AccessTime className='text-xs md:text-base' />}
      />
    </div>
  );

  const GroupAPR = () => (
    <div className='text-center mb-5 md:mb-0'>
      <div className='flex gap-1 items-center justify-center text-xl font-extrabold'>
        APR
        <Tooltip
          title={
            <div className='text-black font-semibold font-avenir' style={{ maxWidth: 220, fontSize: 15 }}>
              The APR shown is an estimate and fluctuates depending on total staked amount. The APR will be determined
              at the closing time of this pool.
            </div>
          }
          placement='top'
          arrow
        >
          <HelpOutline style={{ width: 19, height: 19 }} />
        </Tooltip>
      </div>
      <div
        className='font-extrabold bg-clip-text text-transparent break-all'
        style={{
          background: '-webkit-linear-gradient(180deg, #FFF7EA 0%, #A36C02 100%)',
          fontSize: 32,
        }}
      >
        {`${apr}%`}
      </div>
    </div>
  );

  return (
    <div
      className='p-4 pb-8 md:px-8 md:py-0 md:grid md:grid-cols-3 md:gap-7 items-center'
      style={{ background: '#3F281CE5', borderRadius: 10 }}
    >
      {isMobile ? (
        <>
          <GroupAPR />
          <div className='grid grid-cols-2'>
            <Group1 />
            <Group2 />
          </div>
        </>
      ) : (
        <>
          <Group1 />
          <Group2 />
          <GroupAPR />
        </>
      )}
    </div>
  );
};
export default PoolInfor;
