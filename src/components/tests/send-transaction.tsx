import { Intent } from "../../libs";
import { useCircle } from "../../providers";

export const SendTransaction = () => {
  const { circle } = useCircle();

  const sendTransaction = async () => {
    const tokenInAddress = '0x9999f7Fea5938fD3b1E26A12c3f2fb024e194f97' // USDC
    const tokenOutAddress = '0x2bbF1f48a678d2f7c291dc5F8fD04805D34F485f' //curve
    const amountIn = 7
    const minAmountOut = 2

    const intent = new Intent(circle);
    // console.log(await intent.testTransaction());

    // await circle.transfer({
    //   amount: 3,
    //   // recipient: "0x79cA1C90D44a2A547eE19aD4e4C9dFd46De109f6",
    //   recipient: intent.validatorAddress,
    //   symbol: "USDC",
    // });
    
    console.log(await intent.placeIntent({
      assetIn: tokenInAddress,
      assetTo: tokenOutAddress,
      amountIn: amountIn,
      minAmountOut: minAmountOut
    }));

    const fetchedIntent = await intent.getIntent()

    console.log(fetchedIntent)

    console.log(await intent.estimateExecuteIntentGas({
      intentId: fetchedIntent.intentId,
      assetIn: tokenInAddress,
      assetTo: tokenOutAddress,
      amountIn: amountIn,
      minAmountOut: minAmountOut
    }))
    // console.log(await intent.executeIntent({
    //   intentId: fetchedIntent.intentId,
    //   assetIn: tokenInAddress,
    //   assetTo: tokenOutAddress,
    //   amountIn: amountIn,
    //   minAmountOut: minAmountOut
    // }))

  };

  return (
    <>
      <button className="btn-secondary" onClick={sendTransaction}>
        Send Transaction
      </button>

    </>
  );
};
