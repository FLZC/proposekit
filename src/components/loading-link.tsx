"use client";

import Link from "next/link";
import { useLoading } from "@/components/loading-bar";
import type { ComponentProps } from "react";

export function LoadingLink({ onClick, ...props }: ComponentProps<typeof Link>) {
  const loading = useLoading();
  return (
    <Link
      {...props}
      onClick={(e) => {
        loading.start();
        onClick?.(e);
      }}
    />
  );
}
