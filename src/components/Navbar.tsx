import { useLocation, useNavigate } from "@tanstack/react-router";
import { Diamond, ShoppingBag, User, Users } from "lucide-react";
import { useState } from "react";
import { useUser } from "../hooks/useUser";
export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const { pathname } = useLocation();
  const [activeButton, setActiveButton] = useState("balance");
  const userBalance = user?.crystalBalance;

  if (
    pathname !== "/" &&
    pathname !== "/profile" &&
    pathname !== "/friends" &&
    pathname !== "/cases"
  ) {
    return null;
  }

  return (
    <div className="fixed right-0 bottom-0 left-0 flex w-full justify-around bg-neutral-900/80 py-5 backdrop-blur-lg">
      <NavButton
        icon={<Diamond className="h-6 w-6" />}
        label={`${userBalance}`}
        onClick={() => {
          navigate({ to: "/" });
          setActiveButton("balance");
        }}
        isActive={activeButton === "balance"}
      />
      <NavButton
        icon={<ShoppingBag className="h-6 w-6" />}
        label="Кейсы"
        onClick={() => {
          navigate({ to: "/" });
          setActiveButton("cases");
        }}
        isActive={activeButton === "cases"}
      />
      <NavButton
        icon={<Users className="h-6 w-6" />}
        label="Друзья"
        onClick={() => {
          navigate({ to: "/friends" });
          setActiveButton("friends");
        }}
        isActive={activeButton === "friends"}
      />
      <NavButton
        icon={<User className="h-6 w-6" />}
        label="Профиль"
        onClick={() => {
          navigate({ to: "/profile" });
          setActiveButton("profile");
        }}
        isActive={activeButton === "profile"}
      />
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  isActive: boolean;
}
const NavButton = ({ icon, label, onClick, isActive }: NavButtonProps) => {
  return (
    <button
      className={`flex flex-col items-center justify-center px-2 text-neutral-400 ${
        isActive && "text-white"
      }`}
      onClick={onClick}
    >
      <div>{icon}</div>
      <span className="mt-1 text-xs">{label}</span>
    </button>
  );
};
