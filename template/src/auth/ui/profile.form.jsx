"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { PasswordInput } from "@/auth/ui/password-input"
import { checkPasswordStrength } from "@/auth/utils"
import { useToast } from "@/hooks/use-toast"
import { deleteProfile, upsertCredentials } from "@/auth/actions"

export function PasswordResetForm() {
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


  let passwordScore = checkPasswordStrength(newPassword);


  const handlePasswordReset = async(e) => {
    e.preventDefault()

    setLoading(true);

    if (passwordScore < 3) {
      toast({
        title: "Password is too weak!",
        description: "Add numbers, special characters, and a minimum of 8 characters with capital letters",
        variant: "destructive"
      })
      setLoading(false)
      return
    }

    if (newPassword !== confirmPassword) {
      toast({
        title: "Password do not match",
        description: "Please make sure the confirmed password matches with the new password",
        variant: "destructive"
      })
      setLoading(false)
      return
    }
    
    const resultError = await upsertCredentials(newPassword);

    if (resultError) {
      toast({
        title: "Something went wrong!",
        description: resultError.message,
        variant: "destructive"
      })
      setLoading(false)
      return
    }

    toast({
      title: 'Password updated!',
      description: 'Your password has been successfully updated.',
    });

    setNewPassword("")
    setConfirmPassword("")
    setLoading(false)
  }



  return (
    <form onSubmit={handlePasswordReset} className="mx-2 space-y-4">
      <div className="space-y-2">
        <Label htmlFor="new-password">New Password</Label>
        <PasswordInput
          id="new-password"
          value={newPassword}
          passwordScore={passwordScore}
          onChange={(e) => setNewPassword(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirm-password">Confirm New Password</Label>
        <PasswordInput
          id="confirm-password"
          value={confirmPassword}
          passwordScore={null}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
      </div>
      {(newPassword && confirmPassword && newPassword === confirmPassword) && (
        <div className="flex gap-2 justify-end items-center">
          <Button 
            onClick={() => {
              setNewPassword("");
              setConfirmPassword("")
            }}
            type="button" variant="outline" disabled={loading}
          >
            Cancel
          </Button>
          <Button  disabled={loading} type="submit">
            Create Credentials
          </Button>
        </div>
      )}
    </form>
  )
}


export function DangerZoneForm({ user}) {
  const [deleteConfirmEmail, setDeleteConfirmEmail] = useState("")
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();


  const handleAccountDeletion = async (e) => {
    e.preventDefault(); 

    setLoading(true);
    
    const resultError = await deleteProfile();

    if (resultError) {
      toast({
        title: "Something went wrong!",
        description: resultError.message,
        variant: "destructive"
      })
      setLoading(false)
      return
    }

    toast({
      title: 'Account Deleted',
      description: 'Your account has been successfully deleted.',
    });

    setLoading(false)
  };

  return(
    <form onSubmit={handleAccountDeletion} className="space-y-4 px-2 mt-6">
      <div className="space-y-2">
        <Label htmlFor="delete-confirm-email">Confirm your email address to delete</Label>
        <Input
          id="delete-confirm-email"
          autoComplete="off"
          type="email"
          onPaste={(e) => e.preventDefault()} 
          value={deleteConfirmEmail}
          onChange={(e) => setDeleteConfirmEmail(e.target.value)}
          required
          placeholder="Enter your email address"
        />
      </div>
      {(deleteConfirmEmail && deleteConfirmEmail === user?.email) && (
        <div className="flex gap-2 justify-end items-center">
          <Button disabled={loading}
            onClick={() => {setDeleteConfirmEmail("")}}
            type="button" variant="outline"
          >
            Cancel
          </Button>
          <Button disabled={loading} type="submit" variant="destructive">
            Delete Account
          </Button>
        </div>
      )}
    </form>
  )
}