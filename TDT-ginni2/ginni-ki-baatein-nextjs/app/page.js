"use client";

import { useState } from "react";
import Onboarding from "@/components/Onboarding";
import Sidebar from "@/components/Sidebar";
import ReadingPanel from "@/components/ReadingPanel";

export default function Home() {
  const [session, setSession] = useState(null); // {name, lang}
  const [activeTopic, setActiveTopic] = useState(null);

  if (!session) {
    return <Onboarding onBegin={(name, lang) => setSession({ name, lang })} />;
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
      />
      <main className="main">
        <div className="main-inner">
          <ReadingPanel
            key={activeTopic?.id ?? "empty"}
            topic={activeTopic}
            lang={session.lang}
            name={session.name}
            onAnotherQuestion={() => setActiveTopic(null)}
          />
        </div>
      </main>
    </div>
  );
}
