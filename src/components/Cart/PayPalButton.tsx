// import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
// import React from 'react';

// interface PayPalButtonProps {
//   amount: string | number;
//   onSuccess: (details: any) => void;
//   onError: (err: any) => void;
// }

// const PayPalButton: React.FC<PayPalButtonProps> = ({ amount, onSuccess, onError }) => {
//   const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

//   if (!clientId) {
//     return <p className="text-red-600 text-center">PayPal configuration error. Please contact support.</p>;
//   }

//   return (
//     <PayPalScriptProvider
//       options={{
//         clientId,
//         currency: 'USD',
//         intent: 'capture',
//       }}
//     >
//       <PayPalButtons
//         style={{ layout: 'vertical' }}
//         createOrder={(data, actions) => {
//           return actions.order.create({
//             intent: 'CAPTURE',
//             purchase_units: [
//               {
//                 amount: {
//                   currency_code: 'USD',
//                   value: parseFloat(amount as string).toFixed(2),
//                 },
//               },
//             ],
//           });
//         }}
//         onApprove={(data, actions) => {
//           // actions.order is guaranteed to exist here after createOrder success
//           // @paypal/react-paypal-js types mark it as optional, but in practice it's always available
//           // Use non-null assertion (!) to satisfy TypeScript
//           return actions.order!.capture().then((details) => {
//             onSuccess(details);
//           });
//         }}
//         onError={onError}
//       />
//     </PayPalScriptProvider>
//   );
// };

// export default PayPalButton;

import { PayPalButtons, PayPalScriptProvider } from '@paypal/react-paypal-js';
import React from 'react';

interface PayPalButtonProps {
  amount: string | number;
  onSuccess: (details: any) => void;
  onError: (err: any) => void;
}

const PayPalButton: React.FC<PayPalButtonProps> = ({
  amount,
  onSuccess,
  onError,
}) => {
  const clientId = import.meta.env.VITE_PAYPAL_CLIENT_ID as string;

  if (!clientId) {
    return (
      <p className="text-red-600 text-center">
        PayPal configuration error. Please contact support.
      </p>
    );
  }

  return (
    <PayPalScriptProvider
      options={{
        clientId,
        currency: 'USD',
        intent: 'capture',
      }}
    >
      <PayPalButtons
        style={{ layout: 'vertical' }}

      
        createOrder={(_, actions) => {
          return actions.order.create({
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: Number(amount).toFixed(2),
                },
              },
            ],
          });
        }}

        
        onApprove={(_, actions) => {
          return actions.order!.capture().then((details) => {
            onSuccess(details);
          });
        }}

        onError={onError}
      />
    </PayPalScriptProvider>
  );
};

export default PayPalButton;
