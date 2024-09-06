'use client'

import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/shadcn";


const PasswordInput = React.forwardRef(({ className, passwordScore, ...props }, ref) => {
  const [showPassword, setShowPassword] = React.useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div>
      <div className="relative">
        <input
          type={showPassword ? "text" : "password"}
          className={cn(
            "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          ref={ref}
          {...props}
        />
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className="absolute outline-none inset-y-0 right-0 flex items-center pr-3"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>


      {(passwordScore !== null && passwordScore !== 0) && (
        <div className="mt-2">
          <div className="flex gap-2">
            <div className={`flex-1 h-1 rounded-full ${passwordScore > 0 ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex-1 h-1 rounded-full ${passwordScore > 1 ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex-1 h-1 rounded-full ${passwordScore > 2 ? "bg-primary" : "bg-muted"}`} />
            <div className={`flex-1 h-1 rounded-full ${passwordScore > 3 ? "bg-primary" : "bg-muted"}`} />
          </div>
        </div>
      )}
    
    </div>
  );
});
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };