import { Drawer } from "vaul";

type DrawerProps = {
  price: number;
  image: string;
  name: string;
  id: number;
  sellItem: (id: number) => void;
  withdrawItem: (id: number) => void;
  children: React.ReactNode;
};

export default function VaulDrawer({
  price,
  image,
  name,
  id,
  sellItem,
  withdrawItem,
  children,
}: DrawerProps) {
  return (
    <Drawer.Root preventScrollRestoration={true}>
      <Drawer.Trigger asChild>{children}</Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay className="fixed inset-0 bg-black/40" />
        <Drawer.Content className="fixed right-0 bottom-0 left-0 flex max-h-[82vh] flex-col rounded-t-[10px] bg-neutral-900">
          <div className="mx-auto w-full max-w-md overflow-auto rounded-t-[10px] p-4">
            <Drawer.Handle className="bg-neutral-600" />
            <div className="mt-8 flex flex-col items-center gap-4">
              <img className="h-32 w-32 rounded-md object-cover" src={image} alt={name} />
              <Drawer.Title className="text-center text-xl font-medium text-white">
                {name.length > 30 ? name.substring(0, 30) + "..." : name}
              </Drawer.Title>
              <div className="text-2xl font-bold text-white">{price} DOTA COINS</div>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <button
                onClick={() => sellItem(id)}
                className="flex h-12 w-full items-center justify-center rounded-lg bg-red-500 font-medium text-white transition-colors hover:bg-red-600"
              >
                Продать за {price} DOTA COINS
              </button>
              <button
                onClick={() => withdrawItem(id)}
                className="flex h-12 w-full items-center justify-center rounded-lg border border-neutral-700 bg-neutral-800 font-medium text-white transition-colors hover:bg-neutral-700"
              >
                Вывести предмет
              </button>
            </div>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
}
