import {Default} from './loadBlockchain.js';
import {ElectionData} from './loadElections.js';

// Election class for maintaining separate states for each election contract
export class Election {
constructor(address) {
  this.address = address;
}

init = async () => {
  await this.loadElectionContract();
}

// Loading election contract's javascript equivalent in the this.election variable
loadElectionContract = async () => {
  // Dynamic contracts whose address is not known should be handled like this
  var electionABI = await $.getJSON('/electionJSON');
  this.election = await new web3.eth.Contract(electionABI, this.address);
  await this.election.setProvider(web3.currentProvider);
}

// Get details of the election
getDetails = async () => {
  var details = {};

  // Fetching details from blockchain and storing it in details object
  details.candidates      = [];
  details.address         = this.address;
  details.candidatesCount = await this.election.methods.candidatesCount().call()
  details.name            = await this.election.methods.name().call();
  details.description     = await this.election.methods.description().call();
  details.hasVoted        = await this.election.methods.voters(Default.account).call();

  // Fetching candidate details along with their vote count
  for(var i = 0; i < details.candidatesCount; i++) {
      var candidate = await this.election.methods.candidates(i).call()

      details.candidates.push({
          name: candidate.name,
          voteCount: candidate.voteCount
      });
  }

  return details;
}

// This function will call vote() on Fuji testnet
castVote = async (candidateId) => {
  await this.election.methods.vote(candidateId).send({ from: Default.account });
  await ElectionData.get();
}
}