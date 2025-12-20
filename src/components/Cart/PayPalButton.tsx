import { PayPalButtons,PayPalScriptProvider } from '@paypal/react-paypal-js'
import React from 'react'
import { data } from 'react-router-dom'

const PayPalButton = ({amount,onSuccess,onError}) => {
  return (
    <PayPalScriptProvider options={{"client-id":
        "AeXaA1zk00DJ6j7gK9r2D49TDhKKhRQbOEMuFgLz1bLn9O8SqvUTtbxxn3Jh3o5UJwXREsN23RnFnNav"}}>

        <PayPalButtons style={{layout: "vertical"}}
        createOrder={(data,actions) => {
            return actions.order.create({
                purchase_units: [{amount: {value: amount}}]
            })
        }}  
        onApprove={(data,actions) => {
            return actions.order?.capture().then(onSuccess)
        }}  
        onError={onError} />
        </PayPalScriptProvider>
  )
}

export default PayPalButton