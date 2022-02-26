const getContract = async (web3, contracts) => {
  let network_id = await web3.eth.net.getId();
  let contract_address = contracts.networks[network_id];
  let contract = new web3.eth.Contract(contracts.abi, contract_address.address);
  return { contract, address: contract_address.address }
}

export default getContract;