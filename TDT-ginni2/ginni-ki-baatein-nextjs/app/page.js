"use client";

import { useState, useEffect } from "react";
import AuthGate from "@/components/AuthGate";
import Onboarding from "@/components/Onboarding";
import Sidebar from "@/components/Sidebar";
import ReadingPanel from "@/components/ReadingPanel";

export default function Home() {
  const [me, setMe] = useState(null); // null while loading; {loggedIn, ...access} once known
  const [session, setSession] = useState(null); // {name, lang} — onboarding personalization, separate from auth
  const [activeTopic, setActiveTopic] = useState(null);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then(setMe)
      .catch(() => setMe({ loggedIn: false }));
  }, []);

  if (me === null) {
    return null; // brief blank frame while the session check resolves
  }

  if (!me.loggedIn) {
    return <AuthGate onAuthed={setMe} />;
  }

  if (!session) {
    return <Onboarding defaultName={me.name} onBegin={(name, lang) => setSession({ name, lang })} />;
  }

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    setMe({ loggedIn: false });
    setSession(null);
    setActiveTopic(null);
  }

  return (
    <div id="app" className="active">
      <Sidebar
        name={session.name}
        lang={session.lang}
        activeTopicId={activeTopic?.id}
        onSelectTopic={setActiveTopic}
        onChangeLang={(lang) => setSession((prev) => ({ ...prev, lang }))}
        onRestart={() => {
          setSession(null);
          setActiveTopic(null);
        }}
        onLogout={handleLogout}
      />
      <main className="main">
        <div className="main-inner">
          <ReadingPanel
            key={activeTopic?.id ?? "empty"}
            topic={activeTopic}
            lang={session.lang}
            name={session.name}
            onSelectTopic={setActiveTopic}
            onAnotherQuestion={() => setActiveTopic(null)}
            access={me}
            onAccessChange={(newAccess) => setMe((prev) => ({ ...prev, ...newAccess }))}
          />
        </div>
      </main>
    </div>
  );
}
