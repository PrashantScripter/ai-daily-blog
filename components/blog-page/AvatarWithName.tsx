import Image from "next/image";

interface AvatarProp {
  user?: any;
  time?: string;
}

export function AvatarWithName({ user, time }: AvatarProp) {
  if (!user) return null;

  return (
    <div className="flex flex-row gap-2 items-center">
      {user.image ? (
        <Image
          src={user.image}
          alt={user.username || "User"}
          width={32}
          height={32}
          className="rounded-full"
        />
      ) : (
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-sm">
            {user.username?.charAt(0) || "U"}
          </span>
        </div>
      )}
      <div>
        <p className="text-neutral-800 font-medium">
          {user.username || "Anonymous"}
        </p>
        {time && <p className="text-xs text-gray-500">{time}</p>}
      </div>
    </div>
  );
}