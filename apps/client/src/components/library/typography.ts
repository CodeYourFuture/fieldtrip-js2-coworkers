import { tw, switchcase } from "@djgrant/react-tailwind";

type Level = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

const getHeadingComponent = (level: Level) =>
  tw(level)(
    switchcase(level, {
      h1: ["text-4xl", "font-medium", "font-heading"],
      h2: ["text-xl", "font-heading"],
      h3: ["text-lg", "font-bold", "font-heading"],
      h4: ["font-medium", "text-slate-500"],
      h5: ["text-sm", "font-bold", "uppercase", "text-gray-600"],
      h6: ["text-xs", "font-medium", "uppercase", "text-gray-500"],
    })
  );

export const H1 = getHeadingComponent("h1");
export const H2 = getHeadingComponent("h2");
export const H3 = getHeadingComponent("h3");
export const H4 = getHeadingComponent("h4");
export const H5 = getHeadingComponent("h5");
export const H6 = getHeadingComponent("h6");
