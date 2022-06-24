# Staking pool
# 1. Deploy the contract
        Step 1: Deploy the Lib file: "Festaked.Library.sol"
        Step 2: Deploy the Contract (link to the Lib address provided at step 1)
# 2. Deploy the react app
        Step 1: Clone the branch you want to deploy, we provide 2 branches
                - Traditional staking pool: then token to be staked and the reward token are the same token
                - Liquidity staking pool: then token to be staked is the Dex token(eg:. LPtoken from Uniswap or Pancake swap), the reward token is another ERC20 token
        Step 2: npm start

# 3. Formular to calculate the reward amount
        Early withdraw
                r = (earlyWithdrawReward / stakedTotal) * (block.timestamp - stakingEnds) / (withdrawEnds - stakingEnds)
                reward = (1+r) * withdrawAmount
        Withdraw after close
                reward = (rewBal*withdrawAmount)/stakedBalance

# 4. NOTE
        - Operator MUST add reward after the constribution period ends and before the early withdraw starts
        - The APR is calculated based on the total amout of reward added
