'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import Link from 'next/link'
import { createRecoveryLink } from '@/auth/actions'
import { useToast } from '@/hooks/use-toast'



export default function AccountRecoveryForm({borderless, className}) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast()


  function resetForm() {
    setEmail('');
    setError('');
    setLoading(false)
  }

  const handleMagicLinkRequest = async(e) => {
    e.preventDefault()
    setLoading(true);
    
    const resultError = await createRecoveryLink( email ) 

    if (resultError) {
      setError(resultError.message)
      setLoading(false)
      return
    }

    toast({
      title: "Recovery link sent!",
      description: "A magic link has been sent to your verified email address. Please login to recover your account"
    })


    resetForm()
  }


  return (
    <Card className={`w-full max-w-md ${borderless && "border-none shadow-none bg-background" }  max-md:border-none  max-md:shadow-none  max-md:bg-background mx-auto ${className && className}`}>
        <CardHeader className="space-y-1">
          <Link href={"/"} className='mx-auto mb-4 mt-2'>
            <Image height={60} width={60} src="/icon.png" alt="logo" /> 
          </Link>
          <CardTitle className="text-2xl font-bold text-center">
            Account {` `}        
            <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
              Recovery
            </span>
          </CardTitle>
          <CardDescription className="text-center">
            Provide your verified email address. We will send a magic link to help you login!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">

          <form className='space-y-4' onSubmit={handleMagicLinkRequest}>
            {error && <p className='text-xs text-destructive dark:text-red-500 text-center'>{error}</p>}
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="m@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            <div>
              <Button disabled={loading} type="submit" size="lg" className="w-full">
                {loading ? "Processing..." : "Get Magic Link"}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm mt-4">
            Aready recovered your account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>

        </CardContent>
        <CardFooter>
          <p className="text-xs text-center text-muted-foreground w-full">
            By clicking continue, you agree to our{" "}
            <Link href="#" className="underline hover:text-primary">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-primary">
              Privacy Policy
            </Link>
            .
          </p>
        </CardFooter>
    </Card>
  )
}