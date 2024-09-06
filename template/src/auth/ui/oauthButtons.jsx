"use client"
import { Button } from "@/components/ui/button";
import { OAuthProviders } from "@/auth/providers";
import { LoginWithOAuthProvider } from "@/auth/actions";


export default function OauthButtons({handleClick, nextUrl, formBelow}) {
  if (!OAuthProviders || OAuthProviders.length === 0) return;

  const handleOauthLogin = async(provider) => {
    const auth_error = await LoginWithOAuthProvider(provider, nextUrl);
    if(auth_error && !auth_error.success) {
      console.error(auth_error.message)
    }
  }

  return (
    <div className={`flex ${formBelow ? "flex-col-reverse" : "flex-col"} gap-4`}>
      <span className="flex items-center">
        <span className="h-px flex-1 bg-border"></span>
        <span className="shrink-0 text-muted-foreground text-xs px-6">Or, Continue with</span>
        <span className="h-px flex-1 bg-border"></span>
      </span>

      <div
        className={`${
          OAuthProviders.length > 4
            ? 'space-y-2'
            : `grid grid-cols-${OAuthProviders.length} gap-4`
        }`}
      >
        {OAuthProviders.map(({ provider, icon: Icon }) => (
          <Button
            onClick={() => { if(handleClick) {handleClick(provider)} else {handleOauthLogin(provider)} }}
            className="w-full space-x-2"
            variant="outline"
            size="lg"
            key={provider}
          >
            {(OAuthProviders.length < 2 || OAuthProviders.length > 4) && (
              <>
                <Icon />
                <span className="capitalize">Continue with {provider}</span>
              </>
            )}
            {OAuthProviders.length === 2 && (
              <>
                <Icon />
                <span className="capitalize">{provider}</span>
              </>
            )}
            {OAuthProviders.length > 2 && OAuthProviders.length <= 4 && <Icon />}
          </Button>
        ))}
      </div>
    </div>
  );
}