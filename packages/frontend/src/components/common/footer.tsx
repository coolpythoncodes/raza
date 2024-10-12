import Link from "next/link";
import { Icons } from "./icons";
import PageWrapper from "./page-wrapper";

const links = [
  {
    label:"Github",
    to:"https://github.com/coolpythoncodes/raza"
  },
  {
    label:"Twitter",
    to:"https://x.com/DevRapture"
  },
  {
    label:"Linkedln",
    to:"https://www.linkedin.com/in/rapture-godson/"
  },
  ];

const Footer = () => {
  return (
    <footer className="text-white py-6 border-t border-white">
      <PageWrapper className="flex flex-col md:flex-row items-center gap-y-5 md:justify-between">
        <Icons.logo />
        <ul className="flex items-center gap-x-6">
          {links.map((link, index) => (
            <li key={`links-${index}`} className="font-normal text-base">
              <Link href={link.to} target="_blank">{link.label}</Link>
            </li>
          ))}
        </ul>
      </PageWrapper>
    </footer>
  );
};

export default Footer;
