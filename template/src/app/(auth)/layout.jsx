import { redirectOnAuth } from "@/auth/session";


export default async function AuthLayout({children}) {
  await redirectOnAuth();

  return (
    <div className="py-14 container">
      {children}
    </div>
  );
}