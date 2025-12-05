import express from "express";
import { 
    Client, 
    AccountBalanceQuery, 
    TransferTransaction, 
    Hbar, 
    PrivateKey,
    AccountInfoQuery,
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

// Get Account Balance with Hedera Mirror Node Exchange Rate
app.get("/account/balance/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const client = Client.forTestnet();

        // ===== Get Account Balance =====
        const balance = await new AccountBalanceQuery()
            .setAccountId(id)
            .execute(client);

        const hbarBalanceStr = balance.hbars.toString();       // string
        const hbarBalanceNum = parseFloat(balance.hbars.toString()); // number

        // ===== Get current exchange rate from Mirror Node =====
        const rateResponse = await fetch("https://testnet.mirrornode.hedera.com/api/v1/network/exchangerate");
        const rateData = await rateResponse.json();

        const { cent_equivalent, hbar_equivalent } = rateData.current_rate;

        // ===== Calculate transaction fee in HBAR =====
        const txFeeUsd = 0.00010; // USD
        const txFeeCents = txFeeUsd * 100; // convert USD to cents
        const txFeeHbar = (txFeeCents / cent_equivalent) * hbar_equivalent;

        const hbarBalanceFormatted = `${hbarBalanceStr}`;
        const txFeeHbarFormatted = Number(txFeeHbar.toFixed(6));

        res.json({
            accountId: id,
            hbars: hbarBalanceFormatted,
            transactionFeeHbar: txFeeHbarFormatted,
            balance: hbarBalanceNum
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

        const client = createClient(accountId, PrivateKey.fromStringDer(privateKey));

        // Execute transfer
        const tx = await new TransferTransaction()
            .addHbarTransfer(accountId, new Hbar(-amount))
            .addHbarTransfer(receiverAccountId, new Hbar(amount))
            .execute(client);

        const receipt = await tx.getReceipt(client);
        const transactionId = tx.transactionId.toString();

        // HashScan link
        const hashscanUrl = `https://hashscan.io/testnet/transaction/${transactionId}`;
        // Execution time
        const executionTime = new Date().toISOString();
        res.json({
            status: "Transfer Success",
            from: accountId,
            to: receiverAccountId,
            amount: amount,
            transactionId: transactionId,
            hashscan: hashscanUrl,
            executionTime: executionTime,
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

    if (!accountId || !privateKey) {
      return res.status(400).json({
        valid: false,
        message: "accountId and privateKey are required"
      });
    }

    const client = Client.forTestnet();
    client.setOperator(accountId, PrivateKey.fromStringDer(privateKey));

    // This query forces signature check
    const info = await new AccountInfoQuery()
      .setAccountId(accountId)
      .execute(client);

    return res.json({
      valid: true,
      message: "Credentials are correct",
      publicKeyOnChain: info.key.toString(),
    });

  } catch (error) {
    
    // ====== Special Case: Balance = 0 but Key is Correct ======
    if (error.message?.includes("INSUFFICIENT_PAYER_BALANCE")) {
      return res.json({
        valid: true,
        message: "Credentials are correct but account has insufficient balance",
        warning: "Account is valid but empty (0 HBAR)",
      });
    }

    // ====== Any Other Error Means Invalid ======
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