import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "sonner";

export default function ChallengeProof(){
  const [media, setMedia] = useState(null);
  const [comment, setComment] = useState('');
  const [uploading, setUploading] = useState(false);
  const [searchParams] = useSearchParams();
  const challengeId = searchParams.get('challengeId');
  const navigate = useNavigate();

  const handleFile = (e) => setMedia(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!media) return toast.error("Envie uma foto ou vídeo");
    setUploading(true);
    try {
      const path = `${Date.now()}_${media.name}`;
      const up = await supabase.storage.from('challenges').upload(path, media);
      if (up.error) throw up.error;
      const urlRes = await supabase.storage.from('challenges').getPublicUrl(path);
      const payload = {
        title: `Prova do desafio ${challengeId}`,
        content: comment,
        media: [{ url: urlRes.data.publicURL, name: media.name }],
        isChallengeEvidence: true,
        challenge_id: challengeId || null
      };
      const res = await supabase.from('posts').insert([payload]);
      if (res.error) throw res.error;
      toast.success("Prova enviada e publicada no feed");
      navigate("/home");
    } catch (err) {
      toast.error(err.message || String(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h1 className="text-xl font-bold mb-3">Enviar Prova do Desafio</h1>
      <form onSubmit={handleSubmit}>
        <input type="file" accept="image/*,video/*" onChange={handleFile} className="mb-2" />
        <textarea value={comment} onChange={e=>setComment(e.target.value)} className="w-full p-2 border rounded mb-2" placeholder="Comentário (opcional)"></textarea>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">{uploading ? "Enviando..." : "Enviar prova"}</button>
      </form>
    </div>
  );
}
