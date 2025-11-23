import React, { useState, useEffect, useRef } from "react";
import { supabase } from "@/supabaseClient"; 
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useMutation } from "@tanstack/react-query";

const LEVELS = ["Iniciante", "Intermediário", "Avançado"];
const CATEGORIES = ["Musculação", "Emagrecimento", "Hipertrofia", "Funcional", "Cardio", "Yoga"];

export default function CreatePlan() {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState("");
  const [priceMonthly, setPriceMonthly] = useState("");
  const [level, setLevel] = useState("");
  const [category, setCategory] = useState("");
  const [durationWeeks, setDurationWeeks] = useState("");
  const [workoutsPerWeek, setWorkoutsPerWeek] = useState("");
  const [includesNutrition, setIncludesNutrition] = useState(false);
  const [includesChat, setIncludesChat] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const coverInputRef = useRef(null);

  useEffect(() => {
    const getUser = async () => {
      try {
        
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)
        
        if (user?.user_metadata?.account_type !== 'instrutor') {
          navigate(createPageUrl("BecomeInstructor"))
        }
      } catch (error) {
        console.log("User not logged in")
      }
    }
    getUser()
  }, [navigate])

  const handleCoverUpload = async (file) => {
    setIsUploading(true)
    try {
      
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      
      const { data, error } = await supabase.storage
        .from('plan-covers')
        .upload(fileName, file)

      if (error) throw error

   
      const { data: { publicUrl } } = supabase.storage
        .from('plan-covers')
        .getPublicUrl(fileName)

      setCoverImage(publicUrl)
    } catch (error) {
      console.error("Error uploading cover:", error)
      alert("Erro ao fazer upload da capa")
    }
    setIsUploading(false)
  }

  const createPlanMutation = useMutation({
    mutationFn: async (planData) => {
      
      const { data, error } = await supabase
        .from('workout_plans')
        .insert(planData)
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      navigate(createPageUrl("InstructorDashboard"))
    }
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!title || !description || !priceMonthly || !level || !category) {
      alert("Preencha todos os campos obrigatórios!")
      return
    }

    createPlanMutation.mutate({
      instructor_email: currentUser?.email,
      title,
      description,
      cover_image: coverImage,
      price_monthly: parseFloat(priceMonthly),
      level,
      category,
      duration_weeks: parseInt(durationWeeks) || 0,
      workouts_per_week: parseInt(workoutsPerWeek) || 0,
      includes_nutrition: includesNutrition,
      includes_chat: includesChat,
      active: true,
      subscribers_count: 0
    })
  }
