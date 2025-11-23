
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function Medals() {
  const [medals, setMedals] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(()=>{
    supabase.auth.getUser().then(({data})=>{
      setUser(data.user);
      if (data.user) loadMedals(data.user);
    });
  },[]);

  async function loadMedals(u){
    const res = await supabase.from('medals').select();
    if (res.data) {
      setMedals(res.data.filter(m=>m.uid===u.uid));
    }
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Suas Medalhas</h1>
      <div className="grid grid-cols-2 gap-4">
        {medals.map(m=>(
          <div key={m.id} className="p-4 border rounded">
            <p>Desafio: {m.challengeId||'N/A'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
