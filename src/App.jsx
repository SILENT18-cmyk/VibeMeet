import { Heart, Sparkles } from "lucide-react";
import "./App.css";

function App() {
  return (
    <main className="welcome-page">
      <div className="glow glow-one"></div>
      <div className="glow glow-two"></div>

      <section className="welcome-card">
        <div className="logo">
          <div className="logo-heart">
            <Heart size={34} fill="currentColor" />
          </div>
        </div>

        <div className="badge">
          <Sparkles size={15} />
          <span>Real connections</span>
        </div>

        <h1>
          Meet someone
          <span> worth smiling for.</span>
        </h1>

        <p className="subtitle">
          Discover genuine people, make meaningful connections,
          and find someone who matches your vibe.
        </p>

        <div className="actions">
          <button className="primary-button">
            Create account
          </button>

          <button className="secondary-button">
            I already have an account
          </button>
        </div>

        <p className="terms">
          By continuing, you agree to our Terms & Privacy Policy.
        </p>
      </section>
    </main>
  );
}

export default App;
