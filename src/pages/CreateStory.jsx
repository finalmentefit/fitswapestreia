import React, { useState, useRef, useEffect } from "react";
import { X, Check, Camera, Image as ImageIcon, Type, Smile, AlertCircle, Video, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { supabase } from "@/supabaseClient"; // 
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const FILTERS = ["Normal", "Sépia", "Preto e Branco", "Vintage", "Brilho"];

export default function CreateStory() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  
  const [mediaUrl, setMediaUrl] = useState("");
  const [mediaType, setMediaType] = useState("photo");
  const [text, setText] = useState("");
  const [sticker, setSticker] = useState("");
  const [filter, setFilter] = useState("Normal");
  const [visibility, setVisibility] = useState("Todos");
  const [isUploading, setIsUploading] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  
  const cameraInputRef = useRef(null);
  const galleryInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const videoRecordRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const streamRef = useRef(null);

  const createStoryMutation = useMutation({
    mutationFn: async (storyData) => {
       Mudar entities.create() para supabase.from().insert()
      const { data, error } = await supabase
        .from('stories')
        .insert(storyData)
        .select()
      
      if (error) throw error
      return data[0]
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stories'] })
      navigate(createPageUrl("Home"))
    }
  })

  const handleFileUpload = async (files, type = 'photo') => {
    if (!files || files.length === 0) return

    setIsUploading(true)
    try {
       - Upload no Supabase Storage
      const file = files[0]
      const fileExt = file.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const bucket = type === 'video' ? 'story-videos' : 'story-photos'
      
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(fileName, file)

      if (error) throw error

      
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(fileName)

      setMediaUrl(publicUrl)
      setMediaType(type)
      setShowMediaOptions(false)
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Erro ao fazer upload. Tente novamente.")
    }
    setIsUploading(false)
  }

  const startVideoRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: 'environment' }, 
        audio: true 
      })
      
      streamRef.current = stream
      if (videoRecordRef.current) {
        videoRecordRef.current.srcObject = stream
      }

      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp8,opus'
      })
      
      mediaRecorderRef.current = mediaRecorder
      const chunks = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/webm' })
        const file = new File([blob], `video-${Date.now()}.webm`, { type: 'video/webm' })
        
        // Stop all tracks
        if (streamRef.current) {
          streamRef.current.getTracks().forEach(track => track.stop())
        }
        
        // Upload recorded video
        setIsUploading(true)
        try {
           - Upload do vídeo gravado
          const fileExt = 'webm'
          const fileName = `${Math.random()}.${fileExt}`
          
          const { data, error } = await supabase.storage
            .from('story-videos')
            .upload(fileName, file)

          if (error) throw error

          const { data: { publicUrl } } = supabase.storage
            .from('story-videos')
            .getPublicUrl(fileName)

          setMediaUrl(publicUrl)
          setMediaType('video')
          setShowMediaOptions(false)
          setIsRecording(false)
        } catch (error) {
          console.error("Error uploading video:", error)
          alert("Erro ao fazer upload do vídeo.")
        }
        setIsUploading(false)
      }

      mediaRecorder.start()
      setIsRecording(true)
      setShowMediaOptions(false)
    } catch (error) {
      console.error("Error accessing camera:", error)
      alert("Não foi possível acessar a câmera. Verifique as permissões.")
    }
  }

  const stopVideoRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop()
    }
  }

  const handlePublish = () => {
    if (!mediaUrl) {
      alert("Adicione uma foto ou vídeo!")
      return
    }

    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)

    createStoryMutation.mutate({
      photo_url: mediaUrl,
      video_url: mediaType === 'video' ? mediaUrl : null,
      media_type: mediaType,
      text,
      sticker,
      filter: mediaType === 'photo' ? filter : null,
      visibility,
      expires_at: expiresAt.toISOString()
    })
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop())
      }
    }
  }, [])
