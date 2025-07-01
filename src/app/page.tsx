
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Hash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  const [minVal, setMinVal] = useState<string>("0.01");
  const [maxVal, setMaxVal] = useState<string>("0.04");
  const [precision, setPrecision] = useState<string>("4");
  const [randomNumber, setRandomNumber] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResult, setShowResult] = useState<boolean>(false);
  const { toast } = useToast();

  const handleGenerate = () => {
    setShowResult(true);
    setError(null);
    setRandomNumber(null);

    const min = parseFloat(minVal);
    const max = parseFloat(maxVal);
    const prec = parseInt(precision, 10);

    if (isNaN(min) || isNaN(max) || isNaN(prec)) {
      setError("Please fill in all fields with valid numbers.");
      return;
    }

    if (min >= max) {
      setError("Minimum value must be less than the maximum value.");
      return;
    }

    if (prec < 0 || !Number.isInteger(prec)) {
      setError("Precision must be a non-negative integer.");
      return;
    }
    
    if (prec > 20) {
      setError("Precision must be 20 or less.");
      return;
    }

    const rawRandom = Math.random() * (max - min) + min;
    const result = parseFloat(rawRandom.toFixed(prec));
    setRandomNumber(result);
  };

  const handleCopy = () => {
    if (randomNumber === null) return;
    const prec = parseInt(precision, 10);
    const numberString = randomNumber.toLocaleString(undefined, {
      minimumFractionDigits: !isNaN(prec) && prec >= 0 ? prec : 0,
      maximumFractionDigits: !isNaN(prec) && prec >= 0 ? prec : 0,
      useGrouping: false,
    });
    navigator.clipboard.writeText(numberString);
    toast({
      title: "Copied to clipboard!",
    });
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center p-4">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <Card className="w-full max-w-lg shadow-lg">
        <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-4">
            <div className="bg-secondary p-3 rounded-lg">
                <Hash className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div className="space-y-1">
                <CardTitle className="text-2xl font-bold">Precise Num Gen</CardTitle>
                <CardDescription>
                Generate a random number with your desired precision within a specific
                range.
                </CardDescription>
            </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min">Minimum Value</Label>
                <Input
                  id="min"
                  type="number"
                  placeholder="0.01"
                  value={minVal}
                  onChange={(e) => setMinVal(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max">Maximum Value</Label>
                <Input
                  id="max"
                  type="number"
                  placeholder="0.04"
                  value={maxVal}
                  onChange={(e) => setMaxVal(e.target.value)}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="precision">Precision (decimal places)</Label>
              <Input
                id="precision"
                type="number"
                placeholder="4"
                value={precision}
                onChange={(e) => setPrecision(e.target.value)}
                min="0"
                max="20"
                step="1"
              />
              <p className="text-sm text-muted-foreground pt-1">
                The number of digits to appear after the decimal point.
              </p>
            </div>
            <Button
              onClick={handleGenerate}
              className="w-full text-lg py-6 font-semibold"
            >
              Generate Number
            </Button>
            
            {showResult && (
              <div className="flex flex-col items-center justify-center h-24 mt-4 rounded-lg bg-muted/50">
                {error && <p className="text-destructive text-center p-4">{error}</p>}
                {randomNumber !== null && !error ? (
                  <div className="w-full flex items-center justify-between p-4">
                    <p className="text-3xl font-bold tracking-wider">
                      {randomNumber.toLocaleString(undefined, {
                          minimumFractionDigits: parseInt(precision, 10) || 0,
                          maximumFractionDigits: parseInt(precision, 10) || 0,
                          useGrouping: false,
                      })}
                    </p>
                    <Button variant="ghost" size="icon" onClick={handleCopy}>
                        <Copy className="h-5 w-5"/>
                    </Button>
                  </div>
                ) : !error && (
                  <div className="text-muted-foreground">
                      Your number will appear here
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
