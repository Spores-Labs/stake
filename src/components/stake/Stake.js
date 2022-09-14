import React, { useState } from 'react';
import './Stake.css';
import BigNumber from 'bignumber.js';
import { TextField, styled, Button, Dialog, Divider, CircularProgress } from '@mui/material';
import { Controller, useForm } from 'react-hook-form';
import DesignButton from '../common/DesignButton';
import { useSnackbar } from 'notistack';
import CloseButton from '../common/CloseButton';
import { useMutation } from 'react-query';
import { Close, Done, WarningRounded } from '@mui/icons-material';
import { poolStatuses, tierList } from '../StakeView/StakeView';
import { useSelector } from 'react-redux';
import { profileSelector } from '../../reducers/profile';
import { contractInfosSelector } from '../../reducers/contractInfos';
import { connectWallet } from '../../services/wallet';
import { updateInfosProfileService } from '../../services/profile';
import { getContractInfos } from '../../services/contract';
import { stakingContract, tokenNPO } from '../../contractHandler/contractHandler';

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

const StakingStage = ({ title, description, loading, success, error, handleRetry }) => (
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
      {error && (
        <Button
          variant='outlined'
          className='w-20 text-xs text-color-secondary border-color-secondary px-3 mt-1'
          onClick={handleRetry}
        >
          Try again
        </Button>
      )}
    </div>
  </div>
);

const GroupInfo = ({ title, value, border }) => (
  <div className='flex flex-col gap-2' style={{ borderRight: border ? '1px solid #F1E9DC' : '', fontSize: 15 }}>
    <div className='font-semibold'>{title}</div>
    <div className='font-black text-2xl'>{value}</div>
  </div>
);

const Stake = ({ poolStatus }) => {
  const { isLoggedIn, address, balance, yourStakedBalance } = useSelector(profileSelector);
  const props = useSelector(contractInfosSelector);
  const { enqueueSnackbar } = useSnackbar();
  const { control, watch, setValue, handleSubmit, reset: resetInput } = useForm({ mode: 'onChange' });
  const { amount } = watch();
  const [openPopupStake, setOpenPopupStake] = useState(false);
  const [openPopupUnstake, setOpenPopupUnstake] = useState(false);
  const [openPopupUnstakeSuccess, setOpenPopupUnstakeSuccess] = useState(false);

  const {
    mutate: approve,
    isLoading: isLoadingApprove,
    isSuccess: isSuccessApprove,
    isError: isErrorApprove,
    reset: resetApprove,
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

        await tokenNPO.methods.approve(process.env.REACT_APP_STK_CONTRACT, handleAmount).send({ from: address });
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
    reset: resetStake,
  } = useMutation(
    async () => {
      const handleAmount = BigNumber(amount * 1e18).toFixed(0);
      await stakingContract.methods.stake(handleAmount).send({ from: address });
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

  const { mutate: unstake } = useMutation(
    async () => {
      let handleAmount = yourStakedBalance;

      if (Date.now() < props.earlyWithdraw * 1000) {
        enqueueSnackbar(
          `Could not withdraw, you can withdraw from  ${new Date(props.earlyWithdraw * 1000).toLocaleString()}`,
          { variant: 'error' },
        );
        throw new Error();
      } else if (parseFloat(handleAmount) > parseFloat(yourStakedBalance)) {
        enqueueSnackbar('You could not withdraw more than what you staked', { variant: 'error' });
        throw new Error();
      } else if (handleAmount === '' || handleAmount <= 0) {
        enqueueSnackbar('Please input a positive amount', { variant: 'error' }); // user has to input amount before click on stake button
        throw new Error();
      } else {
        // handle amount (number bigint)
        handleAmount = BigNumber(handleAmount * 1e18).toFixed(0);
        await stakingContract.methods.withdraw(handleAmount).send({ from: address });
      }
    },
    {
      onSuccess: () => {
        enqueueSnackbar('Unstake successfully!', { variant: 'success' });
        setOpenPopupUnstakeSuccess(true);
      },
      onError: () => {
        enqueueSnackbar('Unstake failed!', { variant: 'error' });
      },
    },
  );

  const stakeToken = () => approve();

  const getTierReward = () => {
    let tierName = tierList[0].name;
    tierList.forEach((tier) => {
      if (yourStakedBalance * 1 >= tier.reward) {
        tierName = tier.name;
      }
    });
    return tierName;
  };

  const getOKGReward = () => {
    return (process.env.REACT_APP_TOTAL_REWARD / (props.stakedTotal / 1e18)) * (yourStakedBalance * 1);
  };

  const ButtonLogin = () => (
    <DesignButton fullWidth design='yellow' size='large' imageSize='small' className='w-56' onClick={connectWallet}>
      CONNECT WALLET
    </DesignButton>
  );

  const getRemainingStakingCap = () => Number(props.stakingCap) - Number(props.stakedTotal) / 1e18;

  const getMaxLimit = () => {
    const capLimit = getRemainingStakingCap();
    return balance / 1e18 > capLimit ? capLimit : balance / 1e18;
  };

  const getMaxLimitErrorMessage = () => {
    const capLimit = getRemainingStakingCap();
    return balance / 1e18 > capLimit ? `The maximum amount is ${capLimit}` : 'Insufficient balance.';
  };

  const onClosePopupStake = () => {
    setOpenPopupStake(false);
    resetApprove();
    resetStake();
  };

  const onClosePopupUnstake = () => {
    setOpenPopupUnstake(false);
  };

  return (
    <div className='bg-color-primary p-8 text-color-greyish' style={{ borderRadius: 10 }}>
      {isLoggedIn ? (
        <>
          {(poolStatus === poolStatuses[0] || poolStatus === poolStatuses[1]) && (
            <>
              <Controller
                name='amount'
                defaultValue=''
                control={control}
                rules={{
                  required: true,
                  pattern: /^\d*\.?\d*$/,
                  min: 1,
                  max: getMaxLimit(),
                }}
                render={({ field, fieldState: { invalid, error } }) => {
                  let mes = 'Please enter a positive number';
                  if (error?.type === 'max') {
                    mes = getMaxLimitErrorMessage();
                  }

                  return (
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
                                onClick={() => setValue('amount', getMaxLimit(), { shouldValidate: true })}
                              >
                                Max
                              </Button>
                              OKG
                            </div>
                          ),
                          type: 'number',
                          onKeyDown: (el) => {
                            if (el.which === 189 || el.which === 190 || el.which === 109 || el.which === 110)
                              el.preventDefault();
                          },
                        }}
                      />
                      {invalid && <div className='text-red-500 text-tiny md:text-sm mt-1'>{mes}</div>}
                    </div>
                  );
                }}
              />
              <div className='flex justify-between items-center'>
                {poolStatus === poolStatuses[0] ? (
                  <DesignButton fullWidth design='gray' size='large' imageSize='small' className='w-44'>
                    STAKE NOW
                  </DesignButton>
                ) : (
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
                )}
                <div className='font-black text-color-greyish'>
                  <div>{`Wallet Balance: ${(balance / 1e18).toLocaleString('en-EN')} OKG`}</div>
                  <div>{`Current staked: ${Math.round(yourStakedBalance).toLocaleString('en-EN')} OKG`}</div>
                </div>
              </div>
            </>
          )}
          {poolStatus === poolStatuses[2] && (
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
          {poolStatus === poolStatuses[3] && (
            <>
              <div className='grid grid-cols-3 gap-5 mb-4'>
                <GroupInfo title='Staked Amount (OKG)' value={yourStakedBalance.toLocaleString('en-EN')} border />
                <GroupInfo
                  title='Pending Rewards (OKG)'
                  value={Number(getOKGReward().toFixed(2).toLocaleString('en-EN'))}
                  border
                />
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
        </>
      ) : (
        <>
          <div className='grid grid-cols-3 gap-5 mb-4'>
            <GroupInfo title='Staked Amount (OKG)' value='-' border />
            <GroupInfo title='Pending Rewards (OKG)' value='-' border />
            <GroupInfo title='Reward to receive' value='-' />
          </div>
          <ButtonLogin />
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
            handleRetry={approve}
          />
          <StakingStage
            title='Stake OKG'
            description='Confirm to stake your desired amount into OKG Staking pool'
            loading={isLoadingStake}
            success={isSuccessStake}
            error={isErrorStake}
            handleRetry={stake}
          />
          {isSuccessApprove && isSuccessStake && (
            <DesignButton
              fullWidth
              design='yellow'
              size='large'
              onClick={() => {
                onClosePopupStake();
                resetInput();
                updateInfosProfileService(address);
                getContractInfos();
              }}
            >
              DONE
            </DesignButton>
          )}
          <CloseButton onClick={() => onClosePopupStake()} />
        </div>
      </CustomDialog>
      <CustomDialog fullWidth open={openPopupUnstake}>
        <div className='text-color-secondary'>
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
              <div className='font-extrabold'>{`${yourStakedBalance} OKG`}</div>
            </div>
            <div className='flex justify-between'>
              <div className='text-color-primary'>Rewards</div>
              <div className='font-extrabold'>{`${getOKGReward()} OKG`}</div>
            </div>
          </div>
          <div className='text-color-primary flex gap-2.5 mb-6'>
            <WarningRounded style={{ color: '#FFA108' }} />
            Item rewards will be transferred into your game account. Please make sure you have linked your wallet to the
            game account.
          </div>
          <div className='flex gap-2'>
            <DesignButton
              fullWidth
              design='yellow'
              size='large'
              imageSize='small'
              onClick={() => {
                unstake();
                onClosePopupUnstake();
              }}
            >
              UNSTAKE
            </DesignButton>
            <DesignButton fullWidth design='gray' size='large' imageSize='small' onClick={() => onClosePopupUnstake()}>
              CANCEL
            </DesignButton>
          </div>
        </div>
      </CustomDialog>
      <CustomDialog fullWidth open={openPopupUnstakeSuccess}>
        <div className='text-color-secondary'>
          <div className='flex justify-center'>
            <img src='/assets/icons/icon-success.png' alt='Success' className='mb-8' />
          </div>
          <div className='font-skadi text-center text-3xl mb-3'>UNSTAKING SUCCEEDED</div>
          <div className='text-center text-xl mb-12'>You have successfull unstaked OKG token</div>
          <DesignButton
            fullWidth
            design='yellow'
            size='large'
            imageSize='large'
            onClick={() => {
              setOpenPopupUnstakeSuccess(false);
            }}
          >
            DONE
          </DesignButton>
        </div>
      </CustomDialog>
    </div>
  );
};
export default Stake;
