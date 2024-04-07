"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

export default function Widget() {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  const [account, setAccount] = useState(null);
  const [mmr, setMmr] = useState(null);
  const [history, setHistory] = useState([]);
  const [winrate, setWinrate] = useState(0);
  const [kda, setKda] = useState(0);

  const [loading, setLoading] = useState(true);

  const getAccount = async () => {
    const _account = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/by-puuid/account/${id}?force=true`
    )
      .then((res) => res.json())
      .then((data) => data.data);

    if (!_account) {
      return;
    }

    setAccount(_account);

    console.log("🚀 ~ getAccount ~ _account:", _account);
    getMmr(_account);
    getHistory(_account);
  };

  const getMmr = async (user) => {
    if (!user.region) return;

    const _mmr = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr/${user.region}/${id}`
    )
      .then((res) => res.json())
      .then((data) => data.data);

    if (!_mmr) {
      return;
    }

    setMmr(_mmr);
  };

  const getHistory = async (user) => {
    if (!user.region) return;

    const _history = await fetch(
      `https://api.henrikdev.xyz/valorant/v1/by-puuid/lifetime/matches/${user.region}/${id}?mode=competitive&page=1&size=40`
    )
      .then((res) => res.json())
      .then((data) => data.data);

    if (!_history) {
      return;
    }
    console.log("🚀 ~ getHistory ~ _history:", _history);

    setHistory(_history);

    const _winrate = _history.reduce((acc, match) => {
      const playerTeam = match.stats.team.toLowerCase();

      const teamWithMostWins = Object.keys(match.teams).reduce((a, b) => {
        return match.teams[a] > match.teams[b] ? a : b;
      });

      const _won = playerTeam === teamWithMostWins;

      return acc + _won;
    }, 0);

    setWinrate(((_winrate / _history.length) * 100).toFixed(2));

    const _kda = _history.reduce((acc, match) => {
      const __kda =
        (match.stats.assists + match.stats.kills) / match.stats.deaths;

      return acc + (__kda !== Infinity ? __kda : 0);
    }, 0);

    setKda((_kda / _history.length).toFixed(2));
  };

  useEffect(() => {
    if (!id) return;
    getAccount();
    setInterval(() => {
      getAccount();
    }, 1000 * 60 * 5);
  }, [id]);

  useEffect(() => {
    if (account && mmr && history.length > 0 && winrate > 0 && kda > 0) {
      setLoading(false);
    }
  }, [account, mmr, history, winrate, kda]);

  return (
    <div className="w-[452px] h-[128px] relative overflow-hidden">
      <div
        className={`size-full bg-gray-900 absolute top-0 left-0 z-50 flex justify-center items-center transition duration-500 ease-in-out ${
          loading ? "translate-y-0" : "-translate-y-full"
        } shadow-2xl`}
      >
        <img src="/logo.png" className="h-full object-cover" alt="" />
      </div>
      <div className="absolute top-0 left-0 bg-gradient-to-r from-black to-transparent size-full z-10"></div>
      <img
        src={account?.card?.wide ?? ""}
        className="w-full h-full object-cover absolute top-0 left-0 z-0"
        alt=""
      />
      <div className="w-[452px] h-[128px] bg-black/60 flex relative z-20 p-4 gap-2">
        <div className="w-[25%] h-full">
          <img
            src={
              mmr?.images?.large ??
              "https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04/0/largeicon.png"
            }
            alt=""
            className="size-full object-contain"
          />
        </div>
        <div className="flex flex-col w-[75%] h-full">
          <div className="flex w-full h-full gap-4">
            <div className="flex flex-col justify-center h-full">
              <span className="text-white text-md font-bold opacity-60 uppercase">
                Rating
              </span>
              <span className="text-white text-xl font-bold uppercase">
                {mmr?.currenttierpatched ?? "Unranked"}
              </span>
            </div>
            <div className="flex-1"></div>
            <div className="flex flex-col justify-center h-full">
              <span className="text-white text-md font-bold opacity-60 uppercase">
                WIN%
              </span>
              <span className="text-white text-xl font-bold uppercase">
                {winrate + "%" ?? "0%"}
              </span>
            </div>
            <div className="flex flex-col justify-center h-full">
              <span className="text-white text-md font-bold opacity-60 uppercase">
                KDA
              </span>
              <span className="text-white text-xl font-bold uppercase">
                {kda ?? "0"}
              </span>
            </div>
          </div>
          <hr className="my-2 opacity-50" />
          <div className="flex w-full h-full gap-1">
            {history.slice(0, 10).map((match, i) => (
              <Match key={match.meta.id} match={match} id={id} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Match({ match, id }) {
  const [agentImg, setAgentImg] = useState("");
  const [won, setWon] = useState(false);

  useEffect(() => {
    setAgentImg(
      `https://media.valorant-api.com/agents/${match.stats.character.id}/displayiconsmall.png` ??
        ""
    );
  }, [match]);

  useEffect(() => {
    if (!match) return;

    const playerTeam = match.stats.team.toLowerCase();

    const teamWithMostWins = Object.keys(match.teams).reduce((a, b) => {
      return match.teams[a] > match.teams[b] ? a : b;
    });

    const _won = playerTeam === teamWithMostWins;

    setWon(_won);
  }, [match]);

  return (
    <div className="flex flex-col aspect-square relative w-full">
      <div
        className={`h-0.5 w-full absolute left-0 bottom-0 z-20 ${
          won ? "bg-green-500" : "bg-red-500"
        }`}
      ></div>
      <div className="size-full">
        <img src={agentImg ?? ""} alt="" className="size-full object-cover" />
      </div>
    </div>
  );
}
