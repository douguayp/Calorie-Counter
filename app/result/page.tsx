'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ArrowLeft, CheckCircle, AlertTriangle, Camera, Target, Utensils } from 'lucide-react';
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
        name: 'White Rice',
        confidence: 95,
        calories: 206,
        portion: '150g (1 bowl)',
        nutrients: { protein: 4.3, carbs: 45.8, fat: 0.3 }
      },
      {
        name: 'Braised Pork',
        confidence: 88,
        calories: 285,
        portion: '100g',
        nutrients: { protein: 18.5, carbs: 5.2, fat: 21.8 }
      },
      {
        name: 'Green Vegetables',
        confidence: 92,
        calories: 25,
        portion: '100g',
        nutrients: { protein: 2.8, carbs: 4.6, fat: 0.2 }
      }
    ];

    setFoodResults(mockResults);
  }, [router]);

  if (!userData || !analyzedImage) {
    return <div>Loading...</div>;
  }

  const totalCalories = foodResults.reduce((sum, food) => sum + food.calories, 0);
  const dailyTarget = userData.dailyCalories;
  const percentage = Math.round((totalCalories / dailyTarget) * 100);
  const isOverTarget = percentage > 30; // Assuming this is one meal, 30% is reasonable

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
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto space-y-6">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => router.push('/upload')}
              className="mr-3"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Recognition Results</h1>
              <p className="text-sm text-gray-600">
                Daily target: {dailyTarget} kcal
              </p>
            </div>
          </div>

          {/* Image Preview */}
          <Card className="backdrop-blur-sm bg-white border-0 shadow-2xl">
            <CardContent className="p-4">
              <div className="relative aspect-video rounded-2xl overflow-hidden bg-gray-100">
                <Image
                  src={analyzedImage}
                  alt="Analyzed food"
                  fill
                  className="object-cover"
                />
              </div>
            </CardContent>
          </Card>

          {/* Calorie Summary */}
          <Card className="backdrop-blur-sm bg-white border-0 shadow-2xl">
            <CardHeader className="text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                isOverTarget 
                  ? 'bg-gradient-to-r from-orange-500 to-red-500' 
                  : 'bg-gradient-to-r from-emerald-500 to-green-500'
              }`}>
                {isOverTarget ? (
                  <AlertTriangle className="h-8 w-8 text-white" />
                ) : (
                  <CheckCircle className="h-8 w-8 text-white" />
                )}
              </div>
              <CardTitle className={isOverTarget ? 'text-orange-700' : 'text-emerald-700'}>
                Total Calorie Intake
              </CardTitle>
              <div className="text-4xl font-bold text-gray-900">
                {totalCalories}
              </div>
              <CardDescription>kcal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>% of Daily Target</span>
                  <span className="font-semibold">{percentage}%</span>
                </div>
                <Progress 
                  value={Math.min(percentage, 100)} 
                  className={`h-3 ${
                    isOverTarget 
                      ? '[&>div]:bg-gradient-to-r [&>div]:from-orange-500 [&>div]:to-red-500' 
                      : '[&>div]:bg-gradient-to-r [&>div]:from-emerald-500 [&>div]:to-green-500'
                  }`}
                />
              </div>
              
              <div className={`p-4 rounded-2xl text-center ${
                isOverTarget 
                  ? 'bg-orange-50 text-orange-700' 
                  : 'bg-emerald-50 text-emerald-700'
              }`}>
                {isOverTarget ? (
                  <p className="font-semibold">⚠️ Moderate Control Recommended</p>
                ) : (
                  <p className="font-semibold">✅ Suitable Intake</p>
                )}
                <p className="text-sm mt-1">
                  {isOverTarget 
                    ? 'This meal is high in calories. Consider exercising or reducing other meal portions'
                    : 'This meal has reasonable calories and fits your health goals'
                  }
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Food Items */}
          <Card className="backdrop-blur-sm bg-white border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-700">
                <Utensils className="mr-2 h-5 w-5" />
                Recognized Foods
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {foodResults.map((food, index) => (
                <div key={index} className="border rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-lg">{food.name}</h3>
                      <p className="text-sm text-gray-600">{food.portion}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-emerald-600">{food.calories}</p>
                      <p className="text-sm text-gray-600">kcal</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                      Confidence {food.confidence}%
                    </Badge>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div className="text-center">
                      <p className="text-gray-600">Protein</p>
                      <p className="font-semibold">{food.nutrients.protein}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Carbs</p>
                      <p className="font-semibold">{food.nutrients.carbs}g</p>
                    </div>
                    <div className="text-center">
                      <p className="text-gray-600">Fat</p>
                      <p className="font-semibold">{food.nutrients.fat}g</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Nutrition Summary */}
          <Card className="backdrop-blur-sm bg-white border-0 shadow-2xl">
            <CardHeader>
              <CardTitle className="flex items-center text-emerald-700">
                <Target className="mr-2 h-5 w-5" />
                Total Nutrition Summary
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <p className="text-sm text-blue-600 mb-1">Protein</p>
                  <p className="text-2xl font-bold text-blue-700">{totalNutrients.protein.toFixed(1)}</p>
                  <p className="text-sm text-blue-600">grams</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-2xl">
                  <p className="text-sm text-emerald-600 mb-1">Carbs</p>
                  <p className="text-2xl font-bold text-emerald-700">{totalNutrients.carbs.toFixed(1)}</p>
                  <p className="text-sm text-emerald-600">grams</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-2xl">
                  <p className="text-sm text-orange-600 mb-1">Fat</p>
                  <p className="text-2xl font-bold text-orange-700">{totalNutrients.fat.toFixed(1)}</p>
                  <p className="text-sm text-orange-600">grams</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={() => router.push('/upload')}
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold py-6 text-lg rounded-2xl"
            >
              <Camera className="mr-2 h-5 w-5" />
              Take Another Photo
            </Button>
            
            <Button 
              variant="outline"
              onClick={() => router.push('/')}
              className="w-full border-2 border-emerald-200 hover:bg-emerald-50 text-emerald-700 font-semibold py-3 rounded-2xl"
            >
              Back to Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}