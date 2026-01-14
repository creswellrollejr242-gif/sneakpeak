import React from 'react';
import { Story } from '../types';
import { Plus } from 'lucide-react';

interface StoriesProps {
  stories: Story[];
}

const Stories: React.FC<StoriesProps> = ({ stories }) => {
  return (
    <div className="flex gap-4 overflow-x-auto px-4 py-4 no-scrollbar">
      {/* Add Story Button */}
      <div className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
        <div className="w-16 h-16 rounded-full border-2 border-zinc-800 bg-zinc-900 flex items-center justify-center relative">
          <Plus size={24} className="text-violet-500" />
          <div className="absolute bottom-0 right-0 bg-violet-600 text-white rounded-full p-0.5 border-2 border-zinc-950">
             <Plus size={10} />
          </div>
        </div>
        <span className="text-[10px] text-zinc-400 font-medium">Add Drop</span>
      </div>

      {stories.map(story => (
        <div key={story.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer group">
          <div className={`w-16 h-16 rounded-full p-[2px] ${story.viewed ? 'bg-zinc-700' : 'bg-gradient-to-tr from-amber-500 to-violet-600'}`}>
            <div className="w-full h-full rounded-full border-2 border-zinc-950 overflow-hidden relative">
              <img src={story.image} className="w-full h-full object-cover" alt={story.title} />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors"></div>
            </div>
          </div>
          <span className="text-[10px] text-white font-medium truncate w-16 text-center">{story.title}</span>
        </div>
      ))}
    </div>
  );
};

export default Stories;