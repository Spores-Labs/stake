import { createSlice } from '@reduxjs/toolkit';

export const contractInfosSlice = createSlice({
  name: 'contractInfos',
  initialState: {
    poolName: '',
    stakingCap: '0',
    stakedBalance: '0',
    stakedTotal: '0',
    earlyWithdraw: '0',
    stakingStart: '0',
    stakingEnds: '0',
    maturityAt: '0',
    rewardState: '0',
    isCalled: false,
  },
  reducers: {
    updateContractInfos: (state, { payload: infos }) => {
      return { ...state, ...infos };
    },
  },
});

export const { updateContractInfos } = contractInfosSlice.actions;

export const contractInfosSelector = ({ contractInfos }) => contractInfos;

export default contractInfosSlice.reducer;
