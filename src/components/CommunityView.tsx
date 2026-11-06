import React from 'react';
import { CommunityPost, UserProfile, UserLevel, TrackId } from '../types';
import {
  MessageSquare,
  ThumbsUp,
  Tag,
  Plus,
  Send,
  Pin,
  Sparkles,
  Camera,
  Compass,
  Rocket,
  Search,
  X,
} from 'lucide-react';

interface CommunityViewProps {
  user: UserProfile | null;
  posts: CommunityPost[];
  onUpvotePost: (postId: string) => void;
  onAddComment: (postId: string, text: string) => void;
  onCreatePost: (newPost: {
    title: string;
    content: string;
    trackTag: TrackId | 'gear' | 'general';
    tags: string[];
  }) => void;
  onOpenAuth: () => void;
}

export const CommunityView: React.FC<CommunityViewProps> = ({
  user,
  posts,
  onUpvotePost,
  onAddComment,
  onCreatePost,
  onOpenAuth,
}) => {
  const [activeFilter, setActiveFilter] = React.useState<string>('all');
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [expandedComments, setExpandedComments] = React.useState<Record<string, boolean>>({
    'post-1': true,
  });
  const [commentInputs, setCommentInputs] = React.useState<Record<string, string>>({});

  // New post form state
  const [newTitle, setNewTitle] = React.useState<string>('');
  const [newContent, setNewContent] = React.useState<string>('');
  const [newTrack, setNewTrack] = React.useState<TrackId | 'gear' | 'general'>('astrophotography');
  const [newTagsStr, setNewTagsStr] = React.useState<string>('MilkyWay, BackyardAstrophotography');

  const filteredPosts = posts.filter((p) => {
    const matchesFilter = activeFilter === 'all' || p.trackTag === activeFilter;
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesFilter && matchesSearch;
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newContent.trim()) return;

    const tags = newTagsStr
      .split(',')
      .map((t) => t.trim().replace(/^#/, ''))
      .filter(Boolean);

    onCreatePost({
      title: newTitle,
      content: newContent,
      trackTag: newTrack,
      tags: tags.length ? tags : ['GeneralSpace'],
    });

    setNewTitle('');
    setNewContent('');
    setIsModalOpen(false);
  };

  const handleCommentSubmit = (postId: string) => {
    const text = commentInputs[postId];
    if (!text || !text.trim()) return;
    onAddComment(postId, text);
    setCommentInputs((prev) => ({ ...prev, [postId]: '' }));
  };

  const levelBadges: Record<UserLevel, string> = {
    beginner: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    intermediate: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30',
    advanced: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Community Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider flex items-center gap-1.5">
            <MessageSquare className="w-3.5 h-3.5" />
            Learn Community Forum
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            Cosmic Cadets & Observers
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Discuss astrophysics research papers, share backyard telescope setups, compare Hohmann transfer math, and collaborate with learners worldwide.
          </p>
        </div>

        <div>
          {user ? (
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>New Community Post</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <span>Log in to Join Discussion</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Chips and Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeFilter === 'all'
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            All Channels
          </button>
          <button
            onClick={() => setActiveFilter('astrophotography')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeFilter === 'astrophotography'
                ? 'bg-cyan-950/40 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-cyan-400" />
            <span>Astrophotography</span>
          </button>
          <button
            onClick={() => setActiveFilter('astronomy')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeFilter === 'astronomy'
                ? 'bg-indigo-950/40 text-indigo-300 border-indigo-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span>Astrophysics</span>
          </button>
          <button
            onClick={() => setActiveFilter('aerospace')}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              activeFilter === 'aerospace'
                ? 'bg-orange-950/40 text-orange-300 border-orange-500/40'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            <Rocket className="w-3.5 h-3.5 text-orange-400" />
            <span>Aerospace</span>
          </button>
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search discussions & tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
      </div>

      {/* Posts Feed */}
      <div className="space-y-4">
        {filteredPosts.map((post) => {
          const isExpanded = expandedComments[post.id];

          return (
            <div
              key={post.id}
              className="p-5 rounded-3xl bg-gradient-to-b from-[#160b2e] via-[#100722] to-[#090416] border border-purple-500/30 hover:border-purple-400/50 transition-all space-y-4 shadow-xl"
            >
              {/* Post Author Bar */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <img
                    src={post.authorAvatar}
                    alt={post.authorName}
                    className="w-10 h-10 rounded-full object-cover ring-1 ring-cyan-500/30"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white">
                        {post.authorName}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider border ${
                          levelBadges[post.authorLevel]
                        }`}
                      >
                        {post.authorLevel}
                      </span>
                      {post.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                          <Pin className="w-3 h-3" /> Pinned
                        </span>
                      )}
                    </div>
                    {post.authorBadge && (
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {post.authorBadge}
                      </span>
                    )}
                  </div>
                </div>

                <span className="text-xs text-slate-500 font-mono">
                  {post.createdAt}
                </span>
              </div>

              {/* Title & Content */}
              <div className="space-y-2">
                <h3 className="text-base sm:text-lg font-bold text-white font-display">
                  {post.title}
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">
                  {post.content}
                </p>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-slate-800/80 text-cyan-300 border border-slate-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Post Actions: Upvote, Comments toggle */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-800/80">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onUpvotePost(post.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      post.isUpvoted
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50'
                        : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700'
                    }`}
                  >
                    <ThumbsUp className={`w-3.5 h-3.5 ${post.isUpvoted ? 'fill-current' : ''}`} />
                    <span>{post.upvotes} Upvotes</span>
                  </button>

                  <button
                    onClick={() =>
                      setExpandedComments((prev) => ({
                        ...prev,
                        [post.id]: !prev[post.id],
                      }))
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-400 hover:text-white bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>{post.commentsList.length} Responses</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Comments Section */}
              {isExpanded && (
                <div className="pt-3 border-t border-slate-800 space-y-3 bg-[#060814]/70 p-4 rounded-xl">
                  {post.commentsList.map((c) => (
                    <div key={c.id} className="flex items-start gap-2.5 text-xs">
                      <img
                        src={c.authorAvatar}
                        alt={c.authorName}
                        className="w-7 h-7 rounded-full object-cover shrink-0 ring-1 ring-slate-700"
                      />
                      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex-1 space-y-1">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white">{c.authorName}</span>
                            <span
                              className={`px-1.5 py-0.2 rounded text-[9px] uppercase font-mono border ${
                                levelBadges[c.authorLevel]
                              }`}
                            >
                              {c.authorLevel}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono">
                            {c.createdAt}
                          </span>
                        </div>
                        <p className="text-slate-300 leading-relaxed">{c.text}</p>
                      </div>
                    </div>
                  ))}

                  {/* Add comment input */}
                  {user ? (
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Write a constructive response or question..."
                        value={commentInputs[post.id] || ''}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCommentSubmit(post.id);
                        }}
                        className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => handleCommentSubmit(post.id)}
                        className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
                        title="Post Response"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="pt-2 text-center text-xs text-slate-400">
                      <button
                        onClick={onOpenAuth}
                        className="text-cyan-400 hover:underline font-semibold"
                      >
                        Log in
                      </button>{' '}
                      to participate in this discussion.
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* New Post Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0b1026] border border-slate-700 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white font-display">
                Create Community Post
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Track / Topic Channel
                </label>
                <select
                  value={newTrack}
                  onChange={(e) =>
                    setNewTrack(e.target.value as TrackId | 'gear' | 'general')
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                >
                  <option value="astrophotography">Astrophotography & Imaging</option>
                  <option value="astronomy">Astrophysics & Astronomy</option>
                  <option value="aerospace">Aerospace & Flight Mechanics</option>
                  <option value="gear">Telescope & Camera Hardware</option>
                  <option value="general">General Space Exploration</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Post Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tips on calibrating flat frames in Siril without banding"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Content / Details
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="Share your observation workflow, mathematical derivations, telescope settings, or questions..."
                  value={newContent}
                  onChange={(e) => setNewContent(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. M42, PixInsight, Bortle4, Refractor"
                  value={newTagsStr}
                  onChange={(e) => setNewTagsStr(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-600/30"
                >
                  Publish Post (+15 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
