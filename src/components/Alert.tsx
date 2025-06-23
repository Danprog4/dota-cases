import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Logo } from "./icons/logo";

export function AlertDialogDemo({
  children,
  price,
  sellItem,
}: {
  children: React.ReactNode;
  price: number;
  sellItem: () => void;
}) {
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent className="bg-white text-black">
        <AlertDialogHeader>
          <AlertDialogTitle className="mx-auto flex items-center gap-1">
            Продать за {price} <Logo width={"20"} height={"20"} />?
          </AlertDialogTitle>
          <AlertDialogDescription>
            DOTA COINS будут возвращены на баланс вашего приложения DOTA 2 CASES
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Отмена</AlertDialogCancel>
          <AlertDialogAction onClick={sellItem}>Продать</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
