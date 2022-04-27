import React, { useState } from "react"
import Web3 from "web3/dist/web3.min"
import FestakedWithReward from "../../artifacts/contracts/FestakedWithReward.sol/FestakedWithReward.json"
import tokenContract from "../../artifacts/contracts/tokenContract/tokenContract.json"

const withWallet = (OriginalComponent) => {
  function NewComponent(props) {
    // Check Chain
    let chain = ""
    if (typeof window.ethereum === "undefined") {
      alert("Please install Metamask extension first!")
    } else {
      if (window.ethereum.networkVersion === "56") {
        chain = "You are connected to BSC"

      } else {
        chain = <span className="boldText">Please connect your Wallet to BSC!!!</span>
      }
    }

    const formVisibility = (window.ethereum.networkVersion === "56")

    // Get/Set Wallet Address
    const [account, setAccount] = useState(
      "0x0000000000000000000000000000000000000000"
    )
    connectMM()
    async function connectMM() {
      const accounts = await window.ethereum.request(
        { method: "eth_requestAccounts" },
        (error) => {
          if (error) {
            console.log(error)
          }
        }
      )
      setAccount(accounts[0])
    }

    // On Account Changed
    function onAccountChange() {
      window.ethereum.on("accountsChanged", async () => {
        setAccount(window.ethereum.selectedAddress)
      })
    }

    window.ethereum.on("chainChanged", (chainID) => {
      // Handle the new chain.
      // Correctly handling chain changes can be complicated.
      // We recommend reloading the page unless you have good reason not to.
      if (parseInt(chainID).toString === "56") {
        chain = "You are connected to BSC"
      } else {
        chain = "Please connect to BSC!!!"
      }
      window.location.reload()
    })

    // Work with staking contract
    // const stakingContractAddr = "0x1FE470E4E533EeA525b2f2c34a9EbB995597C143"
    // const stakingContractAddr = "0xa49403Be3806eb19F27163D396f8A77b40b75C5f"
    // const stakingContractAddr = "0x0d0791b125689bA5152F4940dACD54dBfB850618"
    const stakingContractAddr = "0xDDb3699BEF2519A06CF1783b8bb2C4d4576429f1"

    // const web3 = new Web3("https://data-seed-prebsc-1-s1.binance.org:8545/")
    const web3 = new Web3("https://bsc-dataseed.binance.org/")
    web3.eth.setProvider(Web3.givenProvider) // chuyen sang MM provider, neu khong se gap loi Returned error: unknown account
    const stakingContract = new web3.eth.Contract(
      FestakedWithReward.abi,
      stakingContractAddr
    )

    // Your staked balance
    const [yourStakedBalance, setYourStakedBalance] = useState("")
    getyourStakedBalance()
    function getyourStakedBalance() {
      stakingContract.methods.stakeOf(account).call((error, result) => {
        setYourStakedBalance((result / 1e18).toLocaleString("en-EN"))
      })
    }

    // Pool Name
    const [poolName, setPoolName] = useState("")
    stakingContract.methods.name().call((error, result) => {
      setPoolName(result)
    })

    // Get staking cap
    const [stakingCap, setStakingCap] = useState("")
    stakingContract.methods.stakingCap().call((error, result) => {
      setStakingCap((result / 1e18).toLocaleString("en-EN"))
    })

    // Staked so far
    const [stakedBalance, setStakedBalance] = useState("")
    stakingContract.methods.stakedBalance().call((error, result) => {
      setStakedBalance((result / 1e18).toLocaleString("en-EN"))
    })

    // Early Withdraw open
    const [earlyWithdraw, setEarlyWithdraw] = useState("")
    stakingContract.methods.withdrawStarts().call((error, result) => {
      // setEarlyWithdraw(new Date(result * 1000).toLocaleString())
      setEarlyWithdraw(result)
    })

    // Staking start
    const [stakingStart, setstakingStart] = useState("")
    stakingContract.methods.stakingStarts().call((error, result) => {
      setstakingStart(result)
    })

    // Contribution close
    const [stakingEnds, setstakingEnds] = useState("")
    stakingContract.methods.stakingEnds().call((error, result) => {
      setstakingEnds(result)
    })

    // Maturity at
    const [maturityAt, setMaturityAt] = useState("")
    stakingContract.methods.withdrawEnds().call((error, result) => {
      setMaturityAt(new Date(result * 1000).toLocaleString())
    })

    // Control token contract
    // const tokenAddr = "0x476f7BcbC4058d4a0E8C0f9a6Df1fdcF675FAC83"
    const tokenAddr = "0x8357c604c5533fa0053BeAaA1494Da552ceA38f7"
    const tokenNPO = new web3.eth.Contract(tokenContract.abi, tokenAddr)

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
        setStakedBalance={setStakedBalance}
        earlyWithdraw={earlyWithdraw}
        yourStakedBalance={yourStakedBalance}
        setYourStakedBalance={setYourStakedBalance}
        stakingStart={stakingStart}
        stakingEnds={stakingEnds}
        maturityAt={maturityAt}
        stakingContract={stakingContract}
        tokenNPO={tokenNPO}
        getyourStakedBalance={getyourStakedBalance}
      />
    )
  }
  return NewComponent
}
export default withWallet
