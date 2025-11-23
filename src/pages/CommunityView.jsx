import React, { useState, useEffect } from "react";
import { supabase } from "@/supabaseClient"; 
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { ArrowLeft, Users, Settings, Lock, Globe, UserPlus, Shield, Ban, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PostCard from "../components/PostCard";

export default function CommunityView() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const communityId = searchParams.get('id');
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState("feed");

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

  const { data: community, isLoading } = useQuery({
    queryKey: ['community', communityId],
    queryFn: async () => {
     
      const { data: communities, error } = await supabase
        .from('communities')
        .select('*')
      
      if (error) throw error
      return communities.find(c => c.id === communityId)
    },
    enabled: !!communityId
  })

  const { data: membership } = useQuery({
    queryKey: ['communityMembership', communityId, currentUser?.email],
    queryFn: async () => {
      if (!currentUser?.email || !communityId) return null
      
      const { data: memberships, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
        .eq('user_email', currentUser.email)
      
      if (error) throw error
      return memberships[0] || null
    },
    enabled: !!currentUser?.email && !!communityId
  })

  const { data: members = [] } = useQuery({
    queryKey: ['communityMembers', communityId],
    queryFn: async () => {
      if (!communityId) return []
      
      const { data, error } = await supabase
        .from('community_members')
        .select('*')
        .eq('community_id', communityId)
        .eq('status', 'approved')
      
      if (error) throw error
      return data || []
    },
    enabled: !!communityId,
    initialData: []
  })

  const { data: posts = [] } = useQuery({
    queryKey: ['communityPosts', communityId],
    queryFn: async () => {
      if (!communityId) return []
      
      const { data, error } = await supabase
        .from('community_posts')
        .select('*')
        .eq('community_id', communityId)
        .order('created_date', { ascending: false })
      
      if (error) throw error
      return data || []
    },
    enabled: !!communityId,
    initialData: []
  })

  const leaveMutation = useMutation({
    mutationFn: async () => {
      if (!membership) return
      
      
      const { error: deleteError } = await supabase
        .from('community_members')
        .delete()
        .eq('id', membership.id)
      
      if (deleteError) throw deleteError

      if (community) {
        
        const { error: updateError } = await supabase
          .from('communities')
          .update({
            members_count: Math.max(0, (community.members_count || 0) - 1)
          })
          .eq('id', community.id)
        
        if (updateError) throw updateError
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['communityMembership'])
      queryClient.invalidateQueries(['community'])
      navigate(createPageUrl("Communities"))
    }
  })
