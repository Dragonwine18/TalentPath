# TalentPath — original interface with expanded feature prototype

TalentPath connects learning, skill-building, sports talent development, and AI-assisted video review. The original TalentPath dashboard layout, particle mark, 3D visual scene, typography, and existing dark cinematic visual system are retained unchanged. Student/Coach role switch and workspaces use sample/demo data.

## Included experience

- **Education & learning:** learning-path cards, practice content, lesson/quiz style pathways
- **Skill development / career readiness:** projects, practical labs, and challenge cards
- **Student tracks:** Studies, Athlete / Sports, Gaming, and Skill Development
- **Student workspace:** Explore Learning, expanded subject and sport topics, Challenges, Practical Labs, AI Mentor, AI Studio, Opportunities, Talent Profiles, Talent Exchange, Live Sessions, Fast Thinking, Community, and separate student/athlete leaderboards
- **Coach workspace:** Coach Overview, learner discovery filters, Athlete Review, AI Studio coach feedback and drill suggestions, Coach Sessions, Live Sessions, Talent Exchange, Community, and My Profile
- **Sports discovery:** Cricket, football, basketball, tennis, badminton, athletics, swimming, esports, volleyball, hockey, and other options; filters for sport, skill, level, age, position, and location search
- **Profile editing:** add/remove skills and interests; profile data is saved locally in this browser
- **Challenge flow:** open details, start/resume, mark complete, and retain started/completed status locally
- **Opportunities and connections:** visible demo request/interest status and an accepted demo athlete profile
- **Video recording guidance:** camera preview plus on-screen framing, lighting, angle, and stability checklist
- **Responsive layouts:** desktop, tablet, and mobile

### Prototype vs connected product

This package includes functioning frontend interactions using local component state and sample content. Profile edits and challenge started/completed status are saved locally in this browser. Connection requests, opportunity interest, posts, session listings, and leaderboard data are demo content/state unless connected to an authenticated backend. Coach feedback notes are saved locally in this browser. The AI Studio samples frames in the browser and calls `/.netlify/functions/analyze-video`; if the function or API key is not configured, it displays an explicitly marked demo report. No sample rating is a verified evaluation.

## Run locally

Requires Node.js 20+.

```bash
npm install
npm run dev
```

Vite prints a local address. To make a production build:

```bash
npm run build
npm run preview
```

## Activate live AI analysis (Netlify + Gemini)

The included Netlify Function sends **sampled still frames** from the chosen video to Gemini Vision. It does not upload the entire video file. This is a prototype route; accuracy varies by sport/task and sampling can miss timing, so feedback must be treated as coaching assistance—not official scouting or medical advice.

1. Create a Gemini API key in Google AI Studio.
2. In Netlify, open **Site configuration → Environment variables** and add:
   - `GEMINI_API_KEY` = your secret API key (server-side; do **not** use `VITE_` prefix).
3. Deploy this project to Netlify (or run with Netlify CLI locally):
   ```bash
   npm install
   npx netlify dev
   ```
4. Upload a short clear video in AI Studio and click **Analyze video**.
5. Function endpoint is `netlify/functions/analyze-video.mjs`. It extracts an output JSON containing summary, optional score, strengths, improvement tips, drills, and confidence.

Do not expose a provider key in React code, `.env` variables prefixed `VITE_`, GitHub, or public client bundles. A rubric should be category-specific and validated by a human coach. For an initial demo, choose a narrow use case (for example, a cricket delivery from a side camera) rather than claiming general-purpose video evaluation.

## Supabase: data persistence + real-time updates

Supabase is the recommended single primary database for profiles, coach/student relationships, challenge definitions, submissions, feedback, and opportunity listings. This repo includes:

- `src/supabase.js` — client initialization (not yet wired into every demo view)
- `supabase/schema.sql` — starter tables and Row Level Security policies
- `.env.example` — environment variable names

### Setup

1. Create a Supabase project.
2. Open **SQL Editor** and run `supabase/schema.sql`.
3. In **Project Settings → API**, copy the Project URL and anon/publishable key.
4. Copy `.env.example` to `.env.local`, then set:
   ```env
   VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
   VITE_SUPABASE_ANON_KEY=YOUR_PUBLIC_ANON_OR_PUBLISHABLE_KEY
   ```
5. Restart Vite. `src/supabase.js` exports `supabase`.
6. Create a private Storage bucket named `talent-evidence`. Add storage policies so users can only upload/read their own evidence. Student videos should not be public by default.
7. Before enabling production data, test RLS policies with a student and coach account. Add coach-specific authorization to submission visibility/review policies (the starter schema is intentionally conservative).

### Real-time subscription example

Supabase Realtime can push new rows/changes to an open browser session. For example, after adding the table to the Realtime publication and setting up permissions:

```js
import { supabase } from "./supabase";

const channel = supabase
  .channel("challenge-updates")
  .on(
    "postgres_changes",
    { event: "*", schema: "public", table: "challenges" },
    (payload) => {
      // Refresh state from the database; do not trust event payload for authorization.
      console.log("Challenge changed:", payload);
    }
  )
  .subscribe();

// In React cleanup:
supabase.removeChannel(channel);
```

You can use the same pattern for `opportunities`, `community_posts`, and `submissions`. Add only the tables that need live updates to Supabase's Realtime publication. Use a database read to hydrate current state, then subscribe to changes. RLS still applies; do not broadcast private student data to public channels.

### Persisting a profile (example)

After authentication is implemented, call `upsert` using the signed-in user's `auth.uid()`:

```js
await supabase.from("profiles").upsert({
  id: user.id,
  display_name: profile.name,
  headline: profile.headline,
  about: profile.about,
  location: profile.location,
  visibility: "public"
});
```

Do not let the browser supply another person's `id`. Enforce ownership with RLS.

## Firebase and Supabase together — what I recommend

Avoid keeping the **same profile/challenge/submission data in both Firestore and Supabase**. It creates conflicting writes, duplicated security rules, and synchronization work.

Suggested architecture:
- **Supabase:** PostgreSQL database, student/coach profiles, challenge/submission records, private video storage, Realtime data updates, and (when added) Supabase Auth.
- **Firebase (optional):** Firebase Cloud Messaging for push notifications, or analytics/crash reporting. It can send a push when a Supabase event occurs via a trusted server/Netlify function.
- **Authentication:** use one identity provider at first. Supabase Auth is simplest for this schema. If you specifically need Firebase Auth, implement a trusted JWT verification bridge before allowing Supabase access; do not just place Firebase IDs in database rows and assume Supabase RLS will protect them.

Realtime data on the open website is best served by Supabase Realtime. Firebase push notifications are useful when the website is closed or the user is on a device that permits notifications.

## Netlify deployment

1. Push the project to GitHub.
2. In Netlify choose **Add new site → Import an existing project**.
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Functions directory: `netlify/functions` (already in `netlify.toml`).
6. Add `GEMINI_API_KEY` and Supabase public client variables under Netlify environment variables.
7. Deploy. For local function development, use `npx netlify dev`, not only `npm run dev`.

## Safety and privacy

- Do not ask minors to publish phone numbers, precise home addresses, school IDs, or private contact details.
- Make student profile visibility explicit (public / private / coaches-only) and allow deletion.
- Get clear consent before sending uploaded video frames to an AI provider.
- Set file size, MIME type, retention, and storage access rules.
- Coach ratings should be attributable, moderated, and clearly distinguish demo values from verified reviews.
- Do not present AI output as a definitive talent verdict. Add coach validation and category-specific scoring criteria.

## Structure

```text
TalentPath/
├── index.html
├── package.json
├── vite.config.js
├── netlify.toml
├── .env.example
├── src/
│   ├── main.jsx
│   ├── styles.css
│   └── supabase.js
├── netlify/functions/
│   └── analyze-video.mjs
└── supabase/
    └── schema.sql
```


## Merge notes (November 2026)

This build retains the previously supplied TalentPath UI and its expanded interactive pages. Selected persistence improvements from the companion repository are merged: connection requests, opportunity interest, and community messages are saved locally in the browser alongside profile and challenge state. The existing URL hash keeps role, track, and page on refresh.

Validation performed for this package:
- JSX syntax parsing of `src/main.jsx`, `src/TalentScene.jsx`, and `src/LogoParticles.jsx` passed.
- ZIP integrity check passed after packaging.
- A full Vite production build could not be run in the working environment because npm dependency installation timed out. Please run `npm install` then `npm run build` locally before deployment.
