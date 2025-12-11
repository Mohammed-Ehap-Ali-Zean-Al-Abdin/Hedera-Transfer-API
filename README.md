# 🚀 Hedera Transfer API
A powerful and straightforward RESTful API built to simplify and streamline the process of transferring HBAR and fungible/non-fungible tokens on the [Hedera Hashgraph](https://hedera.com/) network. This service provides secure, high-availability endpoints, allowing applications to easily integrate Hedera's asset transfer capabilities without needing to manage the complex Hedera SDK directly.

## ✨ Features
- **HBAR Transfer:** Send native HBAR to any valid Hedera Account ID.
- **Token Transfer (FT):** Transfer specific amounts of fungible tokens (HIP-17 standard).
- **NFT Transfer (NFT):** Transfer a single Non-Fungible Token by serial number.
- **Transaction Status:** Endpoints to retrieve the status and details of executed transfers.
- **Secure Configuration:** Manages private keys and network settings via environment variables (`.env`).
- **Clean REST Architecture:** Easy to integrate with any client application (web, mobile, backend).

# 🛠️ Getting Started
Follow these steps to get your local copy up and running for development and testing.

**Prerequisites**
- **Node.js** (LTS version recommended)
- **npm** or **yarn**
- A valid **Hedera Account ID** and **Private Key** (for the Payer/Operator account).

**Installation**
1. **Clone the repository:**
```bash
git clone https://github.com/Mohammed-Ehap-Ali-Zean-Al-Abdin/Hedera-Transfer-API.git
cd Hedera-Transfer-API
```
2. **Install dependencies:**
```bash
npm install
# or
# yarn install
```
3. **Set up Environment Variables:** Create a file named `.env` in the root directory and configure it with your Hedera account credentials and network settings:
```
# Hedera Network Configuration (TESTNET, PREVIEWNET, or MAINNET)
HEDERA_NETWORK="TESTNET"

# The Account ID that will be paying for the transactions (Payer/Operator)
OPERATOR_ID="<YOUR_HEDERA_ACCOUNT_ID>"

# The Private Key for the OPERATOR_ID
OPERATOR_KEY="<YOUR_HEDERA_PRIVATE_KEY>"

# The port the API will run on
PORT=3000
```
-------
##### **⚠️ Security Warning: Never commit your `.env` file containing private keys to a public repository. Ensure it is listed in your `.gitignore` file.**
-------
**Running the API**
Start the server:
```bash
npm start
# or (for development with auto-reload, if configured)
# npm run dev
```
The API should now be running at `http://localhost:<PORT>` (e.g., `http://localhost:3000`).

## 🔗 API Endpoints
The API is versioned under `/api/v1`.
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/transfer/hbar` | Transfers native HBAR between two Hedera accounts. |
| `POST` | `/api/v1/transfer/token/:tokenId` | Transfers a specific amount of a fungible token. |
| `POST` | `/api/v1/transfer/nft/:tokenId` | Transfers a single NFT (by serial number). |
| `GET` | `/api/v1/transaction/:transactionId` | Retrieves the status of a past transaction. |

**Example: Transferring HBAR**
**Request Body** (`POST /api/v1/transfer/hbar`)
```json
{
  "senderId": "0.0.12345",
  "recipientId": "0.0.67890",
  "amountHbar": 10.5
}
```
**Success Response** (`200 OK`)
```json
{
  "success": true,
  "message": "HBAR transfer initiated successfully.",
  "transactionId": "0.0.12345@1678886000.123456789",
  "network": "TESTNET"
}
```
---
### 🧩 Integrations and Client Examples

This powerful REST API is designed to be easily consumed by various client applications. Below are examples of projects and clients that utilize these endpoints:

| Project Name | Type | Description | Repository |
| :--- | :--- | :--- | :--- |
| **Hedera Transfer App** | Frontend Web/Mobile Client | A client application built to demonstrate and utilize this API's endpoints for performing HBAR and token transfers in a user-friendly interface. | [mhmdwaelanwr/Hedera-Transfer-App](https://github.com/mhmdwaelanwr/Hedera-Transfer-App.git) |
---
## 🤝 Contributing
We welcome community contributions! If you have suggestions for new features, bug fixes, or improvements, please follow these steps:
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
---
## 📄 License
Distributed under the MIT License. See the `LICENSE` file for more information.






