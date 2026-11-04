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
  { id: 3, name: "Meera Iyer", role: "Mentor", specialty: "Coding • Career readiness", location: "Bengaluru, Karnataka", rating: 4.9, reviews: 26, bio: "Guides students from fundamentals to portfolio projects and internship readiness.", tags: ["Python", "Portfolio", "Interview prep"], initials: "MI", color: "lilac" },
  { id: 4, name: "Dev Malhotra", role: "Student", specialty: "Esports • FPS", location: "Delhi, India", rating: 4.6, reviews: 12, bio: "Tracks match performance and shares improvement clips with a team.", tags: ["FPS", "VOD review", "Team play"], initials: "DM", color: "mint" },
  { id: 5, name: "Sana Khan", role: "Student", specialty: "Robotics • Embedded systems", location: "Hyderabad, Telangana", rating: 4.7, reviews: 9, bio: "Building small robotics projects and documenting practical skills.", tags: ["Robotics", "Arduino", "Projects"], initials: "SK", color: "yellow" },
];

const challengeSeed = [
  { id: 1, title: "Explain a concept in 90 seconds", area: "Education & learning", kind: "Learning", xp: 120, time: "20 min", level: "Starter", detail: "Choose a concept you recently learned. Explain it in your own words and identify one example." },
  { id: 2, title: "Build a mini portfolio project", area: "Skill development / career readiness", kind: "Career", xp: 250, time: "2–4 hrs", level: "Intermediate", detail: "Build a small project, include a README, and submit a demo plus what you learned." },
  { id: 3, title: "Cricket bowling fundamentals", area: "Sports & talent discovery", kind: "Sports", xp: 180, time: "30 min", level: "Starter", detail: "Record a short run-up and delivery sequence. Review balance, rhythm, and follow-through." },
  { id: 4, title: "Learn → build: applied maths", area: "Education + skills", kind: "Integrated", xp: 200, time: "45 min", level: "Intermediate", detail: "Use a math idea to solve a real scenario and show your working." },
  { id: 5, title: "Review a gameplay decision", area: "Sports + AI", kind: "AI review", xp: 160, time: "15 min", level: "Intermediate", detail: "Upload a short gameplay clip and identify one decision you would change." },
];

function Icon({ children }) { return <span className="icon" aria-hidden="true">{children}</span>; }
function Avatar({ person, small = false }) { return <div className={`avatar ${person.color || "lilac"} ${small ? "small" : ""}`}>{person.initials || person.name.split(" ").map(x=>x[0]).slice(0,2).join("")}</div>; }
function App() {
  const [role, setRole] = useState("Student");
  const [roleTransition, setRoleTransition] = useState("");
  const [moduleTransition, setModuleTransition] = useState("");
  const [page, setPage] = useState("Overview");
  const [category, setCategory] = useState("All areas");
  const [query, setQuery] = useState("");
  const [completed, setCompleted] = useState([]);
  const [profile, setProfile] = useState({ name: "Alex Morgan", location: "Hyderabad, Telangana", headline: "Curious learner • Aspiring all-rounder", about: "I’m building practical skills, tracking my growth, and looking for feedback from people who can help me improve.", skills: ["Learning", "Cricket", "Python"], visibility: "Public" });
  const [people, setPeople] = useState(demoPeople);
  const [connected, setConnected] = useState([]);
  const [messages, setMessages] = useState([{ id: 1, author: "TalentPath", text: "Welcome! Share a challenge, a learning win, or ask for feedback.", time: "Just now" }]);
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
  const videoRef = useRef(null);

  const notify = (s) => { setToast(s); window.setTimeout(() => setToast(""), 2600); };
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
        improvements: ["Connect an AI provider key in Netlify environment variables", "Use a coach-approved rubric for this category"],
        drills: ["Record a consistent short clip from the same angle", "Repeat the selected challenge and compare your next attempt"],
        confidence: "Not evaluated"
      });
      setAnalysisStatus("demo");
    } catch (e) {
      setAnalysis({ label: "Demo review", summary: "The analysis endpoint is not connected yet. Your clip remains local to this browser. Set up the Netlify function and AI key to activate live AI feedback.", strengths: ["Upload and local preview are working"], improvements: ["Configure Netlify Functions and the AI provider"], drills: ["Try again after deploying the function"], confidence: "Not evaluated" });
      setAnalysisStatus("demo");
    }
  }

  const navItems = role === "Student"
    ? ["Overview", "Explore learning", "Challenges", "AI Studio", "Talent profiles", "Opportunities", "Leaderboard", "Community", "My portfolio"]
    : ["Overview", "Learner discovery", "Review submissions", "AI Studio", "Challenges", "Opportunities", "Leaderboard", "Community", "My profile"];

  function doNav(item) {
    if (item === page || moduleTransition || roleTransition) return;
    setModuleTransition(item);
    setPage(item);
    setAssessment(null);
    window.setTimeout(() => setModuleTransition(""), 980);
  }
  function completeChallenge(id) { if (!completed.includes(id)) { setCompleted([...completed, id]); notify("Challenge completed! XP added to your demo profile."); } else notify("Already completed in this demo."); }
  function connectPerson(id) { setConnected(prev => prev.includes(id) ? prev.filter(x=>x!==id) : [...prev,id]); notify(connected.includes(id) ? "Connection removed." : "Connection request sent (demo)."); }
  function addPost() { if (!newPost.trim()) return; setMessages([...messages, { id: Date.now(), author: profile.name, text: newPost.trim(), time: "Just now" }]); setNewPost(""); notify("Post shared in the demo community."); }

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
      <div className="brand"><div className="brand-mark"><LogoParticles /></div><div><strong>talentpath</strong><small>GROW INTO YOUR POTENTIAL</small></div></div>
      <div className="role-switch"><span>Viewing as</span><div><button className={role==="Student"?"active":""} onClick={()=>switchRole("Student")}>Student</button><button className={role==="Coach"?"active":""} onClick={()=>switchRole("Coach")}>Coach</button></div></div>
      <div className="nav-label">WORKSPACE</div>
      <nav>{navItems.map((item,i)=><button key={item} className={`nav-item ${page===item?"selected":""}`} onClick={()=>doNav(item)}><span className="nav-icon">{["⌂","◌","✧","◈","◎","↗","♜","☷","▤"][i]||"•"}</span>{item}{item==="AI Studio"&&<span className="new-pill">AI</span>}</button>)}</nav>
      <div className="sidebar-bottom"><div className="help-card"><div className="help-icon">✦</div><strong>Keep growing</strong><p>Every attempt gives you more evidence of what you can do.</p><button onClick={()=>doNav("Challenges")}>Find a challenge <span>→</span></button></div><div className="user-mini"><Avatar person={{name:profile.name,initials:profile.name.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"lilac"}} small/><div><strong>{profile.name}</strong><small>{role} workspace</small></div><button aria-label="Edit profile" onClick={()=>{setPage(role==="Student"?"My portfolio":"My profile");setShowProfileEdit(true)}}>•••</button></div></div>
    </aside>

    <main className="main"><div className="talent-scene-layer" aria-hidden="true"><TalentScene /></div>
      <header className="topbar"><div className="crumb">Workspace <span>/</span> <b>{page}</b></div><div className="top-actions"><div className="search"><span>⌕</span><input placeholder="Search challenges, people..." value={query} onChange={e=>setQuery(e.target.value)} onKeyDown={e=>e.key==="Enter"&&doNav("Challenges")}/><kbd>⌘ K</kbd></div><button className="icon-button" title="Notifications" onClick={()=>notify("You're all caught up!")}>♧<i/></button><button className="top-avatar" onClick={()=>{setPage(role==="Student"?"My portfolio":"My profile");setShowProfileEdit(true)}}>{profile.name.split(" ").map(s=>s[0]).slice(0,2).join("")}</button></div></header>
      <div className="page-wrap">
        <section className="page-heading"><div><div className="eyebrow">{role==="Student"?"YOUR PERSONAL GROWTH SPACE":"COACH & MENTOR WORKSPACE"}</div><h1>{pageTitle}</h1><p>{pageSub}</p></div><button className="primary-btn" onClick={()=>doNav("AI Studio")}><span>＋</span> Analyze a video</button></section>

        <div key={page} className="module-transition">
        {page==="Overview" && <Overview role={role} xp={xp} progress={progress} completed={completed} onNav={doNav} onComplete={completeChallenge} />}
        {page==="Explore learning" && <ExploreLearning onNav={doNav} onToast={notify} />}
        {page==="Challenges" && <Challenges list={challengeList} category={category} setCategory={setCategory} completed={completed} onComplete={completeChallenge} query={query} setQuery={setQuery} />}
        {page==="AI Studio" && <AIStudio role={role} selectedVideo={selectedVideo} videoUrl={videoUrl} analysis={analysis} analysisStatus={analysisStatus} analysisMode={analysisMode} setAnalysisMode={setAnalysisMode} videoPrompt={videoPrompt} setVideoPrompt={setVideoPrompt} selectVideo={selectVideo} runAnalysis={runAnalysis} videoRef={videoRef} />}
        {(page==="Talent profiles"||page==="Learner discovery") && <Profiles role={role} people={people} query={query} setQuery={setQuery} connected={connected} onConnect={connectPerson} onToast={notify} />}
        {page==="Opportunities" && <Opportunities role={role} onToast={notify} />}
        {page==="Leaderboard" && <Leaderboard xp={xp} completed={completed.length} />}
        {page==="Community" && <Community messages={messages} newPost={newPost} setNewPost={setNewPost} addPost={addPost} profile={profile} />}
        {(page==="My portfolio"||page==="My profile") && <MyPortfolio role={role} profile={profile} setProfile={setProfile} showEdit={showProfileEdit} setShowEdit={setShowProfileEdit} xp={xp} progress={progress} completed={completed} onToast={notify} />}
        {page==="Review submissions" && <ReviewSubmissions onNav={doNav} onToast={notify} />}
        </div>
      </div>
      <footer className="footer"><span>TalentPath <b>•</b> Grow into your potential</span><span>Prototype mode · Demo data</span></footer>
    </main>
    {toast && <div className="toast">✦ {toast}</div>}
  </div>;
}

function Overview({ role, xp, progress, completed, onNav, onComplete }) {
  const [tab,setTab] = useState("For you");
  return <>
    <div className="hero-card"><div className="hero-copy"><span className="hero-tag"><span/> YOUR JOURNEY, YOUR PACE</span><h2>Small steps.<br/><em>Remarkable growth.</em></h2><p>Turn what you're learning into skills you can show the world.</p><div className="hero-actions"><button className="white-btn" onClick={()=>onNav("Challenges")}>Explore challenges <span>→</span></button><button className="text-btn" onClick={()=>onNav("My portfolio")}>View my portfolio</button></div></div><div className="hero-art"><div className="orbit orbit-one"/><div className="orbit orbit-two"/><div className="art-spark s1">✦</div><div className="art-spark s2">✧</div><div className="art-cube">✦</div><div className="art-ring"><div className="ring-inner">tp</div></div><div className="float-note"><b>+{completed.length ? completed.length*12 : 12}%</b><small>momentum</small></div></div></div>
    <div className="stats-grid"><Stat icon="✧" tint="violet" label="Total XP" value={xp.toLocaleString()} trend="+120 this week"/><Stat icon="◎" tint="green" label="Skills in progress" value="4" trend="Across 3 areas"/><Stat icon="▤" tint="orange" label="Challenges done" value={completed.length.toString()} trend="Keep the streak going"/><Stat icon="↗" tint="blue" label="Growth score" value={`${progress}%`} trend="+8% this month"/></div>
    <div className="section-head"><div><h3>Your learning universe</h3><p>Explore every path. Find the one that sparks you.</p></div><button className="subtle-link" onClick={()=>onNav("Explore learning")}>Explore all areas →</button></div>
    <div className="category-grid">{categories.map((c,i)=><button key={c.id} className={`category-card ${c.tint}`} onClick={()=>onNav(i===0||i===3?"Explore learning":i===4?"AI Studio":i===2?"Talent profiles":"Challenges")}><div className="category-top"><span className="category-icon">{c.icon}</span><span className="card-arrow">↗</span></div><strong>{c.name}</strong><p>{c.desc}</p><div className="category-foot"><span>{["Explore lessons","Build your portfolio","Find talent","Apply your learning","Analyze performance"][i]}</span><b>→</b></div></button>)}</div>
    <div className="two-col"><div className="panel"><div className="panel-head"><div><h3>Recommended for you</h3><p>Picked to help you take your next step.</p></div><div className="tabs">{["For you","Trending"].map(t=><button className={tab===t?"active":""} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div></div><div className="recommend-list">{challengeSeed.slice(tab==="For you"?0:2,tab==="For you"?3:5).map(c=><div className="recommend-item" key={c.id}><div className={`rec-icon rec-${c.kind.toLowerCase().replace(" ","")}`}>{c.kind==="Sports"?"◎":c.kind==="Career"?"↗":c.kind==="AI review"?"◈":"✦"}</div><div className="rec-body"><strong>{c.title}</strong><span>{c.area} · {c.time}</span></div><div className="rec-xp">+{c.xp} XP</div><button className="circle-arrow" onClick={()=>onComplete(c.id)}>→</button></div>)}</div><button className="panel-bottom-link" onClick={()=>onNav("Challenges")}>View all challenges →</button></div>
    <div className="panel progress-panel"><div className="panel-head"><div><h3>Your momentum</h3><p>Progress comes from showing up.</p></div><span className="more">•••</span></div><div className="progress-visual"><div className="progress-circle" style={{"--progress":progress}}><div><b>{progress}%</b><small>growth</small></div></div></div><div className="progress-note"><span className="success-dot"/> <b>You're building a habit!</b><p>Complete a challenge this week to keep your progress moving.</p><button className="outline-btn" onClick={()=>onNav("Challenges")}>Continue learning</button></div></div></div>
    <div className="banner-strip"><div className="banner-icon">✦</div><div><strong>Your talent deserves to be seen.</strong><p>Build a portfolio with evidence of your growth and share it with coaches or mentors.</p></div><button onClick={()=>onNav("My portfolio")}>Build my portfolio <span>→</span></button></div>
  </>;
}
function Stat({icon,tint,label,value,trend}) { return <div className="stat-card"><div className={`stat-icon ${tint}`}>{icon}</div><span>{label}</span><strong>{value}</strong><small><i/> {trend}</small></div>; }

function ExploreLearning({onNav,onToast}) {
  const [active,setActive] = useState("All");
  const paths = [
    {name:"Learn a concept",desc:"Build understanding through bite-sized lessons and reflection.",type:"Education",icon:"✦",color:"violet",tasks:["Concept cards","Quick quizzes","Reflection prompts"]},
    {name:"Practice a real skill",desc:"Work through practical tasks and collect evidence of ability.",type:"Skills",icon:"⌘",color:"blue",tasks:["Guided projects","Skill rubric","Portfolio proof"]},
    {name:"Learn by doing",desc:"Connect theory with applied challenges and mini projects.",type:"Integrated",icon:"↗",color:"green",tasks:["Applied maths","Science experiments","Build challenges"]},
    {name:"Sports fundamentals",desc:"Explore practice plans, technique cues, and repeatable challenges.",type:"Sports",icon:"◎",color:"orange",tasks:["Technique drills","Practice logs","Video feedback"]},
  ];
  return <><div className="filter-row"><div className="filter-pills">{["All","Education","Skills","Integrated","Sports"].map(t=><button key={t} className={active===t?"active":""} onClick={()=>setActive(t)}>{t}</button>)}</div><span className="muted">Learning paths · Prototype content</span></div><div className="learning-grid">{paths.filter(p=>active==="All"||p.type===active).map(p=><div className="learning-card" key={p.name}><div className={`learning-icon ${p.color}`}>{p.icon}</div><span className="learning-type">{p.type}</span><h3>{p.name}</h3><p>{p.desc}</p><ul>{p.tasks.map(t=><li key={t}>✓ {t}</li>)}</ul><button className="outline-btn" onClick={()=>{onToast(`${p.name} path opened in demo.`);onNav("Challenges")}}>Explore path →</button></div>)}</div><div className="panel learning-note"><div className="category-icon violet">✧</div><div><h3>Personalized learning, coming from your activity</h3><p>In a connected version, recommendations can use completed assessments, selected goals, and mentor feedback to suggest the next challenge.</p></div></div></>;
}

function Challenges({list,category,setCategory,completed,onComplete,query,setQuery}) {
  const [view,setView] = useState("All");
  const areas = ["All areas",...categories.map(c=>c.name)];
  return <><div className="filter-row"><div className="filter-pills"><button className={view==="All"?"active":""} onClick={()=>setView("All")}>All challenges</button><button className={view==="Completed"?"active":""} onClick={()=>setView("Completed")}>Completed</button><button className={view==="To do"?"active":""} onClick={()=>setView("To do")}>To do</button></div><select className="select" value={category} onChange={e=>setCategory(e.target.value)}>{areas.map(a=><option key={a}>{a}</option>)}</select></div><div className="challenge-grid">{list.filter(c=>view==="All"||(view==="Completed"?completed.includes(c.id):!completed.includes(c.id))).map(c=><div className="challenge-card" key={c.id}><div className="challenge-top"><span className={`challenge-type ${c.kind.toLowerCase().replace(" ","")}`}>{c.kind}</span><span className="xp-badge">✧ {c.xp} XP</span></div><h3>{c.title}</h3><p>{c.detail}</p><div className="challenge-meta"><span>◷ {c.time}</span><span>▧ {c.level}</span></div><button className={completed.includes(c.id)?"done-btn":"primary-btn"} onClick={()=>onComplete(c.id)}>{completed.includes(c.id)?"✓ Completed":"Start challenge →"}</button></div>)}</div>{!list.length&&<div className="empty-state">No matching challenges. Try another category or search.</div>}</>;
}

function AIStudio({role,selectedVideo,videoUrl,analysis,analysisStatus,analysisMode,setAnalysisMode,videoPrompt,setVideoPrompt,selectVideo,runAnalysis,videoRef}) {
  return <div className="ai-layout"><div className="ai-main"><div className="panel upload-panel"><div className="panel-head"><div><h3>AI video analysis studio</h3><p>Upload a clip, choose what to review, and get a structured improvement report.</p></div><span className="ai-badge">✦ AI LAB</span></div><div className="upload-box">{!videoUrl?<><div className="upload-illustration"><div>↑</div><span>✦</span></div><h3>Drop your video here</h3><p>or browse files · MP4, MOV, WebM · up to 100 MB</p><label className="primary-btn file-btn">Choose video<input type="file" accept="video/*" onChange={e=>selectVideo(e.target.files?.[0])}/></label><small>Your video is previewed locally. It is only sent to the AI endpoint if you run analysis.</small></>:<><video ref={videoRef} src={videoUrl} controls className="video-preview"/><div className="video-file-row"><div><strong>{selectedVideo?.name}</strong><small>{selectedVideo ? `${(selectedVideo.size/1024/1024).toFixed(1)} MB` : ""}</small></div><label className="outline-btn file-btn">Replace video<input type="file" accept="video/*" onChange={e=>selectVideo(e.target.files?.[0])}/></label></div></>}</div><div className="analysis-options"><label><span>Analysis category</span><select value={analysisMode} onChange={e=>setAnalysisMode(e.target.value)}><option>Sports</option><option>Cricket technique</option><option>Football technique</option><option>Gaming / esports</option><option>Public speaking</option><option>Practical skill / task</option></select></label><label><span>What should the AI focus on?</span><textarea value={videoPrompt} onChange={e=>setVideoPrompt(e.target.value)} rows="3" /></label></div><button className="primary-btn analyze-btn" onClick={runAnalysis} disabled={analysisStatus==="analyzing"}>{analysisStatus==="analyzing"?"Preparing frames & analyzing…":"✦ Analyze video"}</button><p className="privacy-note">AI output is guidance, not a professional diagnosis or official selection score. A coach should validate important assessments.</p></div>{analysis&&<AnalysisReport analysis={analysis} status={analysisStatus}/>}</div><aside className="ai-side"><div className="panel rubric-panel"><div className="panel-head"><div><h3>How review works</h3><p>Designed to turn a clip into a next step.</p></div></div><div className="rubric-step"><span>01</span><div><b>Observe</b><p>Frames are sampled from your clip.</p></div></div><div className="rubric-step"><span>02</span><div><b>Review against criteria</b><p>Feedback should map to the selected skill and rubric.</p></div></div><div className="rubric-step"><span>03</span><div><b>Practice next</b><p>Receive tips and drills to try in your next attempt.</p></div></div></div><div className="panel ai-tip-card"><div className="tip-star">✦</div><strong>Make your next attempt count</strong><p>Use a consistent camera angle, lighting, and challenge. That makes comparisons across attempts more meaningful.</p></div><div className="panel connection-panel"><h3>Live AI setup</h3><p>For real AI feedback, deploy the Netlify function and set <code>GEMINI_API_KEY</code> in Netlify environment variables.</p><a href="/README.md" target="_blank" rel="noreferrer">Setup guide in project README ↗</a></div></aside></div>;
}
function AnalysisReport({analysis,status}) { return <div className="panel report-panel"><div className="report-head"><div><span className="eyebrow">YOUR REVIEW</span><h3>{analysis.label || (status==="done"?"AI analysis complete":"Review preview")}</h3></div>{analysis.score!=null&&<div className="score-circle"><b>{analysis.score}</b><small>/100</small></div>}</div><p className="report-summary">{analysis.summary}</p><div className="report-columns"><div><h4>✦ Strengths</h4><ul>{(analysis.strengths||[]).map((s,i)=><li key={i}>{s}</li>)}</ul></div><div><h4>↗ Improvement tips</h4><ul>{(analysis.improvements||[]).map((s,i)=><li key={i}>{s}</li>)}</ul></div></div><div className="drill-box"><b>Next practice plan</b><ul>{(analysis.drills||[]).map((s,i)=><li key={i}>{s}</li>)}</ul></div><div className="report-foot"><span>Confidence: {analysis.confidence||"Not provided"}</span><span>{status==="done"?"AI generated":"Demo / not evaluated"}</span></div></div>; }

function Profiles({role,people,query,setQuery,connected,onConnect,onToast}) {
  const [filter,setFilter] = useState("All");
  const [detail,setDetail] = useState(null);
  const filtered = people.filter(p=>(filter==="All"||p.role===filter)&&`${p.name} ${p.specialty} ${p.location}`.toLowerCase().includes(query.toLowerCase()));
  return <><div className="profile-toolbar"><div className="filter-pills">{["All","Student","Coach","Mentor"].map(t=><button className={filter===t?"active":""} onClick={()=>setFilter(t)} key={t}>{t==="All"?"Everyone":t+"s"}</button>)}</div><div className="search profile-search"><span>⌕</span><input placeholder="Search by skill or location" value={query} onChange={e=>setQuery(e.target.value)}/></div></div><div className="people-grid">{filtered.map(p=><div className="person-card" key={p.id}><div className="person-card-top"><Avatar person={p}/><span className={`role-badge ${p.role.toLowerCase()}`}>{p.role}</span><button className="dots" onClick={()=>setDetail(p)}>•••</button></div><h3>{p.name}</h3><div className="person-specialty">{p.specialty}</div><div className="rating-line"><span>★</span><b>{p.rating.toFixed(1)}</b><small>({p.reviews} reviews)</small></div><p>{p.bio}</p><div className="tag-list">{p.tags.map(t=><span key={t}>{t}</span>)}</div><div className="person-location">⌖ {p.location}</div><div className="person-actions"><button className="outline-btn" onClick={()=>setDetail(p)}>View profile</button><button className={connected.includes(p.id)?"connected-btn":"primary-btn"} onClick={()=>onConnect(p.id)}>{connected.includes(p.id)?"Requested":"Connect"}</button></div></div>)}</div>{detail&&<div className="modal-backdrop" onClick={()=>setDetail(null)}><div className="profile-modal" onClick={e=>e.stopPropagation()}><button className="modal-close" onClick={()=>setDetail(null)}>×</button><Avatar person={detail}/><span className={`role-badge ${detail.role.toLowerCase()}`}>{detail.role}</span><h2>{detail.name}</h2><h4>{detail.specialty}</h4><div className="rating-line"><span>★</span><b>{detail.rating.toFixed(1)}</b><small>{detail.reviews} community ratings</small></div><p>{detail.bio}</p><div className="tag-list">{detail.tags.map(t=><span key={t}>{t}</span>)}</div><div className="profile-modal-meta">Location: {detail.location}<br/>Profile ratings shown are sample demo data, not verified user reviews.</div><button className="primary-btn" onClick={()=>{onConnect(detail.id);setDetail(null)}}>Connect / request feedback</button></div></div>}</>;
}

function Opportunities({role,onToast}) {
  const opportunities = [{title:"Community cricket skill clinic",org:"Hyderabad Grassroots Sports",type:"Sports",location:"Hyderabad",desc:"Open practice and coach-led assessment for emerging players.",tags:["Beginner-friendly","In-person"]},{title:"Student project showcase",org:"TalentPath Community",type:"Education + skills",location:"Online",desc:"Present a practical project and receive feedback from mentors.",tags:["Portfolio","Mentorship"]},{title:"Junior coding portfolio review",org:"Volunteer Mentor Network",type:"Career",location:"Online",desc:"Get feedback on a beginner project and learn how to improve your portfolio.",tags:["Coding","Career readiness"]},{title:"Esports VOD review session",org:"Community Coaches",type:"Sports + AI",location:"Online",desc:"Submit a short gameplay clip for a guided review session.",tags:["Gaming","Video review"]}];
  return <><div className="section-head"><div><h3>Opportunities to grow</h3><p>Demo listings. Connect real organizations after deployment.</p></div><span className="ai-badge">4 OPEN</span></div><div className="opportunity-list">{opportunities.map((o,i)=><div className="opportunity-card" key={i}><div className={`opportunity-symbol op-${i}`}>{["◎","✦","↗","◈"][i]}</div><div className="opportunity-content"><span className="learning-type">{o.type}</span><h3>{o.title}</h3><b>{o.org}</b><p>{o.desc}</p><div className="tag-list">{o.tags.map(t=><span key={t}>{t}</span>)}</div><small>⌖ {o.location}</small></div><button className="outline-btn" onClick={()=>onToast("Interest registered in this demo. Real listings require connected data.")}>I'm interested →</button></div>)}</div></>;
}

function Leaderboard({xp,completed}) {
  const [scope,setScope] = useState("Weekly");
  const ranks = [{name:"Riya S.",xp:1240,initials:"RS",color:"peach",level:"Learning streak"},{name:"Arjun K.",xp:980,initials:"AK",color:"blue",level:"Sports explorer"},{name:"You",xp,initials:"YO",color:"lilac",level:`${completed} challenges completed`},{name:"Zoya M.",xp:720,initials:"ZM",color:"mint",level:"Skill builder"},{name:"Dev P.",xp:660,initials:"DP",color:"yellow",level:"Community contributor"}].sort((a,b)=>b.xp-a.xp);
  return <><div className="filter-row"><div><h3>Celebrate progress</h3><p className="muted">Demo leaderboard. Real rankings should be opt-in and privacy-aware.</p></div><div className="filter-pills">{["Weekly","All time"].map(t=><button className={scope===t?"active":""} onClick={()=>setScope(t)} key={t}>{t}</button>)}</div></div><div className="panel leaderboard-panel"><div className="leaderboard-header"><div className="podium"><div><Avatar person={ranks[1]}/><b>{ranks[1].name}</b><small>{ranks[1].xp} XP</small><div className="podium-block second">2</div></div><div><span className="crown">♛</span><Avatar person={ranks[0]}/><b>{ranks[0].name}</b><small>{ranks[0].xp} XP</small><div className="podium-block first">1</div></div><div><Avatar person={ranks[2]}/><b>{ranks[2].name}</b><small>{ranks[2].xp} XP</small><div className="podium-block third">3</div></div></div></div>{ranks.map((p,i)=><div className={`rank-row ${p.name==="You"?"you":""}`} key={p.name}><span className="rank-number">{i+1}</span><Avatar person={p} small/><div className="rank-person"><b>{p.name}</b><small>{p.level}</small></div><strong>{scope==="Weekly"?p.xp:Math.round(p.xp*2.8)} XP</strong></div>)}</div></>;
}

function Community({messages,newPost,setNewPost,addPost,profile}) {
  return <div className="community-layout"><div className="panel community-feed"><div className="panel-head"><div><h3>Community circle</h3><p>Share progress, ask for feedback, and celebrate wins.</p></div><span className="ai-badge">COMMUNITY</span></div><div className="post-composer"><Avatar person={{name:profile.name,initials:profile.name.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"lilac"}}/><div><textarea value={newPost} onChange={e=>setNewPost(e.target.value)} placeholder="Share a learning win or ask the community…" rows="3"/><button className="primary-btn" onClick={addPost}>Share post</button></div></div>{messages.slice().reverse().map(m=><div className="community-post" key={m.id}><div className="post-head"><Avatar person={{name:m.author,initials:m.author.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"blue"}} small/><div><b>{m.author}</b><small>{m.time}</small></div></div><p>{m.text}</p><div className="post-actions"><button>♡ Appreciate</button><button>↩ Reply</button><button>♧ Share</button></div></div>)}</div><aside className="panel community-side"><h3>Community guidelines</h3><p>Make this a kind place for people learning in public.</p><ul><li>Give specific, constructive feedback.</li><li>Respect privacy. Ask before sharing someone’s clip.</li><li>Celebrate effort and improvement, not just rankings.</li><li>Never post sensitive personal information.</li></ul><div className="community-prompt"><span>✦ WEEKLY PROMPT</span><b>What’s one thing you improved this week?</b></div></aside></div>;
}

function MyPortfolio({role,profile,setProfile,showEdit,setShowEdit,xp,progress,completed,onToast}) {
  const [skillInput,setSkillInput] = useState("");
  return <div className="portfolio-layout"><div className="panel portfolio-main"><div className="portfolio-cover"><span>✦ TALENTPATH PORTFOLIO</span><div className="cover-orbit"/></div><div className="portfolio-profile"><Avatar person={{name:profile.name,initials:profile.name.split(" ").map(s=>s[0]).slice(0,2).join(""),color:"lilac"}}/><div className="portfolio-id"><h2>{profile.name}</h2><p>{profile.headline}</p><small>⌖ {profile.location} · {role} profile</small></div><button className="outline-btn" onClick={()=>setShowEdit(!showEdit)}>{showEdit?"Close editor":"Edit profile"}</button></div>{showEdit&&<div className="profile-edit-form"><label>Name<input value={profile.name} onChange={e=>setProfile({...profile,name:e.target.value})}/></label><label>Headline<input value={profile.headline} onChange={e=>setProfile({...profile,headline:e.target.value})}/></label><label>Location<input value={profile.location} onChange={e=>setProfile({...profile,location:e.target.value})}/></label><label>About<textarea rows="3" value={profile.about} onChange={e=>setProfile({...profile,about:e.target.value})}/></label><label>Visibility<select value={profile.visibility} onChange={e=>setProfile({...profile,visibility:e.target.value})}><option>Public</option><option>Private</option><option>Coaches only</option></select></label><label>Add a skill<input value={skillInput} onChange={e=>setSkillInput(e.target.value)} placeholder="e.g. video editing"/></label><button className="primary-btn" onClick={()=>{if(skillInput.trim())setProfile({...profile,skills:[...profile.skills,skillInput.trim()]});setSkillInput("");setShowEdit(false);onToast("Profile updated in local demo.")}}>Save profile</button></div>}<div className="portfolio-about"><h3>About me</h3><p>{profile.about}</p></div><div className="portfolio-skills"><h3>Skills & interests</h3><div className="tag-list">{profile.skills.map((s,i)=><span key={i}>{s}</span>)}</div></div><div className="portfolio-evidence"><div className="section-head"><div><h3>Evidence of growth</h3><p>Show your challenges, work samples, and progress.</p></div><button className="subtle-link" onClick={()=>onToast("Evidence upload is available through AI Studio in this prototype.")}>＋ Add evidence</button></div><div className="evidence-placeholder"><div>▤</div><b>Your portfolio is taking shape</b><p>Complete challenges and upload work to collect evidence here.</p></div></div></div><aside className="portfolio-stats"><div className="panel"><h3>Growth snapshot</h3><div className="snapshot-stat"><span>XP earned</span><b>{xp}</b></div><div className="snapshot-stat"><span>Challenges completed</span><b>{completed}</b></div><div className="snapshot-stat"><span>Growth score</span><b>{progress}%</b></div><div className="mini-progress"><i style={{width:`${progress}%`}}/></div><p className="muted">Snapshot is based on demo interactions.</p></div><div className="panel visibility-card"><span className="visibility-icon">◉</span><h3>Profile visibility</h3><p>Choose who can discover your profile. Avoid publishing private contact details.</p><span className="visibility-status">{profile.visibility}</span></div></aside></div>;
}

function ReviewSubmissions({onNav,onToast}) {
  const [selected,setSelected] = useState("Aarav's cricket bowling clip");
  const [feedback,setFeedback] = useState("");
  return <div className="review-layout"><div className="panel"><div className="panel-head"><div><h3>Submission review queue</h3><p>Sample submissions for coach workspace.</p></div><span className="ai-badge">3 WAITING</span></div>{["Aarav's cricket bowling clip","Sana's robotics demo","Dev's gameplay VOD"].map((s,i)=><button className={`submission-row ${selected===s?"selected":""}`} key={s} onClick={()=>setSelected(s)}><div className="submission-icon">{["◎","⌘","◈"][i]}</div><div><b>{s}</b><small>{["Sports • submitted 2h ago","Practical skill • yesterday","Gaming • 4h ago"][i]}</small></div><span>→</span></button>)}</div><div className="panel review-detail"><span className="eyebrow">SELECTED SUBMISSION</span><h3>{selected}</h3><p>Demo review screen. A connected version can show uploaded evidence, rubric dimensions, and AI suggestions for coach validation.</p><label>Coach feedback<textarea rows="5" value={feedback} onChange={e=>setFeedback(e.target.value)} placeholder="Write specific, constructive feedback…"/></label><button className="primary-btn" onClick={()=>onToast("Feedback saved in this demo.")}>Save feedback</button><button className="outline-btn" onClick={()=>onNav("AI Studio")}>Open AI Studio</button></div></div>;
}

createRoot(document.getElementById("root")).render(<App/>);
