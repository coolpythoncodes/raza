/* eslint-disable @typescript-eslint/no-floating-promises */
import { cn } from "@/lib/utils";
import { useEffect } from "react";

interface Props {
  className?: string;
}

export default function Loader({ className }: Props) {
  useEffect(() => {
    async function getLoader() {
      const { tailChase } = await import("ldrs");
      tailChase.register();
    }
    getLoader();
  }, []);
  return (
    <div
      className={cn(
        "grid h-[calc(100vh_-_150px)] place-items-center",
        className,
      )}
    >
      <l-tail-chase size="40" speed="1.75" color="#BB8FFF"></l-tail-chase>
    </div>
  );
}
