"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Copy, Check, Hash } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Toaster } from "@/components/ui/toaster";

const formSchema = z
  .object({
    min: z.coerce.number({ invalid_type_error: "Please enter a valid number." }),
    max: z.coerce.number({ invalid_type_error: "Please enter a valid number." }),
    precision: z.coerce.number().int().min(0, "Precision must be 0 or more.").max(20, "Precision must be 20 or less."),
  })
  .refine((data) => data.max > data.min, {
    message: "Max value must be greater than min value.",
    path: ["max"],
  });

export default function PrecisionRandPage() {
  const [randomNumber, setRandomNumber] = useState<string | null>(null);
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      min: 0.01,
      max: 0.04,
      precision: 4,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const { min, max, precision } = values;
      const rawRandom = Math.random() * (max - min) + min;
      const generated = rawRandom.toFixed(precision);
      setRandomNumber(generated);
      setIsCopied(false); // Reset copied state on new number generation
    } catch (error) {
      toast({
        title: "Error",
        description: "An unexpected error occurred during number generation.",
        variant: "destructive",
      });
    }
  }

  const handleCopy = () => {
    if (randomNumber) {
      navigator.clipboard.writeText(randomNumber);
      setIsCopied(true);
      toast({
          title: "Copied!",
          description: `Copied ${randomNumber} to clipboard.`,
      });
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  return (
    <>
      <main className="flex min-h-screen w-full items-center justify-center bg-background p-4 font-body">
        <Card className="w-full max-w-md shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-2">
              <div className="bg-primary p-2 rounded-md">
                 <Hash className="h-6 w-6 text-primary-foreground" />
              </div>
              <CardTitle className="font-headline text-2xl">Precise Num Gen</CardTitle>
            </div>
            <CardDescription>
              Generate a random number with your desired precision within a specific range.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="min"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Minimum Value</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" placeholder="e.g., 0.01" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Maximum Value</FormLabel>
                        <FormControl>
                          <Input type="number" step="any" placeholder="e.g., 0.04" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="precision"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Precision (decimal places)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 4" {...field} />
                      </FormControl>
                      <FormDescription>
                        The number of digits to appear after the decimal point.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
                  size="lg"
                >
                  Generate Number
                </Button>
              </form>
            </Form>
          </CardContent>
          {randomNumber && (
            <CardFooter>
              <div className="mt-4 w-full space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Generated Number:</p>
                <div className="flex items-center justify-between rounded-lg border bg-accent/10 p-4">
                  <span className="font-mono text-lg font-semibold text-accent-foreground">
                    {randomNumber}
                  </span>
                  <Button variant="ghost" size="icon" onClick={handleCopy}>
                    {isCopied ? (
                      <Check className="h-5 w-5 text-green-500" />
                    ) : (
                      <Copy className="h-5 w-5" />
                    )}
                    <span className="sr-only">Copy to clipboard</span>
                  </Button>
                </div>
              </div>
            </CardFooter>
          )}
        </Card>
      </main>
      <Toaster />
    </>
  );
}
