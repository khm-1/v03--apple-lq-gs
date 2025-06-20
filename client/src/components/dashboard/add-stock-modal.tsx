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
      <DialogContent className="glass-morphism-dark border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add Stock to Watchlist
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="symbol"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Symbol</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="AAPL"
                        className="glass-morphism-dark border-white/20 text-white placeholder:text-slate-400"
                        {...field}
                        onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Price ($)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="173.50"
                        className="glass-morphism-dark border-white/20 text-white placeholder:text-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Company Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Apple Inc."
                      className="glass-morphism-dark border-white/20 text-white placeholder:text-slate-400"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="change"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Change ($)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="4.12"
                        className="glass-morphism-dark border-white/20 text-white placeholder:text-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="changePercent"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Change (%)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="2.4"
                        className="glass-morphism-dark border-white/20 text-white placeholder:text-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
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
                    <FormLabel className="text-slate-300">Volume</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="45200000"
                        className="glass-morphism-dark border-white/20 text-white placeholder:text-slate-400"
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketCap"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-slate-300">Market Cap</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="$2.7T"
                        className="glass-morphism-dark border-white/20 text-white placeholder:text-slate-400"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setOpen(false)}
                className="text-slate-300 hover:text-white hover:bg-white/10"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={createStockMutation.isPending}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white"
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