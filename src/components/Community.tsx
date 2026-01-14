import React, { useState } from 'react';
import { Post, UserProfile } from '../types';
import { Heart, MessageCircle, Share2, Award, X, Send, Image as ImageIcon, Plus, Trophy } from 'lucide-react';
import { MOCK_LEADERBOARD } from '../constants';

interface CommunityProps {
  posts: Post[];
  user: UserProfile;
  onLike: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onAddPost: (content: string, image?: string) => void;
}

const Community: React.FC<CommunityProps> = ({ posts, user, onLike, onAddComment, onAddPost }) => {
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [activePostId, setActivePostId] = useState<string | null>(null);
  const [newPostContent, setNewPostContent] = useState('');
  const [newCommentText, setNewCommentText] = useState('');
  
  const handleSubmitPost = () => {
    if (!newPostContent.trim()) return;
    onAddPost(newPostContent, 'https://picsum.photos/seed/new/600/400');
    setNewPostContent('');
    setIsPostModalOpen(false);
  };

  const activePost = posts.find(p => p.id === activePostId);

  const handleSubmitComment = () => {
    if (!activePostId || !newCommentText.trim()) return;
    onAddComment(activePostId, newCommentText);
    setNewCommentText('');
  };

  return (
    <div className="h-full overflow-y-auto pb-24 px-4 pt-4 relative">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-black italic tracking-tighter">CLUB <span className="text-violet-500">TALK</span></h1>
        <button 
          onClick={() => setIsPostModalOpen(true)}
          className="bg-violet-600 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg shadow-violet-600/20 hover:bg-violet-500 flex items-center gap-1"
        >
          <Plus size={14} strokeWidth={3} /> New Post
        </button>
      </div>

      {/* LEADERBOARD WIDGET */}
      <div className="mb-6 bg-gradient-to-r from-zinc-900 to-black border border-zinc-800 rounded-xl p-4 shadow-lg relative overflow-hidden">
         <div className="absolute top-0 right-0 p-2 opacity-10">
            <Trophy size={64} className="text-amber-500" />
         </div>
         <h3 className="text-xs font-bold text-amber-500 uppercase mb-3 flex items-center gap-1">
            <Trophy size={14} /> Market Leaders
         </h3>
         <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
            {MOCK_LEADERBOARD.map((leader) => (
               <div key={leader.rank} className="flex-shrink-0 flex items-center gap-3 bg-zinc-800/50 pr-4 rounded-full border border-zinc-700/50">
                  <div className="relative">
                     <img src={leader.avatar} className="w-10 h-10 rounded-full" alt={leader.username} />
                     <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold border-2 border-zinc-900 ${leader.rank === 1 ? 'bg-amber-500 text-black' : leader.rank === 2 ? 'bg-zinc-400 text-black' : 'bg-orange-700 text-white'}`}>
                        {leader.rank}
                     </div>
                  </div>
                  <div>
                     <p className="text-xs font-bold text-white">{leader.username}</p>
                     <p className="text-[10px] text-emerald-400 font-mono">${leader.portfolioValue.toLocaleString()}</p>
                  </div>
               </div>
            ))}
         </div>
      </div>

      <div className="space-y-6">
        {posts.map((post) => (
          <div key={post.id} className="bg-zinc-900/50 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
            <div className="p-4 pb-2 flex items-center gap-3">
              <img src={post.userAvatar} alt={post.username} className="w-10 h-10 rounded-full border border-zinc-700 object-cover" />
              <div>
                <h3 className="font-bold text-white text-sm">{post.username}</h3>
                <span className="text-xs text-zinc-500">{new Date(post.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
              </div>
              {post.likes > 100 && (
                <Award size={16} className="text-amber-500 ml-auto" />
              )}
            </div>
            
            <div className="px-4 py-2">
              <p className="text-zinc-200 text-sm leading-relaxed mb-3">{post.content}</p>
              {post.image && (
                <img src={post.image} alt="Post content" className="w-full rounded-lg mb-3 border border-zinc-800" />
              )}
            </div>

            <div className="px-4 py-3 bg-zinc-900 border-t border-zinc-800/50 flex items-center justify-between">
              <button 
                onClick={() => onLike(post.id)}
                className={`flex items-center gap-2 text-sm transition-colors ${post.isLiked ? 'text-red-500' : 'text-zinc-500 hover:text-red-500'}`}
              >
                <Heart size={18} fill={post.isLiked ? "currentColor" : "none"} />
                <span>{post.likes}</span>
              </button>
              <button 
                onClick={() => setActivePostId(post.id)}
                className="flex items-center gap-2 text-zinc-500 text-sm hover:text-white transition-colors"
              >
                <MessageCircle size={18} />
                <span>{post.comments.length} Comments</span>
              </button>
              <button className="flex items-center gap-2 text-zinc-500 text-sm hover:text-white transition-colors">
                <Share2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* NEW POST MODAL */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-zinc-900 w-full max-w-md rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl animate-[slideUp_0.3s_ease-out]">
            <div className="p-4 border-b border-zinc-800 flex justify-between items-center">
              <h3 className="text-white font-bold">New Drop</h3>
              <button onClick={() => setIsPostModalOpen(false)}><X size={20} className="text-zinc-500" /></button>
            </div>
            <div className="p-4">
              <textarea 
                placeholder="What did you cop today?" 
                className="w-full bg-transparent text-white resize-none outline-none h-32 placeholder-zinc-600"
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
              />
              <div className="flex gap-2 mt-4">
                <button className="p-2 bg-zinc-800 rounded-lg text-zinc-400 hover:text-white">
                  <ImageIcon size={20} />
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-zinc-800">
               <button 
                 onClick={handleSubmitPost}
                 disabled={!newPostContent.trim()}
                 className="w-full bg-violet-600 text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed hover:bg-violet-500"
               >
                 Post
               </button>
            </div>
          </div>
        </div>
      )}

      {/* COMMENTS MODAL */}
      {activePostId && activePost && (
         <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm">
           <div className="bg-zinc-900 w-full max-w-md h-[80vh] sm:h-[600px] rounded-t-2xl sm:rounded-2xl border border-zinc-800 flex flex-col shadow-2xl animate-[slideUp_0.3s_ease-out]">
              <div className="p-4 border-b border-zinc-800 flex justify-between items-center flex-shrink-0">
                <h3 className="text-white font-bold">Comments</h3>
                <button onClick={() => setActivePostId(null)}><X size={20} className="text-zinc-500" /></button>
              </div>
              
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                 <div className="pb-4 border-b border-zinc-800/50 mb-4">
                    <div className="flex items-center gap-2 mb-2">
                       <img src={activePost.userAvatar} className="w-6 h-6 rounded-full" alt="avatar" />
                       <span className="text-sm font-bold text-zinc-300">{activePost.username}</span>
                    </div>
                    <p className="text-zinc-400 text-sm line-clamp-2">{activePost.content}</p>
                 </div>

                 {activePost.comments.length === 0 ? (
                   <div className="text-center text-zinc-600 py-10">No comments yet.</div>
                 ) : (
                   activePost.comments.map(comment => (
                     <div key={comment.id} className="flex gap-3">
                        <img src={comment.avatar} className="w-8 h-8 rounded-full bg-zinc-800" alt="avatar" />
                        <div className="flex-1">
                           <div className="bg-zinc-800/50 rounded-xl p-3 rounded-tl-none">
                              <span className="text-xs font-bold text-zinc-300 block mb-1">{comment.username}</span>
                              <p className="text-sm text-zinc-200">{comment.text}</p>
                           </div>
                           <span className="text-[10px] text-zinc-600 ml-2 mt-1 block">Just now</span>
                        </div>
                     </div>
                   ))
                 )}
              </div>

              <div className="p-3 border-t border-zinc-800 flex items-center gap-2 bg-zinc-950 flex-shrink-0 mb-safe">
                 <img src={user.avatar} className="w-8 h-8 rounded-full border border-zinc-700" alt="me" />
                 <div className="flex-1 bg-zinc-900 rounded-full px-4 py-2 flex items-center border border-zinc-800 focus-within:border-violet-500 transition-colors">
                    <input 
                      type="text" 
                      placeholder="Add a comment..."
                      className="bg-transparent w-full text-white text-sm outline-none placeholder-zinc-500"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                    />
                    <button 
                      onClick={handleSubmitComment}
                      disabled={!newCommentText.trim()}
                      className="text-violet-500 disabled:opacity-50 ml-2"
                    >
                      <Send size={16} />
                    </button>
                 </div>
              </div>
           </div>
         </div>
      )}
    </div>
  );
};

export default Community;