import { ethers } from 'ethers';

import MetisTube from '../deployments/metis/MetisTube.json';

export default function MetisTubeInstance(signer) {
  return new ethers.Contract(MetisTube.address, MetisTube.abi, signer);
}
