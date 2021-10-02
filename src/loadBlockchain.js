import {ElectionData} from './loadElections.js';

// Default would contain all the necessary functions for interaction
export var Default = {
  loading: false,
  contracts: {},

  // Main function to be called first
  load: async () => {
    await Default.loadWeb3();
    await Default.loadAccount(); 
    await Default.loadMainContract();
    await ElectionData.get();
    await Default.render();
  },

  // Loading web3 on the browser
  loadWeb3: async () => {
    if(typeof web3 !== 'undefined') {
      web3 = new Web3(web3.currentProvider);
      Default.web3Provider = web3.currentProvider;
    } else {
      window.alert("Please connect to Metamask");
    }

    if(window.ethereum) {
      window.web3 = new Web3(ethereum);
      try {
        await ethereum.enable();
      }catch (error) {
        console.log(error);
      }
    }else if(window.web3) {
      Default.web3Provider = web3.currentProvider;
      window.web3 = new Web3(web3.currentProvider);
    }else{
      console.log('Non-Ethereum Browser detected');
    }
  },

  // This function would load account from Metamask to our dDefault
  loadAccount: async() => {
    await web3.eth.getAccounts().then((result)=>{
      Default.account = result[0];
    });
  },

  // This function would help in loading contract to Default.MainContract
  loadMainContract: async () => {
    // Static pre-deployed contracts should be handled like this
    const MainContract = await $.getJSON('/mainContractJSON');
    Default.contracts.MainContract = TruffleContract(MainContract);
    Default.contracts.MainContract.setProvider(Default.web3Provider);
    Default.MainContract = await Default.contracts.MainContract.deployed();
  },

  // This function will be called after the browser is ready for blockchain interaction
  render: async() => {
    if(Default.loading) {
      return;
    }
    Default.setLoading(true);
    $('#account').html(Default.account);
    Default.setLoading(false);
  },

  // This will facilitate loading feature according to the blockchain data
  setLoading: (boolean) => {
    Default.loading = boolean;
    const loader = $('#loader');
    const content = $('#content');
    if(boolean) {
      loader.show();
      content.hide();
    }else {
      loader.hide();
      content.show();
    }
  }
};

// Function to initiate the blockchain interaction
$(() => {
  window.addEventListener('load', ()=>{
      Default.load();
  });
});

window.Default = Default;