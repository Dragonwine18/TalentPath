import React, { useEffect, useMemo, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import TalentScene from "./TalentScene.jsx";
import LogoParticles from "./LogoParticles.jsx";

const categories = [
  { id: "learn", name: "Education & learning", icon: "✦", tint: "violet", desc: "Learn concepts, practice, and close knowledge gaps." },
  { id: "career", name: "Skill development / career readiness", icon: "↗", tint: "blue", desc: "Build practical skills and a portfolio employers can trust." },
  { id: "discover", name: "Sports & talent discovery", icon: "◎", tint: "orange", desc: "Make ability and progress visible to coaches and scouts." },
  { id: "combo", name: "Education + skills", icon: "⌘", tint: "green", desc: "Connect learning with real-world projects and assessments." },
  { id: "sportsai", name: "Sports + AI", icon: "◈", tint: "pink", desc: "Review performance videos and turn feedback into practice." },
];

const demoPeople = [
  { id: 1, name: "Ananya Rao", role: "Coach", specialty: "Cricket • Batting", location: "Hyderabad, Telangana", rating: 4.9, reviews: 42, bio: "Grassroots cricket coach helping young players build fundamentals and confidence.", tags: ["Batting", "Youth development", "Video review"], initials: "AR", color: "peach" },
  { id: 2, name: "Kabir Shah", role: "Coach", specialty: "Football • Performance", location: "Pune, Maharashtra", rating: 4.8, reviews: 31, bio: "Focuses on decision-making, movement, and measurable player development.", tags: ["Football", "Fitness", "Tactical"], initials: "KS", color: "blue" },
  { id: 3, name: "Meera Iyer", role: "Mentor", specialty: "Coding • Career readiness", location: "Bengaluru, Karnataka", rating: 4.9, reviews: 26, bio: "Guides students from fundamentals to portfolio projects and internship readiness.", tags: ["Python", "Project evidence", "Interview prep"], initials: "MI", color: "lilac" },
  { id: 4, name: "Dev Malhotra", role: "Athlete", classification: "Sports", sport: "Esports", skillLevel: "Intermediate", ageGroup: "18–21", position: "Attacker", status: "Accepted", specialty: "Esports • FPS", location: "Delhi, India", rating: 4.6, reviews: 12, bio: "Tracks match performance and shares improvement clips with a team.", tags: ["FPS", "VOD review", "Team play"], initials: "DM", color: "mint" },
  { id: 5, name: "Sana Khan", role: "Student", classification: "Education", specialty: "Robotics • Embedded systems", location: "Hyderabad, Telangana", rating: 4.7, reviews: 9, bio: "Building small robotics projects and documenting practical skills.", tags: ["Robotics", "Arduino", "Projects"], initials: "SK", color: "yellow" },
  { id: 6, name: "Aarav Mehta", role: "Athlete", classification: "Sports", sport: "Cricket", skillLevel: "Beginner", ageGroup: "13–17", position: "Bowler", specialty: "Cricket • Bowling", location: "Hyderabad, Telangana", rating: 4.7, reviews: 8, bio: "Practicing pace bowling, line and length, and a consistent run-up.", tags: ["Bowling", "Fitness", "Technique"], initials: "AM", color: "mint" },
  { id: 7, name: "Ishita Verma", role: "Athlete", classification: "Sports", sport: "Football", skillLevel: "Advanced", ageGroup: "18–21", position: "Midfielder", specialty: "Football • Midfield", location: "Pune, Maharashtra", rating: 4.8, reviews: 15, bio: "Working on scanning, first touch, passing range, and match decisions.", tags: ["Football", "Tactical", "Team play"], initials: "IV", color: "peach" },
  { id: 8, name: "Rohan Patel", role: "Athlete", classification: "Sports", sport: "Basketball", skillLevel: "Intermediate", ageGroup: "18–21", position: "Attacker", specialty: "Basketball • Guard", location: "Bengaluru, Karnataka", rating: 4.6, reviews: 11, bio: "Building ball-handling, shooting consistency, and transition defense.", tags: ["Fitness", "Technique", "Team play"], initials: "RP", color: "blue" },
];

const challengeSeed = [
  { id: 1, title: "Explain a concept in 90 seconds", area: "Education & learning", kind: "Learning", xp: 120, time: "20 min", level: "Starter", detail: "Choose a concept you recently learned. Explain it in your own words and identify one example." },
  { id: 2, title: "Create a practical skill demo", area: "Skill development / career readiness", kind: "Career", xp: 250, time: "2–4 hrs", level: "Intermediate", detail: "Create a short demonstration of a skill you practiced and explain what you learned." },
  { id: 3, title: "Cricket bowling fundamentals", area: "Sports & talent discovery", kind: "Sports", xp: 180, time: "30 min", level: "Starter", detail: "Record a short run-up and delivery sequence. Review balance, rhythm, and follow-through." },
  { id: 4, title: "Learn → build: applied maths", area: "Education + skills", kind: "Integrated", xp: 200, time: "45 min", level: "Intermediate", detail: "Use a math idea to solve a real scenario and show your working." },
  { id: 5, title: "Review a gameplay decision", area: "Sports + AI", kind: "AI review", xp: 160, time: "15 min", level: "Intermediate", detail: "Upload a short gameplay clip and identify one decision you would change." },
];

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span>; }
function Avatar({ person, small = false }) { return <div className={`avatar ${person.color || "lilac"} ${small ? "small" : ""}`}>{person.initials || person.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>; }
function App() {
  const initialRoute = (() => { try { const p = new URLSearchParams(window.location.hash.slice(1)); return { role: p.get("role") === "Coach" ? "Coach" : "Student", page: p.get("page") || "Overview", track: p.get("track") || "Studies" }; } catch { return { role:"Student", page:"Overview" }; } })();
  const [role, setRole] = useState(initialRoute.role);
  const [roleTransition, setRoleTransition] = useState("");
  const [moduleTransition, setModuleTransition] = useState("");
  const [page, setPage] = useState(initialRoute.page);
  const [category, setCategory] = useState("All areas");
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState(() => { try { return JSON.parse(window.localStorage.getItem("talentpath-completed") || "[]"); } catch { return []; } });
  const [startedChallenges, setStartedChallenges] = useState(() => { try { return JSON.parse(window.localStorage.getItem("talentpath-started") || "[]"); } catch { return []; } });
  const [profile, setProfile] = useState({ name: "Alex Morgan", location: "Hyderabad, Telangana", headline: "Curious learner • Aspiring all-rounder", about: "I’m building practical skills, tracking my growth, and looking for feedback from people who can help me improve.", skills: ["Learning", "Cricket", "Python"], interests: ["Problem solving", "Teamwork", "Photography"], visibility: "Public" });
  const [people, setPeople] = useState(demoPeople);
  const [connected, setConnected] = useState(() => { try { return JSON.parse(window.localStorage.getItem("talentpath-connected") || "[]"); } catch { return []; } });
  const [messages, setMessages] = useState(() => { try { return JSON.parse(window.localStorage.getItem("talentpath-messages") || "null") || [{ id: 1, author: "TalentPath", text: "Welcome! Share a challenge, a learning win, or ask for feedback.", time: "Just now" }]; } catch { return [{ id: 1, author: "TalentPath", text: "Welcome! Share a challenge, a learning win, or ask for feedback.", time: "Just now" }]; } });
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
  const [notifications, setNotifications] = useState([{id:1,title:"Profile accepted",detail:"Your prototype profile is visible to the community.",read:false},{id:2,title:"Coach feedback",detail:"Ananya shared a tip on your latest practice.",read:false}]);
  const [studentTrack, setStudentTrack] = useState(initialRoute.track || "Studies");
  const [selectedChallenge, setSelectedChallenge] = useState(null);
  const [connectionStatus, setConnectionStatus] = useState({});
  const [interested, setInterested] = useState(() => { try { return JSON.parse(window.localStorage.getItem("talentpath-interested") || "[]"); } catch { return []; } });

  const videoRef = useRef(null);

  const notify = (s) => { setToast(s); window.setTimeout(() => setToast(""), 2600); };
  useEffect(()=>{const hash=`#role=${encodeURIComponent(role)}&page=${encodeURIComponent(page)}&track=${encodeURIComponent(studentTrack)}`;if(window.location.hash!==hash)window.history.replaceState(null,"",hash)},[role,page,studentTrack]);
  useEffect(()=>{try{const raw=window.localStorage.getItem("talentpath-profile");if(raw)setProfile(p=>({...p,...JSON.parse(raw)}));}catch{}}
  ,[]);
  useEffect(()=>{try{window.localStorage.setItem("talentpath-profile",JSON.stringify(profile));}catch{}},[profile]);
  useEffect(()=>{try{window.localStorage.setItem("talentpath-completed",JSON.stringify(completed));}catch{}},[completed]);
  useEffect(()=>{try{window.localStorage.setItem("talentpath-started",JSON.stringify(startedChallenges));}catch{}},[startedChallenges]);
  useEffect(()=>{try{window.localStorage.setItem("talentpath-connected",JSON.stringify(connected));}catch{}},[connected]);
  useEffect(()=>{try{window.localStorage.setItem("talentpath-interested",JSON.stringify(interested));}catch{}},[interested]);
  useEffect(()=>{try{window.localStorage.setItem("talentpath-messages",JSON.stringify(messages));}catch{}},[messages]);
  function markNotificationsRead(){setNotifications(n=>n.map(x=>({...x,read:true})));}
  function submitSearch(){const q=query.trim().toLowerCase();if(!q)return;if(["athlete","sport","cricket","football","basketball","position"].some(k=>q.includes(k)))doNav(role==="Student"?"Talent profiles":"Learner discovery");else if(["lab","chemistry","physics","editing","experiment"].some(k=>q.includes(k)))doNav("Practical Labs");else if(["coach","mentor","session","live"].some(k=>q.includes(k)))doNav("Live sessions");else if(["community","post","talent exchange","teach"].some(k=>q.includes(k)))doNav("Community");else if(["ai","video","analyze","analysis"].some(k=>q.includes(k)))doNav("AI Studio");else if(["challenge","scenario","fast thinking"].some(k=>q.includes(k)))doNav("Challenges");else doNav("Explore learning");}
  const switchRole = (nextRole) => {
    if (nextRole === role || roleTransition) return;
    setRoleTransition(nextRole);
    setRole(nextRole);
    setPage("Overview");
    window.setTimeout(() => setRoleTransition(""), 1150);
  };
  const challengeList = useMemo(() => challengeSeed.filter(c => (category === "All areas" || c.area === category) && c.title.toLowerCase().includes(query.toLowerCase())), [category, query]);
  const xp = 460 + completed.reduce((sum, id) => sum + (challengeSeed.find(c=>c.id===id)?.xp || 0), 0);
  const progress = Math.min(100, 38 + completed.length * 12);

  useEffect(() => () => { if (videoUrl) URL.revokeObjectURL(videoUrl); }, [videoUrl]);

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
        improvements: ["Configure a server-side AI provider key for the analysis service", "Use a coach-approved rubric for this category"],
        drills: ["Record a consistent short clip from the same angle", "Repeat the selected challenge and compare your next attempt"],
        confidence: "Not evaluated"
      });
      setAnalysisStatus("demo");
    } catch (e) {
      setAnalysis({ label: "Demo review", summary: "The analysis endpoint is not connected yet. Your clip remains local to this browser. Configure the secure video-analysis service and provider key to enable model feedback.", strengths: ["Upload and local preview are working"], improvements: ["Configure Netlify Functions and the AI provider"], drills: ["Try again after deploying the function"], confidence: "Not evaluated" });
      setAnalysisStatus("demo");
    }
  }

  const navItems = role === "Student"
    ? ["Overview", "Explore learning", "Practical Labs", "AI Mentor", "Challenges", "AI Studio", "Talent profiles", "Opportunities", "Leaderboard", "Community", "Talent Exchange", "Live sessions", "Fast Thinking"]
    : ["Overview", "Learner discovery", "Athlete review", "AI Studio", "Coach sessions", "Live sessions", "Talent Exchange", "Community", "My profile"];


  function doNav(item) {
    const studentOnly = ["Explore learning","Practical Labs","AI Mentor","Challenges","Talent profiles","Opportunities","Leaderboard","Fast Thinking"];
    const coachOnly = ["Learner discovery","Athlete review","Coach sessions","Review submissions"];
    if ((role === "Coach" && studentOnly.includes(item)) || (role === "Student" && coachOnly.includes(item)) || (item === "My portfolio")) return;
    if (item === page || moduleTransition || roleTransition) return;
    setModuleTransition(item);
    setPage(item);
    setAssessment(null);
    window.setTimeout(() => setModuleTransition(""), 980);
  }
  function completeChallenge(id) { if (!completed.includes(id)) { setCompleted(items => items.includes(id) ? items : [...items, id]); setStartedChallenges(items => items.filter(x=>x!==id)); notify("Challenge completed! XP added to your demo profile."); } else notify("Already completed in this demo."); }
  function connectPerson(id) { if (connected.includes(id)) { notify("Connection request is already pending."); return; } setConnected(prev => [...prev,id]); setConnectionStatus(prev=>({...prev,[id]:"Pending"})); notify("Connection request sent. Status: Pending (demo)."); }
  function addPost() { if (!newPost.trim()) return; setMessages([...messages, { id: Date.now(), author: profile.name, text: newPost.trim(), time: "Just now" }]); setNewPost(""); notify("Post shared in the demo community."); }

  useEffect(()=>{if(role==="Coach"&&["Challenges","Opportunities","Leaderboard","Explore learning","Practical Labs","AI Mentor","Fast Thinking","Talent profiles"].includes(page))setPage("Overview");if(role==="Student"&&["Learner discovery","Athlete review","Coach sessions","Review submissions"].includes(page))setPage("Overview");if(page==="My portfolio")setPage("My profile")},[role,page]);
  const pageTitle = page === "Overview" ? `Good ${new Date().getHours() < 12 ? "morning" : new Date().getHours() < 18 ? "afternoon" : "evening"}, ${profile.name.split(" ")[0]}` : page;
  const pageSub = page === "Overview" ? "Your next step is one small win away." : "A connected space to learn, practice, show progress, and find opportunities.";

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
      <div className="brand"><div className="brand-mark"><LogoParticles /></div><div><strong>{role==="Coach"?"TalentPath Coach":"talentpath"}</strong><small>{role==="Coach"?"COACH & MENTOR WORKSPACE":"GROW INTO YOUR POTENTIAL"}</small></div></div>
      <div className="role-switch"><span>Viewing as</span><div><button className={role==="Student"?"active":""} onClick={()=>switchRole("Student")}>Student</button><button className={role==="Coach"?"active":""} onClick={()=>switchRole("Coach")}>Coach</button></div></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{navItems.map((item,i)=><button key={item} className={`nav-item ${page===item?"selected":""} ${item==="Community"?"community-nav-item":""}`} onClick={()=>doNav(item)}><span className="nav-icon">{["⌂","◌","✧","◈","◎","↗","♜","☷","▤"][i]||"•"}</span>{item}{item==="AI Studio"&&<span className="new-pill">AI</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">✦</div><strong>Keep growing</strong><p>Every attempt gives you more evidence of what you can do.</p>{role==="Student"&&<button onClick={()=>doNav("Challenges")}>Find a challenge <span>→</span></button>}</div><div className="user-mini"><Avatar person={{name:profile.name,initials:profile.name.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"lilac"}} small/><div><strong>{profile.name}</strong><small>{role} workspace</small></div><button aria-label="Edit profile" onClick={()=>{setPage("My profile");setShowProfileEdit(true)}}>•••</button></div></div>
    </aside>

    <main className="main"><div className="talent-scene-layer" aria-hidden="true"><TalentScene /></div>
      <header className="topbar"><div className="crumb">Workspace <span>/</span> <b>{page}</b></div><div className="top-actions"><div className="search"><span>⌕</span><input placeholder="Search challenges, people..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&submitSearch()}/><kbd>⌘ K</kbd></div><button className="icon-button" title="Notifications" onClick={()=>setNotificationsOpen(v=>!v)}>♧{notifications.some(n=>!n.read)&&<i/>}</button>{notificationsOpen&&<div className="notification-popover"><div className="notification-head"><b>Notifications</b><button onClick={()=>setNotifications(n=>n.map(x=>({...x,read:true})))}>Mark all read</button></div>{notifications.map(n=><div className={`notification-item ${n.read?"read":""}`} key={n.id}><span className="notification-dot"/><div><b>{n.title}</b><p>{n.detail}</p></div></div>)}</div>}<button className="top-avatar" onClick={()=>{setPage("My profile");setShowProfileEdit(true)}}>{profile.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</button></div></header>
      <div className="page-wrap">
        <section className="page-heading"><div><div className="eyebrow">{role==="Student"?"YOUR PERSONAL GROWTH SPACE":"COACH & MENTOR WORKSPACE"}</div><h1>{pageTitle}</h1><p>{pageSub}</p></div>{page==="AI Studio"&&<span className="ai-badge">VIDEO REVIEW WORKSPACE</span>}</section>

        {page==="Overview" && role==="Student" && <div className="track-selector"><span>My track</span>{["Studies","Athlete / Sports","Gaming","Skill Development"].map(t=><button key={t} className={studentTrack===t?"active":""} onClick={()=>setStudentTrack(t)}>{t}</button>)}</div>}
        <div key={page} className="module-transition">
        {page==="Overview" && <Overview role={role} xp={xp} progress={progress} completed={completed} onNav={doNav} onComplete={completeChallenge} />}
        {page==="Explore learning" && <ExploreLearning onNav={doNav} onToast={notify} />}
        {page==="Practical Labs" && role==="Student" && <PracticalLabs onToast={notify} />}
        {page==="AI Mentor" && role==="Student" && <AIMentor onToast={notify} />}
        {page==="Fast Thinking" && role==="Student" && <FastThinking onToast={notify} />}
        {page==="Talent Exchange" && <TalentExchange onToast={notify} />}
        {page==="Live sessions" && <LiveSessions role={role} onToast={notify} />}
        {page==="Coach sessions" && role==="Coach" && <CoachSessions onToast={notify} />}
        {page==="Athlete review" && role==="Coach" && <AthleteReview onNav={doNav} onToast={notify} />}
        {page==="Review submissions" && role==="Coach" && <ReviewSubmissions onNav={doNav} onToast={notify} />}
        {page==="Challenges" && <Challenges list={challengeList} category={category} setCategory={setCategory} completed={completed} started={startedChallenges} setStarted={setStartedChallenges} onComplete={completeChallenge} query={query} setQuery={setQuery} />}
        {page==="AI Studio" && <AIStudio role={role} selectedVideo={selectedVideo} videoUrl={videoUrl} analysis={analysis} analysisStatus={analysisStatus} analysisMode={analysisMode} setAnalysisMode={setAnalysisMode} videoPrompt={videoPrompt} setVideoPrompt={setVideoPrompt} selectVideo={selectVideo} runAnalysis={runAnalysis} videoRef={videoRef} onToast={notify} />}
        {(page==="Talent profiles"||page==="Learner discovery") && <Profiles role={role} people={people} query={query} setQuery={setQuery} connected={connected} onConnect={connectPerson} onToast={notify} />}
        {page==="Opportunities" && <Opportunities role={role} onToast={notify} />}
        {page==="Leaderboard" && <Leaderboard xp={xp} completed={completed.length} />}
        {page==="Community" && <Community messages={messages} newPost={newPost} setNewPost={setNewPost} addPost={addPost} profile={profile} />}
        {page==="My profile" && <ProfileWorkspace role={role} profile={profile} setProfile={setProfile} showEdit={showProfileEdit} setShowEdit={setShowProfileEdit} xp={xp} progress={progress} completed={completed} onToast={notify} />}
        </div>
      </div>
      <footer className="footer"><span>TalentPath <b>•</b> Grow into your potential</span><span>Prototype mode · Demo data</span></footer>
    </main>
    {toast && <div className="toast">✦ {toast}</div>}
  </div>;
}

function Overview({ role, xp, progress, completed, onNav, onComplete }) {
  const [tab,setTab] = useState("For you");
  if(role==="Coach") return <><div className="hero-card coach-hero"><div className="hero-copy"><span className="hero-tag"><span/> COACH WORKSPACE</span><h2>Discover talent.<br/><em>Shape potential.</em></h2><p>Review learners, requests, and training submissions.</p><div className="hero-actions"><button className="white-btn" onClick={()=>onNav("Learner discovery")}>Find learners →</button><button className="text-btn" onClick={()=>onNav("Athlete review")}>Review submissions</button></div></div></div><div className="stats-grid"><Stat icon="◎" tint="violet" label="Learners to review" value="8" trend="Demo queue"/><Stat icon="↗" tint="green" label="Connection requests" value="3" trend="Awaiting response"/><Stat icon="▤" tint="orange" label="Video submissions" value="5" trend="Needs review"/><Stat icon="◷" tint="blue" label="Upcoming sessions" value="2" trend="This week"/></div><div className="two-col"><div className="panel"><div className="panel-head"><div><h3>Coach action centre</h3><p>Continue where your learners need you.</p></div></div><div className="recommend-list"><div className="recommend-item"><div className="rec-icon">◎</div><div className="rec-body"><strong>Review learner videos</strong><span>Give specific feedback and drills</span></div><button className="circle-arrow" onClick={()=>onNav("Athlete review")}>→</button></div><div className="recommend-item"><div className="rec-icon">↗</div><div className="rec-body"><strong>Discover emerging talent</strong><span>Filter by sport, skill, and location</span></div><button className="circle-arrow" onClick={()=>onNav("Learner discovery")}>→</button></div></div></div><div className="panel progress-panel"><div className="panel-head"><div><h3>Upcoming sessions</h3><p>Keep learner sessions moving.</p></div></div><button className="outline-btn" onClick={()=>onNav("Coach sessions")}>Manage sessions</button></div></div></> ;
  return <>
    <div className="hero-card"><div className="hero-copy"><span className="hero-tag"><span/> YOUR JOURNEY, YOUR PACE</span><h2>Small steps.<br/><em>Remarkable growth.</em></h2><p>Turn what you're learning into skills you can show the world.</p><div className="hero-actions"><button className="white-btn" onClick={()=>onNav("Challenges")}>Explore challenges <span>→</span></button><button className="text-btn" onClick={()=>onNav("My profile")}>View my profile</button></div></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-spark s1">✦</div><div className="art-spark s2">✧</div><div className="art-cube">✦</div><div className="art-ring"><div className="ring-inner">tp</div></div><div className="float-note"><b>+{completed.length ? completed.length*12 : 12}%</b><small>momentum</small></div></div></div>
    <div className="stats-grid"><Stat icon="✧" tint="violet" label="Total XP" value={xp.toLocaleString()} trend="+120 this week"/><Stat icon="◎" tint="green" label="Skills in progress" value="4" trend="Across 3 areas"/><Stat icon="▤" tint="orange" label="Challenges done" value={completed.length.toString()} trend="Keep the streak going"/><Stat icon="↗" tint="blue" label="Growth score" value={`${progress}%`} trend="+8% this month"/></div>
    <div className="section-head"><div><h3>Your learning universe</h3><p>Explore every path. Find the one that sparks you.</p></div><button className="subtle-link" onClick={()=>onNav("Explore learning")}>Explore all areas →</button></div>
    <div className="category-grid">{categories.map((c,i)=><button key={c.id} className={`category-card ${c.tint}`} onClick={()=>onNav(i===0||i===3?"Explore learning":i===4?"AI Studio":i===2?"Talent profiles":"Challenges")}><div className="category-top"><span className="category-icon">{c.icon}</span><span className="card-arrow">↗</span></div><strong>{c.name}</strong><p>{c.desc}</p><div className="category-foot"><span>{["Explore lessons","Build a practical skill","Find talent","Apply your learning","Analyze performance"][i]}</span><b>→</b></div></button>)}</div>
    <div className="two-col"><div className="panel"><div className="panel-head"><div><h3>Recommended for you</h3><p>Picked to help you take your next step.</p></div><div className="tabs">{["For you","Trending"].map(t=><button className={tab===t?"active":""} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div></div><div className="recommend-list">{challengeSeed.slice(tab==="For you"?0:2,tab==="For you"?3:5).map(c=><div className="recommend-item" key={c.id}><div className={`rec-icon rec-${c.kind.toLowerCase().replace(" ","")}`}>{c.kind==="Sports"?"◎":c.kind==="Career"?"↗":c.kind==="AI review"?"◈":"✦"}</div><div className="rec-body"><strong>{c.title}</strong><span>{c.area} · {c.time}</span></div><div className="rec-xp">+{c.xp} XP</div><button className="circle-arrow" onClick={()=>onComplete(c.id)}>→</button></div>)}</div><button className="panel-bottom-link" onClick={()=>onNav("Challenges")}>View all challenges →</button></div>
    <div className="panel progress-panel"><div className="panel-head"><div><h3>Your momentum</h3><p>Progress comes from showing up.</p></div><span className="more">•••</span></div><div className="progress-visual"><div className="progress-circle" style={{"--progress":progress}}><div><b>{progress}%</b><small>growth</small></div></div></div><div className="progress-note"><span className="success-dot"/> <b>You're building a habit!</b><p>Complete a challenge this week to keep your progress moving.</p><button className="outline-btn" onClick={()=>onNav("Challenges")}>Continue learning</button></div></div></div>
    <div className="banner-strip"><div className="banner-icon">✦</div><div><strong>Your skills deserve to be seen.</strong><p>Keep a concise record of skills, achievements, and selected clips on your profile.</p></div><button onClick={()=>onNav("My profile")}>View my profile <span>→</span></button></div>
  </>;
}
function Stat({icon,tint,label,value,trend}) { return <div className="stat-card"><div className={`stat-icon ${tint}`}>{icon}</div><span>{label}</span><strong>{value}</strong><small><i/> {trend}</small></div>; }

function ExploreLearning({onNav,onToast}) {
  const [active,setActive] = useState("All");
  const [track,setTrack] = useState("Studies");
  const [discovery,setDiscovery] = useState(null);
  const discoveries = [{title:"Why does a spinning top stay upright?",text:"Angular momentum resists changes in the direction of rotation. A spinning top gradually falls as friction slows it down.",type:"Physics"},{title:"The 2-minute video edit trick",text:"Cut on motion: transition while the subject is moving to make edits feel more natural and energetic.",type:"Creative skill"},{title:"Cricket: read the seam",text:"The seam angle and wrist position can hint at how a ball may move after pitching. Watch the release, not only the flight.",type:"Sports"},{title:"A tiny Python superpower",text:"Use enumerate(items) when you need both the index and value while looping through a list.",type:"Coding"}];
  const paths = [
    {name:"Learn a concept",desc:"Build understanding through bite-sized lessons and reflection.",type:"Education",icon:"✦",color:"violet",tasks:["Physics: motion, electricity, optics","Chemistry: bonding, acids & bases, titration","Mathematics: calculus, probability, vectors","Biology: cells, genetics, human physiology"]},
    {name:"Practice a real skill",desc:"Work through practical tasks and collect evidence of ability.",type:"Skills",icon:"⌘",color:"blue",tasks:["Video editing: cuts, pacing, color grading","Programming: Python, JavaScript, APIs","Design: typography, layout, prototyping","Communication: speaking, writing, presentation"]},
    {name:"Learn by doing",desc:"Connect theory with applied challenges and mini projects.",type:"Integrated",icon:"↗",color:"green",tasks:["Applied maths and data interpretation","Physics and chemistry lab simulations","Electronics and robotics experiments","Real-world design and build challenges"]},
    {name:"Sports fundamentals",desc:"Explore practice plans, technique cues, and repeatable challenges.",type:"Sports",icon:"◎",color:"orange",tasks:["Cricket: batting, bowling, fielding, match awareness","Football: passing, dribbling, shooting, positioning","Basketball: ball handling, shooting, defense","Tennis, badminton, athletics, swimming and volleyball"]},
  ];
  return <><div className="filter-row"><div className="filter-pills">{["All","Education","Skills","Integrated","Sports"].map(t=><button key={t} className={active===t?"active":""} onClick={()=>setActive(t)}>{t}</button>)}</div><label className="track-filter">My track<select value={track} onChange={e=>setTrack(e.target.value)}>{["Studies","Athlete / Sports","Gaming","Skill Development"].map(t=><option key={t}>{t}</option>)}</select></label></div><div className="panel discovery-card"><div><span className="eyebrow">A LITTLE DISCOVERY</span><h3>{discovery?discovery.title:"Learn something new today"}</h3><p>{discovery?discovery.text:"Get a bite-sized idea outside your usual path—curiosity is a skill too."}</p>{discovery&&<small>{discovery.type}</small>}</div><button className="primary-btn" onClick={()=>setDiscovery(discoveries[Math.floor(Math.random()*discoveries.length)])}>Surprise me ✦</button></div><div className="learning-grid">{paths.filter(p=>(active==="All"||p.type===active)&&(track==="Studies"?p.type!=="Sports":track==="Athlete / Sports"?p.type==="Sports":track==="Gaming"?p.type==="Skills"||p.type==="Integrated":true)).map(p=><div className="learning-card" key={p.name}><div className={`learning-icon ${p.color}`}>{p.icon}</div><span className="learning-type">{p.type}</span><h3>{p.name}</h3><p>{p.desc}</p><ul>{p.tasks.map(t=><li key={t}>✓ {t}</li>)}</ul><button className="outline-btn" onClick={()=>{onToast(`${p.name} path opened in demo.`);onNav("Challenges")}}>Explore path →</button></div>)}</div><div className="panel learning-note"><div className="category-icon violet">✧</div><div><h3>Personalized learning, coming from your activity</h3><p>In a connected version, recommendations can use completed assessments, selected goals, and mentor feedback to suggest the next challenge.</p></div></div></>;
}

function Challenges({list,category,setCategory,completed,started,setStarted,onComplete,query,setQuery}) {
  const [view,setView] = useState("All");
  const [activeId,setActiveId] = useState(null);
  const [challengeAnswer,setChallengeAnswer] = useState("");
  const [challengeStep,setChallengeStep] = useState(0);
  const areas = ["All areas",...categories.map(c=>c.name)];
  const active = list.find(c=>c.id===activeId);
  const visible = list.filter(c=>view==="All"||(view==="Completed"?completed.includes(c.id):!completed.includes(c.id)));
  return <>
    <div className="filter-row"><div className="filter-pills"><button className={view==="All"?"active":""} onClick={()=>setView("All")}>All challenges</button><button className={view==="Completed"?"active":""} onClick={()=>setView("Completed")}>Completed</button><button className={view==="To do"?"active":""} onClick={()=>setView("To do")}>To do</button></div><select className="select" value={category} onChange={e=>setCategory(e.target.value)}>{areas.map(a=><option key={a}>{a}</option>)}</select></div>
    {active&&<div className="panel challenge-detail-panel"><div className="panel-head"><div><span className="eyebrow">CHALLENGE DETAILS</span><h3>{active.title}</h3><p>{active.area} · {active.time} · {active.level}</p></div><button className="outline-btn" onClick={()=>setActiveId(null)}>Close</button></div><p>{active.detail}</p><div className="challenge-meta"><span>Reward: {active.xp} XP</span><span>{completed.includes(active.id)?"Completed":started.includes(active.id)?"In progress":"Not started"}</span></div>{!completed.includes(active.id)&&<><div className="lab-actions"><button className="primary-btn" onClick={()=>{setStarted(ids=>ids.includes(active.id)?ids:[...ids,active.id]);setChallengeStep(1)}}>{started.includes(active.id)?"Resume challenge →":"Start challenge →"}</button><button className="outline-btn" disabled={!started.includes(active.id)} onClick={()=>{onComplete(active.id);setActiveId(null)}}>Mark complete</button></div>{started.includes(active.id)&&<div className="challenge-workspace"><span className="eyebrow">YOUR CHALLENGE WORKSPACE</span><h4>{challengeStep===1?"Your first attempt":"Keep building your response"}</h4><p>Complete the task in your own words. Add your attempt here, then mark it complete when you're satisfied.</p><textarea rows="5" value={challengeAnswer} onChange={e=>setChallengeAnswer(e.target.value)} placeholder="Write your response, plan, or reflection…"/><div className="challenge-meta"><span>{challengeAnswer.trim().split(/\s+/).filter(Boolean).length} words</span><button className="outline-btn" onClick={()=>{try{window.localStorage.setItem(`talentpath-challenge-answer-${active.id}`,challengeAnswer)}catch{}setChallengeStep(2)}}>Save progress</button><button className="primary-btn" onClick={()=>{try{window.localStorage.setItem(`talentpath-challenge-answer-${active.id}`,challengeAnswer)}catch{}onComplete(active.id);setActiveId(null)}} disabled={!challengeAnswer.trim()}>Submit & complete</button></div>{challengeStep===2&&<small>Progress saved on this device. Reopen this challenge to continue.</small>}</div>}</>}</div>}
    <div className="challenge-grid">{visible.map(c=><div className="challenge-card" key={c.id}><div className="challenge-top"><span className={`challenge-type ${c.kind.toLowerCase().replace(" ","")}`}>{c.kind}</span><span className="xp-badge">✧ {c.xp} XP</span></div><h3>{c.title}</h3><p>{c.detail}</p><div className="challenge-meta"><span>◷ {c.time}</span><span>▧ {c.level}</span></div><button className={completed.includes(c.id)?"done-btn":"primary-btn"} onClick={()=>setActiveId(c.id)}>{completed.includes(c.id)?"✓ View completed":"Open challenge →"}</button></div>)}</div>{!visible.length&&<div className="empty-state">No matching challenges. Try another category or search.</div>}
  </>;
}

function AIStudio({role,selectedVideo,videoUrl,analysis,analysisStatus,analysisMode,setAnalysisMode,videoPrompt,setVideoPrompt,selectVideo,runAnalysis,videoRef,onToast}) {
  return <div className="ai-layout"><div className="ai-main"><div className="panel upload-panel"><div className="panel-head"><div><h3>{role==="Coach"?"Learner video review studio":"AI video analysis studio"}</h3><p>{role==="Coach"?"Review a submitted or selected clip, then turn observations into feedback and practice drills.":"Upload a clip, choose what to review, and get a structured improvement report."}</p></div><span className="ai-badge">✦ AI LAB</span></div><div className="upload-box">{!videoUrl?<><div className="upload-illustration"><div>↑</div><span>✦</span></div><h3>{role==="Coach"?"Load a learner review clip":"Drop your video here"}</h3><p>or browse files · MP4, MOV, WebM · up to 100 MB</p><label className="primary-btn file-btn">Choose video<input type="file" accept="video/*" onChange={e=>selectVideo(e.target.files?.[0])}/></label><small>Your video is previewed locally. It is only sent to the AI endpoint if you run analysis.</small></>:<><video ref={videoRef} src={videoUrl} controls className="video-preview"/><div className="video-file-row"><div><strong>{selectedVideo?.name}</strong><small>{selectedVideo ? `${(selectedVideo.size/1024/1024).toFixed(1)} MB` : ""}</small></div><label className="outline-btn file-btn">Replace video<input type="file" accept="video/*" onChange={e=>selectVideo(e.target.files?.[0])}/></label></div></>}</div><div className="analysis-options"><label><span>Analysis category</span><select value={analysisMode} onChange={e=>setAnalysisMode(e.target.value)}><option>Sports</option><option>Cricket technique</option><option>Football technique</option><option>Basketball technique</option><option>Tennis technique</option><option>Badminton technique</option><option>Athletics technique</option><option>Swimming technique</option><option>Volleyball technique</option><option>Hockey technique</option><option>Gaming / esports</option><option>Public speaking</option><option>Practical skill / task</option></select></label><label><span>What should the AI focus on?</span><textarea value={videoPrompt} onChange={e=>setVideoPrompt(e.target.value)} rows="3" /></label></div><button className="primary-btn analyze-btn" onClick={runAnalysis} disabled={analysisStatus==="analyzing"}>{analysisStatus==="analyzing"?"Preparing frames & analyzing…":"✦ Analyze video"}</button><p className="privacy-note">AI output is guidance, not a professional diagnosis or official selection score. A coach should validate important assessments.</p></div>{analysis&&<AnalysisReport analysis={analysis} status={analysisStatus}/>}</div><aside className="ai-side"><div className="panel rubric-panel"><div className="panel-head"><div><h3>How review works</h3><p>Designed to turn a clip into a next step.</p></div></div><div className="rubric-step"><span>01</span><div><b>Observe</b><p>Frames are sampled from your clip.</p></div></div><div className="rubric-step"><span>02</span><div><b>Review against criteria</b><p>Feedback should map to the selected skill and rubric.</p></div></div><div className="rubric-step"><span>03</span><div><b>Practice next</b><p>Receive tips and drills to try in your next attempt.</p></div></div></div><div className="panel ai-tip-card"><div className="tip-star">✦</div><strong>Make your next attempt count</strong><p>Use a consistent camera angle, lighting, and challenge. That makes comparisons across attempts more meaningful.</p></div><CameraSetup /><div className="panel connection-panel"><h3>Camera & lighting setup</h3><p>Place the camera at a stable height, frame the complete movement, and avoid bright windows behind the athlete. Use soft light from the front or side. For a coach review, choose a sport-appropriate angle before recording.</p><div className="setup-tips"><b>Quick setup checklist</b><ul><li>Camera stable; lens clean</li><li>Full body / relevant play area visible</li><li>Light on the subject, not behind</li><li>Record a short sample and check framing</li></ul></div></div>{role==="Coach"&&<CoachAIReviewPanel onToast={onToast}/>}</aside></div>;
}

function CoachAIReviewPanel({onToast}) {
 const [learner,setLearner]=useState("Aarav · Cricket");
 const [feedback,setFeedback]=useState("");
 const [drills,setDrills]=useState("");
 function save(){try{const all=JSON.parse(window.localStorage.getItem("talentpath-ai-coach-reviews")||"[]");window.localStorage.setItem("talentpath-ai-coach-reviews",JSON.stringify([{learner,feedback:feedback.trim(),drills:drills.trim(),savedAt:new Date().toISOString()},...all]));}catch{}onToast("Coach review notes saved on this device.");}
 return <div className="panel coach-ai-review"><div className="panel-head"><div><h3>Coach feedback & drills</h3><p>Attach clear next steps to a learner review.</p></div><span className="ai-badge">COACH TOOLS</span></div><label>Learner / submission<select value={learner} onChange={e=>setLearner(e.target.value)}><option>Aarav · Cricket</option><option>Dev · Esports</option><option>Sana · Robotics</option></select></label><label>Review notes<textarea rows="3" value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="What did the learner do well? What needs attention?"/></label><label>Suggested drills<textarea rows="3" value={drills} onChange={e=>setDrills(e.target.value)} placeholder="Add two or three specific practice steps…"/></label><button className="primary-btn" disabled={!feedback.trim()&&!drills.trim()} onClick={save}>Save coach review →</button></div>;
}

function CameraSetup(){
 const [stream,setStream]=useState(null);const [error,setError]=useState("");const videoRef=useRef(null);
 useEffect(()=>{if(videoRef.current&&stream)videoRef.current.srcObject=stream;return()=>{if(stream)stream.getTracks().forEach(t=>t.stop())}},[stream]);
 async function start(){try{setError("");if(!navigator.mediaDevices?.getUserMedia){setError("Camera preview is not available in this browser or on this connection.");return;}const s=await navigator.mediaDevices.getUserMedia({video:{facingMode:"environment"},audio:false});setStream(s)}catch(e){setError("Camera permission was not granted. You can still use the setup checklist.")}}
 function stop(){if(stream)stream.getTracks().forEach(t=>t.stop());setStream(null)}
 return <div className="panel camera-setup-panel"><div className="panel-head"><div><h3>Recording setup assistant</h3><p>Preview framing and use the checks before capturing your training clip.</p></div><span className="ai-badge">CAMERA</span></div>{stream?<video ref={videoRef} autoPlay muted playsInline className="camera-live-preview"/>:<div className="camera-preview-placeholder">◎<span>Camera preview is off</span></div>}<div className="camera-checklist"><label><input type="checkbox"/> Subject / full movement fits in frame</label><label><input type="checkbox"/> Light comes from the front or side</label><label><input type="checkbox"/> Camera is steady and at a useful angle</label><label><input type="checkbox"/> Background is clear enough to see movement</label></div><div className="lab-actions">{stream?<button className="outline-btn" onClick={stop}>Stop camera</button>:<button className="primary-btn" onClick={start}>Start camera preview →</button>}</div>{error&&<p className="muted">{error}</p>}<small className="muted">Preview stays in this browser. The checklist is guidance; automatic lighting detection is not enabled in this prototype.</small></div>
}


function AnalysisReport({analysis,status}) { return <div className="panel report-panel"><div className="report-head"><div><span className="eyebrow">YOUR REVIEW</span><h3>{analysis.label || (status==="done"?"AI analysis complete":"Review preview")}</h3></div>{analysis.score!=null&&<div className="score-circle"><b>{analysis.score}</b><small>/100</small></div>}</div><p className="report-summary">{analysis.summary}</p><div className="report-columns"><div><h4>✦ Strengths</h4><ul>{(analysis.strengths||[]).map((s,i)=><li key={i}>{s}</li>)}</ul></div><div><h4>↗ Improvement tips</h4><ul>{(analysis.improvements||[]).map((s,i)=><li key={i}>{s}</li>)}</ul></div></div><div className="drill-box"><b>Next practice plan</b><ul>{(analysis.drills||[]).map((s,i)=><li key={i}>{s}</li>)}</ul></div><div className="report-foot"><span>Confidence: {analysis.confidence||"Not provided"}</span><span>{status==="done"?"AI generated":"Demo / not evaluated"}</span></div></div>; }

function Profiles({role,people,query,setQuery,connected,onConnect,onToast}) {
  const [filter,setFilter] = useState("All");
  const [sport,setSport] = useState("All sports");
  const [level,setLevel] = useState("All levels");
  const [age,setAge] = useState("All ages");
  const [position,setPosition] = useState("All positions");
  const [skill,setSkill] = useState("All skills");
  const [detail,setDetail] = useState(null);
  const filtered = people.filter(p=>(role==="Coach" ? ((filter==="All"&&(p.role==="Student"||p.role==="Athlete"))||p.role===filter) : (filter==="All"||p.role===filter||(filter==="Education"&&p.classification==="Education")||(filter==="Sports"&&p.classification==="Sports")))&&
    (sport==="All sports"||p.sport===sport)&& (level==="All levels"||p.skillLevel===level)&&
    (age==="All ages"||p.ageGroup===age)&&(position==="All positions"||p.position===position)&&(skill==="All skills"||p.tags.some(tag=>tag.toLowerCase().includes(skill.toLowerCase()))||p.specialty.toLowerCase().includes(skill.toLowerCase()))&&
    `${p.name} ${p.specialty} ${p.location} ${p.tags.join(" ")}`.toLowerCase().includes(query.toLowerCase()));
  return <><div className="section-head"><div><h3>{role==="Coach"?"Discover learners and athletes":"Talent profiles"}</h3><p>{role==="Coach"?"Filter by discipline, skill level, age group, and playing position to find a good match.":"Explore people across education, sports, and skill-building."}</p></div><span className="ai-badge">{role==="Coach"?"COACH DISCOVERY":"TALENT NETWORK"}</span></div><div className="profile-toolbar"><div className="filter-pills">{(role==="Coach"?["All","Student","Athlete"]:["All","Education","Sports","Student","Athlete","Coach","Mentor"]).map(t=><button className={filter===t?"active":""} onClick={()=>setFilter(t)} key={t}>{t==="All"?"Everyone":t==="Education"?"Education learners":t==="Sports"?"Sports athletes":t==="Coach"?"Coaches":t==="Athlete"?"Athletes":t==="Student"?"Students":t+"s"}</button>)}</div><div className="search profile-search"><span>⌕</span><input placeholder="Search by skill or location" value={query} onChange={e=>setQuery(e.target.value)}/></div></div><div className="profile-filter-grid"><select value={sport} onChange={e=>setSport(e.target.value)}><option>All sports</option>{["Cricket","Football","Basketball","Tennis","Badminton","Athletics","Swimming","Esports","Volleyball","Hockey","Other"].map(x=><option key={x}>{x}</option>)}</select><select value={level} onChange={e=>setLevel(e.target.value)}><option>All levels</option>{["Beginner","Intermediate","Advanced","Professional"].map(x=><option key={x}>{x}</option>)}</select><select value={age} onChange={e=>setAge(e.target.value)}><option>All ages</option>{["Under 13","13–17","18–21","22+"].map(x=><option key={x}>{x}</option>)}</select><select value={position} onChange={e=>setPosition(e.target.value)}><option>All positions</option>{["Batter","Bowler","All-rounder","Goalkeeper","Defender","Midfielder","Attacker","Guard","Center","Winger","Striker","Other"].map(x=><option key={x}>{x}</option>)}</select><select value={skill} onChange={e=>setSkill(e.target.value)}><option>All skills</option>{["Batting","Bowling","Fitness","Tactical","Python","Robotics","Arduino","FPS","Video review","Team play"].map(x=><option key={x}>{x}</option>)}</select></div><div className="people-grid">{filtered.map(p=><div className="person-card" key={p.id}><div className="person-card-top"><Avatar person={p}/><span className={`role-badge ${p.role.toLowerCase()}`}>{p.role}</span>{p.status==="Accepted"&&<span className="accepted-badge">Accepted</span>}<button className="dots" onClick={()=>setDetail(p)}>•••</button></div><h3>{p.name}</h3><div className="person-specialty">{p.specialty}</div><div className="rating-line"><span>★</span><b>{p.rating.toFixed(1)}</b><small>({p.reviews} reviews)</small></div><p>{p.bio}</p><div className="tag-list">{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className="person-location">⌖ {p.location}</div><div className="person-actions"><button className="outline-btn" onClick={()=>setDetail(p)}>View profile</button><button className={connected.includes(p.id)?"connected-btn":"primary-btn"} onClick={()=>onConnect(p.id)}>{connected.includes(p.id)?"Requested":"Connect"}</button></div></div>)}</div>{detail&&<div className="modal-backdrop" onClick={()=>setDetail(null)}><div className="profile-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setDetail(null)}>×</button><Avatar person={detail}/><span className={`role-badge ${detail.role.toLowerCase()}`}>{detail.role}</span><h2>{detail.name}</h2><h4>{detail.specialty}</h4><div className="rating-line"><span>★</span><b>{detail.rating.toFixed(1)}</b><small>{detail.reviews} community ratings</small></div><p>{detail.bio}</p><div className="tag-list">{detail.tags.map(t=><span key={t}>{t}</span>)}</div><div className="profile-modal-meta">Location: {detail.location}<br/>Profile ratings shown are sample demo data, not verified user reviews.</div><button className="primary-btn" onClick={()=>{onConnect(detail.id);setDetail(null)}}>Connect / request feedback</button></div></div>}</>;
}

function Opportunities({role,onToast}) {
  const [interestedIds,setInterestedIds] = useState([]);
  const opportunities = [{title:"Community cricket skill clinic",org:"Hyderabad Grassroots Sports",type:"Sports",location:"Hyderabad",desc:"Open practice and coach-led assessment for emerging players.",tags:["Beginner-friendly","In-person"]},{title:"Student project showcase",org:"TalentPath Community",type:"Education + skills",location:"Online",desc:"Present a practical project and receive feedback from mentors.",tags:["Project evidence","Mentorship"]},{title:"Junior coding project review",org:"Volunteer Mentor Network",type:"Career",location:"Online",desc:"Get feedback on a beginner project and learn how to improve your portfolio.",tags:["Coding","Career readiness"]},{title:"Esports VOD review session",org:"Community Coaches",type:"Sports + AI",location:"Online",desc:"Submit a short gameplay clip for a guided review session.",tags:["Gaming","Video review"]}];
  return <><div className="section-head"><div><h3>Opportunities to grow</h3><p>Demo listings. Connect real organizations after deployment.</p></div><span className="ai-badge">4 OPEN</span></div><div className="opportunity-list">{opportunities.map((o,i)=><div className="opportunity-card" key={i}><div className={`opportunity-symbol op-${i}`}>{["◎","✦","↗","◈"][i]}</div><div className="opportunity-content"><span className="learning-type">{o.type}</span><h3>{o.title}</h3><b>{o.org}</b><p>{o.desc}</p><div className="tag-list">{o.tags.map(t=><span key={t}>{t}</span>)}</div><small>⌖ {o.location}</small></div><button className={interestedIds.includes(i)?"connected-btn":"outline-btn"} onClick={()=>{setInterestedIds(ids=>ids.includes(i)?ids:([...ids,i]));onToast("Your interest has been registered for this demo opportunity.")}}>{interestedIds.includes(i)?"✓ Interest registered":"I'm interested →"}</button></div>)}</div></>;
}

function Leaderboard({xp,completed}) {
  const [scope,setScope] = useState("Weekly");
  const [group,setGroup] = useState("Education");
  const education=[{name:"Riya S.",xp:1240,initials:"RS",color:"peach",level:"Learning streak"},{name:"Kabir A.",xp:980,initials:"KA",color:"blue",level:"Concept builder"},{name:"You",xp,initials:"YO",color:"lilac",level:`${completed} challenges completed`},{name:"Zoya M.",xp:720,initials:"ZM",color:"mint",level:"Skill builder"},{name:"Dev P.",xp:660,initials:"DP",color:"yellow",level:"Community contributor"}];
  const athletes=[{name:"Arjun K.",xp:1380,initials:"AK",color:"blue",level:"Cricket athlete"},{name:"Aarav R.",xp:1150,initials:"AR",color:"peach",level:"Football player"},{name:"You",xp:840,initials:"YO",color:"lilac",level:"Practice consistency"},{name:"Dev M.",xp:760,initials:"DM",color:"mint",level:"Esports athlete"},{name:"Sana K.",xp:650,initials:"SK",color:"yellow",level:"Sports explorer"}];
  const ranks=(group==="Education"?education:athletes).sort((a,b)=>b.xp-a.xp);
  return <><div className="filter-row"><div><h3>Celebrate progress</h3><p className="muted">Separate education and athlete rankings. Demo results; participation should be opt-in.</p></div><div className="filter-pills">{["Education","Athletes"].map(t=><button className={group===(t==="Athletes"?"Athletes":"Education")?"active":""} onClick={()=>setGroup(t==="Athletes"?"Athletes":"Education")} key={t}>{t}</button>)}{["Weekly","All time"].map(t=><button className={scope===t?"active":""} onClick={()=>setScope(t)} key={t}>{t}</button>)}</div></div><div className="panel leaderboard-panel"><div className="leaderboard-header"><div className="podium"><div><Avatar person={ranks[1]}/><b>{ranks[1].name}</b><small>{ranks[1].xp} XP</small><div className="podium-block second">2</div></div><div><span className="crown">♛</span><Avatar person={ranks[0]}/><b>{ranks[0].name}</b><small>{ranks[0].xp} XP</small><div className="podium-block first">1</div></div><div><Avatar person={ranks[2]}/><b>{ranks[2].name}</b><small>{ranks[2].xp} XP</small><div className="podium-block third">3</div></div></div></div>{ranks.map((p,i)=><div className={`rank-row ${p.name==="You"?"you":""}`} key={p.name}><span className="rank-number">{i+1}</span><Avatar person={p} small/><div className="rank-person"><b>{p.name}</b><small>{p.level}</small></div><strong>{scope==="Weekly"?p.xp:Math.round(p.xp*2.8)} XP</strong></div>)}</div></>;
}

function Community({messages,newPost,setNewPost,addPost,profile}) {
  return <div className="community-layout"><div className="panel community-feed"><div className="panel-head"><div><h3>Community circle</h3><p>Share progress, ask for feedback, and celebrate wins.</p></div><span className="ai-badge">COMMUNITY</span></div><div className="post-composer"><Avatar person={{name:profile.name,initials:profile.name.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"lilac"}}/><div><textarea value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="Share a learning win or ask the community…" rows="3"/><button className="primary-btn" onClick={addPost}>Share post</button></div></div>{messages.slice().reverse().map(m=><div className="community-post" key={m.id}><div className="post-head"><Avatar person={{name:m.author,initials:m.author.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"blue"}} small/><div><b>{m.author}</b><small>{m.time}</small></div></div><p>{m.text}</p><div className="post-actions"><button>♡ Appreciate</button><button>↩ Reply</button><button>♧ Share</button></div></div>)}</div><aside className="panel community-side"><h3>Community guidelines</h3><p>Make this a kind place for people learning in public.</p><ul><li>Give specific, constructive feedback.</li><li>Respect privacy. Ask before sharing someone’s clip.</li><li>Celebrate effort and improvement, not just rankings.</li><li>Never post sensitive personal information.</li></ul><div className="community-prompt"><span>✦ WEEKLY PROMPT</span><b>What’s one thing you improved this week?</b></div></aside></div>;
}

function ProfileWorkspace({role,profile,setProfile,showEdit,setShowEdit,onToast}) {
  const [skillInput,setSkillInput] = useState("");
  const [interestInput,setInterestInput] = useState("");
  const skills = Array.isArray(profile.skills) ? profile.skills : [];
  const interests = Array.isArray(profile.interests) ? profile.interests : [];
  const updateList = (field, value, removeValue) => setProfile(p=>({...p,[field]:removeValue ? (p[field]||[]).filter(x=>x!==removeValue) : [...(p[field]||[]),value]}));
  const saveProfile = () => {
    try { window.localStorage.setItem("talentpath-profile",JSON.stringify(profile)); } catch {}
    setShowEdit(false);
    onToast("Profile changes saved on this device.");
  };
  return <div className="portfolio-layout profile-workspace">
    <div className="panel portfolio-main">
      <div className="portfolio-cover"><span>✦ TALENTPATH PROFILE</span><div className="cover-orbit"/></div>
      <div className="portfolio-profile">
        <Avatar person={{name:profile.name,initials:profile.name.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"lilac"}}/>
        <div className="portfolio-id"><h2>{profile.name}</h2><p>{profile.headline}</p><small>⌖ {profile.location} · {role} profile</small></div>
        <button className="outline-btn" onClick={()=>setShowEdit(!showEdit)}>{showEdit?"Close editor":"Edit profile"}</button>
      </div>
      {showEdit&&<div className="profile-edit-form">
        <label>Name<input value={profile.name} onChange={e=>setProfile(p=>({...p,name:e.target.value}))}/></label>
        <label>Headline<input value={profile.headline} onChange={e=>setProfile(p=>({...p,headline:e.target.value}))}/></label>
        <label>Location<input value={profile.location} onChange={e=>setProfile(p=>({...p,location:e.target.value}))}/></label>
        <label>About<textarea rows="3" value={profile.about} onChange={e=>setProfile(p=>({...p,about:e.target.value}))}/></label>
        <label>Visibility<select value={profile.visibility} onChange={e=>setProfile(p=>({...p,visibility:e.target.value}))}><option>Public</option><option>Private</option><option>Coaches only</option></select></label>
        <div className="profile-tag-editor"><label>Add a skill / specialty<input value={skillInput} onChange={e=>setSkillInput(e.target.value)} placeholder="e.g. video editing"/></label><button className="outline-btn" disabled={!skillInput.trim()} onClick={()=>{updateList("skills",skillInput.trim());setSkillInput("")}}>＋ Add skill</button></div>
        <div className="profile-tag-editor"><label>Add an interest<input value={interestInput} onChange={e=>setInterestInput(e.target.value)} placeholder="e.g. robotics"/></label><button className="outline-btn" disabled={!interestInput.trim()} onClick={()=>{updateList("interests",interestInput.trim());setInterestInput("")}}>＋ Add interest</button></div>
        <button className="primary-btn" onClick={saveProfile}>Save profile</button>
      </div>}
      <div className="portfolio-about"><h3>About me</h3><p>{profile.about}</p></div>
      <div className="portfolio-skills"><h3>{role==="Coach"?"Specialties & skills":"Skills"}</h3><div className="tag-list">{skills.map((value,i)=><span key={`${value}-${i}`}>{value}{showEdit&&<button type="button" aria-label={`Remove ${value}`} onClick={()=>updateList("skills",null,value)}> ×</button>}</span>)}</div></div>
      <div className="portfolio-skills"><h3>Interests</h3><div className="tag-list">{interests.map((value,i)=><span key={`${value}-${i}`}>{value}{showEdit&&<button type="button" aria-label={`Remove ${value}`} onClick={()=>updateList("interests",null,value)}> ×</button>}</span>)}</div></div>
    </div>
    <aside className="portfolio-stats">
      <div className="panel visibility-card"><span className="visibility-icon">◉</span><h3>Profile visibility</h3><p>Choose who can discover your profile. Avoid publishing private contact details.</p><span className="visibility-status">{profile.visibility}</span></div>
      <div className="panel"><h3>{role==="Coach"?"Coach profile checklist":"Profile checklist"}</h3><div className="profile-check-row">✓ Bio and headline</div><div className="profile-check-row">✓ Location and visibility</div><div className="profile-check-row">{skills.length?"✓":"○"} Skills / specialties</div><div className="profile-check-row">{interests.length?"✓":"○"} Interests</div><button className="outline-btn" onClick={()=>setShowEdit(true)}>Edit profile →</button></div>
    </aside>
  </div>;
}

function ReviewSubmissions({onNav,onToast}) {
  const [selected,setSelected] = useState("Aarav's cricket bowling clip");
  const [feedback,setFeedback] = useState("");
  return <div className="review-layout"><div className="panel"><div className="panel-head"><div><h3>Submission review queue</h3><p>Sample submissions for coach workspace.</p></div><span className="ai-badge">3 WAITING</span></div>{["Aarav's cricket bowling clip","Sana's robotics demo","Dev's gameplay VOD"].map((s,i)=><button className={`submission-row ${selected===s?"selected":""}`} key={s} onClick={()=>setSelected(s)}><div className="submission-icon">{["◎","⌘","◈"][i]}</div><div><b>{s}</b><small>{["Sports • submitted 2h ago","Practical skill • yesterday","Gaming • 4h ago"][i]}</small></div><span>→</span></button>)}</div><div className="panel review-detail"><span className="eyebrow">SELECTED SUBMISSION</span><h3>{selected}</h3><p>Demo review screen. A connected version can show uploaded evidence, rubric dimensions, and AI suggestions for coach validation.</p><label>Coach feedback<textarea rows="5" value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Write specific, constructive feedback…"/></label><button className="primary-btn" onClick={()=>onToast("Feedback saved in this demo.")}>Save feedback</button><button className="outline-btn" onClick={()=>onNav("AI Studio")}>Open AI Studio</button></div></div>;
}

function PracticalLabs({onToast}) {
 const [lab,setLab]=useState("Physics"); const [experiment,setExperiment]=useState("Ohm's law circuit"); const [step,setStep]=useState(0); const [material,setMaterial]=useState("Copper wire");
 const [voltage,setVoltage]=useState(6); const [resistance,setResistance]=useState(3); const [ran,setRan]=useState(false);
 const list={Chemistry:["Hardness of water","Acid-base indicator","Separation of mixtures"],Physics:["Ohm's law circuit","Lens and image formation","Motion and friction"],"Editing Lab":["Build a 20-second montage","Balance audio levels","Color-match two shots"]};
 const steps=["Set up the virtual workspace and review the equipment.","Choose materials and configure the experiment parameters.","Run the experiment and observe the simulated result.","Review the explanation and connect it to the real-world concept."];
 const current=voltage/resistance;
 return <><div className="section-head"><div><h3>Practical laboratories</h3><p>Explore a guided lab, then experiment with the setup yourself.</p></div><span className="ai-badge">INTERACTIVE LAB</span></div><div className="filter-pills">{Object.keys(list).map(x=><button className={lab===x?"active":""} key={x} onClick={()=>{setLab(x);setExperiment(list[x][0]);setStep(0);setRan(false)}}>{x}</button>)}</div><div className="lab-layout"><div className="panel lab-workspace"><div className="lab-visual"><div className="lab-glow"/><div className="lab-flask">{lab==="Physics"?"ϟ":lab==="Chemistry"?"⚗":"▶"}</div><span>{lab.toUpperCase()} / VIRTUAL BENCH</span></div><label>Experiment<select value={experiment} onChange={e=>{setExperiment(e.target.value);setStep(0);setRan(false)}}>{list[lab].map(x=><option key={x}>{x}</option>)}</select></label>
 {lab==="Physics"&&experiment==="Ohm's law circuit"?<div className="ohms-sim"><span className="eyebrow">LIVE CIRCUIT SIMULATOR</span><div className="circuit-visual"><span className="battery">{voltage} V</span><svg viewBox="0 0 320 100" role="img" aria-label="Circuit diagram"><path d="M30 50 H105 M215 50 H290 V15 H30 V50 M30 50 V85 H290 V50" fill="none" stroke="currentColor" strokeWidth="3"/><rect x="105" y="35" width="110" height="30" rx="5" fill="#dbeafe" stroke="#2563eb" strokeWidth="2"/><text x="160" y="55" textAnchor="middle" fontSize="12" fill="#1e3a8a">R = {resistance} Ω</text></svg><span className="ammeter">{current.toFixed(2)} A</span></div><label>Voltage: {voltage} V<input type="range" min="1" max="12" step="1" value={voltage} onChange={e=>{setVoltage(+e.target.value);setRan(false)}}/></label><label>Resistance: {resistance} Ω<input type="range" min="1" max="12" step="1" value={resistance} onChange={e=>{setResistance(+e.target.value);setRan(false)}}/></label><button className="primary-btn" onClick={()=>setRan(true)}>Run circuit →</button>{ran&&<div className="mentor-message mentor"><b>Measured simulation result</b><p>Using Ohm's law, I = V ÷ R = {voltage} ÷ {resistance} = <strong>{current.toFixed(2)} A</strong>. {resistance} Ω at {voltage} V produces {current.toFixed(2)} amperes in this ideal circuit.</p><p>Try doubling the resistance while keeping voltage constant. What happens to current?</p></div>}</div>:<><label>Material / tool<select value={material} onChange={e=>setMaterial(e.target.value)}>{["EDTA solution","Soap solution","Distilled water","Copper wire","Lens","Video clips","Audio track","Color chart"].map(x=><option key={x}>{x}</option>)}</select></label><div className="lab-step"><span>STEP {step+1} / 4</span><h3>{steps[step]}</h3><p>Current selection: <b>{material}</b>. This guided model uses illustrative observations, not real laboratory measurements.</p></div><div className="lab-actions"><button className="outline-btn" disabled={step===0} onClick={()=>setStep(s=>Math.max(0,s-1))}>← Previous</button><button className="primary-btn" onClick={()=>step===3?onToast("Experiment completed. Summary added to your learning activity."):setStep(s=>s+1)}>{step===3?"Complete experiment":"Next step →"}</button></div></>}</div><aside className="panel lab-guide"><h3>AI lab guide</h3><p>Ask why a step matters, what to observe, or how this concept applies in practice.</p><button className="outline-btn" onClick={()=>onToast(`Guide: ${experiment} explores a core ${lab.toLowerCase()} concept. Review the procedure, compare observations, and explain the cause.`)}>Explain this experiment →</button><div className="video-placeholder">▶<span>Experiment walkthrough</span><small>Video lesson placeholder</small></div><p className="muted">Chemistry experiments are limited to safe educational simulations.</p></aside></div></>;
}
function AIMentor({onToast}) { const [messages,setMessages]=useState([{role:"mentor",text:"Tell me what you are thinking about. We can unpack it together, one question at a time."}]);const [draft,setDraft]=useState("");const send=()=>{if(!draft.trim())return;const user=draft.trim();setMessages(m=>[...m,{role:"you",text:user},{role:"mentor",text:`Let's explore that: what part feels most important to you, and what have you already tried? A useful next step is to break “${user.slice(0,90)}” into one small, testable action.`}]);setDraft("")};return <div className="panel mentor-panel"><div className="panel-head"><div><h3>AI thought partner</h3><p>Supportive reflection and learning guidance—not a substitute for a trusted adult or professional.</p></div><span className="ai-badge">MENTOR</span></div><div className="mentor-messages">{messages.map((m,i)=><div className={`mentor-message ${m.role}`} key={i}><b>{m.role==="you"?"You":"TalentPath Mentor"}</b><p>{m.text}</p></div>)}</div><div className="mentor-compose"><textarea value={draft} onChange={e=>setDraft(e.target.value)} placeholder="Share your question or thought…" rows="2"/><button className="primary-btn" onClick={send}>Ask mentor →</button></div></div>}
function FastThinking({onToast}) {const [scenario,setScenario]=useState(0);const [answer,setAnswer]=useState("");const [submitted,setSubmitted]=useState(false);const prompts=["Your team is trailing by one point with 20 seconds left. The opponent is pressing. What is your decision and why?","You notice a teammate becoming frustrated after two mistakes. How do you respond while keeping focus?","You have limited time to prepare for a match and notice your opponent favors one side. What do you adjust?"];return <div className="panel scenario-panel"><span className="ai-badge">ATHLETE DECISION LAB</span><h3>Fast Thinking</h3><p className="muted">Practice reasoning in game-like situations. AI feedback is a learning aid, not an objective talent rating.</p><div className="scenario-card"><span>SCENARIO {scenario+1} / {prompts.length}</span><h2>{prompts[scenario]}</h2><textarea rows="6" value={answer} onChange={e=>{setAnswer(e.target.value);setSubmitted(false)}} placeholder="Explain what you would do, why, and what risks you considered…"/><div className="lab-actions"><button className="outline-btn" onClick={()=>{setScenario((scenario+1)%prompts.length);setAnswer("");setSubmitted(false)}}>Next scenario →</button><button className="primary-btn" disabled={!answer.trim()} onClick={()=>setSubmitted(true)}>Submit reasoning</button></div>{submitted&&<div className="mentor-message mentor"><b>Reflection feedback</b><p>Your answer is submitted in the prototype. Consider whether you explained your goal, evaluated risk, included teammates, and described an alternative if the first choice fails.</p><button className="outline-btn" onClick={()=>onToast("Your response is shown publicly in the demo scenario feed.")}>Share answer publicly →</button></div>}</div></div>}
function TalentExchange({onToast}) {const [skill,setSkill]=useState("Video editing");const [topic,setTopic]=useState("");const [items,setItems]=useState([{id:1,name:"Sana K.",skill:"Robotics",topic:"Help me understand Arduino sensors",kind:"Looking to learn"},{id:2,name:"Dev M.",skill:"Cricket",topic:"I can guide beginners on batting basics",kind:"Offering to teach"}]);return <><div className="section-head"><div><h3>Talent Exchange</h3><p>Students can offer a skill, request help, and connect to learn from each other.</p></div></div><div className="panel exchange-compose"><label>Skill<select value={skill} onChange={e=>setSkill(e.target.value)}>{["Video editing","Coding","Cricket","Football","Robotics","Photography","Maths","Music","Other"].map(x=><option key={x}>{x}</option>)}</select></label><label>What do you want to share or learn?<input value={topic} onChange={e=>setTopic(e.target.value)} placeholder="Describe a skill or help request"/></label><button className="primary-btn" onClick={()=>{if(!topic.trim())return;setItems(a=>[{id:Date.now(),name:"You",skill,topic,kind:"Looking to learn"},...a]);setTopic("");onToast("Your talent exchange post is live in this prototype.")}}>Post to exchange →</button></div><div className="people-grid">{items.map(x=><div className="person-card" key={x.id}><span className="role-badge student">{x.kind}</span><h3>{x.name}</h3><div className="person-specialty">{x.skill}</div><p>{x.topic}</p><button className="outline-btn" onClick={()=>onToast("A collaboration request was sent in the demo.")}>Request to connect →</button></div>)}</div></>}
function LiveSessions({role,onToast}) {const [title,setTitle]=useState("");const [kind,setKind]=useState("Learning");const [sessions,setSessions]=useState([{id:1,title:"Cricket batting basics",host:"Coach Ananya",kind:"Sports",time:"Today · 5:30 PM",spots:8},{id:2,title:"Editing transitions workshop",host:"Student creator circle",kind:"Creative",time:"Tomorrow · 6:00 PM",spots:12}]);return <><div className="section-head"><div><h3>Live learning sessions</h3><p>Join coach-led workshops or student-hosted skill sessions. This prototype models scheduling and participation; live video requires a conferencing provider.</p></div></div>{role==="Coach"&&<div className="panel exchange-compose"><label>Session title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="What will you teach?"/></label><label>Session type<select value={kind} onChange={e=>setKind(e.target.value)}><option>Learning</option><option>Sports</option><option>Creative</option><option>Practical Lab</option></select></label><button className="primary-btn" onClick={()=>{if(!title.trim())return;setSessions(s=>[{id:Date.now(),title,host:"You · Coach",kind,time:"Scheduled · Demo",spots:15},...s]);setTitle("");onToast("Session published in the prototype.")}}>Publish session →</button></div>}<div className="opportunity-list">{sessions.map(s=><div className="opportunity-card" key={s.id}><div className="opportunity-symbol">◉</div><div className="opportunity-content"><span className="learning-type">{s.kind} · {s.time}</span><h3>{s.title}</h3><b>{s.host}</b><p>{s.spots} available spots · live session listing</p></div><button className="primary-btn" onClick={()=>onToast("You joined the session list. Video-room integration is not enabled in this prototype.")}>Join session →</button></div>)}</div></>}
function CoachSessions({onToast}) {const [title,setTitle]=useState("");const [desc,setDesc]=useState("");const [sessions,setSessions]=useState([{title:"Fundamentals: building a practice routine",desc:"A structured 30-minute session for new athletes."},{title:"Study skills: learning by explaining",desc:"Help learners develop a concept and test their understanding."}]);return <><div className="section-head"><div><h3>Publish a coach lesson</h3><p>Upload and share a teaching session for students to revisit.</p></div></div><div className="panel exchange-compose"><label>Session title<input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter your lesson title"/></label><label>Description<textarea rows="3" value={desc} onChange={e=>setDesc(e.target.value)} placeholder="What will learners gain?"/></label><label>Lesson media<input type="file" accept="video/*,.pdf"/></label><button className="primary-btn" onClick={()=>{if(!title.trim())return;setSessions(s=>[{title,desc:desc||"Coach-created learning session."},...s]);setTitle("");setDesc("");onToast("Lesson published locally in the prototype.")}}>Publish lesson →</button></div><div className="people-grid">{sessions.map((s,i)=><div className="learning-card" key={i}><span className="learning-type">COACH LESSON</span><h3>{s.title}</h3><p>{s.desc}</p><button className="outline-btn" onClick={()=>onToast("Lesson opened in demo preview.")}>View lesson →</button></div>)}</div></>}
function AthleteReview({onNav,onToast}) {
  const submissions=[
    {id:"aarav",title:"Aarav · Cricket bowling clip",detail:"Cricket · Submitted 2 hours ago",focus:"Run-up rhythm, front-foot landing, follow-through"},
    {id:"dev",title:"Dev · Esports decision clip",detail:"Esports · Submitted yesterday",focus:"Map awareness, timing, and decision selection"},
    {id:"sana",title:"Sana · Robotics demo",detail:"Robotics · Submitted yesterday",focus:"Circuit safety, wiring clarity, and test procedure"}
  ];
  const [selectedId,setSelectedId]=useState("aarav");
  const [feedback,setFeedback]=useState("");
  const [drills,setDrills]=useState("");
  const selected=submissions.find(x=>x.id===selectedId)||submissions[0];
  function save(){
    const entry={submissionId:selected.id,title:selected.title,feedback:feedback.trim(),drills:drills.trim(),savedAt:new Date().toISOString()};
    try{const old=JSON.parse(window.localStorage.getItem("talentpath-coach-feedback")||"[]");window.localStorage.setItem("talentpath-coach-feedback",JSON.stringify([entry,...old.filter(x=>x.submissionId!==selected.id)]));}catch{}
    onToast("Coach feedback and suggested drills saved on this device.");
  }
  return <div className="review-layout">
    <div className="panel"><div className="panel-head"><div><h3>Video review queue</h3><p>Sample learner submissions for coach practice.</p></div><span className="ai-badge">3 SUBMISSIONS</span></div>
      {submissions.map((item,i)=><button className={`submission-row ${selectedId===item.id?"selected":""}`} key={item.id} onClick={()=>setSelectedId(item.id)}><div className="submission-icon">{["◎","◈","⌘"][i]}</div><div><b>{item.title}</b><small>{item.detail}</small></div><span>→</span></button>)}
    </div>
    <div className="panel review-detail"><span className="eyebrow">COACH REVIEW</span><h3>{selected.title}</h3><p>Review focus: {selected.focus}. Sample submissions do not contain real learner video in this prototype.</p>
      <label>Coach feedback<textarea rows="4" value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Write specific, constructive feedback for the learner…"/></label>
      <label>Suggested drills / next steps<textarea rows="3" value={drills} onChange={e=>setDrills(e.target.value)} placeholder="Suggest focused exercises to practice…"/></label>
      <div className="lab-actions"><button className="primary-btn" onClick={save} disabled={!feedback.trim()&&!drills.trim()}>Save feedback</button><button className="outline-btn" onClick={()=>onNav("AI Studio")}>Open AI Studio →</button></div>
    </div>
  </div>;
}


createRoot(document.getElementById("root")).render(<App/>);
