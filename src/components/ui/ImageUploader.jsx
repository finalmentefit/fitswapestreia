import React, { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function ImageUploader({ onUpload }) {
  const [loading, setLoading] = useState(false);
  const handle = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);
    try {
      const path = `${Date.now()}_${file.name}`;
      const up = await supabase.storage.from('posts').upload(path, file);
      if (up.error) throw up.error;
      const url = await supabase.storage.from('posts').getPublicUrl(path);
      onUpload && onUpload({ url: url.data.publicURL, name: file.name });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      <input type="file" accept="image/*,video/*" onChange={handle} />
      {loading && <div>Enviando...</div>}
    </div>
  );
}
