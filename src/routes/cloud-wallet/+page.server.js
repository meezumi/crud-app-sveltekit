import NeucronSDK from "neucron-sdk";

/** @type {import('./$types').Actions} */
export const actions = {
  login: async ({ request }) => {
    const data = await request.formData();

    const neucron = new NeucronSDK();

    const authModule = neucron.authentication;
    const walletModule = neucron.wallet;

    const loginResponse = await authModule.login({
      email: data.get("email"),
      password: data.get("password"),
    });
    console.log(loginResponse);

    const DefaultWalletBalance = await walletModule.getWalletBalance({});
    console.log(DefaultWalletBalance);

    const addresses = await walletModule.getAddressesByWalletId({});
    console.log(addresses);

    return { success: true, balance: DefaultWalletBalance.data.balance.summary };
  },

  pay: async ({ request }) => {
    try {
      const data = await request.formData();

      const neucron = new NeucronSDK();

      const authModule = neucron.authentication;
      const walletModule = neucron.wallet;

      const loginResponse = await authModule.login({
        email: data.get("email"),
        password: data.get("password"),
      });
      console.log(loginResponse);

      const paymail = data.get("paymail");
      const amount = parseFloat(data.get("amount"));

      if (!paymail || !amount || isNaN(amount) || amount <= 0) {
        throw new Error("Invalid paymail or amount");
      }

      const options = {
        outputs: [
          {
            address: paymail,
            note: "gurudakshina",
            amount: amount,
          },
        ],
      };

      console.log("Payment options:", options);

      const payResponse = await neucron.pay.txSpend(options);
      console.log(payResponse);

      return { success: true, payment: `https://whatsonchain.com/tx/${payResponse.data.txid}` };
    } catch (error) {
      console.error("Payment failed:", error.message);
      return { success: false, error: error.message };
    }
  },
};
