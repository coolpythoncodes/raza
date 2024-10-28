import { siteConfig } from "@/lib/site";
import { type MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Vaza",
    short_name: "Vaza",
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#2B1E46",
    theme_color: "#2B1E46",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
