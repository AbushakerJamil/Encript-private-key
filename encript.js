const { ethers } = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  // Provider (infura/alchemy ইত্যাদির RPC URL দরকার)
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // Step 1: Private key থেকে Wallet বানাও
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

  // Step 2: Wallet কে password দিয়ে encrypt করো
  const encryptedJson = await wallet.encrypt(process.env.PRIVATE_KEY_PASSWORD);

  // Step 3: Encrypted ফাইল save করো
  fs.writeFileSync("./encryptedKey.json", encryptedJson);
  console.log("🔐 Encrypted wallet saved to encryptedKey.json");

  // Step 4: Encrypted JSON file থেকে আবার wallet read করো
  const encryptedData = fs.readFileSync("./encryptedKey.json", "utf8");
  let decryptedWallet = await ethers.Wallet.fromEncryptedJson(
    encryptedData,
    process.env.PRIVATE_KEY_PASSWORD
  );

  // Step 5: Provider connect করো
  decryptedWallet = decryptedWallet.connect(provider);

  console.log("✅ Wallet address:", decryptedWallet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
