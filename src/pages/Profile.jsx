import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Button } from "@/components/ui/button";
import { Settings, Edit3, User, Award, Calendar, BarChart3 } from "lucide-react";

export default function Profile() {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [profileUser, setProfileUser] = useState(null);
  const [workouts, setWorkouts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("workouts");

  useEffect(() => {
    loadUserData();
    loadWorkouts();
  }, [userId]);

  const loadUserData = async () => {
    try {
      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      setUser(currentUser);

      // Get profile user data
      if (userId) {
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", userId)
          .single();
        
        if (!profileError) {
          setProfileUser(profileData);
        }
      } else if (currentUser) {
        setProfileUser({ ...currentUser, username: currentUser.email?.split('@')[0] });
      }
    } catch (error) {
      console.error("Erro ao carregar dados do usuário:", error);
    }
  };

  const loadWorkouts = async () => {
    try {
      const { data, error } = await supabase
        .from("workouts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setWorkouts(data || []);
    } catch (error) {
      console.error("Erro ao carregar treinos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isOwnProfile = !userId || (user && userId === user.id);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#FF6B35] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate(createPageUrl("Home"))}
                className="w-10 h-10 bg-gradient-to-br from-[#FF6B35] to-[#FF006E] rounded-full flex items-center justify-center"
              >
                <span className="text-white font-bold text-lg">F</span>
              </button>
              <h1 className="text-xl font-bold text-gray-900">Perfil</h1>
            </div>

            {isOwnProfile && (
              <Button
                onClick={() => navigate(createPageUrl("Settings"))}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Settings className="w-4 h-4" />
                Configurações
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-24 h-24 bg-gradient-to-br from-[#FF6B35] to-[#FF006E] rounded-full flex items-center justify-center">
                <User className="w-10 h-10 text-white" />
              </div>
              {isOwnProfile && (
                <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white border rounded-full flex items-center justify-center shadow-sm hover:bg-gray-50">
                  <Edit3 className="w-4 h-4 text-gray-600" />
                </button>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900 mb-1">
                    {profileUser?.username || "Usuário"}
                  </h1>
                  <p className="text-gray-600">{profileUser?.email}</p>
                </div>
                
                {!isOwnProfile && (
                  <Button className="bg-[#FF6B35] hover:bg-[#FF5A25]">
                    Seguir
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="flex items-center gap-6">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{workouts.length}</div>
                  <div className="text-sm text-gray-600">Treinos</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Seguidores</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">0</div>
                  <div className="text-sm text-gray-600">Seguindo</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="border-b">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("workouts")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "workouts"
                  ? "border-[#FF6B35] text-[#FF6B35]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Treinos
              </div>
            </button>
            <button
              onClick={() => setActiveTab("achievements")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "achievements"
                  ? "border-[#FF6B35] text-[#FF6B35]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4" />
                Conquistas
              </div>
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "stats"
                  ? "border-[#FF6B35] text-[#FF6B35]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Estatísticas
              </div>
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        <div className="py-8">
          {activeTab === "workouts" && (
            <div className="grid gap-4">
              {workouts.length > 0 ? (
                workouts.map((workout) => (
                  <div key={workout.id} className="bg-white rounded-2xl shadow-sm border p-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold text-gray-900">{workout.name}</h3>
                      <span className="text-sm text-gray-500">
                        {new Date(workout.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{workout.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span>⏱️ {workout.duration}min</span>
                      <span>🔥 {workout.calories} cal</span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">💪</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    Nenhum treino registrado
                  </h3>
                  <p className="text-gray-600 mb-4">
                    {isOwnProfile 
                      ? "Comece a registrar seus treinos para acompanhar seu progresso!"
                      : "Este usuário ainda não registrou treinos."
                    }
                  </p>
                  {isOwnProfile && (
                    <Button
                      onClick={() => navigate(createPageUrl("LogWorkout"))}
                      className="bg-[#FF6B35] hover:bg-[#FF5A25]"
                    >
                      Registrar Primeiro Treino
                    </Button>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === "achievements" && (
            <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Nenhuma conquista ainda
              </h3>
              <p className="text-gray-600">
                Complete treinos e desafios para desbloquear conquistas!
              </p>
            </div>
          )}

          {activeTab === "stats" && (
            <div className="bg-white rounded-2xl shadow-sm border p-8 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Estatísticas em breve
              </h3>
              <p className="text-gray-600">
                Em desenvolvimento - acompanhe seu progresso detalhado aqui.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
