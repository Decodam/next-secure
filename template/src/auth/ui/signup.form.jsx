'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import Image from 'next/image'
import Link from 'next/link'
import { PasswordInput } from '@/auth/ui/password-input' 
import { checkPasswordStrength } from '@/auth/utils'
import { createNewAccountLink } from '@/auth/actions'
import OauthButtons from './oauthButtons'
import { useToast } from '@/hooks/use-toast'




export default function SignupForm({borderless, className}) {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [next, setNext] = useState(null);
  const { toast } = useToast();


  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const nextUrl = params.get('next');
      const oauthError = params.get('error');

      if (oauthError === "OAuthAccountNotLinked") {
        setError("This OAuth provider is not yet linked to your account! Please login with a connected provider to connect and use it.");
      }

      if(nextUrl) {
        setNext(nextUrl)
      }
    }
  }, [])
  

  function resetForm() {
    setFullName('')
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setError('')
    setLoading(false)
  }

  let passwordScore = checkPasswordStrength(password);

  const handleEmailSignUp = async(e) => {
    e.preventDefault()
    setLoading(true);
    
    if (passwordScore < 3) {
      setError("Password is too weak! Add numbers, special characters, and a minimum of 8 characters with capital letters.")
      setLoading(false)
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match!")
      setLoading(false)
      return
    }


    const resultError = await createNewAccountLink( email, fullName, password ) 


    if (resultError) {
      setError(resultError.message)
      setLoading(false)
      return
    }

    toast({
      title: "Verificaion link sent!",
      description: "A verification magic link has been sent to your email address. Please login to verify and activate your account"
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
            Create your {` `}        
            <span className="bg-gradient-to-r from-green-400 via-green-500 to-green-600 bg-clip-text text-transparent">
              Account
            </span>
          </CardTitle>
          <CardDescription className="text-center">
            Create an account to get started
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <form className='space-y-4' onSubmit={handleEmailSignUp}>
            {error && <p className='text-xs text-destructive dark:text-red-500 text-center'>{error}</p>}
            <div className="space-y-1">
              <Label htmlFor="full-name">Full Name</Label>
              <Input 
                id="full-name" 
                type="text" 
                placeholder="John Doe" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required 
              />
            </div>
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
            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <PasswordInput
                id="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                passwordScore={passwordScore}
                required 
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <PasswordInput 
                id="confirm-password" 
                placeholder="Confirm your password" 
                value={confirmPassword}
                passwordScore={null}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required 
              />
            </div>
            <div>
              <Button disabled={loading} type="submit" size="lg" className="w-full">
                {loading ? "Processing..." : "Continue with Email"}
              </Button>
            </div>
          </form>
          <div className="text-center text-sm mt-4">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline">
              Login
            </Link>
          </div>

          <OauthButtons nextUrl={next} />
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