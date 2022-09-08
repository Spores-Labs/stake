import React, { useEffect, useState } from 'react';
import './Stake.css';
import BigNumber from 'bignumber.js';
import withWallet from '../HOC/hoc';
import EarlyRewardCalculator from '../rewardCalculator/earlyRewardCalculator';
import MaturityReward from '../rewardCalculator/maturityRewardCalculator';
import { TextField, styled, Button, Dialog, Divider, CircularProgress } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import DesignButton from '../common/DesignButton';
import { useSnackbar } from 'notistack';
import CloseButton from '../common/CloseButton';
import { useMutation } from 'react-query';
import { Close, Done, WarningAmberRounded, WarningRounded } from '@mui/icons-material';
import { DateTime } from 'luxon';
import { tierList } from '../StakeView/StakeView';

const AmountField = styled(TextField)`
  border-radius: 8px;
  & .MuiOutlinedInput-root {
    background: #f1e9dc;
    border-radius: 10px;
  }
  & .MuiOutlinedInput-input {
    font-family: 'Avenir';
    font-weight: 800;
    font-size: 24px;
    color: #392609;
    padding: 8px 16px;
  }
`;

const CustomDialog = styled(Dialog)`
  & .MuiDialog-paper {
    background: url('assets/images/background-dialog.png');
    background-size: 100% 100%;
    width: 512px;
    padding: 45px 60px 40px 60px;
  }
`;

const StakingStage = ({ title, description, loading, success, error }) => (
  <div className='flex gap-8 mb-6'>
    <div>
      {!loading && !success && !error && (
        <CircularProgress variant='determinate' sx={{ color: '#1C0B02' }} size={30} thickness={4} value={100} />
      )}
      {loading && <CircularProgress sx={{ color: '#F9B300' }} size={30} thickness={4} />}
      {success && <Done sx={{ color: '#6FAF51', fontSize: 30 }} />}
      {error && <Close sx={{ color: '#FF613F', fontSize: 30 }} />}
    </div>
    <div className='flex flex-col gap-1'>
      <div className='text-xl font-black'>{title}</div>
      <div className='text-color-primary font-semibold' style={{ fontSize: 15 }}>
        {description}
      </div>
    </div>
  </div>
);

const GroupInfo = ({ title, value, border }) => (
  <div className='flex flex-col gap-2' style={{ borderRight: border ? '1px solid #F1E9DC' : '', fontSize: 15 }}>
    <div className='font-semibold'>{title}</div>
    <div className='font-black text-2xl'>{value}</div>
  </div>
);

const Stake = (props) => {
  const { enqueueSnackbar } = useSnackbar();
  const now = DateTime.now().toSeconds();
  const isLive = now < props.stakingEnds * 1;
  const isLockPeriod = now > props.stakingEnds * 1 && now < props.earlyWithdraw * 1;
  const isExpired = now > props.earlyWithdraw * 1;

  // Call from HOC - Reuse functions/code fro Higher Order Component
  props.onAccountChange();

  const { control, watch, setValue, handleSubmit } = useForm({ mode: 'onChange' });
  const { amount } = watch();
  const [balance, setBalance] = useState(0);
  const [openPopupStake, setOpenPopupStake] = useState(false);
  const [openPopupUnstake, setOpenPopupUnstake] = useState(false);

  const getBalance = async () => {
    const res = await props.tokenNPO.methods.balanceOf(props.account).call();
    setBalance(res);
  };

  useEffect(() => {
    getBalance();
  }, [props.account]);

  const {
    mutate: approve,
    isLoading: isLoadingApprove,
    isSuccess: isSuccessApprove,
    isError: isErrorApprove,
  } = useMutation(
    async () => {
      setOpenPopupStake(true);
      // Balance
      // Step 1: Call the NPO token contract & approve the amount contract (to Set Allowance)
      if (props.stakingEnds * 1000 < Date.now()) {
        enqueueSnackbar('Contribution was CLOSED, please choose another pool!', { variant: 'error' });
        throw new Error();
      } else if (amount === '' || amount <= 0) {
        enqueueSnackbar('Please input a positive amount', { variant: 'error' }); // user has to input amount before click on stake button
        throw new Error();
      } else if (Date.now() < props.stakingStart * 1000) {
        enqueueSnackbar(`Could not stake, staking starts at ${new Date(props.stakingStart * 1000).toLocaleString()}`, {
          variant: 'error',
        });
        throw new Error();
      } else if (amount > balance / 1e18) {
        enqueueSnackbar('Not enough OKG balance', { variant: 'error' }); // check wallet balance
        throw new Error();
      } else if (props.stakingCap === props.stakedBalance) {
        enqueueSnackbar('Pool was fulfilled, please stake into another pool!', { variant: 'error' }); // check if pool was fulfilled
        throw new Error();
      } else {
        // handle amount (number bigint)
        const handleAmount = BigNumber(amount * 1e18).toFixed(0);

        await props.tokenNPO.methods.approve(props.stakingContractAddr, handleAmount).send({ from: props.account });
      }
    },
    {
      onSuccess: () => {
        enqueueSnackbar('Approve successfully!', { variant: 'success' });
        stake();
      },
      onError: () => {
        enqueueSnackbar('Approve failed!', { variant: 'error' });
      },
    },
  );

  const {
    mutate: stake,
    isLoading: isLoadingStake,
    isSuccess: isSuccessStake,
    isError: isErrorStake,
  } = useMutation(
    async () => {
      const handleAmount = BigNumber(amount * 1e18).toFixed(0);
      await props.stakingContract.methods.stake(handleAmount).send({ from: props.account });
    },
    {
      onSuccess: () => {
        enqueueSnackbar('Stake successfully!', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Stake failed!', { variant: 'error' });
      },
    },
  );

  const {
    mutate: unstake,
    isSuccess: isSuccessUnstake,
    reset: resetUnstake,
  } = useMutation(
    async () => {
      let handleAmount = props.yourStakedBalance;

      if (Date.now() < props.earlyWithdraw * 1000) {
        enqueueSnackbar(
          `Could not withdraw, you can withdraw from  ${new Date(props.earlyWithdraw * 1000).toLocaleString()}`,
          { variant: 'error' },
        );
        throw new Error();
      } else if (parseFloat(handleAmount) > parseFloat(props.yourStakedBalance)) {
        enqueueSnackbar('You could not withdraw more than what you staked', { variant: 'error' });
        throw new Error();
      } else if (handleAmount === '' || handleAmount <= 0) {
        enqueueSnackbar('Please input a positive amount', { variant: 'error' }); // user has to input amount before click on stake button
        throw new Error();
      } else {
        // handle amount (number bigint)
        handleAmount = BigNumber(handleAmount * 1e18).toFixed(0);
        console.log(handleAmount, props, 'shittttt');
        await props.stakingContract.methods.withdraw(handleAmount).send({ from: props.account });
      }
    },
    {
      onSuccess: () => {
        enqueueSnackbar('Unstake successfully!', { variant: 'success' });
      },
      onError: () => {
        enqueueSnackbar('Unstake failed!', { variant: 'error' });
      },
    },
  );

  const stakeToken = () => approve();

  const getTierReward = () => {
    let tierName = tierList[0].name;
    tierList.map((tier) => {
      if (props.yourStakedBalance * 1 >= tier.reward) {
        tierName = tier.name;
      }
    });
    return tierName;
  };

  const getOKGReward = () => {
    return (process.env.REACT_APP_TOTAL_REWARD / (props.stakedTotal / 1e18)) * (props.yourStakedBalance * 1);
  };

  return (
    <div className='bg-color-primary p-8 text-color-greyish' style={{ borderRadius: 10 }}>
      {isLive && (
        <>
          <Controller
            name='amount'
            defaultValue=''
            control={control}
            rules={{
              required: true,
              pattern: /^\d*\.?\d*$/,
              min: 0,
              max: balance / 1e18,
            }}
            render={({ field, fieldState: { invalid, error } }) => (
              <div className='mb-4'>
                <div className='text-xl font-black mb-1'>AMOUNT TO STAKE*</div>
                <AmountField
                  {...field}
                  fullWidth
                  variant='outlined'
                  placeholder='0'
                  size='medium'
                  error={invalid}
                  InputProps={{
                    endAdornment: (
                      <div
                        className='flex gap-2 pr-5 text-xl font-avenir font-bold items-center '
                        style={{ color: '#392609' }}
                      >
                        <Button
                          variant='contained'
                          className='font-bold text-color-secondary text-sm'
                          style={{ background: '#6FAF51', borderRadius: 8 }}
                          onClick={() => setValue('amount', balance / 1e18, { shouldValidate: true })}
                        >
                          Max
                        </Button>
                        OKG
                      </div>
                    ),
                  }}
                />
                {invalid && <div className='text-red-500 text-tiny md:text-sm mt-1'>Please enter stake number.</div>}
              </div>
            )}
          />
          <div className='flex justify-between items-center'>
            <DesignButton
              fullWidth
              design='yellow'
              size='large'
              imageSize='small'
              className='w-44'
              onClick={() => handleSubmit(() => stakeToken())()}
            >
              STAKE NOW
            </DesignButton>
            <div className='font-black text-color-greyish'>
              <div>{`Wallet Balance: ${balance / 1e18} OKG`}</div>
              <div>{`Current staked: ${props.yourStakedBalance} OKG`}</div>
            </div>
          </div>
        </>
      )}
      {isLockPeriod && (
        <>
          <div className='grid grid-cols-3 gap-5 mb-4'>
            <GroupInfo title='Staked Amount (OKG)' value='-' border />
            <GroupInfo title='Pending Rewards (OKG)' value='-' border />
            <GroupInfo title='Reward to receive' value='-' />
          </div>
          <DesignButton fullWidth design='gray' size='large' imageSize='small' className='w-44'>
            UNSTAKE
          </DesignButton>
        </>
      )}
      {isExpired && (
        <>
          <div className='grid grid-cols-3 gap-5 mb-4'>
            <GroupInfo title='Staked Amount (OKG)' value={props.yourStakedBalance} border />
            <GroupInfo title='Pending Rewards (OKG)' value={getOKGReward()} border />
            <GroupInfo title='Reward to receive' value={getTierReward()} />
          </div>
          <DesignButton
            fullWidth
            design='yellow'
            size='large'
            imageSize='small'
            className='w-44'
            onClick={() => setOpenPopupUnstake(true)}
          >
            UNSTAKE
          </DesignButton>
        </>
      )}
      <CustomDialog fullWidth open={openPopupStake}>
        <div className='text-color-secondary'>
          <div className='text-color-caption font-skadi text-center mb-2' style={{ fontSize: 32 }}>
            STAKING
          </div>
          <Divider className='mb-6' style={{ borderTop: '1px solid #7B593A' }} />
          <StakingStage
            title='Approve OKG'
            description='You first need to approve the spending of your OKG token'
            loading={isLoadingApprove}
            success={isSuccessApprove}
            error={isErrorApprove}
          />
          <StakingStage
            title='Stake OKG'
            description='Confirm to stake your desired amount into OKG Staking pool'
            loading={isLoadingStake}
            success={isSuccessStake}
            error={isErrorStake}
          />
          {isSuccessApprove && isSuccessStake ? (
            <DesignButton fullWidth design='yellow' size='large' onClick={() => setOpenPopupStake(false)}>
              DONE
            </DesignButton>
          ) : (
            <DesignButton fullWidth design='gray' size='large'>
              DONE
            </DesignButton>
          )}
          <CloseButton onClick={() => setOpenPopupStake(false)} />
        </div>
      </CustomDialog>
      <CustomDialog fullWidth open={openPopupUnstake}>
        <div className='text-color-secondary'>
          {isSuccessUnstake ? (
            <>
              <div className='flex justify-center'>
                <img src='/assets/icons/icon-success.png' alt='Success' className='mb-8' />
              </div>
              <div className='font-skadi text-center text-3xl mb-3'>STAKING SUCCEEDED</div>
              <div className='text-center text-xl mb-12'>You have successfull staked 10,000 OKG</div>
              <DesignButton
                fullWidth
                design='yellow'
                size='large'
                imageSize='large'
                onClick={() => {
                  setOpenPopupUnstake(false);
                  resetUnstake();
                }}
              >
                DONE
              </DesignButton>
            </>
          ) : (
            <>
              <div className='text-color-caption font-skadi text-center mb-2' style={{ fontSize: 32 }}>
                UNSTAKE
              </div>
              <Divider className='mb-6' style={{ borderTop: '1px solid #7B593A' }} />
              <div className='text-xl mb-6'>Are you sure you want to unstake OKG?</div>
              <div
                className='flex flex-col gap-4 p-5 text-xl mb-6'
                style={{ background: '#523527', border: '1px solid #7B593A', borderRadius: 8 }}
              >
                <div className='flex justify-between'>
                  <div className='text-color-primary'>Unstake amount</div>
                  <div className='font-extrabold'>{`${props.yourStakedBalance} OKG`}</div>
                </div>
                <div className='flex justify-between'>
                  <div className='text-color-primary'>Rewards</div>
                  <div className='font-extrabold'>{`${getOKGReward()} OKG`}</div>
                </div>
              </div>
              <div className='text-color-primary flex gap-2.5 mb-6'>
                <WarningRounded style={{ color: '#FFA108' }} />
                Item rewards will be transferred into your game account. Please make sure you have linked your wallet to
                the game account.
              </div>
              <div className='flex gap-2'>
                <DesignButton fullWidth design='yellow' size='large' imageSize='small' onClick={() => unstake()}>
                  UNSTAKE
                </DesignButton>
                <DesignButton
                  fullWidth
                  design='gray'
                  size='large'
                  imageSize='small'
                  onClick={() => setOpenPopupUnstake(false)}
                >
                  CANCEL
                </DesignButton>
              </div>
            </>
          )}
        </div>
      </CustomDialog>
    </div>
  );
};
export default withWallet(Stake);
