'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Camera, Calculator, Target, Zap, ArrowRight, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface UserData {
  gender: string;
  age: string;
  height: string;
  weight: string;
  activityLevel: string;
  dailyCalories?: number;
}

export default function SetupPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<UserData>({
    gender: '',
    age: '',
    height: '',
    weight: '',
    activityLevel: ''
  });

  const [isComplete, setIsComplete] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    // Check if user data already exists
    const savedData = localStorage.getItem('userData');
    if (savedData) {
      const parsed = JSON.parse(savedData);
      setUserData(parsed);
      setIsComplete(true);
    }
  }, []);

  const calculateBMR = (data: UserData) => {
    const age = parseInt(data.age);
    const height = parseInt(data.height);
    const weight = parseInt(data.weight);
    
    let bmr;
    if (data.gender === 'male') {
      bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age);
    } else {
      bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age);
    }

    const activityMultipliers = {
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      very_active: 1.9
    };

    return Math.round(bmr * activityMultipliers[data.activityLevel as keyof typeof activityMultipliers]);
  };

  const handleSubmit = () => {
    if (!userData.gender || !userData.age || !userData.height || !userData.weight || !userData.activityLevel) {
      return;
    }

    const dailyCalories = calculateBMR(userData);
    const completeData = { ...userData, dailyCalories };
    
    localStorage.setItem('userData', JSON.stringify(completeData));
    setUserData(completeData);
    setIsComplete(true);
    setShowSetup(false);
  };

  const startUsing = () => {
    router.push('/upload');
  };

  const isFormValid = userData.gender && userData.age && userData.height && userData.weight && userData.activityLevel;

  // Welcome screen with Apple-inspired design
  if (!showSetup && !isComplete) {
    return (
      <div className="min-h-screen bg-white overflow-hidden">
        {/* Hero Section */}
        <div className="relative min-h-screen flex flex-col">
          {/* Background Elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute top-40 right-16 w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full blur-2xl opacity-40 animate-pulse delay-1000"></div>
            <div className="absolute bottom-32 left-20 w-28 h-28 bg-gradient-to-br from-purple-100 to-pink-200 rounded-full blur-3xl opacity-25 animate-pulse delay-2000"></div>
          </div>

          {/* Navigation */}
          <div className="relative z-10 px-6 pt-12">
            <div className="flex items-center justify-between max-w-sm mx-auto">
              <div className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                Calorie
              </div>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="text-sm text-gray-500">AI Ready</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex flex-col justify-center px-6 pb-20">
            <div className="max-w-sm mx-auto text-center space-y-8">
              {/* Food Icon Display */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-green-600/10 rounded-full blur-3xl scale-150"></div>
                <div className="relative bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                  <div className="text-7xl mb-4 animate-bounce">🥗</div>
                  <div className="flex justify-center space-x-3 mb-3">
                    <span className="text-3xl animate-pulse">🍎</span>
                    <span className="text-3xl animate-pulse delay-300">🥑</span>
                    <span className="text-3xl animate-pulse delay-700">🥕</span>
                  </div>
                </div>
              </div>

              {/* Title */}
              <div className="space-y-4">
                <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-600 bg-clip-text text-transparent leading-tight">
                  Food Calorie
                  <br />
                  Calculator
                </h1>
                <p className="text-lg text-gray-600 leading-relaxed font-medium">
                  Intelligent nutrition tracking with
                  <br />
                  <span className="bg-gradient-to-r from-blue-600 to-green-600 bg-clip-text text-transparent font-semibold">
                    AI-powered precision
                  </span>
                </p>
              </div>

              {/* CTA Button */}
              <div className="space-y-4">
                <Button 
                  onClick={() => setShowSetup(true)}
                  className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border-0"
                >
                  <Sparkles className="mr-2 h-5 w-5" />
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                
                <p className="text-sm text-gray-400 font-medium">
                  Personalized • Accurate • Effortless
                </p>
              </div>
            </div>
          </div>

          {/* Bottom Indicator */}
          <div className="relative z-10 pb-8">
            <div className="flex justify-center">
              <div className="w-12 h-1 bg-gradient-to-r from-blue-600 to-green-600 rounded-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Setup Complete Screen
  if (isComplete) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-12">
          <div className="max-w-md mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-4">
              <div className="relative">
                <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                  <Target className="h-10 w-10 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  You're All Set!
                </h1>
                <p className="text-gray-600 font-medium">Your personalized nutrition profile is ready</p>
              </div>
            </div>

            {/* Stats Card */}
            <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
              <div className="text-center space-y-6">
                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <Target className="h-8 w-8 mx-auto mb-3 opacity-90" />
                  <div className="space-y-1">
                    <p className="text-sm opacity-90 font-medium">Daily Target</p>
                    <p className="text-4xl font-bold">{userData.dailyCalories}</p>
                    <p className="text-sm opacity-90">calories</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 font-medium mb-1">Gender</p>
                    <p className="font-semibold text-gray-900">{userData.gender === 'male' ? 'Male' : 'Female'}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 font-medium mb-1">Age</p>
                    <p className="font-semibold text-gray-900">{userData.age}y</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 font-medium mb-1">Height</p>
                    <p className="font-semibold text-gray-900">{userData.height}cm</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-4 text-center">
                    <p className="text-gray-500 font-medium mb-1">Weight</p>
                    <p className="font-semibold text-gray-900">{userData.weight}kg</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button 
                onClick={startUsing}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                <Camera className="mr-2 h-5 w-5" />
                Start Tracking
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              
              <Button 
                variant="ghost" 
                onClick={() => {
                  setIsComplete(false);
                  setShowSetup(true);
                }}
                className="w-full h-12 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl font-medium transition-all duration-200"
              >
                Adjust Settings
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Setup Form
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <Button 
              variant="ghost" 
              onClick={() => setShowSetup(false)}
              className="mb-4 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl"
            >
              ← Back
            </Button>
            
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto shadow-xl">
                <Calculator className="h-8 w-8 text-white" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Personal Profile
                </h1>
                <p className="text-gray-600 font-medium">Help us personalize your nutrition goals</p>
              </div>
            </div>
          </div>

          {/* Form Card */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="space-y-6">
              {/* Gender */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900">Gender</Label>
                <RadioGroup 
                  value={userData.gender} 
                  onValueChange={(value) => setUserData({...userData, gender: value})}
                  className="grid grid-cols-2 gap-3"
                >
                  <div className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors cursor-pointer">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male" className="font-medium cursor-pointer flex-1">Male</Label>
                  </div>
                  <div className="flex items-center space-x-3 bg-gray-50 hover:bg-gray-100 p-4 rounded-xl transition-colors cursor-pointer">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female" className="font-medium cursor-pointer flex-1">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              {/* Age */}
              <div className="space-y-3">
                <Label htmlFor="age" className="text-base font-semibold text-gray-900">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Enter your age"
                  value={userData.age}
                  onChange={(e) => setUserData({...userData, age: e.target.value})}
                  className="h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              {/* Height */}
              <div className="space-y-3">
                <Label htmlFor="height" className="text-base font-semibold text-gray-900">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Enter your height"
                  value={userData.height}
                  onChange={(e) => setUserData({...userData, height: e.target.value})}
                  className="h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              {/* Weight */}
              <div className="space-y-3">
                <Label htmlFor="weight" className="text-base font-semibold text-gray-900">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Enter your weight"
                  value={userData.weight}
                  onChange={(e) => setUserData({...userData, weight: e.target.value})}
                  className="h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                />
              </div>

              {/* Activity Level */}
              <div className="space-y-3">
                <Label className="text-base font-semibold text-gray-900">Activity Level</Label>
                <Select value={userData.activityLevel} onValueChange={(value) => setUserData({...userData, activityLevel: value})}>
                  <SelectTrigger className="h-12 text-base rounded-xl border-gray-200 focus:border-blue-500 focus:ring-blue-500/20">
                    <SelectValue placeholder="Select your activity level" />
                  </SelectTrigger>
                  <SelectContent className="rounded-xl">
                    <SelectItem value="sedentary">Sedentary (minimal exercise)</SelectItem>
                    <SelectItem value="light">Light (1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate (3-5 days/week)</SelectItem>
                    <SelectItem value="active">Active (6-7 days/week)</SelectItem>
                    <SelectItem value="very_active">Very Active (2x daily)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Submit Button */}
              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300 disabled:transform-none disabled:shadow-none"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate My Goals
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}