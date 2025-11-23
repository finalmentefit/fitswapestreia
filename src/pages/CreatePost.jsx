import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const [isChallengeEvidence, setIsChallengeEvidence] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files || []));
  };

  const addLocation = () => {
    if (!navigator.geolocation) return toast.error("Geolocalização não suportada");
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      () => toast.error("Permissão de geolocalização negada")
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (title.trim().length < 3) return toast.error("Título muito curto");
    setLoading(true);
    try {
      const media = [];
      for (const file of files) {
        const path = `${Date.now()}_${file.name}`;
        const up = await supabase.storage.from('posts').upload(path, file);
        if (up.error) throw up.error;
        const urlRes = await supabase.storage.from('posts').getPublicUrl(path);
        media.push({ url: urlRes.data.publicURL, name: file.name });
      }
      const payload = {
        title,
        content,
        media,
        isChallengeEvidence,
        location
      };
      const res = await supabase.from('posts').insert([payload]);
      if (res.error) throw res.error;
      toast.success("Post criado");
      navigate("/home");
    } catch (err) {
      toast.error(err.message || String(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h1 className="text-xl font-bold mb-4">Criar Post</h1>
      <form onSubmit={handleSubmit}>
        <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Título" className="w-full p-2 border rounded mb-2" />
        <textarea value={content} onChange={e=>setContent(e.target.value)} placeholder="Conteúdo" rows={6} className="w-full p-2 border rounded mb-2" />
        <input type="file" multiple accept="image/*,video/*" onChange={handleFiles} className="mb-2" />
        <div className="flex items-center gap-4 mb-2">
          <label className="flex items-center gap-2"><input type="checkbox" checked={isChallengeEvidence} onChange={e=>setIsChallengeEvidence(e.target.checked)} /> Prova de desafio</label>
          <button type="button" onClick={addLocation} className="px-3 py-1 border rounded">Adicionar localização</button>
          {location && <span className="text-sm text-gray-600">Local: {location.lat.toFixed(4)},{location.lng.toFixed(4)}</span>}
        </div>
        <div className="flex justify-end">
          <button type="submit" disabled={loading} className="px-4 py-2 bg-green-600 text-white rounded">{loading ? "Publicando..." : "Publicar"}</button>
        </div>
      </form>
    </div>
  );
}
