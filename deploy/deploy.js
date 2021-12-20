// Just a standard hardhat-deploy deployment definition file!
const func = async (hre) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();
  console.log(deployer);

  const name = 'MetisTube';
  const symbol = 'TUBE';

  await deploy('MetisTube', {
    from: deployer,
    args: [name, symbol],
    log: true,
  });
};

func.tags = ['Metis'];
module.exports = func;
