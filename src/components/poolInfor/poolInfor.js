import React from 'react';
import './poolInfor.css';
import withWallet from '../HOC/hoc';
import { AccessTime, HelpOutline, Layers, Lock } from '@mui/icons-material';
import { DateTime, Duration } from 'luxon';
import { Tooltip } from '@mui/material';

const GroupInfo = ({ title, value, icon }) => (
  <div>
    <div className='flex gap-1 items-center text-color-primary mb-1'>
      {icon}
      {title}
    </div>
    <div className='font-black'>{value}</div>
  </div>
);

const PoolInfor = (props) => {
  props.onAccountChange();
  const lockDays = Duration.fromObject({ seconds: props.earlyWithdraw * 1 - props.stakingEnds * 1 }).toFormat('d');
  const apr = (((process.env.REACT_APP_TOTAL_REWARD * 1e18) / props.stakedTotal / (lockDays * 1)) * 365 * 100).toFixed(
    2,
  );

  return (
    <div className='px-8 grid grid-cols-3 gap-7 items-center' style={{ background: '#3F281CE5', borderRadius: 10 }}>
      <div className='flex flex-col gap-6' style={{ borderRight: '1px solid #B7A284' }}>
        <GroupInfo title='Staking Cap' value={`${props.stakingCap} OKG`} icon={<Layers />} />
        <GroupInfo title='Lock period' value={`${lockDays} days`} icon={<Lock />} />
      </div>
      <div className='flex flex-col gap-6' style={{ borderRight: '1px solid #B7A284' }}>
        <GroupInfo
          title='Open time'
          value={DateTime.fromSeconds(props.stakingStart * 1).toFormat('MM/dd/yyyy')}
          icon={<AccessTime />}
        />
        <GroupInfo
          title='Close time'
          value={DateTime.fromSeconds(props.stakingEnds * 1).toFormat('MM/dd/yyyy')}
          icon={<AccessTime />}
        />
      </div>
      <div className='text-center'>
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
          className='text-5xl font-extrabold bg-clip-text text-transparent'
          style={{
            background: '-webkit-linear-gradient(180deg, #FFF7EA 0%, #A36C02 100%)',
          }}
        >
          {`${apr}%`}
        </div>
      </div>
    </div>
  );
};
export default withWallet(PoolInfor);
