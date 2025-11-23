import React, { useState } from "react";
import { auth } from "./firebase"; // Importa o Firebase Auth
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin) {
      try {
        // Realiza login com o Firebase Auth
        await signInWithEmailAndPassword(auth, email, password);
        alert("Login bem-sucedido!");
      } catch (error) {
        alert("Erro no login: " + error.message);
      }
    } else {
      try {
        // Cria um novo usuário com o Firebase Auth
        await createUserWithEmailAndPassword(auth, email, password);
        alert("Conta criada com sucesso!");
      } catch (error) {
        alert("Erro ao criar conta: " + error.message);
      }
    }
  };

  return (
    <div>
      <h1>{isLogin ? "Login" : "Criar Conta"}</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">{isLogin ? "Login" : "Criar Conta"}</button>
      </form>
      <button onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Criar conta" : "Já tem conta? Faça login"}
      </button>
    </div>
  );
};

export default AuthForm;
