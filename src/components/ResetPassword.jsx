import { useState } from 'react';
import { resetPassword } from '../services/authService';

export default function ResetPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const handle = async (e) => {
    e.preventDefault();
    await resetPassword(email);
    setSent(true);
  };
  return (
    <form onSubmit={handle}>
      <input value={email} onChange={e => setEmail(e.target.value)} placeholder="email" />
      <button type="submit">Enviar link</button>
      {sent && <div>Link enviado</div>}
    </form>
  );
}