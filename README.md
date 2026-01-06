# 🚀 Hedera HBAR Transfer API

A straightforward RESTful API designed to simplify and streamline the process of transferring HBAR on the Hedera Hashgraph network. This service provides secure, high-availability endpoints, allowing applications to easily integrate Hedera's native cryptocurrency transfer and account inquiry capabilities without needing to manage the complex Hedera SDK directly for these operations.

## ✨ Features

*   **HBAR Transfer**: Send native HBAR to any valid Hedera Account ID.
*   **Account Balance Inquiry**: Retrieve the current HBAR balance for a specified Hedera Account ID, including an estimated network transaction fee.
*   **Account Credential Verification**: Validate a Hedera Account ID and its corresponding Private Key.
*   **Transaction Tracking**: Obtain transaction IDs, full transaction receipts, and HashScan URLs for initiated HBAR transfers.
*   **Secure Configuration**: Manages sensitive credentials and network settings via environment variables (`.env`).
*   **Clean REST Architecture**: Provides clear and accessible HTTP endpoints for easy integration with client applications.
*   **Hedera Testnet Integration**: Configured for seamless operation with the Hedera Testnet.

## 🛠️ Tech Stack

*   **Language**: JavaScript
*   **Runtime**: Node.js (LTS version recommended)
*   **Framework**: Express.js
*   **Hedera SDK**: `@hashgraph/sdk`

## 🚀 Getting Started

Follow these steps to get your local copy up and running for development and testing.

### Prerequisites

*   **Node.js** (LTS version recommended)
*   **npm**, **yarn**, or **pnpm**
*   A valid **Hedera Account ID** and **Private Key** (for the Payer/Operator account).

### Installation

1.  **Clone the repository:**`git clone https://github.com/mhmdwaelanwr/Hedera-Transfer-API.git
cd Hedera-Transfer-API
`
2.  **Install dependencies:**`npm install
# or
# yarn install
# or
# pnpm install
`
3.  **Set up Environment Variables:** Create a file named `.env` in the root directory and configure it with your Hedera account credentials and network settings:`OPERATOR_ID="<YOUR_HEDERA_ACCOUNT_ID>"
OPERATOR_KEY="<YOUR_HEDERA_PRIVATE_KEY>"
PORT=3000
`**⚠️ Security Warning: Never commit your `.env` file containing private keys to a public repository. Ensure it is listed in your `.gitignore` file.***Note: The API is currently hardcoded to use the Hedera Testnet (`Client.forTestnet()`) as defined in `index.js`.*

### Usage

Start the server:

```bash
npm start

```

The API should now be running at `http://localhost:<PORT>` (e.g., `http://localhost:3000`).

## 🔗 API Endpoints

The API provides the following endpoints:

| Method | Endpoint | Description | Request Body Example | Success Response Example |
| :--- | :--- | :--- | :--- | :--- |
| GET | / | Checks if the server is running and accessible. | N/A | json { "status": "Server is running", "ok": true }  |
| GET | /account/balance/:id | Retrieves the HBAR balance for a given Hedera Account ID. Includes an estimated transaction fee. | N/A | json { "accountId": "0.0.12345", "hbars": "10.5", "transactionFeeHbar": 0.000100, "balance": 10.5 }  |
| POST | /account/transaction | Initiates an HBAR transfer from one Hedera account to another. Requires sender's accountId and privateKey. | json { "accountId": "0.0.12345", "privateKey": "302e020100...", "amount": 10.5, "receiverAccountId": "0.0.67890" }  | json { "status": "Transfer Success", "from": "0.0.12345", "to": "0.0.67890", "amount": 10.5, "transactionId": "0.0.12345@1678886000.123456789", "hashscan": "https://hashscan.io/testnet/transaction/...", "executionTime": "2023-03-15T10:00:00.000Z", "receipt": { "status": { "_code": 22 }, "accountId": { "shard": 0, "realm": 0, "num": 12345 } } }  |
| POST | /account/verify | Verifies the validity of a Hedera Account ID and its corresponding Private Key. | json { "accountId": "0.0.12345", "privateKey": "302e020100..." }  | json { "valid": true, "message": "Credentials are correct", "publicKeyOnChain": "302a300506..." }  <br> OR <br> json { "valid": true, "message": "Credentials are correct but account has insufficient balance", "warning": "Account is valid but empty (0 HBAR)" }  <br> OR <br> json { "valid": false, "message": "Invalid accountId or privateKey", "error": "NODE_PRECHECK_ACCOUNT_DOES_NOT_EXIST" }  |


### 🧩 Integrations and Client Examples

This API is designed to be easily consumed by various client applications. An example project that utilizes these endpoints is:

| Project Name | Type | Description | Repository |
| :--- | :--- | :--- | :--- |
| Hedera Transfer App | Frontend Web/Mobile Client | A client application built to demonstrate and utilize this API's endpoints for performing HBAR transfers in a user-friendly interface. | 

## 🤝 Contributing

We welcome community contributions! If you have suggestions for new features, bug fixes, or improvements, please follow these steps:

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'feat: Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See the `LICENSE` file for more information.
