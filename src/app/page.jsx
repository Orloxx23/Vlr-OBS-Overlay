"use client";

import { Suspense, useState } from "react";

const host = "http://localhost:3000";

export default function Home() {
  const [name, setName] = useState("");
  const [tag, setTag] = useState("");
  const [widgetUrl, setWidgetUrl] = useState(null);

  const [loading, setLoading] = useState(false);

  const [account, setAccount] = useState(null);

  const [copied, setCopied] = useState(false);

  const getWidget = async () => {
    if (name === "" || tag === "") return;
    if (loading) return;

    setLoading(true);

    const account = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/account/${name}/${tag}?force=true`
    )
      .then((res) => res.json())
      .then((data) => data.data);

    if (!account) {
      alert("Account not found!");
      setLoading(false);
      return;
    }

    setAccount(account);

    console.log("🚀 ~ getWidget ~ account:", account);

    setWidgetUrl(`${host}/widget?&id=${account.puuid}`);

    setLoading(false);
  };

  const copyToClipboard = () => {
    if (!widgetUrl) return;
    navigator.clipboard.writeText(widgetUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <main>
      <div className="w-full h-[100svh] bg-gradient-to-br from-gray-900 to-black flex justify-center items-center">
        <div className="container flex flex-col justify-center items-center gap-4 max-w-sm">
          <h1 className="text-5xl font-bold text-center text-white mb-4">
            Taply OBS Overlay
          </h1>
          <div className="flex w-full gap-2 items-center">
            <input
              type="text"
              className="rounded w-[60%] p-2 border-none outline-none"
              autoComplete="off"
              placeholder="Name"
              onChange={(e) => setName(e.target.value)}
            />
            <span className="text-white font-bold">#</span>
            <input
              type="text"
              className="rounded w-[40%] p-2 border-none outline-none"
              autoComplete="off"
              placeholder="Tag"
              onChange={(e) => setTag(e.target.value)}
            />
          </div>
          <button
            disabled={loading}
            onClick={getWidget}
            className="w-full bg-red-500 p-2 rounded text-gray-900 font-bold hover:bg-red-600 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "..." : "Generate"}
          </button>

          {widgetUrl && (
            <>
              <div className="flex w-full bg-white p-2 rounded gap-2">
                <input
                  type="text"
                  className="w-full rounded"
                  value={widgetUrl ?? ""}
                  readOnly
                />
                <button
                  className="bg-red-500 p-1 text-white font-bold uppercase rounded"
                  onClick={copyToClipboard}
                >
                  {copied ? "✅" : "copy"}
                </button>
              </div>
              <div className="flex justify-center items-center w-[452px] h-[128px]">
                <iframe
                  className="size-full"
                  src={widgetUrl}
                  frameBorder="0"
                ></iframe>
              </div>
              <p className="text-white">452 x 128</p>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
