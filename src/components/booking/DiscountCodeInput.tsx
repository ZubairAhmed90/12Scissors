import { useState } from 'react';
import { Tag, Check, X, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { DiscountCode } from '@/types';
import { mockDiscountCodes } from '@/data/mockData';
import { isAfter, isBefore } from 'date-fns';

interface DiscountCodeInputProps {
  shopId: string;
  totalPrice: number;
  onApply: (discount: { code: string; amount: number; discountCode: DiscountCode } | null) => void;
  appliedDiscount: { code: string; amount: number; discountCode: DiscountCode } | null;
}

const DiscountCodeInput = ({ shopId, totalPrice, onApply, appliedDiscount }: DiscountCodeInputProps) => {
  const [code, setCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);

  const validateCode = async () => {
    if (!code.trim()) {
      toast.error('Please enter a discount code');
      return;
    }

    setIsValidating(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));

    const discountCode = mockDiscountCodes.find(
      dc => dc.code.toLowerCase() === code.trim().toLowerCase() && dc.shopId === shopId
    );

    if (!discountCode) {
      toast.error('Invalid discount code');
      setIsValidating(false);
      return;
    }

    // Check if code is active
    if (!discountCode.isActive) {
      toast.error('This discount code is no longer active');
      setIsValidating(false);
      return;
    }

    // Check validity period
    const now = new Date();
    if (isBefore(now, new Date(discountCode.validFrom))) {
      toast.error('This discount code is not yet valid');
      setIsValidating(false);
      return;
    }

    if (isAfter(now, new Date(discountCode.validUntil))) {
      toast.error('This discount code has expired');
      setIsValidating(false);
      return;
    }

    // Check usage limit
    if (discountCode.usageLimit && discountCode.usedCount >= discountCode.usageLimit) {
      toast.error('This discount code has reached its usage limit');
      setIsValidating(false);
      return;
    }

    // Check minimum order value
    if (discountCode.minOrderValue && totalPrice < discountCode.minOrderValue) {
      toast.error(`Minimum order value of Rs. ${discountCode.minOrderValue} required`);
      setIsValidating(false);
      return;
    }

    // Calculate discount
    let discountAmount: number;
    if (discountCode.discountType === 'percentage') {
      discountAmount = Math.round((totalPrice * discountCode.discountValue) / 100);
      // Apply max discount cap if exists
      if (discountCode.maxDiscountAmount && discountAmount > discountCode.maxDiscountAmount) {
        discountAmount = discountCode.maxDiscountAmount;
      }
    } else {
      discountAmount = discountCode.discountValue;
    }

    // Ensure discount doesn't exceed total
    if (discountAmount > totalPrice) {
      discountAmount = totalPrice;
    }

    onApply({
      code: discountCode.code,
      amount: discountAmount,
      discountCode,
    });

    toast.success(`Discount applied! You save Rs. ${discountAmount}`);
    setIsValidating(false);
  };

  const removeDiscount = () => {
    onApply(null);
    setCode('');
    toast.info('Discount removed');
  };

  if (appliedDiscount) {
    return (
      <div className="p-4 rounded-xl border-2 border-primary/40 bg-gradient-to-r from-primary/10 to-primary/5 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full gradient-gold flex items-center justify-center shadow-gold animate-in zoom-in duration-300">
              <Check className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs text-muted-foreground uppercase tracking-wide">Code Applied</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-primary text-lg">{appliedDiscount.code}</span>
                <Badge className="gradient-gold text-primary-foreground text-xs px-2">
                  {appliedDiscount.discountCode.discountType === 'percentage' 
                    ? `${appliedDiscount.discountCode.discountValue}% OFF`
                    : `Rs. ${appliedDiscount.discountCode.discountValue} OFF`
                  }
                </Badge>
              </div>
              <p className="text-sm text-primary font-semibold mt-1">
                🎉 You save Rs. {appliedDiscount.amount}!
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={removeDiscount}
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-3 pt-3 border-t border-primary/20">
          ✓ Discount applied. Review the updated total below and confirm your booking.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        <Tag className="h-4 w-4 text-primary" />
        <span className="text-sm font-medium text-foreground">Have a discount code?</span>
      </div>
      <div className="flex gap-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          placeholder="Enter code"
          className="bg-secondary border-border font-mono uppercase"
          disabled={isValidating}
        />
        <Button
          variant="outline"
          onClick={validateCode}
          disabled={isValidating || !code.trim()}
          className="border-primary text-primary hover:bg-primary hover:text-primary-foreground min-w-[100px]"
        >
          {isValidating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            'Apply'
          )}
        </Button>
      </div>
    </div>
  );
};

export default DiscountCodeInput;
