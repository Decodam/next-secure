'use client';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LockIcon, LogOutIcon, UserIcon, XIcon } from "lucide-react";
import { deleteProvider, LoginWithOAuthProvider, logout } from "@/auth/actions";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { OAuthProviders } from "@/auth/providers";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DangerZoneForm, PasswordResetForm } from "@/auth/ui/profile.form";


export default function UserButton() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState();
  const { toast } = useToast();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const onClose = () => setIsModalOpen(false)
  const [editFormData, setEditFormData] = useState({
    fullName: "",
    profilePic: "",
  });

  const fetchUserProfile = async() => {
    setLoading(true);
    try {
      const response = await fetch('/api/user');
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.data);
        setEditFormData({
          fullName: data?.data?.name || "",
          profilePic: data?.data?.image || "",
        })
      } 
      
      if (response.status === 401) {
        setUser(null)
      }
      
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast({
        title: 'Error',
        description: 'An error occurred while fetching user data.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUserProfile()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])


  async function removeOauthProveider(provider) {
    setLoading(true);
    
    const resultError = await deleteProvider(provider);

    if (resultError) {
      toast({
        title: "Something went wrong!",
        description: resultError.message,
        variant: "destructive"
      })
      setLoading(false)
      return
    }

    await fetchUserProfile()

    toast({
      title: 'Oauth Provider Deleted',
      description: `your ${provider} account has be removed from your profile`,
    });


    setLoading(false)
  }

  async function updateUserDetails( name, image) {

    setLoading(true)
    try {
      const response = await fetch('/api/user', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, image }),
      });
  
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to update user details');
      }
  
      const data = await response.json();
      toast({
        title: 'Account succesfully updated!',
        description: data.message,
      });
      
      fetchUserProfile();
    } catch (error) {
      toast({
        title: 'Error updating user details',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }

  
  if (loading && !user) {
    return(
      <div className="bg-muted animate-pulse size-10 rounded-full" />
    )
  }



  if (user) {
    return (
      <>
        {/** Dropdown Of your user */}
        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <Avatar>
              <AvatarImage src={user.image} />
              <AvatarFallback className="uppercase">{user.name[0]}</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="m-2 min-w-52 rounded-lg">
            <DropdownMenuLabel>{user.name}</DropdownMenuLabel>
            <DropdownMenuSeparator />
    
            <DropdownMenuItem onClick={() => setIsModalOpen(true)} className="h-10 px-4 rounded-lg font-medium cursor-pointer space-x-2">
              <UserIcon size={16} /> <span>Profile</span>
            </DropdownMenuItem>
    
            {user.role === "admin" && (
              <Link href={"/admin"}>
                <DropdownMenuItem className="h-10 px-4 rounded-lg font-medium cursor-pointer space-x-2">
                  <LockIcon size={16} /> <span>Admin</span>
                </DropdownMenuItem>
              </Link>
            )}
            <button onClick={() => {logout()}} className="h-10 px-4 flex w-full text-sm items-center rounded-lg text-destructive hover:bg-destructive/10 font-medium cursor-pointer space-x-2">
              <LogOutIcon size={16} /> <span>Logout</span>
            </button>
    
          </DropdownMenuContent>
        </DropdownMenu>
      



        {/** Modal */}
        <div
          className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity ${
            isModalOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* Background Overlay */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />

          {/* Modal Content */}
          <div className="relative bg-background sm:max-h-[80svh] h-full max-w-screen-md sm:rounded-xl overflow-hidden flex flex-col sm:flex-row shadow-lg w-full sm:mx-4">
            <div className="flex-1 overflow-y-scroll p-6 scrollbar-hidden">
              {/** Modal header */}
              <div className="card-header flex justify-between">
                <div>
                  <h1 className="font-semibold text-xl">Account Settings</h1>
                  <p className="text-sm text-muted-foreground">Edit your profile and security settings below to best suit your preferences</p>
                </div>
                <Button onClick={onClose} variant="ghost" size="icon">
                  <XIcon size={20} />
                </Button>
              </div>

              <Separator className="my-4" />


              {/* Modal User Content */}
              <div className="profile-details flex items-center gap-4 py-2">
                <Avatar className="size-16">
                  <AvatarImage src={(user?.image) || "/default-user.jpg"} /> {/* you can define your own default-user. currently I am not provinding one */}
                  <AvatarFallback className="uppercase">{(user?.name[0]) || 'U'}</AvatarFallback>
                </Avatar>
                <div className="flex-1 flex items-center flex-wrap gap-2">
                  <div className="flex-1">
                    <h1 className="text-xl font-semibold">{user?.name}</h1>
                    <p className="text-sm text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <Button 
                      onClick={() => {logout()}} disabled={loading} 
                      variant="outline" size="sm"
                      className="text-destructive hover:text-destructive hover:bg-destructive/10 space-x-2"
                    >
                      <LogOutIcon size={14} /> <span>Logout</span>
                    </Button>
                  </div>
                </div>
              </div>

              <Separator className="my-4" />

              <Accordion type="single" collapsible>
                {/** Profile Settings */}
                <AccordionItem value="item-1">
                  <AccordionTrigger>Edit Profile</AccordionTrigger>
                  <AccordionContent>
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      if(user?.name !== editFormData.fullName || user?.image !== editFormData.profilePic) {
                        updateUserDetails(editFormData.fullName, editFormData.profilePic); return;
                      } else {
                        toast({
                          title: 'Account succesfully updated!',
                          description: "Your account has been updated successfully",
                        });
                        return;
                      }
                    }}>
                      {/* Edit Profile Form */}
                      <div className="edit-account space-y-2 py-2 mx-4">
                        <div className="space-y-1">
                          <Label htmlFor="full-name">Full Name</Label>
                          <Input
                            id="full-name"
                            type="text"
                            placeholder="John Doe"
                            value={editFormData.fullName}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, fullName: e.target.value })
                            }
                            required
                          />
                        </div>

                        <div className="space-y-1">
                          <Label htmlFor="profile-pic">Profile Picture URL</Label>
                          <Input
                            id="profile-pic"
                            type="text"
                            placeholder="https://example.com/profile-pic.jpg"
                            value={editFormData.profilePic}
                            onChange={(e) =>
                              setEditFormData({ ...editFormData, profilePic: e.target.value })
                            }
                          />
                        </div>
                      </div>
                      <div className="flex justify-end items-center py-2 gap-4 mx-4">
                        <Button disabled={loading} type="button"  onClick={() => {
                          setEditFormData({
                            fullName: user?.name || "",
                            profilePic: user?.image || "",
                          })
                        }} variant="outline">
                          Cancel
                        </Button>
                        <Button disabled={loading} type="submit">
                          Save Changes
                        </Button>
                      </div>
                    </form>
                  </AccordionContent>
                </AccordionItem>



                {/*** Connected Accounts */}
                <AccordionItem value="item-2">
                  <AccordionTrigger>Connected Accounts</AccordionTrigger>
                  <AccordionContent>
                    {OAuthProviders && (
                      <div className="space-y-4">
                        {/* Google Account */}
                        {OAuthProviders.map(({ provider, icon: Icon }) => (
                          <div key={provider} className="flex items-center">
                            <div className="flex flex-1 space-x-4">
                              <Icon />
                              <span className="font-medium flex items-center">{user?.accounts?.some(account => account.provider === provider) ? "Connected" : "Connect"} to {provider}</span>
                            </div>
        
                            <Button
                              disabled={loading}
                              variant="outline"
                              size="sm"
                              className={
                                user?.accounts?.some(account => account.provider === provider)
                                  ? "text-destructive hover:text-destructive hover:bg-destructive/10"
                                  : ""
                              }
                              onClick={() => {
                                if(user?.accounts?.some(account => account.provider === provider)) {
                                  removeOauthProveider(provider)
                                } else {
                                  LoginWithOAuthProvider(provider)
                                }
                              }}
                            >
                              {user?.accounts?.some(account => account.provider === provider) ? "Remove" : "Connect"}
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}
                  </AccordionContent>
                </AccordionItem>


                {/* Password Settings */}
                <AccordionItem value="item-3">
                  <AccordionTrigger>Password Settings</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm mb-4 text-muted-foreground">
                      To create your new password, please enter your new prefered password and confirm it.
                    </p>
                    <PasswordResetForm />
                  </AccordionContent>
                </AccordionItem>



                {/* Danger Zone */}

                <AccordionItem value="danger-zone">
                  <AccordionTrigger>Danger Zone</AccordionTrigger>
                  <AccordionContent>
                    <p className="text-sm text-muted-foreground">
                      Deleting your account is permanent and cannot be undone. All your data will be lost.
                    </p>
                    <DangerZoneForm user={user} />
                  </AccordionContent>
                </AccordionItem>



              </Accordion>


            </div>
          </div>
          
        </div>
      </>
    );
  }
  
}







