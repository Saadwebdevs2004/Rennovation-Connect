"use client"

import React, { useState } from 'react';
import Cards, { Focused } from 'react-credit-cards-2';
import 'react-credit-cards-2/dist/es/styles-compiled.css';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import { useRouter } from 'next/navigation';

interface MockPaymentFormProps {
  amount: number;
  jobTitle: string;
  onSuccess: () => void;
}

export function MockPaymentForm({ amount, jobTitle, onSuccess }: MockPaymentFormProps) {
  const [state, setState] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: '',
    focus: '' as Focused | undefined,
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleInputChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = evt.target;
    
    // Auto format expiry
    let formattedValue = value;
    if (name === 'expiry') {
      formattedValue = value.replace(/\D/g, '');
      if (formattedValue.length > 2) {
        formattedValue = `${formattedValue.slice(0, 2)}/${formattedValue.slice(2, 4)}`;
      }
    }

    setState((prev) => ({ ...prev, [name]: formattedValue }));
  }

  const handleInputFocus = (evt: React.FocusEvent<HTMLInputElement>) => {
    setState((prev) => ({ ...prev, focus: evt.target.name as Focused }));
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    // Simulate network request to Stripe/Payment Gateway
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Allow user to see the success animation briefly before resolving
      setTimeout(() => {
        onSuccess();
      }, 2000);
    }, 2000);
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-6 animate-in zoom-in duration-500">
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-12 h-12 text-success" />
        </div>
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Payment Successful!</h2>
          <p className="text-muted-foreground">RS {amount.toLocaleString()} has been securely processed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-primary/5 p-4 rounded-xl flex items-start gap-3 border border-primary/20">
        <ShieldCheck className="w-6 h-6 text-primary shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-foreground text-sm">Demo Mode - Secure Checkout</p>
          <p className="text-xs text-muted-foreground mt-1">
            This is a mock interface. No real transactions will occur. Try typing any numbers!
          </p>
        </div>
      </div>

      <div className="scale-90 sm:scale-100 transform origin-top">
        <Cards
          number={state.number}
          expiry={state.expiry}
          cvc={state.cvc}
          name={state.name}
          focused={state.focus}
        />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Card Number</label>
          <Input
            type="text"
            name="number"
            placeholder="Card Number"
            value={state.number}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            maxLength={16}
            required
            disabled={isProcessing}
          />
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Cardholder Name</label>
          <Input
            type="text"
            name="name"
            placeholder="Name as it appears on card"
            value={state.name}
            onChange={handleInputChange}
            onFocus={handleInputFocus}
            required
            disabled={isProcessing}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Expiration Date</label>
            <Input
              type="text"
              name="expiry"
              placeholder="MM/YY"
              value={state.expiry}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              maxLength={5}
              required
              disabled={isProcessing}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">CVC</label>
            <Input
              type="text"
              name="cvc"
              placeholder="CVC"
              value={state.cvc}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              maxLength={4}
              required
              disabled={isProcessing}
            />
          </div>
        </div>

        <Button 
          type="submit" 
          className="w-full h-12 text-lg font-semibold mt-4" 
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Processing...
            </>
          ) : (
            `Pay RS ${amount.toLocaleString()}`
          )}
        </Button>
      </form>
    </div>
  );
}
