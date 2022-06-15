import { ethers } from "./ethers-5.6.esm.min.js";
import { ABI, contractAddress } from "./constants.js";

const connectBtn = document.querySelector(".connect-btn");
const fundBtn = document.querySelector(".fund-btn");
const getBalanceBtn = document.querySelector(".getBalance-btn");
const withdrawBtn = document.querySelector(".withdraw-btn");

// Connecting to Metamask or any Wallet
connectBtn.addEventListener("click", async () => {
  if (window.ethereum === undefined) {
    console.log("Please install MetaMask!");
    return;
  }
  try {
    await window.ethereum.request({
      method: "eth_requestAccounts",
    }); // returns address of the connected account
    connectBtn.innerHTML = "Connected";
    const accounts = await ethereum.request({ method: "eth_accounts" });
    console.log(accounts);
  } catch (err) {
    console.error(err);
  }
});

// Fund the account
fundBtn.addEventListener("click", async () => {
  // Provider
  const ethAmount = document.querySelector(".ethAmount-input").value;
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  // Signer
  const signer = provider.getSigner();
  // ABI, Address
  // Contract
  const contract = new ethers.Contract(contractAddress, ABI, signer);
  const transactionResponse = await contract.fund({
    value: ethers.utils.parseEther(ethAmount),
  });
  await listenForTransactionMine(transactionResponse, provider);
  console.log("Done !!");
});

// Listener for TransactionMine
const listenForTransactionMine = function (transactionResponse, provider) {
  console.log(`Mining ${transactionResponse.hash}....`);
  return new Promise((resolve, reject) => {
    provider.once(transactionResponse.hash, (transactionReceipt) => {
      console.log(
        `Completed with ${transactionReceipt.confirmations} confirmations`
      );
      resolve();
    });
  });
};

// Get Balance of the Contract Wallet
getBalanceBtn.addEventListener("click", async () => {
  if (typeof window.ethereum !== "undefined") {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
      const balance = await provider.getBalance(contractAddress);
      console.log(ethers.utils.formatEther(balance));
    } catch (error) {
      console.log(error);
    }
  } else {
    balanceButton.innerHTML = "Please install MetaMask";
  }
});

// Withdraw To Wallet
withdrawBtn.addEventListener("click", async () => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  const signer = provider.getSigner();

  const contract = new ethers.Contract(contractAddress, ABI, signer);
  const transactionResponse = await contract.withdraw();
  await listenForTransactionMine(transactionResponse, provider);
});
