import express from "express";
import { 
    Client, 
    AccountBalanceQuery, 
    TransferTransaction, 
    Hbar, 
    PrivateKey
} from "@hashgraph/sdk";

const app = express();
app.use(express.json());

// Create Hedera Testnet Client
function createClient(accountId, privateKey) {
    const client = Client.forTestnet();
    client.setOperator(accountId, privateKey);
    return client;
}

// ---------- ROUTES ----------

// 1) Test server
app.get("/", (req, res) => {
    res.json({ status: "Server is running", ok: true });
});

// 2) Get Account Balance
app.get("/account/balance/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const client = Client.forTestnet();

        const balance = await new AccountBalanceQuery()
            .setAccountId(id)
            .execute(client);

        res.json({
            accountId: id,
            hbars: balance.hbars.toString(),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 3) Transfer HBAR + Receipt + HashScan URL
app.post("/account/transaction", async (req, res) => {
    try {
        const { accountId, privateKey, amount, receiverAccountId } = req.body;

        if (!accountId || !privateKey || !amount || !receiverAccountId) {
            return res.status(400).json({ error: "Missing required fields" });
        }

        const client = createClient(accountId, PrivateKey.fromString(privateKey));

        // Execute transfer
        const tx = await new TransferTransaction()
            .addHbarTransfer(accountId, new Hbar(-amount))
            .addHbarTransfer(receiverAccountId, new Hbar(amount))
            .execute(client);

        const receipt = await tx.getReceipt(client);
        const transactionId = tx.transactionId.toString();

        // HashScan link
        const hashscanUrl = `https://hashscan.io/testnet/transaction/${transactionId}`;

        res.json({
            status: "Transfer Success",
            from: accountId,
            to: receiverAccountId,
            amount: amount,
            transactionId: transactionId,
            hashscan: hashscanUrl,
            receipt: receipt, // full JSON receipt
        });

    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 4) Verify Account Credentials
app.post("/account/verify", async (req, res) => {
  try {
    const { accountId, privateKey } = req.body;

    if (!accountId || !privateKey)
      return res.status(400).json({
        valid: false,
        message: "accountId and privateKey are required"
      });

    const client = Client.forTestnet();
    client.setOperator(accountId, PrivateKey.fromString(privateKey));

    // Try a simple balance query (best way to verify credentials)
    const balance = await new AccountBalanceQuery()
      .setAccountId(accountId)
      .execute(client);

    return res.json({
      valid: true,
      message: "Credentials are correct",
      balance: `${balance.hbars.toString()}`
    });
  } catch (error) {
    return res.status(401).json({
      valid: false,
      message: "Invalid accountId or privateKey",
      error: error.message
    });
  }
});

// Run server
const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));