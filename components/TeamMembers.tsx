import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export type TeamMember = {
  id: string;
  name: string;
  role: string;
  photo_url: string;
};

export default function TeamMembers({ onMemberClick }: { onMemberClick: (member: TeamMember) => void }) {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMembers() {
      const { data, error } = await supabase
        .from("team_members")
        .select("id, name, role, photo_url");
      if (!error && data) setMembers(data);
      setLoading(false);
    }
    fetchMembers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex flex-wrap gap-6 justify-center">
      {members.map((member) => (
        <div
          key={member.id}
          className="cursor-pointer flex flex-col items-center"
          onClick={() => onMemberClick(member)}
        >
          <div className="w-28 h-28 relative rounded-full overflow-hidden border-4 border-[#e75a40] mb-2">
            <Image
              src={member.photo_url}
              alt={member.name}
              fill
              className="object-cover"
            />
          </div>
          <span className="font-bold text-black text-lg">{member.name}</span>
          <span className="text-gray-500 text-sm">{member.role}</span>
        </div>
      ))}
    </div>
  );
}
