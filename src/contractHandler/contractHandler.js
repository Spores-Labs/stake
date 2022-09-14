import Web3 from 'web3';
import FestakedWithReward from '../artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json';
import tokenContract from '../artifacts/contracts/tokenContract/tokenContract.json';

export const web3 = new Web3();

export const stakingContract = new web3.eth.Contract(FestakedWithReward.abi, process.env.REACT_APP_STK_CONTRACT);
export const tokenNPO = new web3.eth.Contract(tokenContract.abi, process.env.REACT_APP_TKN_CONTRACT);
