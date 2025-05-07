import { useNavigate } from "@tanstack/react-router";
import { Diamond, ShoppingBag, User, Users } from "lucide-react";
import { useUser } from "./hooks/useUser";

export const Navbar = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const userBalance = user?.crystalBalance;

  return (
    <div className="fixed right-0 bottom-0 left-0 flex w-full justify-around bg-neutral-900/80 py-2 backdrop-blur-lg">
      <NavButton
        icon={<Diamond className="h-6 w-6" />}
        label={`${userBalance}`}
        onClick={() => navigate({ to: "/" })}
      />
      <NavButton
        icon={<ShoppingBag className="h-6 w-6" />}
        label="Кейсы"
        onClick={() => navigate({ to: "/" })}
      />
      <NavButton
        icon={<Users className="h-6 w-6" />}
        label="Друзья"
        onClick={() => navigate({ to: "/friends" })}
      />
      <NavButton
        icon={<User className="h-6 w-6" />}
        label="Профиль"
        onClick={() => navigate({ to: "/" })}
      />
    </div>
  );
};

interface NavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}
const NavButton = ({ icon, label, onClick }: NavButtonProps) => {
  return (
    <button
      className="flex flex-col items-center justify-center px-2 text-neutral-400"
      onClick={onClick}
    >
      <div>{icon}</div>
      <span className="mt-1 text-xs">{label}</span>
    </button>
  );
};
