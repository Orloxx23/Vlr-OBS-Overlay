"use client";

import Widget from "@/components/Widget";
import React, { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Widget />
    </Suspense>
  );
}
