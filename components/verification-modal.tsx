"use client";

import { useState, useRef, useEffect } from "react";
import { Task } from "@/hooks/use-game-state";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { X, Camera, Upload, Loader2, Zap } from "lucide-react";

interface VerificationModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onVerifySuccess: (taskId: string, awardedXp: number) => void;
}

type Step = "classifying" | "capture_physical" | "upload_written" | "verifying" | "result";

export function VerificationModal({ task, isOpen, onClose, onVerifySuccess }: VerificationModalProps) {
  const [step, setStep] = useState<Step>("classifying");
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [feedback, setFeedback] = useState("");
  const [awardedXp, setAwardedXp] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isOpen && task) {
      setStep("classifying");
      classifyTask(task);
    } else {
      stopCamera();
      setImagePreview(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, task]);

  const classifyTask = async (task: Task) => {
    try {
      const res = await fetch("/api/classify-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: task.title, description: task.description })
      });
      const data = await res.json();
      
      if (data.type === "physical") {
        setStep("capture_physical");
        startCamera();
      } else if (data.type === "written") {
        setStep("upload_written");
      } else {
        // none
        onVerifySuccess(task.id, task.xpReward);
        toast.info("System Override", { description: "Verification bypassed for digital task." });
        onClose();
      }
    } catch (err) {
      // Fallback
      onVerifySuccess(task.id, task.xpReward);
      onClose();
    }
  };

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      toast.error("Camera Error", { description: "System could not access camera." });
      setStep("upload_written"); // fallback to file upload
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext("2d");
      canvasRef.current.width = videoRef.current.videoWidth;
      canvasRef.current.height = videoRef.current.videoHeight;
      context?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvasRef.current.toDataURL("image/jpeg");
      stopCamera();
      setImagePreview(dataUrl);
      verifyProof(dataUrl, "image/jpeg");
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setImagePreview(base64String);
        verifyProof(base64String, file.type);
      };
      reader.readAsDataURL(file);
    }
  };

  const verifyProof = async (dataUrl: string, mimeType: string) => {
    setStep("verifying");
    const base64Data = dataUrl.split(',')[1];
    
    try {
      const res = await fetch("/api/verify-task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: task?.title,
          description: task?.description,
          imageBase64: base64Data,
          mimeType
        })
      });
      
      const data = await res.json();
      const mult = data.xpMultiplier ?? 1;
      const finalXp = Math.max(0, Math.floor((task?.xpReward || 0) * mult));
      
      setAwardedXp(finalXp);
      setFeedback(data.feedback);
      setStep("result");
    } catch (err) {
      toast.error("Verification Error", { description: "System analysis failed." });
      onVerifySuccess(task!.id, task!.xpReward);
      onClose();
    }
  };

  const finish = () => {
    if (task) onVerifySuccess(task.id, awardedXp);
    onClose();
  };

  if (!isOpen || !task) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Animated backdrop */}
      <div className="absolute inset-0 bg-black/90 backdrop-blur-md" onClick={() => { stopCamera(); onClose(); }}>
        {/* Scan line effect */}
        <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(139,92,246,0.03)_50%,transparent_100%)] bg-[length:100%_4px] animate-scan pointer-events-none" />
      </div>
      
      <div className="relative group max-w-lg w-full animate-fade-in-up">
        {/* Animated border glow */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-purple-500/30 via-cyan-500/30 to-purple-500/30 opacity-75 blur-lg group-hover:opacity-100 transition-all duration-500" />
        
        <div className="relative glass rounded-2xl border border-purple-500/30 overflow-hidden shadow-2xl shadow-purple-900/30">
          {/* Inner gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-cyan-500/5 pointer-events-none" />
          
          {/* Header */}
          <div className="relative glass border-b border-purple-500/20 px-5 py-4 flex justify-between items-center">
            <h3 className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-purple-400 flex items-center gap-3 text-lg">
              <div className="relative">
                <div className="absolute inset-0 bg-purple-500/50 blur-md rounded-full" />
                <Zap className="relative text-purple-400" size={20} />
              </div>
              System Verification
            </h3>
            <button 
              onClick={() => { stopCamera(); onClose(); }} 
              className="relative p-2 rounded-lg text-gray-400 hover:text-white hover:bg-gray-800/50 transition-all duration-300"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="relative p-6">
            {/* Task Info Badge */}
            <div className="flex items-center justify-center gap-2 mb-6">
              <span className="text-sm text-gray-400">Quest:</span>
              <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 rounded-full text-purple-300 font-medium text-sm">
                {task.title}
              </span>
            </div>

            {step === "classifying" && (
              <div className="flex flex-col items-center justify-center py-12">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-purple-500/30 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="relative animate-spin text-purple-400" size={48} />
                </div>
                <p className="text-purple-300 font-semibold animate-pulse text-lg">
                  Analyzing Quest Parameters...
                </p>
                <p className="text-gray-500 text-sm mt-2">Initializing system protocols</p>
              </div>
            )}

            {step === "capture_physical" && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse" />
                  <p className="text-center text-gray-300 font-medium">
                    Physical Quest Detected
                  </p>
                </div>
                <p className="text-gray-500 text-sm mb-4 text-center">
                  Show your proof to the camera
                </p>
                <div className="relative rounded-xl overflow-hidden border-2 border-purple-500/30 w-full bg-gray-900 aspect-video mb-5 group/video">
                  <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  <div className="absolute inset-0 border-4 border-purple-500/10 rounded-xl pointer-events-none" />
                  {/* Corner markers */}
                  <div className="absolute top-2 left-2 w-6 h-6 border-l-2 border-t-2 border-purple-500/50" />
                  <div className="absolute top-2 right-2 w-6 h-6 border-r-2 border-t-2 border-purple-500/50" />
                  <div className="absolute bottom-2 left-2 w-6 h-6 border-l-2 border-b-2 border-purple-500/50" />
                  <div className="absolute bottom-2 right-2 w-6 h-6 border-r-2 border-b-2 border-purple-500/50" />
                </div>
                <canvas ref={canvasRef} className="hidden" />
                <Button 
                  onClick={capturePhoto} 
                  className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white flex gap-2 font-bold py-6 shadow-lg shadow-purple-500/25 transition-all duration-300"
                >
                  <Camera size={20} />
                  <span>Capture Proof</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/video:translate-x-full transition-transform duration-700" />
                </Button>
              </div>
            )}

            {step === "upload_written" && (
              <div className="flex flex-col items-center">
                <div className="flex items-center gap-2 mb-4">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full animate-pulse" />
                  <p className="text-center text-gray-300 font-medium">
                    Written/Digital Quest Detected
                  </p>
                </div>
                <p className="text-gray-500 text-sm mb-4 text-center">
                  Upload proof of completion
                </p>
                <label className="w-full group relative cursor-pointer">
                  <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-500/20 to-cyan-500/20 opacity-0 group-hover:opacity-100 blur transition-all duration-500" />
                  <div className="relative flex flex-col items-center justify-center border-2 border-dashed border-gray-600 group-hover:border-purple-500/50 rounded-xl py-14 transition-all duration-300 bg-gray-900/30">
                    <Upload className="text-gray-400 group-hover:text-purple-400 mb-3 transition-colors duration-300" size={36} />
                    <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors duration-300">Click to Browse</span>
                    <span className="text-xs text-gray-500 mt-1.5">PNG, JPG up to 10MB</span>
                  </div>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>
              </div>
            )}

            {step === "verifying" && (
              <div className="flex flex-col items-center justify-center py-10">
                {imagePreview && (
                  <div className="relative w-28 h-28 rounded-xl overflow-hidden border border-purple-500/30 mb-6 group">
                    <img src={imagePreview} alt="Proof" className="w-full h-full object-cover opacity-70" />
                    <div className="absolute inset-0 bg-purple-500/10 animate-pulse" />
                  </div>
                )}
                <div className="relative mb-4">
                  <div className="absolute inset-0 bg-cyan-500/30 rounded-full blur-xl animate-pulse" />
                  <Loader2 className="relative animate-spin text-cyan-400" size={40} />
                </div>
                <p className="text-cyan-300 font-semibold animate-pulse text-center text-lg">
                  System is evaluating your performance...
                </p>
                <p className="text-gray-500 text-sm mt-2 text-center">Processing verification data</p>
              </div>
            )}

            {step === "result" && (
              <div className="flex flex-col items-center text-center py-6">
                <div className="mb-6">
                  {/* Animated result badge */}
                  <div className="relative inline-block mb-5">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/30 to-cyan-500/30 rounded-full blur-lg animate-pulse" />
                    <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-full glass border border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                      <span className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400">
                        {(awardedXp / task.xpReward).toFixed(1)}x
                      </span>
                    </div>
                  </div>
                  
                  <h4 className="text-xl font-bold text-white mb-3">Evaluation Complete</h4>
                  
                  <p className="text-gray-400 italic mb-5 text-sm leading-relaxed">
                    "{feedback}"
                  </p>
                  
                  {/* XP Award Card */}
                  <div className="relative group/xp inline-block">
                    <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-amber-500/20 to-orange-500/20 opacity-75 blur transition-all duration-500" />
                    <div className="relative glass rounded-xl p-4 border border-amber-500/30">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">⭐</span>
                        <div className="text-left">
                          <span className="text-gray-400 text-xs block">Awarded XP</span>
                          <span className="text-amber-400 font-bold text-2xl">{awardedXp}</span>
                          <span className="text-gray-500 text-xs ml-2">(Base: {task.xpReward})</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <Button 
                  onClick={finish} 
                  className="w-full relative overflow-hidden bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600 bg-size-200 hover:bg-pos-100 text-white font-bold py-5 text-lg tracking-wider shadow-lg shadow-purple-900/50 transition-all duration-500 group/btn"
                >
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <span>⚔️</span> CLAIM REWARD
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
