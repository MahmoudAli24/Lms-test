"use client";

import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon } from "./SunIcon";
import { MoonIcon } from "./MoonIcon";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const [isSelected, setIsSelected] = useState(true);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (mounted) {
      setTheme(isSelected ? "dark" : "light");
    }
  }, [isSelected, mounted, setTheme]);

  if (!mounted) return null;

  return (
    <Switch
      isSelected={isSelected}
      onValueChange={setIsSelected}
      size='sm'
      color='success'
      startContent={<SunIcon />}
      endContent={<MoonIcon />}
    ></Switch>
  );
}
