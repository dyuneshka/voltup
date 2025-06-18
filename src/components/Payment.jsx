import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { payInvoice } from '../redux/slices/paymentSlice';
import '../styles/payment.scss';

const Payment = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [amount, setAmount] = useState(0);

  const handlePay = () => {
    if (amount > 0 && user) {
      dispatch(payInvoice({ userId: user.id, amount, date: new Date().toISOString(), status: 'Paid' }));
      alert(`Оплата на сумму ${amount} руб. успешно выполнена!`);
    }
  };

  if (!user) return null;

  return (
    <div className="payment">
      <h2>Онлайн-оплата</h2>
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="Сумма (руб.)"
      />
      <button onClick={handlePay}>Оплатить</button>
    </div>
  );
};

export default Payment;