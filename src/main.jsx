import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import TalentScene from "./TalentScene.jsx";
import LogoParticles from "./LogoParticles.jsx";

const categories = [
  { id: "learn", name: "Education & learning", icon: "✦", tint: "violet", desc: "Learn concepts, practice, and close knowledge gaps." },
  { id: "career", name: "Skill development / career readiness", icon: "↗", tint: "blue", desc: "Build practical skills you can demonstrate to employers." },
  { id: "discover", name: "Sports & talent discovery", icon: "◎", tint: "orange", desc: "Make ability and progress visible to coaches and scouts." },
  { id: "combo", name: "Education + skills", icon: "⌘", tint: "green", desc: "Connect learning with real-world projects and assessments." },
  { id: "sportsai", name: "Sports + AI", icon: "◈", tint: "pink", desc: "Review performance videos and turn feedback into practice." },
];

const demoPeople = [
  { id: 1, name: "Ananya Rao", role: "Coach", specialty: "Cricket • Batting", location: "Hyderabad, Telangana", rating: 4.9, reviews: 42, bio: "Grassroots cricket coach helping young players build fundamentals and confidence.", tags: ["Batting", "Youth development", "Video review"], initials: "AR", color: "peach", connection: "Accepted" },
  { id: 2, name: "Kabir Shah", role: "Coach", specialty: "Football • Performance", location: "Pune, Maharashtra", rating: 4.8, reviews: 31, bio: "Focuses on decision-making, movement, and measurable player development.", tags: ["Football", "Fitness", "Tactical"], initials: "KS", color: "blue" },
  { id: 3, name: "Meera Iyer", role: "Mentor", specialty: "Coding • Career readiness", location: "Bengaluru, Karnataka", rating: 4.9, reviews: 26, bio: "Guides students from fundamentals to portfolio projects and internship readiness.", tags: ["Python", "Portfolio", "Interview prep"], initials: "MI", color: "lilac" },
  { id: 4, name: "Dev Malhotra", role: "Student", specialty: "Esports • FPS", location: "Delhi, India", rating: 4.6, reviews: 12, bio: "Tracks match performance and shares improvement clips with a team.", tags: ["FPS", "VOD review", "Team play"], initials: "DM", color: "mint", level:"Developing", evidence:"Gameplay decision · 45 sec VOD", achievement:"Team communication streak · 4 weeks" },
  { id: 5, name: "Sana Khan", role: "Student", specialty: "Robotics • Embedded systems", location: "Hyderabad, Telangana", rating: 4.7, reviews: 9, bio: "Building small robotics projects and documenting practical skills.", tags: ["Robotics", "Arduino", "Projects"], initials: "SK", color: "yellow", level:"Starter", evidence:"Line-following robot · demo clip", achievement:"Completed 3 guided builds" },
  { id: 6, name: "Aarav Menon", role: "Student", specialty: "Athlete • Cricket bowling", location: "Hyderabad, Telangana", rating: 4.8, reviews: 14, bio: "A developing fast bowler building consistency through focused practice and video review.", tags: ["Cricket", "Bowling", "Athlete"], initials: "AM", color: "blue", level:"Developing", evidence:"Cricket bowling practice · 30 sec clip", achievement:"Consistent practice · 8 sessions" },
  { id: 7, name: "Ishita Das", role: "Student", specialty: "Studies • Mathematics", location: "Bengaluru, Karnataka", rating: 4.7, reviews: 11, bio: "Enjoys breaking down difficult concepts and learning through small projects.", tags: ["Studies", "Mathematics", "Projects"], initials: "ID", color: "lilac", level:"Advanced", evidence:"Explaining algebra · 90 sec clip", achievement:"Maths practice streak · 12 days" },
  { id: 8, name: "Rohan Patel", role: "Student", specialty: "Athlete • Football", location: "Pune, Maharashtra", rating: 4.7, reviews: 8, bio: "Practices first touch, movement, and passing with his local team.", tags: ["Football", "First touch", "Team play"], initials: "RP", color: "peach", level:"Starter", evidence:"First-touch practice · demo clip", achievement:"Completed 5 team sessions" },
  { id: 9, name: "Mira Joshi", role: "Student", specialty: "Athlete • Badminton", location: "Mumbai, Maharashtra", rating: 4.8, reviews: 10, bio: "Building consistency in footwork, serve, and court recovery.", tags: ["Badminton", "Footwork", "Serve"], initials: "MJ", color: "mint", level:"Developing", evidence:"Footwork ladder · demo clip", achievement:"Practice streak · 6 sessions" },
  { id: 10, name: "Nikhil Shah", role: "Student", specialty: "Athlete • Basketball", location: "Hyderabad, Telangana", rating: 4.6, reviews: 7, bio: "Working on dribbling control, passing, and shooting form.", tags: ["Basketball", "Dribbling", "Shooting"], initials: "NS", color: "yellow", level:"Developing", evidence:"Shooting form · demo clip", achievement:"Completed beginner fundamentals" },
];

const challengeSeed = [
  { id: 1, title: "Explain a concept in 90 seconds", area: "Education & learning", kind: "Learning", xp: 120, time: "20 min", level: "Starter", detail: "Choose a concept you recently learned. Explain it in your own words and identify one example." },
  { id: 3, title: "Cricket bowling fundamentals", area: "Sports & talent discovery", kind: "Sports", xp: 180, time: "30 min", level: "Starter", detail: "Record a short run-up and delivery sequence. Review balance, rhythm, and follow-through." },
  { id: 4, title: "Learn → build: applied maths", area: "Education + skills", kind: "Integrated", xp: 200, time: "45 min", level: "Intermediate", detail: "Use a math idea to solve a real scenario and show your working." },
  { id: 5, title: "Review a gameplay decision", area: "Sports + AI", kind: "AI review", xp: 160, time: "15 min", level: "Intermediate", detail: "Upload a short gameplay clip and identify one decision you would change." },
];

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span>; }
function Avatar({ person, small = false }) { return <div className={`avatar ${person.color || "lilac"} ${small ? "small" : ""}`}>{person.initials || person.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>; }
function App() {
  const [savedApp, setSavedApp] = useState(() => { try { return JSON.parse(localStorage.getItem("talentpath-state") || "{}"); } catch { return {}; } });
  const [role, setRole] = useState(() => savedApp.role || "Student");
  const [track, setTrack] = useState(() => savedApp.track || "Studies");
  const [roleTransition, setRoleTransition] = useState("");
  const [moduleTransition, setModuleTransition] = useState("");
  const [page, setPage] = useState(() => savedApp.page || "Overview");
  const [category, setCategory] = useState("All areas");
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState(() => savedApp.completed || []);
  const [startedChallenges, setStartedChallenges] = useState(() => savedApp.startedChallenges || []);
  const [challengeProgress, setChallengeProgress] = useState(() => savedApp.challengeProgress || {});
  const [profile, setProfile] = useState(() => savedApp.profile || { name: "Alex Morgan", location: "Hyderabad, Telangana", headline: "Curious learner • Aspiring all-rounder", about: "I’m building practical skills, tracking my growth, and looking for feedback from people who can help me improve.", skills: ["Learning", "Cricket", "Python"], interests: ["Studies", "Athlete/Sports"], visibility: "Public" });
  const [people, setPeople] = useState(demoPeople);
  const [connected, setConnected] = useState(() => savedApp.connected || {});
  const [interested, setInterested] = useState(() => savedApp.interested || []);
  const [messages, setMessages] = useState(() => savedApp.messages || [{ id: 1, author: "TalentPath", text: "Welcome! Share a challenge, a learning win, or ask for feedback.", time: "Just now" }]);
  const [newPost, setNewPost] = useState("");
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [videoUrl, setVideoUrl] = useState("");
  const [analysis, setAnalysis] = useState(null);
  const [analysisStatus, setAnalysisStatus] = useState("idle");
  const [analysisMode, setAnalysisMode] = useState("Sports");
  const [videoPrompt, setVideoPrompt] = useState("Review the movement, technique, consistency, and next practice steps. Be specific and avoid claiming certainty.");
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [assessment, setAssessment] = useState(null);
  const [assessmentAnswer, setAssessmentAnswer] = useState("");
  const [toast, setToast] = useState("");
  const [saved, setSaved] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileEditorOpen, setProfileEditorOpen] = useState(false);
  const videoRef = useRef(null);

  const notify = (s) => { setToast(s); window.setTimeout(() => setToast(""), 2600); };
  const switchRole = (nextRole) => {
    if (nextRole === role || roleTransition) return;
    setRoleTransition(nextRole);
    setRole(nextRole);
    setPage("Overview");
    window.setTimeout(() => setRoleTransition(""), 1150);
  };
  const challengeList = useMemo(() => challengeSeed.filter(c => (category === "All areas" || c.area === category) && `${c.title} ${c.area} ${c.kind} ${c.detail}`.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const xp = 460 + completed.reduce((sum, id) => sum + (challengeSeed.find(c=>c.id===id)?.xp || 0), 0);
  const progress = Math.min(100, 38 + completed.length * 12);

  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);

  useEffect(() => {
    const next = { role, track, page, completed, startedChallenges, challengeProgress, profile, connected, interested, messages };
    localStorage.setItem("talentpath-state", JSON.stringify(next));
    setSavedApp(next);
  }, [role, track, page, completed, startedChallenges, challengeProgress, profile, connected, interested, messages]);

  const selectVideo = (file) => {
    if (!file) return;
    if (!file.type.startsWith("video/")) { notify("Please choose a video file."); return; }
    if (file.size > 100 * 1024 * 1024) { notify("For this prototype, choose a video under 100 MB."); return; }
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setSelectedVideo(file); setVideoUrl(URL.createObjectURL(file)); setAnalysis(null); setAnalysisStatus("idle");
  };

  async function extractFrames(video, count = 5) {
    return new Promise((resolve, reject) => {
      const el = document.createElement("video");
      el.preload = "metadata"; el.muted = true; el.src = URL.createObjectURL(video);
      el.onloadedmetadata = async () => {
        const duration = Math.max(0.5, el.duration || 1), canvas = document.createElement("canvas"), ctx = canvas.getContext("2d");
        canvas.width = 640; canvas.height = 360;
        const frames = [];
        for (let i = 0; i < count; i++) {
          const time = Math.min(Math.max(0.05, duration * ((i + 1) / (count + 1))), Math.max(0.05, duration - 0.05));
          await new Promise((r) => { el.currentTime = time; el.onseeked = r; });
          const scale = Math.min(canvas.width / el.videoWidth, canvas.height / el.videoHeight);
          const w = el.videoWidth * scale, h = el.videoHeight * scale;
          ctx.clearRect(0, 0, canvas.width, canvas.height); ctx.drawImage(el, (canvas.width-w)/2, (canvas.height-h)/2, w, h);
          frames.push(canvas.toDataURL("image/jpeg", 0.72).split(",")[1]);
        }
        URL.revokeObjectURL(el.src); resolve(frames);
      };
      el.onerror = () => reject(new Error("Couldn't read this video. Try a common MP4 or MOV file."));
    });
  }

  async function runAnalysis() {
    if (!selectedVideo) { notify("Upload a video first."); return; }
    setAnalysisStatus("analyzing"); setAnalysis(null);
    try {
      const frames = await extractFrames(selectedVideo, 5);
      const response = await fetch("/.netlify/functions/analyze-video", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ frames, category: analysisMode, prompt: videoPrompt, filename: selectedVideo.name })
      });
      if (response.ok) {
        const result = await response.json();
        if (result.analysis) { setAnalysis(result.analysis); setAnalysisStatus("done"); return; }
      }
      setAnalysis({
        score: null, label: "Demo review (AI not connected)", summary: "Your video is loaded and frames were prepared in your browser. Connect the secure AI function to receive model-generated feedback. This sample report is not an assessment of your actual performance.",
        strengths: ["Video was selected successfully", "A structured review workflow is ready"],
        improvements: ["Live AI analysis is not connected in this prototype", "Use a coach-approved rubric for this category"],
        drills: ["Record a consistent short clip from the same angle", "Repeat the selected challenge and compare your next attempt"],
        confidence: "Not evaluated"
      });
      setAnalysisStatus("demo");
    } catch (e) {
      setAnalysis({ label: "Demo review", summary: "The analysis service is not connected yet. Your clip remains local to this browser. This sample report is not an assessment of your performance.", strengths: ["Upload and local preview are working"], improvements: ["Live AI feedback is not enabled in this prototype"], drills: ["Try a short clip with a steady camera and good lighting"], confidence: "Not evaluated" });
      setAnalysisStatus("demo");
    }
  }

  const navItems = role === "Student"
    ? ["Overview", "Explore learning", "Challenges", "AI Studio", "Talent profiles", "Opportunities", "Leaderboard", "Community"]
    : ["Overview", "Learner discovery", "Review submissions", "AI Studio", "Community", "My profile"];

  useEffect(() => {
    if (!navItems.includes(page)) setPage("Overview");
  }, [role, page]);

  function doNav(item) {
    if (item === page || moduleTransition || roleTransition) return;
    setModuleTransition(item);
    setPage(item);
    setAssessment(null);
    window.setTimeout(() => setModuleTransition(""), 980);
  }
  function completeChallenge(id) { if (!completed.includes(id)) { setCompleted([...completed, id]); setStartedChallenges(prev=>prev.filter(x=>x!==id)); notify("Challenge completed! XP added to your demo profile."); } else notify("Already completed in this demo."); }
  function startChallenge(id) { if (!completed.includes(id)) { setStartedChallenges(prev=>prev.includes(id)?prev:[...prev,id]); notify("Challenge saved. Your progress will be here when you return."); } }
  function connectPerson(id) { const accepted=connected[id]==="Accepted"||people.find(x=>x.id===id)?.connection==="Accepted"; if(accepted){notify("You’re already connected.");return;} setConnected(prev=>({...prev,[id]:"Requested"})); notify(connected[id]==="Requested"?"Connection request is pending.":"Connection request sent."); }
  function addPost() { if (!newPost.trim()) return; setMessages([...messages, { id: Date.now(), author: profile.name, text: newPost.trim(), time: "Just now" }]); setNewPost(""); notify("Post shared in the demo community."); }

  const searchTargets = useMemo(() => {
    const q = query.trim().toLowerCase(); if (!q) return [];
    return [
      ...(challengeSeed.filter(c=>`${c.title} ${c.area} ${c.kind} ${c.detail}`.toLowerCase().includes(q)).length||["challenge","activity"].some(t=>q.includes(t)) ? [{ label: "Challenges", page: "Challenges", detail: "Matching activities" }] : []),
      ...(categories.some(c=>`${c.name} ${c.desc}`.toLowerCase().includes(q)) || ["math","science","history","english","coding","cricket","football","basketball","badminton","tennis","athletics","volleyball","swimming","sports","learning","studies"].some(t=>t.includes(q)||q.includes(t)) ? [{ label: "Explore learning", page: "Explore learning", detail: "Lessons and concepts" }] : []),
      ...(demoPeople.some(p=>`${p.name} ${p.specialty} ${p.tags.join(" ")} ${p.location}`.toLowerCase().includes(q)) ? [{ label: role==="Coach"?"Learner discovery":"Talent profiles", page: role==="Coach"?"Learner discovery":"Talent profiles", detail: "People and skills" }] : []),
      ...(["community","post","feedback"].some(t=>q.includes(t)) ? [{ label: "Community", page: "Community", detail: "Posts and peer feedback" }] : []),
      ...(role === "Student" && ["opportunity","clinic","mentor","showcase","internship","session"].some(t=>q.includes(t)) ? [{ label: "Opportunities", page: "Opportunities", detail: "Clinics, projects, and sessions" }] : []),
    ];
  }, [query, role]);
  function submitSearch() { if (!searchTargets.length) { notify("No matching people, lessons, or challenges yet."); return; } doNav(searchTargets[0].page); setSearchOpen(false); }

  const pageTitle = page === "Overview" ? role === "Coach" ? "Coach dashboard" : `Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, ${profile.name.split(" ")[0]}` : page;
  const pageSub = page === "Overview" ? role === "Coach" ? "Your learners, reviews, and upcoming sessions in one place." : "Your next step is one small win away." : role === "Coach" ? "A focused workspace for learner discovery, video review, and mentorship." : "A connected space to learn, practice, show progress, and find opportunities.";

  return <div className="app-shell">
    {roleTransition && <div className={`role-transition-overlay ${roleTransition.toLowerCase()}`} aria-live="polite">
      <div className="role-transition-world">
        <div className="role-transition-ring ring-a"/><div className="role-transition-ring ring-b"/><div className="role-transition-ring ring-c"/>
        <div className="role-transition-core"><span>{roleTransition === "Coach" ? "C" : "S"}</span></div>
        <div className="role-transition-particles"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div>
      </div>
      <div className="role-transition-copy"><span>WORKSPACE SHIFT</span><strong>Entering {roleTransition}<i>.</i><i>.</i><i>.</i></strong><small>{roleTransition === "Coach" ? "Discover talent. Shape potential." : "Build skills. Show your growth."}</small></div>
    </div>}
    {moduleTransition && <div className="module-portal-overlay" aria-live="polite" style={{"--module-hue-number": (["Leaderboard","Community","Overview"].includes(moduleTransition) ? 155 : ["AI Studio","Learner discovery","Talent profiles"].includes(moduleTransition) ? 190 : ["Challenges","Opportunities"].includes(moduleTransition) ? 35 : 285)}}>
      <div className="module-portal-orbit portal-orbit-one"/><div className="module-portal-orbit portal-orbit-two"/>
      <div className="module-portal-particles">{Array.from({length:34}, (_,i)=><i key={i} style={{"--particle-index":i,"--dx":`${(i-17)*13}px`,"--dy":`${(17-i)*11}px`}} />)}</div>
      <div className="module-portal-wordmark"><span className="portal-kicker">TALENTPATH / WORKSPACE</span><strong>{moduleTransition}</strong><span className="portal-subtitle">Entering module</span></div>
      <div className="module-portal-flash"/>
    </div>}
    <aside className="sidebar">
      <div className="brand"><div className="brand-mark"><LogoParticles /></div><div><strong>talent<span className="brand-slash">/</span>path</strong><small>{role === "Coach" ? "GUIDE THE NEXT GENERATION" : "GROW INTO YOUR POTENTIAL"}</small></div></div>
      <div className="role-switch"><span>Viewing as</span><div><button className={role==="Student"?"active":""} onClick={()=>switchRole("Student")}>Student</button><button className={role==="Coach"?"active":""} onClick={()=>switchRole("Coach")}>Coach</button></div></div>
      {role === "Student" && <div className="track-picker"><span>YOUR TRACK</span><select aria-label="Choose your track" value={track} onChange={e=>setTrack(e.target.value)}>{["Studies","Athlete/Sports","Gaming","Skill Development"].map(t=><option key={t}>{t}</option>)}</select></div>}
      <div className="nav-label">{role === "Coach" ? "COACH DESK" : "YOUR WORKSPACE"}</div>
      <nav>{navItems.map((item,i)=><button key={item} className={`nav-item ${page===item?"selected":""} ${item==="Community"?"community-nav":""}`} onClick={()=>doNav(item)}><span className="nav-icon">{["⌂","◌","✧","◈","◎","↗","♜","☷"][i]||"•"}</span>{item}{item==="AI Studio"&&<span className="new-pill">AI</span>}{item==="Community"&&<span className="community-label">LIVE</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">✦</div><strong>{role === "Coach" ? "Review the next learner" : "Keep growing"}</strong><p>{role === "Coach" ? "Give focused feedback and help learners improve." : "Every attempt gives you more evidence of what you can do."}</p><button onClick={()=>doNav(role==="Coach"?"Review submissions":"Explore learning")}>{role === "Coach" ? "Open review queue" : "Explore learning"} <span>→</span></button></div><div className="user-mini"><Avatar person={{name:profile.name,initials:profile.name.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"lilac"}} small/><div><strong>{profile.name}</strong><small>{role === "Coach" ? "TalentPath Coach" : `${track} learner`}</small></div><button aria-label="Edit profile" onClick={()=>setProfileEditorOpen(true)}>•••</button></div></div>
    </aside>

    <main className="main"><div className="talent-scene-layer" aria-hidden="true"><TalentScene /></div>
      <header className="topbar"><div className="crumb">{role === "Coach" ? "TalentPath Coach" : "talent/path"} <span>/</span> <b>{page}</b></div><div className="top-actions"><div className="search search-wrap"><span>⌕</span><input placeholder="Search lessons, people, challenges…" value={query} onFocus={()=>setSearchOpen(true)} onChange={e=>{setQuery(e.target.value);setSearchOpen(true)}} onKeyDown={e=>e.key==="Enter"&&submitSearch()}/><kbd>↵</kbd>{searchOpen && query.trim() && <div className="search-results">{searchTargets.length ? searchTargets.map(t=><button key={t.page} onClick={()=>{doNav(t.page);setSearchOpen(false)}}><b>{t.label}</b><small>{t.detail}</small></button>) : <span>No matches found</span>}</div>}</div><button className="icon-button" title="Notifications" aria-expanded={notificationsOpen} onClick={()=>setNotificationsOpen(v=>!v)}>♧<i/></button>{notificationsOpen&&<div className="notification-popover"><strong>Your updates</strong><button onClick={()=>{setNotificationsOpen(false);doNav(role==="Coach"?"Review submissions":"Talent profiles")}}><b>{role==="Coach"?"3 learner videos need review":"Ananya Rao accepted your request"}</b><small>Tap to open</small></button><button onClick={()=>{setNotificationsOpen(false);doNav("Community")}}><b>New community prompt</b><small>Share a small win this week</small></button></div>}<button className="top-avatar" aria-label="Edit profile" onClick={()=>setProfileEditorOpen(true)}>{profile.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</button></div></header>
      <div className="page-wrap">
        <section className={`page-heading ${role==="Coach"?"coach-heading":""}`}><div><div className="eyebrow">{role==="Student"?`${track.toUpperCase()} · YOUR PERSONAL GROWTH SPACE`:"TALENTPATH COACH · MENTOR WORKSPACE"}</div><h1>{pageTitle}</h1><p>{pageSub}</p></div></section>

        <div key={page} className="module-transition">
        {page==="Overview" && <Overview role={role} track={track} xp={xp} progress={progress} completed={completed} onNav={doNav} onComplete={completeChallenge} />}
        {page==="Explore learning" && <ExploreLearning onNav={doNav} onToast={notify} />}
        {page==="Challenges" && role==="Student" && <Challenges list={challengeList} category={category} setCategory={setCategory} completed={completed} started={startedChallenges} progress={challengeProgress} onProgress={(id,n)=>setChallengeProgress(p=>({...p,[id]:n}))} onStart={startChallenge} onComplete={completeChallenge} query={query} setQuery={setQuery} />}
        {page==="AI Studio" && <AIStudio role={role} selectedVideo={selectedVideo} videoUrl={videoUrl} analysis={analysis} analysisStatus={analysisStatus} analysisMode={analysisMode} setAnalysisMode={setAnalysisMode} videoPrompt={videoPrompt} setVideoPrompt={setVideoPrompt} selectVideo={selectVideo} runAnalysis={runAnalysis} videoRef={videoRef} />}
        {(page==="Talent profiles"||page==="Learner discovery") && <Profiles role={role} people={people} query={query} setQuery={setQuery} connected={connected} onConnect={connectPerson} onToast={notify} onNav={doNav} />}
        {page==="Opportunities" && role==="Student" && <Opportunities interested={interested} onInterest={id=>{setInterested(p=>p.includes(id)?p:[...p,id]);notify("Interest sent. This opportunity is saved in your demo updates.");}} />}
        {page==="Leaderboard" && role==="Student" && <Leaderboard xp={xp} completed={completed.length} track={track} />}
        {page==="Community" && <Community messages={messages} newPost={newPost} setNewPost={setNewPost} addPost={addPost} profile={profile} onToast={notify} />}
        {page==="My profile" && <MyPortfolio role={role} profile={profile} setProfile={setProfile} showEdit={showProfileEdit} setShowEdit={setShowProfileEdit} xp={xp} progress={progress} completed={completed} onToast={notify} />}
        {page==="Review submissions" && <ReviewSubmissions onNav={doNav} onToast={notify} />}
        </div>
      </div>
      <footer className="footer"><span>TalentPath <b>•</b> Grow into your potential</span><span>Prototype mode · Demo data</span></footer>
    </main>
    {toast && <div className="toast">✦ {toast}</div>}
    {profileEditorOpen && <ProfileEditor profile={profile} setProfile={setProfile} track={track} setTrack={setTrack} role={role} onClose={()=>setProfileEditorOpen(false)} onToast={notify} />}
  </div>;
}

function Overview({ role, track, xp, progress, completed, onNav, onComplete }) {
  const [tab,setTab] = useState("For you");
  if (role === "Coach") return <div className="coach-dashboard">
    <div className="hero-card coach-hero"><div className="hero-copy"><span className="hero-tag"><span/> TALENTPATH COACH</span><h2>Help talent<br/><em>move forward.</em></h2><p>A focused space to review learner progress and give useful next steps.</p><div className="hero-actions"><button className="white-btn" onClick={()=>onNav("Learner discovery")}>Discover learners →</button><button className="text-btn" onClick={()=>onNav("Review submissions")}>Review videos</button></div></div><div className="hero-art"><div className="art-ring"><div className="ring-inner">tp</div></div></div></div>
    <div className="stats-grid coach-stats"><Stat icon="◎" tint="violet" label="Learners to review" value="3" trend="Across your tracks"/><Stat icon="↗" tint="green" label="New requests" value="2" trend="One accepted demo connection"/><Stat icon="◈" tint="blue" label="Video submissions" value="3" trend="Ready for feedback"/><Stat icon="◷" tint="orange" label="Upcoming sessions" value="2" trend="This week"/></div>
    <div className="two-col"><div className="panel"><div className="panel-head"><div><h3>Review queue</h3><p>Give learners clear, specific feedback.</p></div><button className="subtle-link" onClick={()=>onNav("Review submissions")}>Open queue →</button></div>{["Aarav · Cricket bowling","Sana · Robotics demo","Dev · Gameplay review"].map((x,i)=><button className="recommend-item coach-queue-item" key={x} onClick={()=>onNav("Review submissions")}><div className="rec-icon">{["◎","⌘","◈"][i]}</div><div className="rec-body"><strong>{x}</strong><span>{["Submitted 2 hours ago","Submitted yesterday","Submitted 4 hours ago"][i]}</span></div><span className="rec-xp">Review →</span></button>)}</div><div className="panel progress-panel"><div className="panel-head"><div><h3>Coach sessions</h3><p>Your upcoming touchpoints.</p></div><span className="more">THIS WEEK</span></div><div className="coach-session"><b>Thu · 4:30 PM</b><span>Aarav Menon · bowling review</span></div><div className="coach-session"><b>Fri · 6:00 PM</b><span>Community skill clinic</span></div><button className="outline-btn" onClick={()=>onNav("Community")}>Open coach community</button></div></div>
    <div className="banner-strip"><div className="banner-icon">☷</div><div><strong>Keep your feedback visible.</strong><p>Share a practice tip or answer a learner question in the community.</p></div><button onClick={()=>onNav("Community")}>Visit community →</button></div>
  </div>;
  return <>
    <div className="hero-card"><div className="hero-copy"><span className="hero-tag"><span/> {track.toUpperCase()} · YOUR JOURNEY</span><h2>Small steps.<br/><em>Remarkable growth.</em></h2><p>Turn what you're learning into skills you can show the world.</p><div className="hero-actions"><button className="white-btn" onClick={()=>onNav("Challenges")}>Explore challenges <span>→</span></button><button className="text-btn" onClick={()=>onNav("Explore learning")}>Explore learning paths</button></div></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-spark s1">✦</div><div className="art-spark s2">✧</div><div className="art-cube">✦</div><div className="art-ring"><div className="ring-inner">tp</div></div><div className="float-note"><b>+{completed.length ? completed.length*12 : 12}%</b><small>momentum</small></div></div></div>
    <div className="stats-grid"><Stat icon="✧" tint="violet" label="Total XP" value={xp.toLocaleString()} trend="+120 this week"/><Stat icon="◎" tint="green" label="Skills in progress" value="4" trend="Across 3 areas"/><Stat icon="▤" tint="orange" label="Challenges done" value={completed.length.toString()} trend="Keep the streak going"/><Stat icon="↗" tint="blue" label="Growth score" value={`${progress}%`} trend="+8% this month"/></div>
    <div className="section-head"><div><h3>Your learning universe</h3><p>Explore every path. Find the one that sparks you.</p></div><button className="subtle-link" onClick={()=>onNav("Explore learning")}>Explore all areas →</button></div>
    <div className="category-grid">{categories.map((c,i)=><button key={c.id} className={`category-card ${c.tint}`} onClick={()=>onNav(i===0||i===3?"Explore learning":i===4?"AI Studio":i===2?"Talent profiles":"Challenges")}><div className="category-top"><span className="category-icon">{c.icon}</span><span className="card-arrow">↗</span></div><strong>{c.name}</strong><p>{c.desc}</p><div className="category-foot"><span>{["Explore lessons","Build skills","Find talent","Apply your learning","Analyze performance"][i]}</span><b>→</b></div></button>)}</div>
    <div className="two-col"><div className="panel"><div className="panel-head"><div><h3>Recommended for you</h3><p>Picked to help you take your next step.</p></div><div className="tabs">{["For you","Trending"].map(t=><button className={tab===t?"active":""} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div></div><div className="recommend-list">{challengeSeed.slice(tab==="For you"?0:2,tab==="For you"?3:5).map(c=><div className="recommend-item" key={c.id}><div className={`rec-icon rec-${c.kind.toLowerCase().replace(" ","")}`}>{c.kind==="Sports"?"◎":c.kind==="Career"?"↗":c.kind==="AI review"?"◈":"✦"}</div><div className="rec-body"><strong>{c.title}</strong><span>{c.area} · {c.time}</span></div><div className="rec-xp">+{c.xp} XP</div><button className="circle-arrow" aria-label={`Open ${c.title}`} onClick={()=>onNav("Challenges")}>→</button></div>)}</div><button className="panel-bottom-link" onClick={()=>onNav("Challenges")}>View all challenges →</button></div>
    <div className="panel progress-panel"><div className="panel-head"><div><h3>Your momentum</h3><p>Progress comes from showing up.</p></div><span className="more">•••</span></div><div className="progress-visual"><div className="progress-circle" style={{"--progress":progress}}><div><b>{progress}%</b><small>growth</small></div></div></div><div className="progress-note"><span className="success-dot"/> <b>You're building a habit!</b><p>Complete a challenge this week to keep your progress moving.</p><button className="outline-btn" onClick={()=>onNav("Challenges")}>Continue learning</button></div></div></div>
    <div className="banner-strip"><div className="banner-icon">☷</div><div><strong>Community helps growth travel further.</strong><p>Share what you learned, ask for feedback, and encourage another learner.</p></div><button onClick={()=>onNav("Community")}>Join the community <span>→</span></button></div>
  </>;
}
function Stat({icon,tint,label,value,trend}) { return <div className="stat-card"><div className={`stat-icon ${tint}`}>{icon}</div><span>{label}</span><strong>{value}</strong><small><i/> {trend}</small></div>; }

function ExploreLearning({onNav,onToast}) {
  const [active,setActive] = useState("All");
  const paths = [
    {name:"Studies & subjects",desc:"Explore focused concepts and practice by subject.",type:"Education",icon:"✦",color:"violet",tasks:["Mathematics · algebra, geometry, statistics","Science · motion, energy, ecosystems","English · writing, reading, speaking","History · timelines, sources, cause and effect"]},
    {name:"Skill development",desc:"Build useful skills with clear practice steps.",type:"Skills",icon:"⌘",color:"blue",tasks:["Coding · Python, web basics, logic","Communication · presentations, teamwork","Creative skills · design, video editing","Career readiness · CVs, interviews, planning"]},
    {name:"Learn by doing",desc:"Apply an idea in a real-world task and reflect on what worked.",type:"Integrated",icon:"↗",color:"green",tasks:["Applied maths · budgeting, measurement","Science · experiments and observations","Coding · build a small working tool","Study skills · explain a concept in your own words"]},
    {name:"Sports & performance",desc:"Choose a sport and build reliable fundamentals, one skill at a time.",type:"Sports",icon:"◎",color:"orange",tasks:["Cricket · batting, bowling, fielding","Football · passing, first touch, movement","Basketball · dribbling, shooting, footwork","Badminton · serve, clear, court movement","Tennis · serve, rally, recovery","Athletics · sprint form, starts, pacing","Volleyball · serve, pass, approach","Swimming · body position, breathing, turns","Gaming · aim, decisions, team communication"]},
  ];
  return <><div className="filter-row"><div className="filter-pills">{["All","Education","Skills","Integrated","Sports"].map(t=><button key={t} className={active===t?"active":""} onClick={()=>setActive(t)}>{t}</button>)}</div><span className="muted">Concepts and practice paths · Choose a topic to begin</span></div><div className="learning-grid">{paths.filter(p=>active==="All"||p.type===active).map(p=><div className="learning-card" key={p.name}><div className={`learning-icon ${p.color}`}>{p.icon}</div><span className="learning-type">{p.type}</span><h3>{p.name}</h3><p>{p.desc}</p><ul>{p.tasks.map(t=><li key={t}>✓ {t}</li>)}</ul><button className="outline-btn" onClick={()=>{onToast(`${p.name} concepts are ready to explore.`);onNav("Challenges")}}>Explore practice →</button></div>)}</div><div className="panel learning-note"><div className="category-icon violet">✧</div><div><h3>Personalized learning</h3><p>Your selected track and saved activities shape a starting plan. Choose a topic above, practice at your own pace, then return to build from your progress.</p><button className="outline-btn" onClick={()=>onNav("Challenges")}>Continue with a suggested activity →</button></div></div></>;
}

function Challenges({list,category,setCategory,completed,started,progress,onProgress,onStart,onComplete}) {
  const [view,setView] = useState("All");
  const [activeChallenge,setActiveChallenge] = useState(null);
  const areas = ["All areas",...categories.map(c=>c.name)];
  const visible = list.filter(c=>view==="All"||(view==="Completed"?completed.includes(c.id):!completed.includes(c.id)));
  return <><div className="filter-row"><div className="filter-pills"><button className={view==="All"?"active":""} onClick={()=>setView("All")}>All challenges</button><button className={view==="Completed"?"active":""} onClick={()=>setView("Completed")}>Completed</button><button className={view==="To do"?"active":""} onClick={()=>setView("To do")}>To do</button></div><select className="select" value={category} onChange={e=>setCategory(e.target.value)}>{areas.map(a=><option key={a}>{a}</option>)}</select></div><div className="challenge-grid">{visible.map(c=><div className="challenge-card" key={c.id}><div className="challenge-top"><span className={`challenge-type ${c.kind.toLowerCase().replace(" ","")}`}>{c.kind}</span><span className="xp-badge">✧ {c.xp} XP</span></div><h3>{c.title}</h3><p>{c.detail}</p>{started.includes(c.id)&&!completed.includes(c.id)&&<div className="challenge-progress"><span style={{width:`${progress[c.id]||0}%`}}/></div>}<div className="challenge-meta"><span>◷ {c.time}</span><span>▧ {c.level}</span>{started.includes(c.id)&&!completed.includes(c.id)&&<span>{progress[c.id]||0}% done</span>}</div><button className={completed.includes(c.id)?"done-btn":"primary-btn"} onClick={()=>completed.includes(c.id)?null:(onStart(c.id),setActiveChallenge(c))}>{completed.includes(c.id)?"✓ Completed":started.includes(c.id)?"Resume challenge →":"Start challenge →"}</button></div>)}</div>{!visible.length&&<div className="empty-state">No matching challenges. Try another category or search.</div>}{activeChallenge&&<div className="modal-backdrop" onClick={()=>setActiveChallenge(null)}><div className="profile-modal challenge-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setActiveChallenge(null)}>×</button><span className="learning-type">{activeChallenge.area} · {activeChallenge.time}</span><h2>{activeChallenge.title}</h2><p>{activeChallenge.detail}</p><div className="challenge-progress"><span style={{width:`${progress[activeChallenge.id]||0}%`}}/></div><p>Progress: {progress[activeChallenge.id]||0}% · Saved on this device</p><button className="primary-btn" onClick={()=>{const next=Math.min(100,(progress[activeChallenge.id]||0)+25);onProgress(activeChallenge.id,next);if(next===100){onComplete(activeChallenge.id);setActiveChallenge(null);}}}>{(progress[activeChallenge.id]||0)>=75?"Finish challenge & collect XP":"Complete next step →"}</button></div></div>}</>;
}

function AIStudio({role,selectedVideo,videoUrl,analysis,analysisStatus,analysisMode,setAnalysisMode,videoPrompt,setVideoPrompt,selectVideo,runAnalysis,videoRef}) {
  const cameraRef = useRef(null), recorderRef = useRef(null), chunksRef = useRef([]);
  const [cameraStream,setCameraStream] = useState(null);
  const [recording,setRecording] = useState(false);
  const startCamera = async () => {
    try { const stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:"user"},audio:true}); setCameraStream(stream); }
    catch { alert("Camera access was not available. Check browser permissions or choose a saved video clip."); }
  };
  const startRecording = () => {
    if (!cameraStream) return;
    chunksRef.current=[];
    const mimeType=MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm";
    const recorder=new MediaRecorder(cameraStream,{mimeType}); recorderRef.current=recorder;
    recorder.ondataavailable=e=>{if(e.data.size)chunksRef.current.push(e.data)};
    recorder.onstop=()=>{const file=new File(chunksRef.current,`talentpath-recording-${Date.now()}.webm`,{type:"video/webm"});selectVideo(file);setCameraStream(null);cameraStream.getTracks().forEach(t=>t.stop());};
    recorder.start(); setRecording(true);
  };
  useEffect(()=>{if(cameraRef.current&&cameraStream)cameraRef.current.srcObject=cameraStream;},[cameraStream]);
  useEffect(()=>()=>{cameraStream?.getTracks().forEach(t=>t.stop());},[cameraStream]);
  const sports=["Cricket technique","Football technique","Basketball","Badminton","Tennis","Athletics","Volleyball","Swimming","Table tennis","Hockey","Gaming / esports","Public speaking","Practical skill / task"];
  return <div className="ai-layout"><div className="ai-main"><div className="panel upload-panel"><div className="panel-head"><div><h3>{role==="Coach"?"Learner video review":"AI video analysis studio"}</h3><p>{role==="Coach"?"Review a learner clip, leave feedback, and suggest their next drill.":"Record or upload a clip, choose a focus, and get a structured review."}</p></div><span className="ai-badge">✦ AI LAB</span></div><div className="upload-box">{cameraStream?<><div className="guided-camera"><video ref={cameraRef} autoPlay muted playsInline className="video-preview"/><div className="camera-guides"><b>Recording checklist</b><span>☀ Face a light source</span><span>▧ Keep your full movement in frame</span><span>◉ Set camera at chest height</span><span>⌖ Place phone on a stable surface</span></div><span className="framing-guide"/></div><div className="video-file-row"><strong>{recording?"Recording · use the cues above":"Camera preview · center yourself in frame"}</strong><div><button className={recording?"done-btn":"primary-btn"} onClick={recording?()=>{recorderRef.current?.stop();setRecording(false)}:startRecording}>{recording?"■ Stop & use clip":"● Start recording"}</button><button className="outline-btn" onClick={()=>{cameraStream.getTracks().forEach(t=>t.stop());setCameraStream(null)}}>Cancel</button></div></div></>:videoUrl?<><video ref={videoRef} src={videoUrl} controls className="video-preview"/><div className="video-file-row"><div><strong>{selectedVideo?.name}</strong><small>{selectedVideo ? `${(selectedVideo.size/1024/1024).toFixed(1)} MB` : ""}</small></div><label className="outline-btn file-btn">Replace video<input type="file" accept="video/*" onChange={e=>selectVideo(e.target.files?.[0])}/></label></div></>:<><div className="upload-illustration"><div>↑</div><span>✦</span></div><h3>Record or choose a video</h3><p>MP4, MOV, WebM · up to 100 MB</p><div className="record-actions"><button className="primary-btn" onClick={startCamera}>● Record with camera</button><label className="outline-btn file-btn">Choose video<input type="file" accept="video/*" onChange={e=>selectVideo(e.target.files?.[0])}/></label></div><small>Your clip stays on this device until you choose to analyze it.</small></>}</div><div className="analysis-options"><label><span>{role==="Coach"?"Learner skill or sport":"Analysis category"}</span><select value={analysisMode} onChange={e=>setAnalysisMode(e.target.value)}>{sports.map(s=><option key={s}>{s}</option>)}</select></label><label><span>{role==="Coach"?"Coach review focus":"What should the AI focus on?"}</span><textarea value={videoPrompt} onChange={e=>setVideoPrompt(e.target.value)} rows="3" /></label></div><button className="primary-btn analyze-btn" onClick={runAnalysis} disabled={analysisStatus==="analyzing"}>{analysisStatus==="analyzing"?"Preparing frames & analyzing…":role==="Coach"?"✦ Review learner video":"✦ Analyze video"}</button><p className="privacy-note">Feedback is guidance for practice. A coach should validate important assessments.</p></div>{analysis&&<AnalysisReport analysis={analysis} status={analysisStatus}/>}</div><aside className="ai-side"><div className="panel rubric-panel"><div className="panel-head"><div><h3>{role==="Coach"?"Coach review steps":"How to record a useful clip"}</h3><p>{role==="Coach"?"Turn an observation into a clear next step.":"Use these visual cues while recording."}</p></div></div>{(role==="Coach"?["Watch the full movement before reviewing","Connect feedback to one skill","Suggest one drill to practice next"]:["Lighting · face a window or bright light","Camera angle · use chest or waist height","Framing · keep your full body and activity visible","Stability · prop your phone on a solid surface"]).map((s,i)=><div className="rubric-step" key={s}><span>{String(i+1).padStart(2,"0")}</span><div><b>{s.split(" · ")[0]}</b><p>{s.includes(" · ")?s.split(" · ")[1]:s}</p></div></div>)}</div><div className="panel ai-tip-card"><div className="tip-star">✦</div><strong>{role==="Coach"?"Feedback that moves talent forward":"Ready to practice?"}</strong><p>{role==="Coach"?"Call out one thing done well, one adjustment, and one drill to try.":"Review one skill at a time. A steady angle and good light make comparisons more useful."}</p></div></aside></div>;
}
function AnalysisReport({analysis,status}) { return <div className="panel report-panel"><div className="report-head"><div><span className="eyebrow">YOUR REVIEW</span><h3>{analysis.label || (status==="done"?"AI analysis complete":"Review preview")}</h3></div>{analysis.score!=null&&<div className="score-circle"><b>{analysis.score}</b><small>/100</small></div>}</div><p className="report-summary">{analysis.summary}</p><div className="report-columns"><div><h4>✦ Strengths</h4><ul>{(analysis.strengths||[]).map((s,i)=><li key={i}>{s}</li>)}</ul></div><div><h4>↗ Improvement tips</h4><ul>{(analysis.improvements||[]).map((s,i)=><li key={i}>{s}</li>)}</ul></div></div><div className="drill-box"><b>Next practice plan</b><ul>{(analysis.drills||[]).map((s,i)=><li key={i}>{s}</li>)}</ul></div><div className="report-foot"><span>Confidence: {analysis.confidence||"Not provided"}</span><span>{status==="done"?"AI generated":"Demo / not evaluated"}</span></div></div>; }

function Profiles({role,people,query,setQuery,connected,onConnect,onToast,onNav}) {
  const [filter,setFilter] = useState(role==="Coach"?"Student":"All");
  const [detail,setDetail] = useState(null);
  const [sport,setSport] = useState("All sports"), [level,setLevel] = useState("All levels");
  const filtered = people.filter(p=>(filter==="All"||p.role===filter)&&`${p.name} ${p.specialty} ${p.location} ${p.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase())&&(sport==="All sports"||p.specialty.toLowerCase().includes(sport.toLowerCase())||p.tags.some(t=>t.toLowerCase().includes(sport.toLowerCase())))&&(level==="All levels"||p.level===level));
  return <><div className="profile-toolbar"><div className="filter-pills">{(role==="Coach"?["Student"]:["All","Coach","Mentor","Student"]).map(t=><button className={filter===t?"active":""} onClick={()=>setFilter(t)} key={t}>{t==="All"?"Everyone":t==="Student"?"Learners":t==="Coach"?"Coaches":"Mentors"}</button>)}</div><div className="discovery-filters"><select className="select" value={sport} onChange={e=>setSport(e.target.value)}><option>All sports</option>{["Cricket","Football","Basketball","Badminton","Tennis","Athletics","Volleyball","Swimming","Gaming"].map(x=><option key={x}>{x}</option>)}</select><select className="select" value={level} onChange={e=>setLevel(e.target.value)}><option>All levels</option>{["Starter","Developing","Advanced"].map(x=><option key={x}>{x}</option>)}</select><div className="search profile-search"><span>⌕</span><input placeholder="Search skill or location" value={query} onChange={e=>setQuery(e.target.value)}/></div></div></div>{role==="Coach"&&<p className="muted">Learner discovery · Filter by sport or skill, level, and location.</p>}<div className="people-grid">{filtered.map(p=>{const status=connected[p.id]||p.connection;return <div className="person-card" key={p.id}><div className="person-card-top"><Avatar person={p}/><span className={`role-badge ${p.role.toLowerCase()}`}>{p.role}</span>{status&&<span className={`connection-status ${status.toLowerCase()}`}>{status}</span>}<button className="dots" aria-label={`View ${p.name}`} onClick={()=>setDetail(p)}>•••</button></div><h3>{p.name}</h3><div className="person-specialty">{p.specialty}</div><div className="rating-line"><span>★</span><b>{p.rating.toFixed(1)}</b><small>({p.reviews} reviews)</small></div><p>{p.bio}</p><div className="tag-list">{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className="person-location">⌖ {p.location} · {p.level||"Developing"}</div><div className="person-actions"><button className="outline-btn" onClick={()=>setDetail(p)}>Review profile</button>{role==="Student"&&<button className={status==="Accepted"?"connected-btn":status==="Requested"?"requested-btn":"primary-btn"} onClick={()=>status?onToast(`Connection ${status.toLowerCase()}.`):onConnect(p.id)}>{status==="Accepted"?"✓ Accepted":status==="Requested"?"Request sent":"Connect"}</button>}</div></div>})}</div>{!filtered.length&&<div className="empty-state">No profiles match those filters yet. Try another sport, skill, or location.</div>}{detail&&<div className="modal-backdrop" onClick={()=>setDetail(null)}><div className="profile-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setDetail(null)}>×</button><Avatar person={detail}/><span className={`role-badge ${detail.role.toLowerCase()}`}>{detail.role}</span><h2>{detail.name}</h2><h4>{detail.specialty}</h4><div className="rating-line"><span>★</span><b>{detail.rating.toFixed(1)}</b><small>{detail.reviews} sample ratings</small></div><p>{detail.bio}</p><div className="tag-list">{detail.tags.map(t=><span key={t}>{t}</span>)}</div><div className="profile-modal-meta">Location: {detail.location}<br/>Level: {detail.level||"Developing"}</div><div className="profile-evidence-list"><b>Recent evidence</b><span>▣ {detail.evidence||"Recent skill practice clip · demo"}</span><span>✦ {detail.achievement||"Progress milestone · demo"}</span></div>{role==="Coach"?<button className="primary-btn" onClick={()=>{setDetail(null);onNav("AI Studio")}}>Review this learner’s clip in AI Studio →</button>:<button className={connected[detail.id]==="Accepted"||detail.connection==="Accepted"?"connected-btn":"primary-btn"} onClick={()=>{onConnect(detail.id);setDetail(null)}}>{connected[detail.id]==="Accepted"||detail.connection==="Accepted"?"✓ Accepted":connected[detail.id]==="Requested"?"Request sent":"Connect / request feedback"}</button>}</div></div>}</>;
}

function Opportunities({interested,onInterest}) {
  const opportunities = [{title:"Community cricket skill clinic",org:"Hyderabad Grassroots Sports",type:"Sports",location:"Hyderabad",desc:"Open practice and coach-led assessment for emerging players.",tags:["Beginner-friendly","In-person"]},{title:"Student project showcase",org:"TalentPath Community",type:"Education + skills",location:"Online",desc:"Present a practical project and receive feedback from mentors.",tags:["Portfolio","Mentorship"]},{title:"Junior coding portfolio review",org:"Volunteer Mentor Network",type:"Career",location:"Online",desc:"Get feedback on a beginner project and learn how to improve your portfolio.",tags:["Coding","Career readiness"]},{title:"Esports VOD review session",org:"Community Coaches",type:"Sports + AI",location:"Online",desc:"Submit a short gameplay clip for a guided review session.",tags:["Gaming","Video review"]}];
  return <><div className="section-head"><div><h3>Opportunities to grow</h3><p>Explore community clinics, projects, and mentor sessions.</p></div><span className="ai-badge">4 OPEN</span></div><div className="opportunity-list">{opportunities.map((o,i)=><div className="opportunity-card" key={i}><div className={`opportunity-symbol op-${i}`}>{["◎","✦","↗","◈"][i]}</div><div className="opportunity-content"><span className="learning-type">{o.type}</span><h3>{o.title}</h3><b>{o.org}</b><p>{o.desc}</p><div className="tag-list">{o.tags.map(t=><span key={t}>{t}</span>)}</div><small>⌖ {o.location}</small></div><button className={interested.includes(i)?"connected-btn":"outline-btn"} onClick={()=>onInterest(i)}>{interested.includes(i)?"✓ Interest sent":"I’m interested →"}</button></div>)}</div></>;
}

function Leaderboard({xp,completed,track}) {
  const [scope,setScope] = useState("Weekly");
  const [kind,setKind] = useState(track==="Athlete/Sports"?"Athletes":"Students");
  const students=[{name:"Riya S.",xp:1240,initials:"RS",color:"peach",level:"Mathematics learner"},{name:"Kabir N.",xp:980,initials:"KN",color:"blue",level:"Study streak"},{name:"You",xp,initials:"YO",color:"lilac",level:`${completed} activities completed`},{name:"Zoya M.",xp:720,initials:"ZM",color:"mint",level:"Skill builder"},{name:"Ishita D.",xp:660,initials:"ID",color:"yellow",level:"Concept explorer"}];
  const athletes=[{name:"Aarav M.",xp:1380,initials:"AM",color:"blue",level:"Cricket · Bowling"},{name:"Maya R.",xp:1100,initials:"MR",color:"peach",level:"Badminton · Singles"},{name:"You",xp,initials:"YO",color:"lilac",level:"Practice sessions"},{name:"Dev P.",xp:820,initials:"DP",color:"mint",level:"Football · Midfield"},{name:"Nikhil S.",xp:710,initials:"NS",color:"yellow",level:"Athletics · Sprint"}];
  const ranks=(kind==="Athletes"?athletes:students).sort((a,b)=>b.xp-a.xp);
  return <><div className="filter-row"><div><h3>{kind} leaderboard</h3><p className="muted">Separate boards celebrate study progress and athletic practice.</p></div><div className="leaderboard-controls"><div className="filter-pills">{["Students","Athletes"].map(t=><button className={kind===t?"active":""} onClick={()=>setKind(t)} key={t}>{t}</button>)}</div><div className="filter-pills">{["Weekly","All time"].map(t=><button className={scope===t?"active":""} onClick={()=>setScope(t)} key={t}>{t}</button>)}</div></div></div><div className="panel leaderboard-panel"><div className="leaderboard-header"><div className="podium"><div><Avatar person={ranks[1]}/><b>{ranks[1].name}</b><small>{ranks[1].xp} XP</small><div className="podium-block second">2</div></div><div><span className="crown">♛</span><Avatar person={ranks[0]}/><b>{ranks[0].name}</b><small>{ranks[0].xp} XP</small><div className="podium-block first">1</div></div><div><Avatar person={ranks[2]}/><b>{ranks[2].name}</b><small>{ranks[2].xp} XP</small><div className="podium-block third">3</div></div></div></div>{ranks.map((p,i)=><div className={`rank-row ${p.name==="You"?"you":""}`} key={p.name}><span className="rank-number">{i+1}</span><Avatar person={p} small/><div className="rank-person"><b>{p.name}</b><small>{p.level}</small></div><strong>{scope==="Weekly"?p.xp:Math.round(p.xp*2.8)} XP</strong></div>)}</div></>;
}

function Community({messages,newPost,setNewPost,addPost,profile,onToast}) {
  return <div className="community-layout"><div className="panel community-feed"><div className="panel-head"><div><h3>Community circle</h3><p>Share progress, ask for feedback, and celebrate wins.</p></div><span className="ai-badge">COMMUNITY</span></div><div className="post-composer"><Avatar person={{name:profile.name,initials:profile.name.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"lilac"}}/><div><textarea value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="Share a learning win or ask the community…" rows="3"/><button className="primary-btn" onClick={addPost}>Share post</button></div></div>{messages.slice().reverse().map(m=><div className="community-post" key={m.id}><div className="post-head"><Avatar person={{name:m.author,initials:m.author.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"blue"}} small/><div><b>{m.author}</b><small>{m.time}</small></div></div><p>{m.text}</p><div className="post-actions"><button onClick={()=>onToast(`You appreciated ${m.author}’s post.`)}>♡ Appreciate</button><button onClick={()=>{setNewPost(`@${m.author} `);onToast(`Replying to ${m.author}. Add your message above.`);document.querySelector(".post-composer textarea")?.focus();}}>↩ Reply</button><button onClick={async()=>{try{await navigator.clipboard.writeText(m.text);onToast("Post copied to clipboard.");}catch{onToast("Post is ready to share. Copy its text from the post above.");}}}>♧ Share</button></div></div>)}</div><aside className="panel community-side"><h3>Community guidelines</h3><p>Make this a kind place for people learning in public.</p><ul><li>Give specific, constructive feedback.</li><li>Respect privacy. Ask before sharing someone’s clip.</li><li>Celebrate effort and improvement, not just rankings.</li><li>Never post sensitive personal information.</li></ul><div className="community-prompt"><span>✦ WEEKLY PROMPT</span><b>What’s one thing you improved this week?</b></div></aside></div>;
}

function MyPortfolio({role,profile,setProfile,showEdit,setShowEdit,onToast}) {
  return <div className="profile-settings-page"><div className="panel profile-settings-card"><div className="profile-settings-head"><Avatar person={{name:profile.name,initials:profile.name.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"lilac"}}/><div><span className="eyebrow">{role==="Coach"?"TALENTPATH COACH":"YOUR PROFILE"}</span><h2>{profile.name}</h2><p>{profile.headline}</p><small>⌖ {profile.location} · {role} profile</small></div><button className="outline-btn" onClick={()=>setShowEdit(!showEdit)}>{showEdit?"Close editor":"Edit profile"}</button></div><div className="profile-settings-about"><h3>About</h3><p>{profile.about}</p></div><div className="profile-settings-about"><h3>Specialties & interests</h3><div className="tag-list">{[...(profile.skills||[]),...(profile.interests||[])].map((s,i)=><span key={`${s}-${i}`}>{s}</span>)}</div><p className="muted">Edit your profile from the button above. Updates are saved on this device.</p></div>{showEdit&&<ProfileEditor profile={profile} setProfile={setProfile} role={role} onClose={()=>setShowEdit(false)} onToast={onToast} embedded/>}</div><aside className="profile-side-note"><div className="panel"><span className="visibility-icon">◉</span><h3>Profile visibility</h3><p>Choose who can discover your profile. Avoid publishing private contact details.</p><span className="visibility-status">{profile.visibility}</span></div>{role==="Coach"&&<div className="panel"><h3>Your coach space</h3><p>Manage your bio and specialties here. Learner feedback and reviews live in the coach desk.</p></div>}</aside></div>;
}

function ProfileEditor({profile,setProfile,track,setTrack,role,onClose,onToast,embedded=false}) {
  const [skill,setSkill]=useState(""),[interest,setInterest]=useState("");
  const patchProfile=(key,value)=>setProfile(p=>({...p,[key]:value}));
  const addTag=(key,value,clear)=>{const text=value.trim();if(text&&!profile[key]?.includes(text))patchProfile(key,[...(profile[key]||[]),text]);clear("");};
  const form=<><div className="profile-edit-form"><label>Name<input value={profile.name} onChange={e=>patchProfile("name",e.target.value)}/></label><label>Headline or specialty<input value={profile.headline||""} onChange={e=>patchProfile("headline",e.target.value)}/></label><label>Location<input value={profile.location} onChange={e=>patchProfile("location",e.target.value)}/></label><label>About<textarea rows="3" value={profile.about} onChange={e=>patchProfile("about",e.target.value)}/></label><label>Visibility<select value={profile.visibility} onChange={e=>patchProfile("visibility",e.target.value)}><option>Public</option><option>Private</option><option>Coaches only</option></select></label>{role==="Student"&&<label>Your track<select value={track||"Studies"} onChange={e=>setTrack?.(e.target.value)}>{["Studies","Athlete/Sports","Gaming","Skill Development"].map(x=><option key={x}>{x}</option>)}</select></label>}<div className="tag-editor"><label>Add a skill<input value={skill} onChange={e=>setSkill(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addTag("skills",skill,setSkill))} placeholder="Type a skill and press Add"/></label><button className="outline-btn" onClick={()=>addTag("skills",skill,setSkill)}>Add skill</button><div className="tag-list">{(profile.skills||[]).map((x,i)=><button key={`${x}-${i}`} className="editable-tag" onClick={()=>patchProfile("skills",profile.skills.filter((_,j)=>j!==i))}>{x} ×</button>)}</div></div><div className="tag-editor"><label>Add an interest<input value={interest} onChange={e=>setInterest(e.target.value)} onKeyDown={e=>e.key==="Enter"&&(e.preventDefault(),addTag("interests",interest,setInterest))} placeholder="Type an interest and press Add"/></label><button className="outline-btn" onClick={()=>addTag("interests",interest,setInterest)}>Add interest</button><div className="tag-list">{(profile.interests||[]).map((x,i)=><button key={`${x}-${i}`} className="editable-tag" onClick={()=>patchProfile("interests",profile.interests.filter((_,j)=>j!==i))}>{x} ×</button>)}</div></div><button className="primary-btn" onClick={()=>{onToast("Profile saved on this device.");onClose()}}>Save profile</button></div></>;
  return embedded?form:<div className="modal-backdrop" onClick={onClose}><div className="profile-modal profile-editor-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" aria-label="Close profile editor" onClick={onClose}>×</button><span className="eyebrow">EDIT YOUR PROFILE</span><h2>Make it yours</h2>{form}</div></div>;
}

function ReviewSubmissions({onNav,onToast}) {
  const [selected,setSelected] = useState("Aarav's cricket bowling clip");
  const [feedback,setFeedback] = useState("");
  return <div className="review-layout"><div className="panel"><div className="panel-head"><div><h3>Submission review queue</h3><p>Sample submissions for coach workspace.</p></div><span className="ai-badge">3 WAITING</span></div>{["Aarav's cricket bowling clip","Sana's robotics demo","Dev's gameplay VOD"].map((s,i)=><button className={`submission-row ${selected===s?"selected":""}`} key={s} onClick={()=>setSelected(s)}><div className="submission-icon">{["◎","⌘","◈"][i]}</div><div><b>{s}</b><small>{["Sports • submitted 2h ago","Practical skill • yesterday","Gaming • 4h ago"][i]}</small></div><span>→</span></button>)}</div><div className="panel review-detail"><span className="eyebrow">SELECTED SUBMISSION</span><h3>{selected}</h3><p>Demo review screen. A connected version can show uploaded evidence, rubric dimensions, and AI suggestions for coach validation.</p><label>Coach feedback<textarea rows="5" value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Write specific, constructive feedback…"/></label><button className="primary-btn" onClick={()=>onToast("Feedback saved in this demo.")}>Save feedback</button><button className="outline-btn" onClick={()=>onNav("AI Studio")}>Open AI Studio</button></div></div>;
}

createRoot(document.getElementById("root")).render(<App/>);
