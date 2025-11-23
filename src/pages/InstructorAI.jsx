
import { useState } from 'react';

export default function InstructorAI() {
  const [goal,setGoal]=useState('');
  const [plan,setPlan]=useState('');

  async function generate(){
    const res = await fetch('/api/instructor/plan',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({goal})
    });
    const j=await res.json();
    setPlan(j.plan||'');
  }

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold">Gerador IA de Treinos</h1>
      <textarea className="border p-2 w-full mt-4" value={goal} onChange={e=>setGoal(e.target.value)} placeholder="Objetivo do aluno"></textarea>
      <button onClick={generate} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Gerar Plano</button>
      {plan && <pre className="mt-4 p-2 bg-gray-100">{plan}</pre>}
    </div>
  );
}
