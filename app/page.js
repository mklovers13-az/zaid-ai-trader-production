import { createClient } from "@/lib/supabase/server";
import SignIn from "./signin";

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <main className="shell">
      <div className="brand"><div className="logo">Z</div><div><b>SMC Trade</b><span>TRADER</span></div></div>
      {!user ? <SignIn /> : <Dashboard user={user} />}
    </main>
  );
}

function Dashboard({ user }) {
  return (
    <section className="card">
      <div className="topline"><div><small>Signed in</small><h1>SMC Trade</h1><p>{user.email}</p></div><form action="/auth/signout" method="post"><button className="ghost">Sign out</button></form></div>
      <div className="credits" id="credits">Loading credits…</div>
      <div className="upload">
        <h2>Image Upload Analysis</h2>
        <p>Upload a chart screenshot, choose the market and timeframe, then run the analysis.</p>
        <form action="/api/analyze" method="post" encType="multipart/form-data">
          <div className="row"><select name="symbol" defaultValue="XAU/USD"><option>XAU/USD</option><option>BTC/USD</option><option>EUR/USD</option><option>GBP/USD</option><option>USD/JPY</option></select><select name="timeframe" defaultValue="15m"><option>1m</option><option>5m</option><option>15m</option><option>1H</option><option>4H</option><option>1D</option></select></div>
          <input type="file" name="chart" accept="image/png,image/jpeg,image/webp" required />
          <button className="primary">Analyze chart</button>
        </form>
      </div>
      <div className="plans"><div><b>Free</b><p>6 image analyses per day</p></div><div><b>Paid credits</b><p>Purchase credits / subscription when billing is connected.</p></div></div>
      <p className="disclaimer">Analysis is informational and experimental. AI confidence is not a guaranteed probability of profit. Test signals before using real money.</p>
      <script dangerouslySetInnerHTML={{__html:`fetch('/api/credits').then(r=>r.json()).then(x=>{document.getElementById('credits').textContent='Available today: '+x.remaining})`}} />
    </section>
  );
}
