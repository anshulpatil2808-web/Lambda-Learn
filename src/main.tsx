import { StrictMode, Suspense, lazy, type ReactElement } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./styles.css";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Quiz from "./pages/Quiz";
import Start, { Play } from "./pages/Start";
const CommunityHome = lazy(() => import("./pages/Community").then((m) => ({ default: m.CommunityHome })));
const NewPost = lazy(() => import("./pages/Community").then((m) => ({ default: m.NewPost })));
const PostPage = lazy(() => import("./pages/Community").then((m) => ({ default: m.PostPage })));
const Moderation = lazy(() => import("./pages/Community").then((m) => ({ default: m.Moderation })));
const wait = (el: ReactElement) => <Suspense fallback={<div className="container page-head"><p className="muted">Loading…</p></div>}>{el}</Suspense>;
import NotFound from "./pages/NotFound";
import { LearnIndex, LessonPage, TrackPage } from "./pages/Learn";
import { Glossary, Labs, Sky } from "./pages/Explore";
import { About, Auth, Privacy, Profile } from "./pages/Account";
import { registerTracks } from "./lib/store";
import "./lib/cloud"; // restores a signed-in session and starts sync
import { BASICS_KEYS, TRACK_KEYS } from "./data/tracks";

registerTracks(TRACK_KEYS, BASICS_KEYS);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="start" element={<Start />} />
          <Route path="play" element={<Play />} />
          <Route path="learn" element={<LearnIndex />} />
          <Route path="learn/:trackId" element={<TrackPage />} />
          <Route path="learn/:trackId/:lessonId" element={<LessonPage />} />
          <Route path="community" element={wait(<CommunityHome />)} />
          <Route path="community/new" element={wait(<NewPost />)} />
          <Route path="community/post/:id" element={wait(<PostPage />)} />
          <Route path="community/moderate" element={wait(<Moderation />)} />
          <Route path="labs" element={<Labs />} />
          <Route path="sky" element={<Sky />} />
          <Route path="glossary" element={<Glossary />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="auth" element={<Auth />} />
          <Route path="profile" element={<Profile />} />
          <Route path="about" element={<About />} />
          <Route path="privacy" element={<Privacy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
