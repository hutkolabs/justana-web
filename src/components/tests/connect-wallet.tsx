import { Button } from '@mui/material'
import { useCircle } from '../../providers'
import { useState } from 'react'

const shortizeAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export const ConnectWallet = () => {
  const [userAddress, setUserAddress] = useState<string>("")
  const { circle } = useCircle()

  const isConnected = userAddress;

  const connectWallet = async () => {
    if (!isConnected) {
      await circle.connectWallet()
      setUserAddress(circle.userAddress!)
    } else {
      setUserAddress('')
    }
  }

  return (
    <Button variant="contained" color="primary" onClick={connectWallet}>
      {isConnected ? shortizeAddress(userAddress) : 'Connect Wallet'}
    </Button>
  )
}