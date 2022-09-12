import React, { useEffect, useState } from 'react';
import { useCallback } from 'react';
import Web3 from 'web3/dist/web3.min';
import FestakedWithReward from '../../artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json';
import tokenContract from '../../artifacts/contracts/tokenContract/tokenContract.json';

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
        await stakingContract.methods.name().call((error, result) => {
          setPoolName(result);
        });
        await stakingContract.methods.stakingCap().call((error, result) => {
          setStakingCap(result / 1e18);
        });
        await stakingContract.methods.stakedBalance().call((error, result) => {
          setStakedBalance(result);
        });
        await stakingContract.methods.stakedTotal().call((error, result) => {
          setStakedTotal(result);
        });
        await stakingContract.methods.withdrawStarts().call((error, result) => {
          // setEarlyWithdraw(new Date(result * 1000).toLocaleString())
          setEarlyWithdraw(result);
        });
        await stakingContract.methods.stakingStarts().call((error, result) => {
          setstakingStart(result);
        });
        await stakingContract.methods.stakingEnds().call((error, result) => {
          setstakingEnds(result);
        });
        await stakingContract.methods.withdrawEnds().call((error, result) => {
          setMaturityAt(result);
        });
        await stakingContract.methods.rewardState().call((error, result) => {
          setRewardState(result);
        });
      }
    };

    const getNetwork = useCallback(async () => {
      const netId = await web3.eth.net.getId();
      setFormVisibility(netId === Number(process.env.REACT_APP_NETWORK_VERSION));
    }, [web3.eth.net]);

    useEffect(() => {
      getNetwork();
    }, [getNetwork]);

    useEffect(() => {
      getInfos();
    }, [account, formVisibility]);

    return (
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
    );
  }
  return NewComponent;
};
export default withWallet;
