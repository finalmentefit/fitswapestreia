import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { ArrowLeft, User, Bell, Shield, HelpCircle, LogOut } from "lucide-react";

export default function Settings() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState("profile");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const { data: { user: userData }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(userData);
    } catch (error) {
      console.error("Erro ao carregar usuário:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate(createPageUrl("Welcome"));
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao sair. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate(createPageUrl("Home"))}
              className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FF006E] rounded-full flex items-center justify-center"
            >
              <span className="text-white font-bold text-lg">F</span>
            </button>
            
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Voltar</span>
            </button>
            
            <h1 className="text-xl font-bold text-gray-900">Configurações</h1>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <nav className="bg-white rounded-2xl shadow-sm border p-4 space-y-2">
              <button
                onClick={() => setActiveSection("profile")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeSection === "profile" 
                    ? "bg-[#FF6B35] text-white" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <User className="w-5 h-5" />
                <span className="font-medium">Perfil</span>
              </button>

              <button
                onClick={() => setActiveSection("notifications")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeSection === "notifications" 
                    ? "bg-[#FF6B35] text-white" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Bell className="w-5 h-5" />
                <span className="font-medium">Notificações</span>
              </button>

              <button
                onClick={() => setActiveSection("privacy")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeSection === "privacy" 
                    ? "bg-[#FF6B35] text-white" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Shield className="w-5 h-5" />
                <span className="font-medium">Privacidade</span>
              </button>

              <button
                onClick={() => setActiveSection("help")}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors ${
                  activeSection === "help" 
                    ? "bg-[#FF6B35] text-white" 
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <HelpCircle className="w-5 h-5" />
                <span className="font-medium">Ajuda</span>
              </button>

              <div className="border-t pt-2 mt-2">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span className="font-medium">Sair</span>
                </button>
              </div>
            </nav>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              {activeSection === "profile" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações do Perfil</h2>
                  
                  <div className="space-y-6">
                    {/* Profile Photo */}
                    <div className="flex items-center gap-6">
                      <div className="w-20 h-20 bg-gradient-to-br from-[#FF6B35] to-[#FF006E] rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <Button variant="outline" className="mb-2">
                          Alterar Foto
                        </Button>
                        <p className="text-sm text-gray-500">JPG, GIF ou PNG. Máx. 5MB.</p>
                      </div>
                    </div>

                    {/* User Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Nome de Usuário
                        </label>
                        <input
                          type="text"
                          defaultValue={user?.email?.split('@')[0]}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          defaultValue={user?.email}
                          disabled
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bio
                        </label>
                        <textarea
                          rows={3}
                          placeholder="Conte um pouco sobre você..."
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Tipo de Conta
                        </label>
                        <div className="px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-700">
                          {user?.user_metadata?.account_type || "Usuário"}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button className="bg-[#FF6B35] hover:bg-[#FF5A25]">
                        Salvar Alterações
                      </Button>
                      <Button variant="outline">
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "notifications" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Configurações de Notificação</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900">Notificações por Email</h3>
                        <p className="text-sm text-gray-600">Receba atualizações por email</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900">Notificações Push</h3>
                        <p className="text-sm text-gray-600">Receba notificações no navegador</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900">Novos Seguidores</h3>
                        <p className="text-sm text-gray-600">Seja notificado quando alguém te seguir</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "privacy" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Privacidade e Segurança</h2>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900">Perfil Público</h3>
                        <p className="text-sm text-gray-600">Qualquer pessoa pode ver seu perfil</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-xl">
                      <div>
                        <h3 className="font-medium text-gray-900">Conta Privada</h3>
                        <p className="text-sm text-gray-600">Aprovar seguidores manualmente</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FF6B35]"></div>
                      </label>
                    </div>

                    <div className="p-4 border rounded-xl">
                      <h3 className="font-medium text-gray-900 mb-4">Alterar Senha</h3>
                      <div className="space-y-4">
                        <input
                          type="password"
                          placeholder="Senha atual"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Nova senha"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        />
                        <input
                          type="password"
                          placeholder="Confirmar nova senha"
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[#FF6B35] focus:border-transparent"
                        />
                        <Button className="bg-[#FF6B35] hover:bg-[#FF5A25]">
                          Alterar Senha
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeSection === "help" && (
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">Ajuda e Suporte</h2>
                  <div className="space-y-6">
                    <div className="p-6 border rounded-xl">
                      <h3 className="font-medium text-gray-900 mb-2">Central de Ajuda</h3>
                      <p className="text-gray-600 mb-4">Encontre respostas para perguntas frequentes</p>
                      <Button variant="outline">Acessar Central de Ajuda</Button>
                    </div>

                    <div className="p-6 border rounded-xl">
                      <h3 className="font-medium text-gray-900 mb-2">Contato</h3>
                      <p className="text-gray-600 mb-2">Email de suporte:</p>
                      <a 
                        href="mailto:clebersimoessilva@gmail.com"
                        className="text-[#FF6B35] hover:underline font-medium"
                      >
                        clebersimoessilva@gmail.com
                      </a>
                    </div>

                    <div className="p-6 border rounded-xl">
                      <h3 className="font-medium text-gray-900 mb-2">Sobre o FitSwap</h3>
                      <p className="text-gray-600 mb-2">Versão: 1.0.0</p>
                      <p className="text-gray-600">
                        FitSwap - Conectando entusiastas do fitness em uma comunidade vibrante.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
