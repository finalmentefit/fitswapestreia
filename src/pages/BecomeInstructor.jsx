import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient"; // ✅ Mudar para Supabase
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Building2, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";

const SEGMENTS = [
  "Academia",
  "Loja de Suplementos",
  "Roupas Esportivas",
  "Personal Trainer",
  "Nutricionista",
  "Outro"
];

export default function BusinessSetup() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [businessName, setBusinessName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [segment, setSegment] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    const getUser = async () => {
      try {
        // ✅ MUDAR PARA SUPABASE
        const { data: { user } } = await supabase.auth.getUser();
        setCurrentUser(user);
      } catch (error) {
        console.log("User not logged in");
      }
    };
    getUser();
  }, []);

  const createBusinessMutation = useMutation({
    mutationFn: async (data) => {
      // Calculate free period end date (3 months from now)
      const freePeriodEnds = new Date();
      freePeriodEnds.setMonth(freePeriodEnds.getMonth() + 3);

      // ✅ MUDAR PARA SUPABASE - Inserir na tabela business_profiles
      const { error: businessError } = await supabase
        .from('business_profiles')
        .insert({
          ...data,
          free_period_ends: freePeriodEnds.toISOString().split('T')[0],
          submitted_at: new Date().toISOString(),
          verification_status: 'pending',
          verified: false
        });

      if (businessError) throw businessError;

      // ✅ MUDAR PARA SUPABASE - Atualizar usuário
      const { error: userError } = await supabase.auth.updateUser({
        data: {
          account_type: 'comercial'
        }
      });

      if (userError) throw userError;
    },
    onSuccess: () => {
      alert("Cadastro enviado! Nossa equipe irá verificar suas informações em até 48 horas. Você receberá um email com o resultado.");
      navigate(createPageUrl("Profile"));
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!businessName || !cnpj || !segment || !phone || !address || !city) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    createBusinessMutation.mutate({
      user_email: currentUser?.email,
      business_name: businessName,
      cnpj,
      segment,
      phone,
      address,
      city,
      state,
      website
    });
  }
