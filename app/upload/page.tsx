'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, ArrowLeft, Image as ImageIcon, Zap, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function UploadPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    if (!savedData) {
      router.push('/');
      return;
    }
    setUserData(JSON.parse(savedData));
  }, [router]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.setAttribute('capture', 'environment');
      fileInputRef.current.click();
    }
  };

  const handleUploadClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.removeAttribute('capture');
      fileInputRef.current.click();
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    
    // Simulate API call with delay
    setTimeout(() => {
      // Store the image for results page
      localStorage.setItem('analyzedImage', selectedImage);
      router.push('/result');
    }, 2000);
  };

  const resetImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (!userData) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-32 right-10 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full blur-2xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-40 left-8 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full blur-3xl opacity-25 animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{userData.dailyCalories} cal</div>
                <div className="text-xs text-gray-500">daily target</div>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Food Analysis
                </h1>
                <p className="text-gray-600 font-medium mt-1">Capture or upload your meal</p>
              </div>
            </div>
          </div>

          {!selectedImage ? (
            /* Upload Interface */
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center space-y-8">
                {/* Icon Display */}
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto">
                    <Camera className="h-12 w-12 text-gray-400" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <Sparkles className="h-4 w-4 text-white" />
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-xl font-semibold text-gray-900">Ready to Analyze</h3>
                  <p className="text-gray-600 leading-relaxed">
                    Our AI will identify foods and calculate<br />nutritional information instantly
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-4">
                  <Button 
                    onClick={handleCameraCapture}
                    className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    <Camera className="mr-2 h-5 w-5" />
                    Take Photo
                  </Button>
                  
                  <Button 
                    onClick={handleUploadClick}
                    variant="outline"
                    className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-semibold rounded-2xl transition-all duration-200"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Choose from Gallery
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {/* Tips */}
                <div className="bg-blue-50 rounded-2xl p-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    </div>
                    <div className="text-left">
                      <p className="text-sm font-medium text-blue-900 mb-1">Pro Tips</p>
                      <p className="text-xs text-blue-700 leading-relaxed">
                        • Ensure good lighting<br/>
                        • Keep food clearly visible<br/>
                        • Include the entire meal
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* Image Preview & Analysis */
            <div className="space-y-6">
              {/* Image Preview */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-gray-900">Image Preview</h3>
                    <p className="text-gray-600 text-sm">Review and confirm your selection</p>
                  </div>
                  
                  <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
                    <Image
                      src={selectedImage}
                      alt="Selected food"
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
                {isAnalyzing ? (
                  <div className="text-center py-8 space-y-4">
                    <div className="relative">
                      <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto">
                        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="font-semibold text-gray-900">Analyzing your food...</p>
                      <p className="text-sm text-gray-600">AI is identifying ingredients and calculating nutrition</p>
                    </div>
                    
                    <div className="flex justify-center space-x-1 mt-4">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <Button 
                      onClick={analyzeImage}
                      className="w-full h-14 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white font-semibold text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Analyze Food
                    </Button>
                    
                    <Button 
                      onClick={resetImage}
                      variant="outline"
                      className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-2xl transition-all duration-200"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Choose Different Image
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}