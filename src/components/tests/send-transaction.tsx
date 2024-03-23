import {Button} from '@mui/material'
import { useCircle } from '../../providers'

export const SendTransaction = () => {
  const {circle} = useCircle()

  const sendTransaction = async () => {
    await circle.transfer({
      amount: 0.01,
      recipient: '0x79cA1C90D44a2A547eE19aD4e4C9dFd46De109f6',
      symbol: 'USDC'
    })
  }


  return <Button onClick={sendTransaction}>SendTransaction</Button>
}