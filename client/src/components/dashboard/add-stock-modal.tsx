import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { insertStockSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Loader2 } from "lucide-react";

const formSchema = insertStockSchema.extend({
  symbol: z.string().min(1, "Symbol is required").max(5, "Symbol must be 5 characters or less"),
  name: z.string().min(1, "Company name is required"),
  price: z.string().min(1, "Price is required"),
  change: z.string().min(1, "Change is required"),
  changePercent: z.string().min(1, "Change percent is required"),
  volume: z.number().min(0, "Volume must be positive"),
  marketCap: z.string().min(1, "Market cap is required"),
});

interface AddStockModalProps {
  children: React.ReactNode;
}

export default function AddStockModal({ children }: AddStockModalProps) {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      symbol: "",
      name: "",
      price: "",
      change: "",
      changePercent: "",
      volume: 0,
      marketCap: "",
    },
  });

  const createStockMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      return apiRequest("/api/stocks", {
        method: "POST",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/stocks"] });
      toast({
        title: "Success",
        description: "Stock added to watchlist successfully!",
      });
      form.reset();
      setOpen(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to add stock to watchlist. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    createStockMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="glass-morphism border-white/10 text-white max-w-md backdrop-blur-xl bg-slate-900/80 shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2 text-xl font-semibold">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
              <Plus className="w-4 h-4" />
            </div>
            Add Stock to Watchlist
          </DialogTitle>
          <DialogDescription className="text-slate-300 text-sm">
            Enter the stock details to add it to your watchlist for monitoring.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 mt-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium">Symbol</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="AAPL"
                        className="glass-morphism border-white/10 text-white placeholder:text-slate-500 bg-slate-800/50 focus:bg-slate-800/70 transition-all"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium">Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="173.50"
                        className="glass-morphism border-white/10 text-white placeholder:text-slate-500 bg-slate-800/50 focus:bg-slate-800/70 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300 font-medium">Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apple Inc."
                      className="glass-morphism border-white/10 text-white placeholder:text-slate-500 bg-slate-800/50 focus:bg-slate-800/70 transition-all"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-400" />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="change"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium">Change ($)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="4.12"
                        className="glass-morphism border-white/10 text-white placeholder:text-slate-500 bg-slate-800/50 focus:bg-slate-800/70 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="changePercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium">Change (%)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2.4"
                        className="glass-morphism border-white/10 text-white placeholder:text-slate-500 bg-slate-800/50 focus:bg-slate-800/70 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium">Volume</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="45200000"
                        className="glass-morphism border-white/10 text-white placeholder:text-slate-500 bg-slate-800/50 focus:bg-slate-800/70 transition-all"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketCap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300 font-medium">Market Cap</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$2.7T"
                        className="glass-morphism border-white/10 text-white placeholder:text-slate-500 bg-slate-800/50 focus:bg-slate-800/70 transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-400" />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t border-white/10">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-slate-300 hover:text-white glass-morphism hover:bg-white/10 transition-all"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createStockMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                {createStockMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Stock
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}