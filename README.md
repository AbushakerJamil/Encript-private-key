# Encrypted Wallet Example

A minimal Node.js example showing how to:

* Create an `ethers` Wallet from a private key
* Encrypt the wallet to an encrypted JSON file
* Read the encrypted JSON file and decrypt the wallet
* Connect the decrypted wallet to an RPC provider

This README contains everything you need to initialize the project and run the script.

---

## Project structure (recommended)

```
my-wallet-project/
├─ .env
├─ index.js
├─ package.json
├─ .gitignore
└─ encryptedKey.json   # generated after first run
```

---

## Prerequisites

* Node.js (v16+ recommended)
* npm (or pnpm)
* An Ethereum RPC URL (Alchemy, Infura, or similar)
* A private key for the wallet you want to encrypt

---

## 1) Initialize project

Open your terminal and run:

```bash
mkdir my-wallet-project
cd my-wallet-project
npm init -y
```

This creates `package.json` with default values.

---

## 2) Install dependencies

```bash
npm install ethers fs-extra dotenv
```

**What they do**:

* `ethers` – wallet, encryption, provider, and common Ethereum utilities.
* `fs-extra` – simple file read/write helpers.
* `dotenv` – load environment variables from `.env`.

---

## 3) Create `.env`

Add a `.env` file to the project root with these variables:

```
PRIVATE_KEY=0xyourprivatekeyhere
PRIVATE_KEY_PASSWORD=strongpassword123
RPC_URL=https://eth-sepolia.g.alchemy.com/v2/your-api-key
```

**Security:** Never commit `.env` or your private key to version control.

---

## 4) `index.js` - Example script

Create `index.js` with the following content:

```js
const { ethers } = require("ethers");
const fs = require("fs-extra");
require("dotenv").config();

async function main() {
  // Create provider from RPC_URL
  const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);

  // Create wallet from private key
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY);

  // Encrypt the wallet (creates a JSON string)
  const encryptedJson = await wallet.encrypt(process.env.PRIVATE_KEY_PASSWORD);

  // Save encrypted JSON to file
  await fs.writeFileSync("./encryptedKey.json", encryptedJson);
  console.log(" Encrypted wallet saved to encryptedKey.json");

  // Read encrypted JSON from file
  const encryptedData = fs.readFileSync("./encryptedKey.json", "utf8");

  // Decrypt (unlock) the wallet
  let decryptedWallet = await ethers.Wallet.fromEncryptedJson(
    encryptedData,
    process.env.PRIVATE_KEY_PASSWORD
  );

  // Connect wallet to the provider
  decryptedWallet = decryptedWallet.connect(provider);

  console.log(" Wallet address:", decryptedWallet.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
```

---

## 5) `.gitignore`

Create a `.gitignore` file and add:

```
node_modules
.env
encryptedKey.json
```

This prevents your private data and dependencies from being committed.

---

## 6) Optional `package.json` scripts

You can add convenient scripts to `package.json` under the `scripts` section. Example:

```json
"scripts": {
  "start": "node index.js",
  "encrypt": "node index.js"
}
```

After adding that, run with:

```bash
npm start
```

---

## 7) Run the script

```bash
node index.js
# or
npm start
```

Expected outcome:

1. `encryptedKey.json` is created with the encrypted wallet JSON.
2. The script reads and decrypts the file using `PRIVATE_KEY_PASSWORD`.
3. The script connects the unlocked wallet to your RPC provider and prints the wallet address.

---

## Troubleshooting

* `ReferenceError: wallet is not defined` — ensure you create the wallet (`new ethers.Wallet(...)`) before calling `wallet.encrypt()`.
* File not found or mismatch — ensure the filenames you write and read match exactly (e.g., `encryptedKey.json`).
* RPC errors — confirm `RPC_URL` is correct and the provider is reachable.
* Incorrect password — `fromEncryptedJson` will throw if the password is wrong.

---

## Tips and best practices

* Use a strong password for the encrypted JSON (`PRIVATE_KEY_PASSWORD`).
* In production, consider hardware wallets or secret managers instead of raw private keys.
* Limit RPC keys' permissions and rotate them when needed.
* Add `encryptedKey.json` and `.env` to `.gitignore` to avoid leaking secrets.

---

## Next steps (optional)

If you want, I can:

* Add a ready `package.json` with scripts,
* Convert the example into a Hardhat task,
* Add a TypeScript version with types,
* Show how to integrate this into a Next.js app safely.

Tell me which one you'd like and I will update the project accordingly.
