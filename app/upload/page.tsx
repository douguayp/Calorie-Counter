'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, ArrowLeft, Image as ImageIcon, Zap } from 'lucide-react';
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
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/')}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Food Photo Recognition</h1>
              <p className="text-sm text-gray-600">
                Daily target: {userData.dailyCalories} kcal
              </p>
            </div>
          </div>

          {!selectedImage ? (
            <Card className="backdrop-blur-sm bg-white border-0 shadow-2xl">
              <CardHeader className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-green-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-8 w-8 text-white" />
                </div>
                <CardTitle className="text-emerald-700">Select Food Image</CardTitle>
                <CardDescription>
                  Take a photo or upload a food image, we will automatically recognize and calculate calories
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button 
                  onClick={handleCameraCapture}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-lg rounded-2xl"
                >
                  <Camera className="mr-2 h-5 w-5" />
                  Take Photo
                </Button>
                
                <Button 
                  onClick={handleUploadClick}
                  variant="outline"
                  className="w-full border-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-semibold py-6 text-lg rounded-2xl"
                >
                  <Upload className="mr-2 h-5 w-5" />
                  Choose from Gallery
                </Button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <div className="bg-blue-50 p-4 rounded-2xl">
                  <p className="text-sm text-blue-700 text-center">
                    💡 Photo Tips: Make sure food is clearly visible, good lighting works better
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="backdrop-blur-sm bg-white border-0 shadow-2xl">
              <CardHeader className="text-center">
                <CardTitle className="text-emerald-700">Image Preview</CardTitle>
                <CardDescription>
                  Confirm the image is correct, then click analyze button
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="relative aspect-square rounded-2xl overflow-hidden bg-gray-100">
                  <Image
                    src={selectedImage}
                    alt="Selected food"
                    fill
                    className="object-cover"
                  />
                </div>

                {isAnalyzing ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-emerald-700 font-semibold">Recognizing food...</p>
                    <p className="text-sm text-gray-600 mt-2">
                      Please wait, AI is analyzing your food
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <Button 
                      onClick={analyzeImage}
                      className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-lg rounded-2xl"
                    >
                      <Zap className="mr-2 h-5 w-5" />
                      Start Analysis
                    </Button>
                    
                    <Button 
                      onClick={resetImage}
                      variant="outline"
                      className="w-full border-2 border-gray-200 hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-2xl"
                    >
                      <ImageIcon className="mr-2 h-4 w-4" />
                      Choose Again
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}