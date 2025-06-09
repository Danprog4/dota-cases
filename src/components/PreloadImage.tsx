import { CASES_CONFIG } from "~/lib/configs/cases.config";

export const PreloadImage = () => {
  return (
    <div className="hidden">
      {CASES_CONFIG.map((image) => (
        <img src={image.img} alt="" />
      ))}
    </div>
  );
};
