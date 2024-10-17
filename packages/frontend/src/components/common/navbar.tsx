"use client";

import Link from "next/link";
import { Icons } from "./icons";
import PageWrapper from "./page-wrapper";
import { routes } from "@/lib/routes";
import { navLinks } from "./extras";
import useDisclosure from "@/hooks/use-disclosure.hook";
import { configResponsive, useResponsive } from "ahooks";
import { responsiveConfig } from "@/lib/utils";
import { useEffect } from "react";
import {
  Sheet,
  SheetContent,
  // SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { Menu } from "lucide-react";

configResponsive(responsiveConfig);

const Navbar = () => {
  const { isOpen, onOpen, onClose, onToggle } = useDisclosure();
  const responsive = useResponsive();

  useEffect(() => {
    if (responsive?.middle) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [responsive?.middle]);

  return (
    <header className="pt-20">
      <PageWrapper className="flex items-center justify-between">
        <Link href={routes.home}>
          <Icons.logo />
        </Link>
        <nav className="hidden lg:block">
          <ul className="flex items-center gap-x-[62px] text-white">
            {navLinks?.map((navLink, index) => (
              <li key={`navLinks-${index}`}>
                <Link
                  href={navLink?.link}
                  className="text-base font-light hover:text-[#BB8FFF]"
                >
                  {navLink?.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="hidden lg:block">
          <w3m-button />
        </div>
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={onToggle}>
            <SheetTrigger asChild>
              <Button
                onClick={onOpen}
                variant="ghost"
                className="p-0 lg:hidden"
              >
                <Menu className="text-white" />
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-[#2C1F48]">
              <SheetHeader>
                <SheetTitle className="mt-6">
                  <Icons.logo />
                </SheetTitle>
                {/* <SheetDescription className=""> */}
                <nav className="flex flex-col items-start gap-y-6 pt-10 text-white">
                  {navLinks?.map((navLink, index) => (
                    <div key={`mobile-navlinks-${index}`}>
                      <Link href={navLink.link} onClick={onClose} className="">
                        {navLink.name}
                      </Link>
                    </div>
                  ))}
                  <w3m-button />

                  {/* <div>
                    <LinkButton href={routes.contact} text="Contact" />
                  </div> */}
                </nav>
                {/* </SheetDescription> */}
              </SheetHeader>
            </SheetContent>
          </Sheet>
        </div>
      </PageWrapper>
    </header>
  );
};

export default Navbar;
