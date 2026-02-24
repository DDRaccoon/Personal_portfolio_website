import { WORK_CATEGORIES } from "../../constants/workCategories";

export const siteCopy = {
  intro: {
    name: "SiCheng Chen",
    title: "Technical Artist (UE5) / Environment Art",
    bio: "Technical Artist focused on game production pipelines, real-time rendering, and environment workflows.",
    bioSecondary:
      "I build reliable art-tech bridges across Unreal Engine, procedural tooling, and shader systems.",
    skills: ["UE5", "Houdini", "Shaders", "Tools-Pipeline"],
    socials: [
      {
        id: "github",
        label: "GitHub",
        href: "https://github.com/",
      },
      {
        id: "linkedin",
        label: "LinkedIn",
        href: "https://www.linkedin.com/",
      },
    ],
  },
  works: {
    sectionTitle: "Works",
    tabs: WORK_CATEGORIES,
    emptyStateTitle: "Create your first work in this category",
    emptyStateCta: "+",
  },
  music: {
    enablePrompt: "Click to enable sound",
    muteLabel: "Mute",
    unmuteLabel: "Unmute",
  },
};
