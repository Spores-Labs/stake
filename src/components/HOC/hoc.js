import { CircularProgress, Dialog, styled, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import Web3 from 'web3/dist/web3.min';
import FestakedWithReward from '../../artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json';
import tokenContract from '../../artifacts/contracts/tokenContract/tokenContract.json';
import DesignButton from '../common/DesignButton';

const CustomDialog = styled(Dialog)`
  & .MuiDialog-paper {
    background: url('assets/images/background-dialog.png');
    background-size: 100% 100%;
    color: #f1e9dc;
  }
`;

const withWallet = (OriginalComponent) => {
  function NewComponent(props) {
    // Check Chain
    let chain = '';
    if (typeof window.ethereum === 'undefined') {
      alert('Please install Metamask extension first!');
    } else {
      if (window.ethereum.networkVersion === process.env.REACT_APP_NETWORK_VERSION) {
        chain = 'You are connected to BSC';
      } else {
        chain = <span className='boldText'>Please connect your Wallet to BSC!!!</span>;
      }
    }

    // Get/Set Wallet Address
    const [account, setAccount] = useState('');
    const [formVisibility, setFormVisibility] = useState(false);
    const connectMM = async () => {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' }, (error) => {
        if (error) {
          console.log(error);
        }
      });
      setAccount(accounts[0]);
    };

    // On Account Changed
    const onAccountChange = async () => {
      await window.ethereum.on('accountsChanged', async () => {
        setAccount(window.ethereum.selectedAddress);
      });
    };

    // Work with staking contract
    // const stakingContractAddr = "0x1FE470E4E533EeA525b2f2c34a9EbB995597C143"
    // const stakingContractAddr = "0xa49403Be3806eb19F27163D396f8A77b40b75C5f"
    // const stakingContractAddr = "0x0d0791b125689bA5152F4940dACD54dBfB850618"
    // const stakingContractAddr = "0xDDb3699BEF2519A06CF1783b8bb2C4d4576429f1"
    const stakingContractAddr = process.env.REACT_APP_STK_CONTRACT;

    const web3 = new Web3();
    const provider = Web3.givenProvider;
    provider.on('accountsChanged', () => setAccount(''));
    provider.on('disconnect', () => setAccount(''));
    provider.on('chainChanged', (chainID) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      if (parseInt(chainID).toString === process.env.REACT_APP_NETWORK_VERSION) {
        chain = 'You are connected to BSC';
      } else {
        chain = 'Please connect to BSC!!!';
      }
      window.location.reload();
    });
    // const web3 = new Web3("https://bsc-dataseed.binance.org/")
    web3.eth.setProvider(Web3.givenProvider); // chuyen sang MM provider, neu khong se gap loi Returned error: unknown account
    const stakingContract = new web3.eth.Contract(FestakedWithReward.abi, stakingContractAddr);

    // Your staked balance
    const [yourStakedBalance, setYourStakedBalance] = useState('0');

    const getyourStakedBalance = async () => {
      if (!!account) {
        await stakingContract.methods.stakeOf(account).call((error, result) => {
          setYourStakedBalance((result ?? 0) / 1e18);
        });
      }
    };

    // Pool Name
    const [poolName, setPoolName] = useState('');

    // Get staking cap
    const [stakingCap, setStakingCap] = useState('0');

    // Current Staked balance
    const [stakedBalance, setStakedBalance] = useState('0');

    // Staked Total
    const [stakedTotal, setStakedTotal] = useState('0');

    // Early Withdraw open
    const [earlyWithdraw, setEarlyWithdraw] = useState('0');

    // Staking start
    const [stakingStart, setstakingStart] = useState('0');

    // Contribution close
    const [stakingEnds, setstakingEnds] = useState('0');

    // Maturity at
    const [maturityAt, setMaturityAt] = useState('0');

    // Reward State
    const [rewardState, setRewardState] = useState('0');

    // Control token contract
    const tokenAddr = process.env.REACT_APP_TKN_CONTRACT;
    // const tokenAddr = "0x8357c604c5533fa0053BeAaA1494Da552ceA38f7"
    const tokenNPO = new web3.eth.Contract(tokenContract.abi, tokenAddr);

    const getBalance = async () => {
      if (!!account) {
        await tokenNPO.methods.balanceOf(account).call((error, result) => {
          setBalance(result);
        });
      }
    };

    const [balance, setBalance] = useState('0');

    const getInfos = async () => {
      if (formVisibility) {
        getyourStakedBalance();
        getBalance();
        const [
          poolNameRes,
          stakingCap,
          stakedBalanceRes,
          stakedTotalRes,
          withdrawStartsRes,
          stakingStartRes,
          stakingEndRes,
          maturityAtRes,
          rewardStateRes,
        ] = await Promise.all([
          new Promise(function (resolve, reject) {
            stakingContract.methods.name().call((error, result) => {
              resolve(result);
            });
          }),
          new Promise(function (resolve, reject) {
            stakingContract.methods.stakingCap().call((error, result) => {
              resolve(result / 1e18);
            });
          }),
          new Promise(function (resolve, reject) {
            stakingContract.methods.stakedBalance().call((error, result) => {
              resolve(result);
            });
          }),
          new Promise(function (resolve, reject) {
            stakingContract.methods.stakedTotal().call((error, result) => {
              resolve(result);
            });
          }),
          new Promise(function (resolve, reject) {
            stakingContract.methods.withdrawStarts().call((error, result) => {
              // setEarlyWithdraw(new Date(result * 1000).toLocaleString())
              resolve(result);
            });
          }),
          new Promise(function (resolve, reject) {
            stakingContract.methods.stakingStarts().call((error, result) => {
              resolve(result);
            });
          }),
          new Promise(function (resolve, reject) {
            stakingContract.methods.stakingEnds().call((error, result) => {
              resolve(result);
            });
          }),
          new Promise(function (resolve, reject) {
            stakingContract.methods.withdrawEnds().call((error, result) => {
              resolve(result);
            });
          }),
          new Promise(function (resolve, reject) {
            stakingContract.methods.rewardState().call((error, result) => {
              resolve(result);
            });
          }),
        ]);

        setPoolName(poolNameRes);
        setStakingCap(stakingCap);
        setStakedBalance(stakedBalanceRes);
        setStakedTotal(stakedTotalRes);
        setEarlyWithdraw(withdrawStartsRes);
        setstakingStart(stakingStartRes);
        setstakingEnds(stakingEndRes);
        setMaturityAt(maturityAtRes);
        setRewardState(rewardStateRes);
      }
    };

    const getNetwork = async () => {
      const netId = await web3.eth.net.getId();
      setFormVisibility(netId === Number(process.env.REACT_APP_NETWORK_VERSION));
    };

    useEffect(() => {
      getNetwork();
    }, []);

    useEffect(() => {
      getInfos();
    }, [account, formVisibility]);

    const APP_NETWORK =
      Number(process.env.REACT_APP_NETWORK_VERSION) === 97
        ? {
            chainName: 'BSC Testnet',
            chainId: '0x61',
            rpcUrls: ['https://data-seed-prebsc-2-s2.binance.org:8545'],
            blockExplorerUrls: ['https://testnet.bscscan.com/'],
            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
          }
        : {
            chainName: 'Binance Smart Chain',
            chainId: '0x38',
            rpcUrls: ['https://bsc-dataseed.binance.org/'],
            nativeCurrency: { name: 'BNB', symbol: 'BNB', decimals: 18 },
          };

    const handleConnectBinance = async () => {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: `0x${Number(process.env.REACT_APP_NETWORK_VERSION).toString(16)}` }],
        });
      } catch (error) {
        if (error.code === 4902) {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [APP_NETWORK],
          });
        }
      }
    };

    return (
      <>
        <OriginalComponent
          formVisibility={formVisibility}
          stakingContractAddr={stakingContractAddr}
          account={account}
          connectMM={connectMM}
          onAccountChange={onAccountChange}
          chain={chain}
          poolName={poolName}
          stakingCap={stakingCap}
          stakedBalance={stakedBalance}
          stakedTotal={stakedTotal}
          setStakedBalance={setStakedBalance}
          earlyWithdraw={earlyWithdraw}
          yourStakedBalance={yourStakedBalance}
          setYourStakedBalance={setYourStakedBalance}
          stakingStart={stakingStart}
          stakingEnds={stakingEnds}
          maturityAt={maturityAt}
          rewardState={rewardState}
          stakingContract={stakingContract}
          tokenNPO={tokenNPO}
          getyourStakedBalance={getyourStakedBalance}
          balance={balance}
          getInfos={getInfos}
        />
        <CustomDialog fullWidth maxWidth='xs' open={!formVisibility}>
          <div className='flex flex-col items-center py-8'>
            <CircularProgress style={{ color: 'rgb(150, 103, 64)' }} />
            <Typography variant='h3' className='mt-4 mb-2'>
              Wrong Network
            </Typography>
            <Typography className='mb-6'>Please switch network to continue</Typography>
            <DesignButton onClick={handleConnectBinance} imageSize='small'>
              BNB Chain
            </DesignButton>
          </div>
        </CustomDialog>
      </>
    );
  }
  return NewComponent;
};
export default withWallet;
