import React, { useState } from "react";
import { db } from "./firebase"; // Importando o Firestore
import { collection, addDoc } from "firebase/firestore"; // Funções para salvar dados no Firestore

const PostForm = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Adiciona um novo post na coleção "posts" no Firestore
      const docRef = await addDoc(collection(db, "posts"), {
        title: title,
        content: content,
        createdAt: new Date(), // Adiciona a data de criação
      });
      alert("Post salvo com sucesso!");
    } catch (e) {
      alert("Erro ao salvar o post: " + e.message);
    }
  };

  return (
    <div>
      <h1>Crie um Post</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Conteúdo"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <button type="submit">Salvar Post</button>
      </form>
    </div>
  );
};

export default PostForm;
