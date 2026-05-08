"use client"

import React, { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, UploadCloud, Building } from "lucide-react";

interface ManualTransferFormProps {
  amount: number;
  jobTitle: string;
  onSuccess: (receiptUrl?: string) => void;
}

export function ManualTransferForm({ amount, jobTitle, onSuccess }: ManualTransferFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [reference, setReference] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setFileUrl(URL.createObjectURL(e.target.files[0]));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    setIsProcessing(true);

    // Simulate backend upload and status change
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        onSuccess(fileUrl || undefined);
      }, 2500);
    }, 1500);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-primary" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Receipt Uploaded!</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Your payment for RS {amount.toLocaleString()} is now pending worker verification. You will be notified once they approve it.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-muted p-5 rounded-xl border border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
            <Building className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h3 className="font-semibold">Bank Transfer Details</h3>
            <p className="text-sm text-muted-foreground">Please transfer to the following account</p>
          </div>
        </div>
        
        <div className="space-y-2 text-sm bg-background p-4 rounded-lg">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Bank Name:</span>
            <span className="font-medium">RenoConnect Escrow Bank</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Account Number:</span>
            <span className="font-medium">1234 5678 9012 3456</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Amount Due:</span>
            <span className="font-medium text-primary">RS {amount.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Upload Payment Receipt (Optional)</label>
          <div className="border-2 border-dashed border-border rounded-xl p-8 text-center hover:bg-muted/50 transition-colors cursor-pointer relative">
            <Input 
              type="file" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
              onChange={handleFileChange}
              accept="image/*,.pdf"
            />
            <div className="flex flex-col items-center gap-2 text-muted-foreground">
              <UploadCloud className="w-8 h-8 mb-2" />
              {file ? (
                <span className="font-medium text-primary">{file.name}</span>
              ) : (
                <>
                  <span className="font-medium">Click to upload or drag and drop</span>
                  <span className="text-xs">PDF, PNG, JPG (max. 5MB)</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Reference Number (Optional)</label>
          <Input
            type="text"
            placeholder="e.g. Transaction ID"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            disabled={isProcessing}
          />
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg font-semibold" 
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Uploading...
            </>
          ) : (
            "Submit Proof of Payment"
          )}
        </Button>
      </form>
    </div>
  );
}
