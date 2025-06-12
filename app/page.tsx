'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Camera, Calculator, Target, Zap } from 'lucide-react';
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
  };

  const startUsing = () => {
    router.push('/upload');
  };

  const isFormValid = userData.gender && userData.age && userData.height && userData.weight && userData.activityLevel;

  if (isComplete) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Camera className="h-8 w-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Calorie Counter
              </h1>
              <p className="text-muted-foreground mt-2">Smart Food Calorie Recognition</p>
            </div>

            <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
              <CardHeader className="text-center">
                <CardTitle className="text-green-700">Setup Complete!</CardTitle>
                <CardDescription>Your daily calorie target has been calculated</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl p-6 text-white text-center">
                  <Target className="h-8 w-8 mx-auto mb-2" />
                  <p className="text-sm opacity-90">Daily Calorie Target</p>
                  <p className="text-3xl font-bold">{userData.dailyCalories}</p>
                  <p className="text-sm opacity-90">kcal</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="text-center">
                    <p className="text-muted-foreground">Gender</p>
                    <p className="font-semibold">{userData.gender === 'male' ? 'Male' : 'Female'}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Age</p>
                    <p className="font-semibold">{userData.age} years</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Height</p>
                    <p className="font-semibold">{userData.height}cm</p>
                  </div>
                  <div className="text-center">
                    <p className="text-muted-foreground">Weight</p>
                    <p className="font-semibold">{userData.weight}kg</p>
                  </div>
                </div>

                <Button 
                  onClick={startUsing}
                  className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-semibold py-6 text-lg rounded-xl"
                >
                  <Zap className="mr-2 h-5 w-5" />
                  Start Using
                </Button>

                <Button 
                  variant="ghost" 
                  onClick={() => setIsComplete(false)}
                  className="w-full text-muted-foreground"
                >
                  Reset Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Calculator className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Calorie Counter
            </h1>
            <p className="text-muted-foreground mt-2">Please set up your basic information first</p>
          </div>

          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="text-green-700">Personal Information Setup</CardTitle>
              <CardDescription>
                We will calculate your daily calorie needs based on your information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label className="text-sm font-medium mb-3 block">Gender</Label>
                <RadioGroup 
                  value={userData.gender} 
                  onValueChange={(value) => setUserData({...userData, gender: value})}
                  className="flex space-x-6"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="male" id="male" />
                    <Label htmlFor="male">Male</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id="female" />
                    <Label htmlFor="female">Female</Label>
                  </div>
                </RadioGroup>
              </div>

              <div>
                <Label htmlFor="age" className="text-sm font-medium">Age</Label>
                <Input
                  id="age"
                  type="number"
                  placeholder="Please enter your age"
                  value={userData.age}
                  onChange={(e) => setUserData({...userData, age: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="height" className="text-sm font-medium">Height (cm)</Label>
                <Input
                  id="height"
                  type="number"
                  placeholder="Please enter your height"
                  value={userData.height}
                  onChange={(e) => setUserData({...userData, height: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label htmlFor="weight" className="text-sm font-medium">Weight (kg)</Label>
                <Input
                  id="weight"
                  type="number"
                  placeholder="Please enter your weight"
                  value={userData.weight}
                  onChange={(e) => setUserData({...userData, weight: e.target.value})}
                  className="mt-2"
                />
              </div>

              <div>
                <Label className="text-sm font-medium mb-2 block">Activity Level</Label>
                <Select value={userData.activityLevel} onValueChange={(value) => setUserData({...userData, activityLevel: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Please select your activity level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedentary">Sedentary (little to no exercise)</SelectItem>
                    <SelectItem value="light">Light activity (exercise 1-3 days/week)</SelectItem>
                    <SelectItem value="moderate">Moderate activity (exercise 3-5 days/week)</SelectItem>
                    <SelectItem value="active">High activity (exercise 6-7 days/week)</SelectItem>
                    <SelectItem value="very_active">Very high activity (daily exercise or physical job)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button 
                onClick={handleSubmit}
                disabled={!isFormValid}
                className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 disabled:opacity-50 text-white font-semibold py-6 text-lg rounded-xl"
              >
                <Calculator className="mr-2 h-5 w-5" />
                Calculate Daily Calories
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}