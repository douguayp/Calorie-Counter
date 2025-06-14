'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, AlertTriangle, Camera, Target, Utensils, TrendingUp, Award } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface FoodItem {
  name: string;
  confidence: number;
  calories: number;
  portion: string;
  nutrients: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

export default function ResultPage() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);
  const [analyzedImage, setAnalyzedImage] = useState<string | null>(null);
  const [foodResults, setFoodResults] = useState<FoodItem[]>([]);

  useEffect(() => {
    const savedData = localStorage.getItem('userData');
    const savedImage = localStorage.getItem('analyzedImage');
    
    if (!savedData || !savedImage) {
      router.push('/');
      return;
    }

    setUserData(JSON.parse(savedData));
    setAnalyzedImage(savedImage);

    // Mock food recognition results
    const mockResults: FoodItem[] = [
      {
        name: 'Steamed White Rice',
        confidence: 96,
        calories: 206,
        portion: '150g (1 bowl)',
        nutrients: { protein: 4.3, carbs: 45.8, fat: 0.3 }
      },
      {
        name: 'Braised Pork Belly',
        confidence: 89,
        calories: 285,
        portion: '100g',
        nutrients: { protein: 18.5, carbs: 5.2, fat: 21.8 }
      },
      {
        name: 'Sautéed Bok Choy',
        confidence: 94,
        calories: 25,
        portion: '100g',
        nutrients: { protein: 2.8, carbs: 4.6, fat: 0.2 }
      }
    ];

    setFoodResults(mockResults);
  }, [router]);

  if (!userData || !analyzedImage) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gray-600 font-medium">Loading analysis...</p>
      </div>
    </div>;
  }

  const totalCalories = foodResults.reduce((sum, food) => sum + food.calories, 0);
  const dailyTarget = userData.dailyCalories;
  const percentage = Math.round((totalCalories / dailyTarget) * 100);
  const isHealthy = percentage <= 35; // Assuming this is one meal, 35% is optimal

  const totalNutrients = foodResults.reduce(
    (sum, food) => ({
      protein: sum.protein + food.nutrients.protein,
      carbs: sum.carbs + food.nutrients.carbs,
      fat: sum.fat + food.nutrients.fat
    }),
    { protein: 0, carbs: 0, fat: 0 }
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-8 w-32 h-32 bg-gradient-to-br from-green-100 to-emerald-200 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute bottom-40 left-6 w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full blur-2xl opacity-25 animate-pulse delay-1000"></div>
      </div>

      <div className="relative container mx-auto px-6 py-8">
        <div className="max-w-md mx-auto space-y-8">
          {/* Header */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => router.push('/upload')}
                className="text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-xl -ml-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              
              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900">{dailyTarget} cal</div>
                <div className="text-xs text-gray-500">daily target</div>
              </div>
            </div>
            
            <div className="text-center space-y-3">
              <div className={`w-16 h-16 bg-gradient-to-br ${isHealthy ? 'from-green-500 to-emerald-600' : 'from-orange-500 to-red-500'} rounded-2xl flex items-center justify-center mx-auto shadow-xl`}>
                {isHealthy ? (
                  <Award className="h-8 w-8 text-white" />
                ) : (
                  <TrendingUp className="h-8 w-8 text-white" />
                )}
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                  Analysis Complete
                </h1>
                <p className="text-gray-600 font-medium mt-1">Your meal breakdown is ready</p>
              </div>
            </div>
          </div>

          {/* Image Preview */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100 shadow-lg">
              <Image
                src={analyzedImage}
                alt="Analyzed food"
                fill
                className="object-cover"
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full px-3 py-1">
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-700">Analyzed</span>
                </div>
              </div>
            </div>
          </div>

          {/* Calorie Summary */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
            <div className="text-center space-y-6">
              <div className={`bg-gradient-to-br ${isHealthy ? 'from-green-500 to-emerald-600' : 'from-orange-500 to-red-500'} rounded-2xl p-6 text-white relative overflow-hidden`}>
                <div className="absolute top-0 right-0 w-20 h-20 bg-white/10 rounded-full -mr-10 -mt-10"></div>
                <div className="relative">
                  <Target className="h-8 w-8 mx-auto mb-3 opacity-90" />
                  <div className="space-y-1">
                    <p className="text-sm opacity-90 font-medium">Total Calories</p>
                    <p className="text-4xl font-bold">{totalCalories}</p>
                    <p className="text-sm opacity-90">kcal in this meal</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-700">Daily Target Progress</span>
                  <span className="font-bold text-gray-900">{percentage}%</span>
                </div>
                
                <div className="relative">
                  <Progress 
                    value={Math.min(percentage, 100)} 
                    className={`h-3 rounded-full ${
                      isHealthy 
                        ? '[&>div]:bg-gradient-to-r [&>div]:from-green-500 [&>div]:to-emerald-600' 
                        : '[&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-red-500'
                    }`}
                  />
                  <div className="absolute -top-8 left-0 right-0">
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>0</span>
                      <span>{dailyTarget}</span>
                    </div>
                  </div>
                </div>
                
                <div className={`p-4 rounded-2xl text-center ${
                  isHealthy 
                    ? 'bg-green-50 text-green-800' 
                    : 'bg-orange-50 text-orange-800'
                }`}>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    {isHealthy ? (
                      <>
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-semibold">Excellent Choice!</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="h-5 w-5" />
                        <span className="font-semibold">Consider Moderation</span>
                      </>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed">
                    {isHealthy 
                      ? 'This meal fits perfectly within your daily nutrition goals. Great balance!'
                      : 'This meal is calorie-dense. Consider lighter options for your next meals.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Food Items */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Utensils className="h-5 w-5 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900">Identified Foods</h3>
              </div>
              
              <div className="space-y-4">
                {foodResults.map((food, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg text-gray-900">{food.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{food.portion}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-gray-900">{food.calories}</p>
                        <p className="text-sm text-gray-600">kcal</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <Badge 
                        variant="secondary" 
                        className={`${food.confidence >= 95 ? 'bg-green-100 text-green-700' : food.confidence >= 85 ? 'bg-blue-100 text-blue-700' : 'bg-yellow-100 text-yellow-700'} border-0`}
                      >
                        {food.confidence}% confidence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center bg-white rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">Protein</p>
                        <p className="font-bold text-blue-600">{food.nutrients.protein}g</p>
                      </div>
                      <div className="text-center bg-white rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">Carbs</p>
                        <p className="font-bold text-green-600">{food.nutrients.carbs}g</p>
                      </div>
                      <div className="text-center bg-white rounded-xl p-3">
                        <p className="text-xs text-gray-500 mb-1">Fat</p>
                        <p className="font-bold text-orange-600">{food.nutrients.fat}g</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Nutrition Summary */}
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl p-6 shadow-2xl border border-white/20">
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-gray-600" />
                <h3 className="text-xl font-semibold text-gray-900">Nutrition Summary</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-blue-50 rounded-2xl p-5 text-center">
                  <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">P</span>
                  </div>
                  <p className="text-sm text-blue-600 font-medium mb-1">Protein</p>
                  <p className="text-2xl font-bold text-blue-700">{totalNutrients.protein.toFixed(1)}</p>
                  <p className="text-xs text-blue-600">grams</p>
                </div>
                <div className="bg-emerald-50 rounded-2xl p-5 text-center">
                  <div className="w-12 h-12 bg-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">C</span>
                  </div>
                  <p className="text-sm text-emerald-600 font-medium mb-1">Carbs</p>
                  <p className="text-2xl font-bold text-emerald-700">{totalNutrients.carbs.toFixed(1)}</p>
                  <p className="text-xs text-emerald-600">grams</p>
                </div>
                <div className="bg-orange-50 rounded-2xl p-5 text-center">
                  <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold text-lg">F</span>
                  </div>
                  <p className="text-sm text-orange-600 font-medium mb-1">Fat</p>
                  <p className="text-2xl font-bold text-orange-700">{totalNutrients.fat.toFixed(1)}</p>
                  <p className="text-xs text-orange-600">grams</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button 
              onClick={() => router.push('/upload')}
              className="w-full h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold text-lg rounded-2xl shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              <Camera className="mr-2 h-5 w-5" />
              Analyze Another Meal
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full h-12 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-2xl transition-all duration-200"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}