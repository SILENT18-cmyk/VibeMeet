import { useState } from "react";
import { ArrowLeft, ArrowRight, Heart } from "lucide-react";
import "./App.css";

function App() {
  const [screen, setScreen] = useState("welcome");

  const [form, setForm] = useState({
    name: "",
    birthday: "",
    gender: "",
    interestedIn: "",
  });

  const updateForm = (field, value) => {
    setForm({
      ...form,
      [field]: value,
    });
  };

  if (screen === "welcome") {
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
            <span>✨</span>
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
            <button
              className="primary-button"
              onClick={() => setScreen("signup")}
            >
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

  return (
    <main className="signup-page">
      <div className="signup-glow"></div>

      <section className="signup-card">
        <button
          className="back-button"
          onClick={() => setScreen("welcome")}
        >
          <ArrowLeft size={20} />
        </button>

        <div className="signup-header">
          <div className="small-logo">
            <Heart size={24} fill="currentColor" />
          </div>

          <p className="step-text">Step 1 of 4</p>

          <h1>Let's get to know you.</h1>

          <p>
            Tell us a little about yourself so we can help you find
            your perfect vibe.
          </p>
        </div>

        <div className="form">
          <label>
            What should we call you?
          </label>

          <input
            type="text"
            placeholder="Your first name"
            value={form.name}
            onChange={(e) => updateForm("name", e.target.value)}
          />

          <label>
            When's your birthday?
          </label>

          <input
            type="date"
            value={form.birthday}
            onChange={(e) => updateForm("birthday", e.target.value)}
          />

          <label>
            What's your gender?
          </label>

          <div className="choice-grid">
            {["Woman", "Man", "Non-binary"].map((option) => (
              <button
                key={option}
                className={
                  form.gender === option
                    ? "choice active"
                    : "choice"
                }
                onClick={() => updateForm("gender", option)}
              >
                {option}
              </button>
            ))}
          </div>

          <label>
            Who are you interested in?
          </label>

          <div className="choice-grid">
            {["Women", "Men", "Everyone"].map((option) => (
              <button
                key={option}
                className={
                  form.interestedIn === option
                    ? "choice active"
                    : "choice"
                }
                onClick={() => updateForm("interestedIn", option)}
              >
                {option}
              </button>
            ))}
          </div>

          <button className="continue-button">
            Continue
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </main>
  );
}

export default App;
