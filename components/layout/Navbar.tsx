"use client";

import SearchDialog from "@/components/search-dialog";

export default function Navbar() {
  return (
    <aside className="sticky h-full py-5 px-5 overflow-y-auto z-50">
      <SearchDialog />
    </aside>
  );
}
