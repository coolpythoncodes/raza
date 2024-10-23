import Link from "next/link";
import { Icons } from "./icons";
import PageWrapper from "./page-wrapper";

const links = [
  {
    label: "Github",
    to: "https://github.com/coolpythoncodes/vaza",
  },
  {
    label: "Twitter",
    to: "https://x.com/DevRapture",
  },
  {
    label: "Linkedln",
    to: "https://www.linkedin.com/in/rapture-godson/",
  },
];

const Footer = () => {
  return (
    <footer className="border-t border-white py-6 text-white">
      <PageWrapper className="flex flex-col items-center gap-y-5 md:flex-row md:justify-between">
        <Icons.logo />
        <ul className="flex items-center gap-x-6">
          {links.map((link, index) => (
            <li key={`links-${index}`} className="text-base font-normal">
              <Link href={link.to} target="_blank">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </PageWrapper>
    </footer>
  );
};

export default Footer;
