// import React from 'react';

// const PaymentForm = () => {
//   return (
//     <div className="min-h-screen flex items-center justify-center bg-[#1f242d] p-6">
//       <form className="bg-white rounded-lg p-10 w-full max-w-3xl shadow-lg">
//         <div className="flex flex-wrap gap-6">
//           {/* Billing Address Column */}
//           <div className="flex-1 min-w-[250px]">
//             <h3 className="text-xl font-semibold text-gray-800 uppercase mb-3">Billing Address</h3>

//             <div className="mb-4">
//               <label className="block mb-2 text-sm">Full Name:</label>
//               <input type="text" placeholder="Jacob Aiden" className="w-full px-4 py-2 border rounded-md text-sm" />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2 text-sm">Email:</label>
//               <input type="email" placeholder="example@example.com" className="w-full px-4 py-2 border rounded-md text-sm" />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2 text-sm">Address:</label>
//               <input type="text" placeholder="Room - Street - Locality" className="w-full px-4 py-2 border rounded-md text-sm" />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2 text-sm">City:</label>
//               <input type="text" placeholder="Berlin" className="w-full px-4 py-2 border rounded-md text-sm" />
//             </div>

//             <div className="flex gap-4">
//               <div className="w-1/2">
//                 <label className="block mb-2 text-sm">State:</label>
//                 <input type="text" placeholder="Germany" className="w-full px-4 py-2 border rounded-md text-sm" />
//               </div>
//               <div className="w-1/2">
//                 <label className="block mb-2 text-sm">Zip Code:</label>
//                 <input type="number" placeholder="123 456" className="w-full px-4 py-2 border rounded-md text-sm" />
//               </div>
//             </div>
//           </div>

//           {/* Payment Column */}
//           <div className="flex-1 min-w-[250px]">
//             <h3 className="text-xl font-semibold text-gray-800 uppercase mb-3">Payment</h3>

//             <div className="mb-4">
//               <label className="block mb-2 text-sm">Cards Accepted:</label>
//               <img src="imgcards.png" alt="Cards" className="h-8 drop-shadow" />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2 text-sm">Name On Card:</label>
//               <input type="text" placeholder="Mr. Jacob Aiden" className="w-full px-4 py-2 border rounded-md text-sm" />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2 text-sm">Credit Card Number:</label>
//               <input type="number" placeholder="1111 2222 3333 4444" className="w-full px-4 py-2 border rounded-md text-sm" />
//             </div>

//             <div className="mb-4">
//               <label className="block mb-2 text-sm">Exp. Month:</label>
//               <input type="text" placeholder="August" className="w-full px-4 py-2 border rounded-md text-sm" />
//             </div>

//             <div className="flex gap-4">
//               <div className="w-1/2">
//                 <label className="block mb-2 text-sm">Exp. Year:</label>
//                 <input type="number" placeholder="2025" className="w-full px-4 py-2 border rounded-md text-sm" />
//               </div>
//               <div className="w-1/2">
//                 <label className="block mb-2 text-sm">CVV:</label>
//                 <input type="number" placeholder="123" className="w-full px-4 py-2 border rounded-md text-sm" />
//               </div>
//             </div>
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="mt-6 w-full py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-semibold text-lg rounded-md transition duration-300"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PaymentForm;



// import React, { useState } from 'react';

// const PaymentForm = () => {
//   const [paymentMethod, setPaymentMethod] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     alert(`Payment via ${paymentMethod}`);
//     // Add your PayFast integration logic here
//   };

//   return (
//     <div className="min-h-screen bg-[#1f242d] flex items-center justify-center p-6">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-10 rounded-xl w-full max-w-3xl"
//       >
//         <div className="flex flex-wrap gap-6">
//           {/* Billing Address */}
//           <div className="flex-1 min-w-[250px]">
//             <h3 className="text-lg font-bold uppercase text-gray-700 mb-4">Billing Address</h3>

//             <div className="mb-4">
//               <label className="block text-sm mb-1">Full Name :</label>
//               <input
//                 type="text"
//                 placeholder="Jacob Aiden"
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm mb-1">Email :</label>
//               <input
//                 type="email"
//                 placeholder="example@example.com"
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm mb-1">Address :</label>
//               <input
//                 type="text"
//                 placeholder="Room - Street - Locality"
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm mb-1">City :</label>
//               <input
//                 type="text"
//                 placeholder="Berlin"
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//             </div>

//             <div className="flex gap-4">
//               <div className="w-1/2">
//                 <label className="block text-sm mb-1">State :</label>
//                 <input
//                   type="text"
//                   placeholder="Germany"
//                   className="w-full border px-4 py-2 rounded-md"
//                 />
//               </div>
//               <div className="w-1/2">
//                 <label className="block text-sm mb-1">Zip Code :</label>
//                 <input
//                   type="number"
//                   placeholder="123 456"
//                   className="w-full border px-4 py-2 rounded-md"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Payment Section */}
//           <div className="flex-1 min-w-[250px]">
//             <h3 className="text-lg font-bold uppercase text-gray-700 mb-4">Payment</h3>

//             <div className="mb-4">
//               <span className="block text-sm mb-1">PayFast Wallets :</span>
//               <div className="flex flex-col gap-2 text-sm">
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="wallet"
//                     value="Visa/MasterCard"
//                     checked={paymentMethod === 'Visa/MasterCard'}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                   />
//                   Visa / MasterCard
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="wallet"
//                     value="JazzCash"
//                     checked={paymentMethod === 'JazzCash'}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                   />
//                   JazzCash
//                 </label>
//                 <label className="flex items-center gap-2">
//                   <input
//                     type="radio"
//                     name="wallet"
//                     value="EasyPaisa"
//                     checked={paymentMethod === 'EasyPaisa'}
//                     onChange={(e) => setPaymentMethod(e.target.value)}
//                   />
//                   Easypaisa
//                 </label>
//               </div>
//             </div>

//             {/* Card Details (Only visible for Visa/MasterCard) */}
//             {paymentMethod === 'Visa/MasterCard' && (
//               <>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-1">Name On Card :</label>
//                   <input
//                     type="text"
//                     placeholder="Mr. Jacob Aiden"
//                     className="w-full border px-4 py-2 rounded-md"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-1">Credit Card Number :</label>
//                   <input
//                     type="number"
//                     placeholder="1111 2222 3333 4444"
//                     className="w-full border px-4 py-2 rounded-md"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-1">Exp. Month :</label>
//                   <input
//                     type="text"
//                     placeholder="August"
//                     className="w-full border px-4 py-2 rounded-md"
//                   />
//                 </div>

//                 <div className="flex gap-4">
//                   <div className="w-1/2">
//                     <label className="block text-sm mb-1">Exp. Year :</label>
//                     <input
//                       type="number"
//                       placeholder="2025"
//                       className="w-full border px-4 py-2 rounded-md"
//                     />
//                   </div>
//                   <div className="w-1/2">
//                     <label className="block text-sm mb-1">CVV :</label>
//                     <input
//                       type="number"
//                       placeholder="123"
//                       className="w-full border px-4 py-2 rounded-md"
//                     />
//                   </div>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition"
//         >
//           Submit Payment
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PaymentForm;




// import React, { useState } from 'react';

// const PaymentForm = () => {
//   const [paymentMethod, setPaymentMethod] = useState('');
//   const [walletNumber, setWalletNumber] = useState('');
//   const [transactionId, setTransactionId] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     if (
//       (paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') &&
//       (!walletNumber || !transactionId)
//     ) {
//       alert("Please enter mobile number and transaction ID");
//       return;
//     }
//     alert(`Payment via ${paymentMethod}`);
//   };

//   return (
//     <div className="min-h-screen bg-[#1f242d] flex items-center justify-center p-6">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-10 rounded-xl w-full max-w-3xl"
//       >
//         <div className="flex flex-wrap gap-6">
//           {/* Billing Address */}
//           <div className="flex-1 min-w-[250px]">
//             <h3 className="text-lg font-bold uppercase text-gray-700 mb-4">Billing Address</h3>

//             <div className="mb-4">
//               <label className="block text-sm mb-1">Full Name :</label>
//               <input
//                 type="text"
//                 placeholder="Jacob Aiden"
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm mb-1">Email :</label>
//               <input
//                 type="email"
//                 placeholder="example@example.com"
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm mb-1">Address :</label>
//               <input
//                 type="text"
//                 placeholder="Room - Street - Locality"
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//             </div>

//             <div className="mb-4">
//               <label className="block text-sm mb-1">City :</label>
//               <input
//                 type="text"
//                 placeholder="Berlin"
//                 className="w-full border px-4 py-2 rounded-md"
//               />
//             </div>

//             <div className="flex gap-4">
//               <div className="w-1/2">
//                 <label className="block text-sm mb-1">State :</label>
//                 <input
//                   type="text"
//                   placeholder="Germany"
//                   className="w-full border px-4 py-2 rounded-md"
//                 />
//               </div>
//               <div className="w-1/2">
//                 <label className="block text-sm mb-1">Zip Code :</label>
//                 <input
//                   type="number"
//                   placeholder="123 456"
//                   className="w-full border px-4 py-2 rounded-md"
//                 />
//               </div>
//             </div>
//           </div>

//           {/* Payment Section */}
//           <div className="flex-1 min-w-[250px]">
//             <h3 className="text-lg font-bold uppercase text-gray-700 mb-4">Payment</h3>

//             <div className="mb-4">
//               <span className="block text-sm mb-1">PayFast Wallets :</span>
//               <div className="flex flex-col gap-2 text-sm">
//               <div className="flex flex-col gap-4">
//   <label className="flex items-center gap-3">
//     <input
//       type="radio"
//       name="wallet"
//       value="Visa/MasterCard"
//       checked={paymentMethod === 'Visa/MasterCard'}
//       onChange={(e) => setPaymentMethod(e.target.value)}
//     />
//     <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLqnwtzOs0P-aJLTIJboqZ2sAAz9btsmPcZw&s" alt="Visa" className="w-10" />
//     <img src="https://pngimg.com/d/mastercard_PNG23.png" alt="MasterCard" className="w-10" />
//     <span className="ml-2 font-medium">Visa / MasterCard</span>
//   </label>

//   <label className="flex items-center gap-3">
//     <input
//       type="radio"
//       name="wallet"
//       value="JazzCash"
//       checked={paymentMethod === 'JazzCash'}
//       onChange={(e) => setPaymentMethod(e.target.value)}
//     />
//     <img src="https://i.brecorder.com/primary/2024/05/664d3ed7d67b2.jpg" alt="JazzCash" className="w-10" />
//     <span className="ml-2 font-medium">JazzCash</span>
//   </label>

//   <label className="flex items-center gap-3">
//     <input
//       type="radio"
//       name="wallet"
//       value="EasyPaisa"
//       checked={paymentMethod === 'EasyPaisa'}
//       onChange={(e) => setPaymentMethod(e.target.value)}
//     />
//     <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRZSVpvEY36C2VAgUpeHMcwPQk1D3rJehmKqA&s" alt="EasyPaisa" className="w-10" />
//     <span className="ml-2 font-medium">EasyPaisa</span>
//   </label>
// </div>

//               </div>
//             </div>

//             {/* Visa/MasterCard Inputs */}
//             {paymentMethod === 'Visa/MasterCard' && (
//               <>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-1">Name On Card :</label>
//                   <input
//                     type="text"
//                     placeholder="Mr. Jacob Aiden"
//                     className="w-full border px-4 py-2 rounded-md"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-1">Credit Card Number :</label>
//                   <input
//                     type="number"
//                     placeholder="1111 2222 3333 4444"
//                     className="w-full border px-4 py-2 rounded-md"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-1">Exp. Month :</label>
//                   <input
//                     type="text"
//                     placeholder="August"
//                     className="w-full border px-4 py-2 rounded-md"
//                   />
//                 </div>
//                 <div className="flex gap-4">
//                   <div className="w-1/2">
//                     <label className="block text-sm mb-1">Exp. Year :</label>
//                     <input
//                       type="number"
//                       placeholder="2025"
//                       className="w-full border px-4 py-2 rounded-md"
//                     />
//                   </div>
//                   <div className="w-1/2">
//                     <label className="block text-sm mb-1">CVV :</label>
//                     <input
//                       type="number"
//                       placeholder="123"
//                       className="w-full border px-4 py-2 rounded-md"
//                     />
//                   </div>
//                 </div>
//               </>
//             )}

//             {/* JazzCash / EasyPaisa Inputs */}
//             {(paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') && (
//               <>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-1">Mobile Number :</label>
//                   <input
//                     type="tel"
//                     placeholder="03xx-xxxxxxx"
//                     value={walletNumber}
//                     onChange={(e) => setWalletNumber(e.target.value)}
//                     className="w-full border px-4 py-2 rounded-md"
//                   />
//                 </div>
//                 <div className="mb-4">
//                   <label className="block text-sm mb-1">Transaction ID :</label>
//                   <input
//                     type="text"
//                     placeholder="Enter transaction/reference ID"
//                     value={transactionId}
//                     onChange={(e) => setTransactionId(e.target.value)}
//                     className="w-full border px-4 py-2 rounded-md"
//                   />
//                 </div>
//               </>
//             )}
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 rounded-md transition"
//         >
//           Submit Payment
//         </button>
//       </form>
//     </div>
//   );
// };

// export default PaymentForm;




import React, { useState } from 'react';
import toast from 'react-hot-toast';

const PaymentForm = () => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [walletNumber, setWalletNumber] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [fee] = useState(999); // Subscription Fee

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      (paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') &&
      (!walletNumber || !transactionId)
    ) {
      toast.error("Please enter mobile number and transaction ID");
      return;
    }
    toast.success(`Payment via ${paymentMethod}`);
  };

  return (
    <div className="min-h-screen bg-[#1f242d] flex items-center justify-center p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl w-full max-w-3xl"
      >
        <div className="flex flex-wrap gap-6">
          {/* Billing Address */}
          <div className="flex-1 min-w-[250px]">
            <h3 className="text-lg font-bold uppercase text-gray-700 mb-4">Billing Address</h3>

            <div className="mb-4">
              <label className="block text-sm mb-1 text-[#1f242d] font-normal">Full Name :</label>
              <input
                type="text"
                placeholder="Jacob Aiden"
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1 text-[#1f242d] font-normal">Email :</label>
              <input
                type="email"
                placeholder="example@example.com"
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1 text-[#1f242d] font-normal">Address :</label>
              <input
                type="text"
                placeholder="Room - Street - Locality"
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm mb-1 text-[#1f242d] font-normal">City :</label>
              <input
                type="text"
                placeholder="Berlin"
                className="w-full border px-4 py-2 rounded-md"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm mb-1 text-[#1f242d] font-normal">State :</label>
                <input
                  type="text"
                  placeholder="Germany"
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>
              <div className="w-1/2">
                <label className="block text-sm mb-1 text-[#1f242d] font-normal">Zip Code :</label>
                <input
                  type="number"
                  placeholder="123 456"
                  className="w-full border px-4 py-2 rounded-md"
                />
              </div>
            </div>
          </div>

          {/* Payment Section */}
          <div className="flex-1 min-w-[250px]">
            <h3 className="text-lg font-bold uppercase text-gray-700 mb-4">Payment</h3>

            <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">Select a payment method:</p>
              <div className="flex flex-col gap-4 text-sm">
                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="wallet"
                    value="Visa/MasterCard"
                    checked={paymentMethod === 'Visa/MasterCard'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLqnwtzOs0P-aJLTIJboqZ2sAAz9btsmPcZw&s" alt="Visa" className="w-10" />
                  <img src="https://pngimg.com/d/mastercard_PNG23.png" alt="MasterCard" className="w-10" />
                  <span className="ml-2 font-medium text-[#1f242d]">Visa / MasterCard</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="wallet"
                    value="JazzCash"
                    checked={paymentMethod === 'JazzCash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <img src="https://i.brecorder.com/primary/2024/05/664d3ed7d67b2.jpg" alt="JazzCash" className="w-12" />
                  <span className="ml-2 font-medium text-[#1f242d]">JazzCash</span>
                </label>

                <label className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="wallet"
                    value="EasyPaisa"
                    checked={paymentMethod === 'EasyPaisa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  <img src="https://vectorseek.com/wp-content/uploads/2020/12/2009-logo-300x190.png" alt="EasyPaisa" className="w-12" />
                  <span className="ml-2 font-medium text-[#1f242d]">EasyPaisa</span>
                </label>
              </div>
            </div>

            {/* Visa/MasterCard Inputs */}
            {paymentMethod === 'Visa/MasterCard' && (
              <>
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-[#1f242d] font-normal">Name On Card :</label>
                  <input
                    type="text"
                    placeholder="Mr. Jacob Aiden"
                    className="w-full border px-4 py-2 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-[#1f242d] font-normal">Credit Card Number :</label>
                  <input
                    type="number"
                    placeholder="1111 2222 3333 4444"
                    className="w-full border px-4 py-2 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-[#1f242d] font-normal">Exp. Month :</label>
                  <input
                    type="text"
                    placeholder="August"
                    className="w-full border px-4 py-2 rounded-md"
                  />
                </div>
                <div className="flex gap-4">
                  <div className="w-1/2">
                    <label className="block text-sm mb-1 text-[#1f242d] font-normal">Exp. Year :</label>
                    <input
                      type="number"
                      placeholder="2025"
                      className="w-full border px-4 py-2 rounded-md"
                    />
                  </div>
                  <div className="w-1/2">
                    <label className="block text-sm mb-1 text-[#1f242d] font-normal">CVV :</label>
                    <input
                      type="number"
                      placeholder="123"
                      className="w-full border px-4 py-2 rounded-md"
                    />
                  </div>
                </div>
              </>
            )}

            {/* JazzCash / EasyPaisa Inputs */}
            {(paymentMethod === 'JazzCash' || paymentMethod === 'EasyPaisa') && (
              <>
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-[#1f242d] font-normal">Mobile Number :</label>
                  <input
                    type="tel"
                    placeholder="03xx-xxxxxxx"
                    value={walletNumber}
                    onChange={(e) => setWalletNumber(e.target.value)}
                    className="w-full border px-4 py-2 rounded-md"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm mb-1 text-[#1f242d] font-normal">Transaction ID :</label>
                  <input
                    type="text"
                    placeholder="Enter transaction/reference ID"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    className="w-full border px-4 py-2 rounded-md"
                  />
                </div>
              </>
            )}
          </div>
        </div>

        {/* Subscription Fee */}
        <div className="mt-6 text-center text-lg font-semibold text-gray-800">
          Subscription Fee: <span className="text-[#83414d]">PKR {fee}</span>
        </div>

        <button
          type="submit"
          className="w-full mt-4 bg-[#69363f] hover:bg-[#83414d] text-white font-semibold py-3 rounded-md transition"
        >
          Submit Payment
        </button>
      </form>
    </div>
  );
};

export default PaymentForm;
