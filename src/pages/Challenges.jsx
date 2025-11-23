import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient"; // 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Trophy, Plus, Users, Calendar, Target, Camera, Award, MoreVertical, Trash2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function Challenges() {
  const queryClient = useQueryClient();
  const [currentUser, setCurrentUser] = useState(null);
  const [challengeToDelete, setChallengeToDelete] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      try {
       
        const { data: { user } } = await supabase.auth.getUser()
        setCurrentUser(user)
      } catch (error) {
        console.log("User not logged in")
      }
    }
    getUser()
  }, [])

  const { data: challenges = [] } = useQuery({
    queryKey: ['challenges'],
    queryFn: async () => {
      
      const { data, error } = await supabase
        .from('challenges')
        .select('*')
        .eq('is_public', true)
        .order('created_date', { ascending: false })
      
      if (error) throw error
      return data || []
    },
    initialData: []
  })

  const { data: myParticipations = [] } = useQuery({
    queryKey: ['myParticipations', currentUser?.email],
    queryFn: async () => {
      if (!currentUser?.email) return []
      
      const { data, error } = await supabase
        .from('challenge_participants')
        .select('*')
        .eq('user_email', currentUser.email)
      
      if (error) throw error
      return data || []
    },
    enabled: !!currentUser?.email,
    initialData: []
  })

  const { data: challengeAchievements = [] } = useQuery({
    queryKey: ['challengeAchievements', currentUser?.email],
    queryFn: async () => {
      if (!currentUser?.email) return []
      
      const { data: allAchievements, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_email', currentUser.email)
        .order('unlocked_at', { ascending: false })
      
      if (error) throw error
      return (allAchievements || []).filter(a => a.description?.includes('Completou:'))
    },
    enabled: !!currentUser?.email,
    initialData: []
  })

  const joinChallengeMutation = useMutation({
    mutationFn: async (challengeId) => {
      // ✅ LINHA 84 - Mudar entities.create() para supabase.from().insert()
      const { error: participantError } = await supabase
        .from('challenge_participants')
        .insert({
          challenge_id: challengeId,
          user_email: currentUser.email,
          current_progress: 0
        })
      
      if (participantError) throw participantError

      const challenge = challenges.find(c => c.id === challengeId)
      if (challenge) {
        
        const { error: updateError } = await supabase
          .from('challenges')
          .update({
            participants_count: (challenge.participants_count || 0) + 1
          })
          .eq('id', challengeId)
        
        if (updateError) throw updateError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myParticipations'])
      queryClient.invalidateQueries(['challenges'])
    }
  })

  const deleteChallengeMutation = useMutation({
    mutationFn: async (challengeId) => {
      
      // Delete all participants first
      const { data: participants } = await supabase
        .from('challenge_participants')
        .select('*')
        .eq('challenge_id', challengeId)
      
      if (participants && participants.length > 0) {
        await supabase
          .from('challenge_participants')
          .delete()
          .in('id', participants.map(p => p.id))
      }
      
      // Delete all proof submissions
      const { data: proofs } = await supabase
        .from('challenge_proof_submissions')
        .select('*')
        .eq('challenge_id', challengeId)
      
      if (proofs && proofs.length > 0) {
        await supabase
          .from('challenge_proof_submissions')
          .delete()
          .in('id', proofs.map(p => p.id))
      }
      
      // Finally delete the challenge
      const { error } = await supabase
        .from('challenges')
        .delete()
        .eq('id', challengeId)
      
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['challenges'])
      queryClient.invalidateQueries(['myParticipations'])
      setChallengeToDelete(null)
    }
  })
