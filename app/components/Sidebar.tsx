// app/components/Sidebar.tsx
import {
  AreaHighlight,
  Highlight,
  PdfHighlighter,
  PdfLoader,
  Popup,
  Tip,
  IHighlight, // Importing IHighlight type
} from "react-pdf-highlighter";

import { MoreVertical, ChevronLast, ChevronFirst } from "lucide-react";
import { useContext, createContext, useState } from "react";

interface SidebarProps {
  highlights: Array<IHighlight>;
  resetHighlights: () => void;
  toggleDocument: () => void;
  scrollToHighlight: (highlight: IHighlight) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ highlights, resetHighlights, toggleDocument, scrollToHighlight }) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="h-screen overflow-y-auto">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-4 pb-2 flex justify-end items-end">
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100 "
          >
            {expanded ? <ChevronFirst /> : <ChevronLast />}
          </button>
        </div>
        <ul className={`flex-1 overflow-hidden ${!expanded ? "w-60" : "w-0"}`}>
          {highlights.map((highlight) => (
            <li
              className="border-2 relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer"
              onClick={() => {
                scrollToHighlight(highlight);
                /* scroll to highlight logic */
              }}
              key={highlight.id}
            >
              <div>
                Page {highlight.position.pageNumber}: {highlight.content.text}
              </div>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};
