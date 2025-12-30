import Web3 from 'web3';

const getWeb3 = () =>
  new Promise(async (resolve, reject) => {
    // Modern dapp browsers
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        resolve(web3);
      } catch (error) {
        reject(error);
      }
    }
    // Legacy dapp browsers
    else if (window.web3) {
      const web3 = window.web3.currentProvider;
      resolve(web3);
    }
    // Non-dapp browsers
    else {
      reject(new Error('Please install MetaMask!'));
    }
  });

export default getWeb3;