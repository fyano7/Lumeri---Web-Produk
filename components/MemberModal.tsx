import { TeamMember } from "./TeamMembers";
import Image from "next/image";

export default function MemberModal({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  if (!member) return null;
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 max-w-sm w-full shadow-2xl relative">
        <button
          className="absolute top-4 right-4 text-gray-400 hover:text-black text-2xl font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 relative rounded-full overflow-hidden border-4 border-[#e75a40] mb-4">
            <Image src={member.photo_url} alt={member.name} fill className="object-cover" />
          </div>
          <h2 className="font-black text-2xl mb-2 text-black">{member.name}</h2>
          <span className="inline-block bg-[#e75a40]/10 text-[#e75a40] font-bold px-4 py-1 rounded-full mb-2">
            {member.role}
          </span>
        </div>
      </div>
    </div>
  );
}
