const { ethers } = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  // Provider (infura/alchemy RPC URL)
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // Step 1: Private key to Wallet 
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

  // Step 2: Wallet to password encrypt
  const encryptedJson = await wallet.encrypt(process.env.PRIVATE_KEY_PASSWORD);

  // Step 3: Encrypted file save
  fs.writeFileSync("./encryptedKey.json", encryptedJson);
  console.log("Encrypted wallet saved to encryptedKey.json");

  // Step 4: Encrypted JSON file to wallet read
  const encryptedData = fs.readFileSync("./encryptedKey.json", "utf8");
  let decryptedWallet = await ethers.Wallet.fromEncryptedJson(
    encryptedData,
    process.env.PRIVATE_KEY_PASSWORD
  );

  // Step 5: Provider connect
  decryptedWallet = decryptedWallet.connect(provider);

  console.log(" Wallet address:", decryptedWallet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
