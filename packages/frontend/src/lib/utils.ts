import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const responsiveConfig = {
  small: 0,
  middle: 1024,
  large: 1280,
};

export const ContestStatus = {
  Inactive: 0,
  OpenForParticipants: 1,
  VotingStarted: 2,
  Canceled: 3,
  Ended: 4,
  Waiting: 5,
};

export const statusConfig = {
  [ContestStatus.Inactive]: { text: "Upcoming", style: "bg-[#BB8FFF]" },
  [ContestStatus.Waiting]: { text: "Waiting", style: "bg-[#BB8FFF]" },
  [ContestStatus.OpenForParticipants]: { text: "Open", style: "bg-green-100" },
  [ContestStatus.VotingStarted]: {
    text: "Voting in Progress",
    style: "bg-blue-100",
  },
  [ContestStatus.Canceled]: { text: "Canceled", style: "bg-red-100" },
  [ContestStatus.Ended]: {
    text: "Ended",
    style: "bg-purple-100 text-purple-800 border-purple-300",
  },
};

export const reactQuillFormat = [
  "header",
  "bold",
  "italic",
  "underline",
  "strike",
  "blockquote",
  "list",
  "bullet",
  "link",
  "color",
  "image",
  "background",
  "align",
  "size",
  "font",
];

export const reactQuillModules = {
  toolbar: [
    [{ header: [1, 2, 3, 4, 5, 6, false] }],
    ["bold", "italic", "underline", "strike", "blockquote"],
    // [{ size: [] }],
    //   [{ font: [] }],
    [{ align: ["right", "center", "justify"] }],
    [{ list: "ordered" }, { list: "bullet" }],
    ["link"],
    //   [{ color: ["red", "#785412"] }],
    //   [{ background: ["red", "#785412"] }],
  ],
};
