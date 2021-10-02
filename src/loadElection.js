import {Default} from './loadBlockchain.js';
import {Election} from './Election.js';

export var ElectionData = {
  // get() is a loader function, to run loadElections() function.
  get: async () => {
      await ElectionData.loadElections();
      await ElectionData.loadElectionDetails();
  },

  // Loading deployed election contracts in Default.election array
  loadElections: async () => {
      ElectionData.elections = [];
      ElectionData.electionCount = await Default.MainContract.electionId();
      for(var i = 0; i < ElectionData.electionCount; i++) {
          var electionAddress = await Default.MainContract.Elections(i);
          var election = await new Election(electionAddress);
          await election.init();
          ElectionData.elections.push(election);
      }

  },

  // This function will update the page with election details
  loadElectionDetails: async () => {
      $('#electionDetails').html("");
      for(var i = 0; i < ElectionData.electionCount; i++) {
          var details = await ElectionData.elections[i].getDetails();
          var votingForm;
          // Showing voting forms to only non-voted elections
          if(details.hasVoted) {
              votingForm = `<td>
                              <font size = 2 color = 'green'><b>Voted</b></font>
                            </td>`
          } else {
              votingForm = `<td>
                              <span>
                                <input type='radio' name=${details.address} id="${details.address}0" onclick="ElectionData.elections[${i}].castVote(0)"> 
                                <label for="${details.address}0"> ${details.candidates[0].name}</label>
                        </span> <br>
                              <span>
                                <input type='radio' name=${details.address} id="${details.address}1" onclick="ElectionData.elections[${i}].castVote(1)"> 
                                <label for="${details.address}1"> ${details.candidates[1].name}</label>
                        </span>
                            </td>`
          }
          var electionComponent = `<tr>
                                      <td>${i}</td>
                                      <td>${details.name}</td>
                                      <td>
                                          ${details.description}<br>
                                          <font size = 2 class='text-muted'>
                                              ${details.address}<br>
                                              <b>${details.candidates[0].name} (${details.candidates[0].voteCount})</b> vs
                                              <b>${details.candidates[1].name} (${details.candidates[1].voteCount})</b>
                                          </font>
                                      </td>
                                      ${votingForm}
                                  </tr>`
          $('#electionDetails').append(electionComponent);
      }
  },

  // Function to create (deploy) election on the network
  createElection: async (details, candidates) => {
      await Default.MainContract.createElection(details, candidates, {from: Default.account});
      ElectionData.get();
  }
}  

window.ElectionData = ElectionData;