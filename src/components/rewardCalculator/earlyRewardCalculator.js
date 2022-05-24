function EarlyRewardCalculator(
  withdrawEnds,
  stakingEnds,
  stakedTotal,
  blockTimeStamp,
  earlyWithdrawReward,
  amount
) {
  let denom = (withdrawEnds - stakingEnds) * stakedTotal;
  let reward = (
    ((blockTimeStamp - stakingEnds) * earlyWithdrawReward * amount) /
    denom /
    1e18
  ).toFixed(6);
  return reward;
}

export default EarlyRewardCalculator;
