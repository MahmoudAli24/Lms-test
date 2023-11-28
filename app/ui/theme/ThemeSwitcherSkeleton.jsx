import { Skeleton } from "@nextui-org/react";
import React from "react";

export default function ThemeSwitcherSkeleton() {
  return (
    <div>
      <Skeleton className='flex rounded-full w-12 h-12' />
    </div>
  );
}
