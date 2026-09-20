 "use client";
import { createBrowserClient } from "@supabase/ssr";

export default function SignIn() {
  const signIn = async () => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    );
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback` }
    });
  };
  return <section className="card login"><div className="hero"><small>AI MARKET WORKSPACE</small><h1>Analyze charts with SMC Trade</h1><p>One account, daily free analyses, paid credits, structured trade plans and signal history.</p><button className="google" onClick={signIn}>Continue with Google</button><p className="tiny">No phone-number account required.</p></div></section>;
}
