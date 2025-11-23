import React, { useState } from "react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { User, Award, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AccountTypeSelector() {
  const navigate = useNavigate();
  const [selectedType, setSelectedType] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleConfirm = async () => {
    if (!selectedType) {
      alert("Selecione um tipo de conta!");
      return;
    }

    setIsUpdating(true);
    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          account_type: selectedType,
          onboarding_completed: true
        }
      });

      if (error) throw error;

      navigate(createPageUrl("Home"));
    } catch (error) {
      console.error("Error updating account type:", error);
      alert("Erro ao salvar. Tente novamente.");
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FF6B35] to-[#FF006E] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center">
            <span className="text-4xl">💪</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Bem-vindo ao FitSwap!
          </h1>
          <p className="text-white/90">
            Escolha o tipo de conta para começar
          </p>
        </div>

        <div className="space-y-4 mb-8">
          {/* User Card */}
          <button
            onClick={() => setSelectedType("user")}
            className={`w-full p-6 rounded-2xl border-4 transition-all text-left ${
              selectedType === "user"
                ? "bg-white border-white shadow-2xl scale-105"
                : "bg-white/10 border-white/20 hover:bg-white/20"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                selectedType === "user" ? "bg-gradient-to-br from-[#FF6B35] to-[#FF006E]" : "bg-white/20"
              }`}>
                <User className="w-7 h-7 text-white" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className={`text-xl font-bold ${
                    selectedType === "user" ? "text-gray-900" : "text-white"
                  }`}>
                    Usuário Comum
                  </h3>
                  {selectedType === "user" && (
                    <Check className="w-6 h-6 text-[#FF6B35]" />
                  )}
                </div>
                <p className={`text-sm ${
                  selectedType === "user" ? "text-gray-600" : "text-white/80"
                }`}>
                  Para quem quer treinar, participar de desafios e seguir instrutores
                </p>
                <div className="mt-3 space-y-1">
                  <div className={`text-xs flex items-center gap-2 ${
                    selectedType === "user" ? "text-gray-700" : "text-white/70"
                  }`}>
                    <span className="text-base">✓</span>
                    <span>Publicar treinos</span>
                  </div>
                  <div className={`text-xs flex items-center gap-2 ${
                    selectedType === "user" ? "text-gray-700" : "text-white/70"
                  }`}>
                    <span className="text-base">✓</span>
                    <span>Participar de desafios</span>
                  </div>
                  <div className={`text-xs flex items-center gap-2 ${
                    selectedType === "user" ? "text-gray-700" : "text-white/70"
                  }`}>
                    <span className="text-base">✓</span>
                    <span>Seguir instrutores</span>
                  </div>
                </div>
              </div>
            </div>
          </button>

          {/* Instructor Card */}
          <button
            onClick={() => setSelectedType("instructor")}
            className={`w-full p-6 rounded-2xl border-4 transition-all text-left ${
              selectedType === "instructor"
                ? "bg-white border-white shadow-2xl scale-105"
                : "bg-white/10 border-white/20 hover:bg-white/20"
            }`}
          >
            <div className="flex items-start gap-4">
              <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                selectedType === "instructor" ? "bg-gradient-to-br from-[#FF6B35] to-[#FF006E]" : "bg-white/20"
              }`}>
                <Award className="w-7 h-7 text
