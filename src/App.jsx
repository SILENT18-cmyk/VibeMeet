import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight, Heart, Sparkles, Gamepad2, MessageCircle, User, Bell, Compass } from "lucide-react";
import { supabase } from "./supabase";
import "./App.css";

function HomeScreen({ selectedCountry, setSelectedCountry, selectedLanguage, setSelectedLanguage, setScreen }) {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [swipeStart, setSwipeStart] = useState(null);
  const [swipeOffset, setSwipeOffset] = useState(0);
const [showLocationMenu, setShowLocationMenu] = useState(false);
const [countrySearch, setCountrySearch] = useState("");

  const languages = [
    "English",
    "Spanish",
    "French",
    "Portuguese",
    "Arabic",
    "German",
    "Italian",
    "Dutch",
    "Russian",
    "Chinese",
    "Japanese",
    "Korean",
    "Hindi",
    "Turkish",
    "Swahili",
    "Yoruba",
    "Igbo",
    "Hausa",
  ];

  const countries = [
  "Any country",
  "Afghanistan",
  "Albania",
  "Algeria",
  "Andorra",
  "Angola",
  "Antigua and Barbuda",
  "Argentina",
  "Armenia",
  "Australia",
  "Austria",
  "Azerbaijan",
  "Bahamas",
  "Bahrain",
  "Bangladesh",
  "Barbados",
  "Belarus",
  "Belgium",
  "Belize",
  "Benin",
  "Bolivia",
  "Bosnia and Herzegovina",
  "Botswana",
  "Brazil",
  "Brunei",
  "Bulgaria",
  "Burkina Faso",
  "Burundi",
  "Cambodia",
  "Cameroon",
  "Canada",
  "Cape Verde",
  "Central African Republic",
  "Chad",
  "Chile",
  "China",
  "Colombia",
  "Comoros",
  "Congo",
  "Costa Rica",
  "Croatia",
  "Cuba",
  "Cyprus",
  "Czech Republic",
  "Denmark",
  "Djibouti",
  "Dominica",
  "Dominican Republic",
  "Ecuador",
  "Egypt",
  "El Salvador",
  "Equatorial Guinea",
  "Eritrea",
  "Estonia",
  "Eswatini",
  "Ethiopia",
  "Fiji",
  "Finland",
  "France",
  "Gabon",
  "Gambia",
  "Georgia",
  "Germany",
  "Ghana",
  "Greece",
  "Grenada",
  "Guatemala",
  "Guinea",
  "Guinea-Bissau",
  "Guyana",
  "Haiti",
  "Honduras",
  "Hungary",
  "Iceland",
  "India",
  "Indonesia",
  "Iran",
  "Iraq",
  "Ireland",
  "Israel",
  "Italy",
  "Jamaica",
  "Japan",
  "Jordan",
  "Kazakhstan",
  "Kenya",
  "Kiribati",
  "Kuwait",
  "Kyrgyzstan",
  "Laos",
  "Latvia",
  "Lebanon",
  "Lesotho",
  "Liberia",
  "Libya",
  "Liechtenstein",
  "Lithuania",
  "Luxembourg",
  "Madagascar",
  "Malawi",
  "Malaysia",
  "Maldives",
  "Mali",
  "Malta",
  "Marshall Islands",
  "Mauritania",
  "Mauritius",
  "Mexico",
  "Micronesia",
  "Moldova",
  "Monaco",
  "Mongolia",
  "Montenegro",
  "Morocco",
  "Mozambique",
  "Myanmar",
  "Namibia",
  "Nauru",
  "Nepal",
  "Netherlands",
  "New Zealand",
  "Nicaragua",
  "Niger",
  "Nigeria",
  "North Korea",
  "North Macedonia",
  "Norway",
  "Oman",
  "Pakistan",
  "Palau",
  "Palestine",
  "Panama",
  "Papua New Guinea",
  "Paraguay",
  "Peru",
  "Philippines",
  "Poland",
  "Portugal",
  "Qatar",
  "Romania",
  "Russia",
  "Rwanda",
  "Saint Lucia",
  "Samoa",
  "San Marino",
  "Saudi Arabia",
  "Senegal",
  "Serbia",
  "Seychelles",
  "Sierra Leone",
  "Singapore",
  "Slovakia",
  "Slovenia",
  "Solomon Islands",
  "Somalia",
  "South Africa",
  "South Korea",
  "South Sudan",
  "Spain",
  "Sri Lanka",
  "Sudan",
  "Suriname",
  "Sweden",
  "Switzerland",
  "Syria",
  "Taiwan",
  "Tajikistan",
  "Tanzania",
  "Thailand",
  "Timor-Leste",
  "Togo",
  "Tonga",
  "Trinidad and Tobago",
  "Tunisia",
  "Turkey",
  "Turkmenistan",
  "Tuvalu",
  "Uganda",
  "Ukraine",
  "United Arab Emirates",
  "United Kingdom",
  "United States",
  "Uruguay",
  "Uzbekistan",
  "Vanuatu",
  "Vatican City",
  "Venezuela",
  "Vietnam",
  "Yemen",
  "Zambia",
  "Zimbabwe",
];

  useEffect(() => {
    const loadProfiles = async () => {
      setLoading(true);
      setErrorMessage("");

      const { data: userData } = await supabase.auth.getUser();
      const currentUserId = userData?.user?.id;

      let query = supabase
        .from("profiles")
.select("id, name, birthday, gender, interested_in, photo_url, bio, country, city, interests")
        .order("created_at", { ascending: false });

      if (currentUserId) {
        query = query.neq("id", currentUserId);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Could not load profiles:", error);
        setErrorMessage(error.message);
        setProfiles([]);
      } else {
        setProfiles(data || []);
      }

      setLoading(false);
    };

    loadProfiles();
  }, []);

  const currentProfile = profiles[currentIndex];

  const calculateAge = (birthday) => {
    if (!birthday) return "";
    
    const birthDate = new Date(birthday);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
      monthDifference < 0 ||
      (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    return age;
  };

const handleTouchStart = (event) => {
  setSwipeStart(event.touches[0].clientX);
};

const handleTouchMove = (event) => {
  if (swipeStart === null) return;

  const currentX = event.touches[0].clientX;
  setSwipeOffset(currentX - swipeStart);
};

const handleSwipe = async (action) => {
  const currentProfile = profiles[currentIndex];

  if (!currentProfile) return;

  const { data: userData } = await supabase.auth.getUser();
  const currentUserId = userData?.user?.id;

  if (!currentUserId) {
    console.error("No logged-in user found.");
    nextProfile();
    return;
  }

  const { error } = await supabase
    .from("swipes")
    .insert({
      user_id: currentUserId,
      profile_id: currentProfile.id,
      action: action,
    });

  if (error) {
    console.error("Could not save swipe:", error);
  }

  nextProfile();
};

const handleTouchEnd = () => {
  if (Math.abs(swipeOffset) > 80) {
    if (swipeOffset < 0) {
      handleSwipe("pass");
    } else {
      handleSwipe("like");
    }
  }

  setSwipeStart(null);
  setSwipeOffset(0);
};

  const nextProfile = () => {
    if (profiles.length === 0) return;

    setCurrentIndex((currentIndex + 1) % profiles.length);
  };

  const previousProfile = () => {
    if (profiles.length === 0) return;

    setCurrentIndex(
      (currentIndex - 1 + profiles.length) % profiles.length
    );
  };

  return (
    <main className="home-page">
      <div className="home-container">

        <div className="home-top">
          <div className="home-brand">
            VibeMeet <strong>❤️</strong>
          </div>

          <button className="icon-button" aria-label="Notifications">
            <Bell size={21} />
          </button>
        </div>

        <div className="discover-heading">
          <p>Good to see you 👋</p>
          <h1>Find your vibe.</h1>
          <span>Discover people who match your energy.</span>
        </div>

<div className="location-section">
  <button
    className="location-button"
    onClick={() => setShowLocationMenu(!showLocationMenu)}
  >
    📍 {selectedCountry}
    <span>⌄</span>
  </button>

  {showLocationMenu && (
    <div className="location-menu">
      <div className="location-menu-title">
        🌍 Explore by location
      </div>

<input
  type="text"
  className="country-search"
  placeholder="🔎 Search country..."
  value={countrySearch}
  onChange={(event) => setCountrySearch(event.target.value)}
/>

{countries
  .filter((country) =>
    country.toLowerCase().includes(countrySearch.toLowerCase())
  )
  .map((country) => (
        <button
          key={country}
          className={
            selectedCountry === country
              ? "country-option active"
              : "country-option"
          }
          onClick={() => {
            setSelectedCountry(country);
            setShowLocationMenu(false);
          }}
        >
          {country === "Any country" ? "🌎" : "🌍"} {country}
          {selectedCountry === country && <span>✓</span>}
        </button>
      ))}

      <div className="language-selector">
        <div className="location-menu-title">
          🗣️ Your language
        </div>

        <select
          className="language-select"
          value={selectedLanguage}
          onChange={(event) => setSelectedLanguage(event.target.value)}
        >
          {languages.map((language) => (
            <option key={language} value={language}>
              {language}
            </option>
          ))}
        </select>
      </div>
    </div>
  )}
</div>

        {loading ? (
          <section className="profile-card">
            <div className="profile-photo">
              <div className="profile-placeholder">V</div>
            </div>

            <div className="profile-info">
              <h2>Finding your vibes...</h2>
              <p>Looking for people on VibeMeet.</p>
            </div>
          </section>
        ) : errorMessage ? (
          <section className="profile-card">
            <div className="profile-info">
              <h2>Something went wrong</h2>
              <p>{errorMessage}</p>
            </div>
          </section>
        ) : !currentProfile ? (
          <section className="profile-card">
            <div className="profile-photo">
              <div className="profile-placeholder">❤️</div>
            </div>

            <div className="profile-info">
              <h2>No new profiles yet</h2>
              <p>Invite more people to join VibeMeet.</p>
            </div>
          </section>
        ) : (
<section
  className="profile-card"
  onTouchStart={handleTouchStart}
  onTouchMove={handleTouchMove}
  onTouchEnd={handleTouchEnd}
  style={{
  transform: `translateX(${swipeOffset}px) rotate(${swipeOffset * 0.04}deg) scale(${1 - Math.min(Math.abs(swipeOffset) / 1200, 0.06)})`,
  opacity: 1 - Math.min(Math.abs(swipeOffset) / 900, 0.15),
  transition: swipeStart === null ? "transform 0.3s ease, opacity 0.3s ease" : "none",
}}
>
{swipeOffset > 30 && (
  <div className="swipe-label like-label">❤️ LIKE</div>
)}

{swipeOffset < -30 && (
  <div className="swipe-label pass-label">✕ PASS</div>
)}
  
        
<div className="profile-photo">
  {currentProfile.photo_url ? (
    <img
      src={currentProfile.photo_url}
      alt={currentProfile.name || "VibeMeet member"}
      className="profile-image"
    />
  ) : (
    <div className="profile-placeholder">
      {(currentProfile.name || "V").charAt(0).toUpperCase()}
    </div>
  )}

  <div className="profile-photo-overlay">
    <div className="profile-stat">
      👤 {currentProfile.name || "Member"}
    </div>

    <div className="profile-stat">
      ❤️ VibeMeet
    </div>

    {currentProfile.city && (
      <div className="profile-stat">
        📍 {currentProfile.city}
      </div>
    )}
  </div>

  <div className="online-badge">
    <span></span> On VibeMeet
  </div>
</div>

            <div className="profile-info">
              <div>
                <h2>
                  {currentProfile.name || "VibeMeet Member"}{" "}
                  <span>✓</span>
                </h2>

                <p>
                  {calculateAge(currentProfile.birthday)
                    ? calculateAge(currentProfile.birthday) + " years old"
                    : "New here"}{" "}
                  • {currentProfile.gender || "VibeMeet member"}
                </p>
              </div>

              <div className="vibe-tags">
                <span>✨ Friendly</span>
                <span>💬 Chatty</span>
                <span>❤️ Open to connect</span>
              </div>
            </div>

            <div className="profile-counter">
  {currentIndex + 1} of {profiles.length}
</div>

            <div className="profile-actions">
              <button
                className="pass-button"
                onClick={() => handleSwipe("pass")}
                aria-label="Previous profile"
              >
                <ArrowLeft size={24} />
              </button>

              <button
                className="like-button"
                aria-label="Like profile"
onClick={() => handleSwipe("like")}              >
                <Heart size={27} fill="currentColor" />
              </button>

              <button
                className="next-button"
                onClick={nextProfile}
                aria-label="Next profile"
              >
                <ArrowRight size={24} />
              </button>
            </div>

          </section>
        )}

        <div className="section-title">
          <div>
            <h3>Explore VibeMeet</h3>
            <p>More ways to connect</p>
          </div>
          <Sparkles size={22} />
        </div>

        <div className="quick-actions">

          <button className="feature-card">
            <div className="feature-icon">
              <Compass size={25} />
            </div>
            <h3>Discover</h3>
            <p>Meet people who match your vibe.</p>
          </button>

          <button className="feature-card">
            <div className="feature-icon">
              <Gamepad2 size={25} />
            </div>
            <h3>Vibe Games</h3>
            <p>Have fun while meeting someone new.</p>
          </button>

          <button className="feature-card">
            <div className="feature-icon">
              <Sparkles size={25} />
            </div>
            <h3>VibeMate</h3>
            <p>Your AI companion for dating and conversations.</p>
          </button>

          <button className="feature-card">
            <div className="feature-icon">
              <MessageCircle size={25} />
            </div>
            <h3>Messages</h3>
            <p>Chat and build real connections.</p>
          </button>

        </div>

      </div>

      <nav className="bottom-nav">
      <button className="active">
        <Compass size={23} />
        <span>Discover</span>
      </button>

      <button onClick={() => setScreen("explore")}>
        <Search size={23} />
        <span>Explore</span>
      </button>

      <button>
        <Gamepad2 size={23} />
        <span>Games</span>
      </button>

      <button>
        <MessageCircle size={23} />
        <span>Messages</span>
      </button>

      <button>
        <User size={23} />
        <span>Profile</span>
      </button>
    </nav>

    </main>
  );
}

function ExploreScreen({
  selectedCountry,
  setSelectedCountry,
  selectedLanguage,
  setSelectedLanguage,
  setScreen,
}) {
  const [search, setSearch] = useState("");

  return (
    <div className="app-shell">
      <header className="top-bar">
        <div>
          <div className="brand">VibeMeet</div>
          <div className="tagline">Find your vibe</div>
        </div>

        <div className="explore-controls">
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
          >
            <option value="English">English</option>
            <option value="Spanish">Español</option>
            <option value="French">Français</option>
            <option value="Portuguese">Português</option>
            <option value="German">Deutsch</option>
            <option value="Italian">Italiano</option>
            <option value="Arabic">العربية</option>
          </select>

          <select
            value={selectedCountry}
            onChange={(e) => setSelectedCountry(e.target.value)}
          >
            <option value="">Any country</option>
            <option value="Nigeria">🇳🇬 Nigeria</option>
            <option value="United States">🇺🇸 United States</option>
            <option value="United Kingdom">🇬🇧 United Kingdom</option>
            <option value="Canada">🇨🇦 Canada</option>
            <option value="Spain">🇪🇸 Spain</option>
            <option value="France">🇫🇷 France</option>
            <option value="Germany">🇩🇪 Germany</option>
            <option value="Italy">🇮🇹 Italy</option>
            <option value="Brazil">🇧🇷 Brazil</option>
            <option value="South Africa">🇿🇦 South Africa</option>
            <option value="Ghana">🇬🇭 Ghana</option>
            <option value="Kenya">🇰🇪 Kenya</option>
          </select>
        </div>
      </header>

      <main className="explore-page">
        <div className="explore-heading">
          <h1>Explore</h1>
          <p>
            {selectedCountry
              ? `Discover people in ${selectedCountry}`
              : "Discover people from anywhere"}
          </p>
        </div>

        <input
          className="country-search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search people..."
        />

        <div className="explore-empty">
          <div className="explore-icon">💜</div>
          <h2>People are waiting to meet you</h2>
          <p>
            Your Explore feed is ready. More profiles will appear here as
            people join VibeMeet.
          </p>
        </div>
      </main>

      <nav className="bottom-nav">
        <button onClick={() => setScreen("home")}>
          <Compass size={23} />
          <span>Discover</span>
        </button>

        <button className="active">
          <Search size={23} />
          <span>Explore</span>
        </button>

        <button>
          <Gamepad2 size={23} />
          <span>Games</span>
        </button>

        <button>
          <MessageCircle size={23} />
          <span>Messages</span>
        </button>

        <button>
          <User size={23} />
          <span>Profile</span>
        </button>
      </nav>
    </div>
  );
}

function App() {
  const [screen, setScreen] = useState(() => localStorage.getItem("vibemeet_screen") || "welcome");
  const [signupStep, setSignupStep] = useState(1);

  const [selectedCountry, setSelectedCountry] = useState(
    () => localStorage.getItem("vibemeet_country") || ""
  );

  const [selectedLanguage, setSelectedLanguage] = useState(
    () => localStorage.getItem("vibemeet_language") || "English"
  );

  useEffect(() => {
    if (selectedCountry) {
      localStorage.setItem("vibemeet_country", selectedCountry);
    }
  }, [selectedCountry]);

  useEffect(() => {
    localStorage.setItem("vibemeet_language", selectedLanguage);
  }, [selectedLanguage]);

const [form, setForm] = useState({
  name: "",
  birthday: "",
  gender: "",
  interestedIn: "",
  email: "",
  password: "",
});

const updateForm = (field, value) => {
  setForm({
    ...form,
    [field]: value,
  });
};

const createAccount = async () => {
  if (!form.name || !form.birthday || !form.gender || !form.interestedIn) {
    alert("Please complete your profile information first.");
    setSignupStep(1);
    return;
  }

  if (!form.email || !form.password) {
    alert("Please enter your email and password.");
    return;
  }

  if (form.password.length < 8) {
    alert("Your password must be at least 8 characters.");
    return;
  }

const { data, error } = await supabase.auth.signUp({
  email: form.email,
  password: form.password,
  options: {
    data: {
      name: form.name,
      birthday: form.birthday,
      gender: form.gender,
      interestedIn: form.interestedIn,
    },
  },
});

  if (error) {
    alert(error.message);
    return;
  }

  if (!data.user) {
    alert("Account could not be created.");
    return;
  }

alert("VibeMeet account created successfully! ❤️");
  setSignupStep(3);
};


  if (screen === "explore") {
    return (
      <ExploreScreen
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        setScreen={setScreen}
      />
    );
  }

  if (screen === "home") {
    return (
      <HomeScreen
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
        selectedLanguage={selectedLanguage}
      />
    );
  }

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
              onClick={() => { localStorage.removeItem("vibemeet_screen"); setScreen("signup"); setSignupStep(1); }}
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

      {signupStep === 1 ? (
        <>
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
            <label>What should we call you?</label>

            <input
              type="text"
              placeholder="Your first name"
              value={form.name}
              onChange={(e) => updateForm("name", e.target.value)}
            />

            <label>When's your birthday?</label>

            <input
              type="date"
              value={form.birthday}
              onChange={(e) => updateForm("birthday", e.target.value)}
            />

            <label>What's your gender?</label>

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

            <label>Who are you interested in?</label>

            <div className="choice-grid">
              {["Women", "Men", "Everyone"].map((option) => (
                <button
                  key={option}
                  className={
                    form.interestedIn === option
                      ? "choice active"
                      : "choice"
                  }
                  onClick={() =>
                    updateForm("interestedIn", option)
                  }
                >
                  {option}
                </button>
              ))}
            </div>

            <button
              className="continue-button"
              onClick={() => setSignupStep(2)}
            >
              Continue
              <ArrowRight size={20} />
            </button>
          </div>
        </>
      ) : signupStep === 2 ? (
        <>
          <div className="signup-header">
            <div className="small-logo">
              <Heart size={24} fill="currentColor" />
            </div>

            <p className="step-text">Step 2 of 4</p>

            <h1>Create your account.</h1>

            <p>
              Use your email and a password to secure your VibeMeet
              account.
            </p>
          </div>

          <div className="form">
            <label>Email address</label>

            <input
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => updateForm("email", e.target.value)}
            />

            <label>Password</label>

            <input
              type="password"
              placeholder="At least 8 characters"
              value={form.password}
              onChange={(e) =>
                updateForm("password", e.target.value)
              }
            />

            <button
              className="continue-button"
              onClick={createAccount}
            >
              Create account
              <ArrowRight size={20} />
            </button>
          </div>
        </>
      ) : signupStep === 3 ? (
        <>
          <div className="signup-header">
            <div className="small-logo">
              <Heart size={24} fill="currentColor" />
            </div>

            <p className="step-text">Step 3 of 4</p>

            <h1>Add your profile photo.</h1>

            <p>
              Let people see the real you. You can add your photo now
              or skip this step and add one later.
            </p>
          </div>

          <div className="form">
            <div className="photo-placeholder">
              <Heart size={42} />
            </div>

            <button
              className="continue-button"
              onClick={() => setSignupStep(4)}
            >
              Continue
              <ArrowRight size={20} />
            </button>

            <button
              className="secondary-button"
              onClick={() => setSignupStep(4)}
            >
              Skip for now
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="signup-header">
            <div className="small-logo">
              <Heart size={24} fill="currentColor" />
            </div>

            <p className="step-text">Step 4 of 4</p>

            <h1>Tell us about you.</h1>

            <p>
              Add a little about yourself so people can get to know
              your vibe.
            </p>
          </div>

          <div className="form">
            <label>About you</label>

            <textarea
              placeholder="Write something about yourself..."
              rows="5"
            />

            <button
              className="continue-button"
              onClick={() => { localStorage.setItem("vibemeet_screen", "home"); setScreen("home"); }}
            >
              Finish
              <Heart size={20} fill="currentColor" />
            </button>
          </div>
        </>
      )}
    </section>
  </main>
  );
}

export default App;
