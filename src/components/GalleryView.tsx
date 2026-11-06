import React from 'react';
import { AstrophotographyPhoto, UserProfile, UserLevel } from '../types';
import {
  Camera,
  Heart,
  MessageSquare,
  Sparkles,
  Plus,
  MapPin,
  Clock,
  Layers,
  Sliders,
  X,
  ExternalLink,
  Send,
} from 'lucide-react';

interface GalleryViewProps {
  user: UserProfile | null;
  photos: AstrophotographyPhoto[];
  onLikePhoto: (photoId: string) => void;
  onAddPhotoComment: (photoId: string, text: string) => void;
  onUploadPhoto: (newPhoto: Omit<AstrophotographyPhoto, 'id' | 'likes' | 'comments' | 'date'>) => void;
  onOpenAuth: () => void;
}

export const GalleryView: React.FC<GalleryViewProps> = ({
  user,
  photos,
  onLikePhoto,
  onAddPhotoComment,
  onUploadPhoto,
  onOpenAuth,
}) => {
  const [selectedCategory, setSelectedCategory] = React.useState<string>('all');
  const [activePhoto, setActivePhoto] = React.useState<AstrophotographyPhoto | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = React.useState<boolean>(false);
  const [modalCommentText, setModalCommentText] = React.useState<string>('');

  // Upload modal state
  const [uploadTitle, setUploadTitle] = React.useState<string>('');
  const [uploadCategory, setUploadCategory] = React.useState<AstrophotographyPhoto['category']>('nebulae');
  const [uploadImageUrl, setUploadImageUrl] = React.useState<string>(
    'https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=1200&auto=format&fit=crop&q=80'
  );
  const [uploadDescription, setUploadDescription] = React.useState<string>('');
  const [uploadTelescope, setUploadTelescope] = React.useState<string>('William Optics Zenithstar 73 III');
  const [uploadCamera, setUploadCamera] = React.useState<string>('Sony A7 III Full Frame');
  const [uploadExposure, setUploadExposure] = React.useState<string>('4.5 Hours (90 x 180s)');
  const [uploadIso, setUploadIso] = React.useState<string>('ISO 1600');
  const [uploadBortle, setUploadBortle] = React.useState<number>(3);
  const [uploadLocation, setUploadLocation] = React.useState<string>('Cherry Springs Dark Sky Park, PA');

  const filteredPhotos = photos.filter((p) => {
    return selectedCategory === 'all' || p.category === selectedCategory;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadTitle.trim() || !uploadImageUrl.trim()) return;

    onUploadPhoto({
      title: uploadTitle,
      photographerName: user ? user.name : 'Cosmic Observer',
      photographerAvatar: user ? user.avatar : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      photographerLevel: user ? user.level : 'beginner',
      imageUrl: uploadImageUrl,
      category: uploadCategory,
      description: uploadDescription || 'Astrophotography capture submitted to Lambda Learn gallery.',
      exif: {
        telescopeOrLens: uploadTelescope,
        camera: uploadCamera,
        mountOrTracker: 'Equatorial Star Tracker',
        exposureTotal: uploadExposure,
        singleExposure: '180 seconds',
        isoOrGain: uploadIso,
        bortleScale: uploadBortle,
        software: 'Siril & Adobe Lightroom',
        location: uploadLocation,
      },
    });

    setIsUploadModalOpen(false);
    setUploadTitle('');
    setUploadDescription('');
  };

  const handleSendModalComment = () => {
    if (!modalCommentText.trim() || !activePhoto) return;
    onAddPhotoComment(activePhoto.id, modalCommentText);
    setModalCommentText('');
  };

  const categories = [
    { id: 'all', label: 'All Targets' },
    { id: 'nebulae', label: 'Emission Nebulae' },
    { id: 'galaxies', label: 'Galaxies' },
    { id: 'milkyway', label: 'Milky Way Landscapes' },
    { id: 'planets', label: 'Planets & Solar' },
  ];

  return (
    <div className="space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <span className="text-xs uppercase font-semibold text-cyan-400 tracking-wider flex items-center gap-1.5">
            <Camera className="w-3.5 h-3.5" />
            Astrophotography Showcase
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white mt-1">
            Deep Cosmos Gallery
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            High-resolution deep sky captures, planetary lucky imaging, and wide-field Milky Way panoramas with complete camera, lens, and exposure metadata.
          </p>
        </div>

        <div>
          {user ? (
            <button
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white text-xs sm:text-sm font-semibold shadow-lg shadow-cyan-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Post Astrophotography</span>
            </button>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs sm:text-sm font-semibold border border-slate-700 transition-all cursor-pointer"
            >
              <span>Log in to Share Photos</span>
            </button>
          )}
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
              selectedCategory === cat.id
                ? 'bg-slate-800 text-cyan-400 border-cyan-500/40 shadow-sm'
                : 'bg-slate-900/60 text-slate-400 border-slate-800 hover:text-white'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Photo Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPhotos.map((photo) => (
          <div
            key={photo.id}
            className="group rounded-3xl bg-[#140a2a] border border-purple-500/30 overflow-hidden hover:border-purple-400/60 transition-all duration-300 shadow-xl flex flex-col justify-between"
          >
            {/* Image Thumbnail Container */}
            <div
              className="relative aspect-video w-full overflow-hidden bg-black cursor-pointer"
              onClick={() => setActivePhoto(photo)}
            >
              <img
                src={photo.imageUrl}
                alt={photo.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c1228] via-transparent to-transparent opacity-80" />

              {/* Bortle scale badge */}
              <div className="absolute top-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-mono bg-black/70 backdrop-blur-md text-amber-300 border border-amber-500/30">
                Bortle {photo.exif.bortleScale}
              </div>

              {/* Category pill */}
              <div className="absolute top-3 right-3 px-2 py-0.5 rounded-md text-[10px] font-semibold uppercase tracking-wider bg-black/70 backdrop-blur-md text-cyan-300 border border-cyan-500/30">
                {photo.category}
              </div>
            </div>

            {/* Photo Details */}
            <div className="p-4 space-y-3">
              <div>
                <h3
                  onClick={() => setActivePhoto(photo)}
                  className="font-bold text-base text-white font-display group-hover:text-cyan-300 transition-colors cursor-pointer line-clamp-1"
                >
                  {photo.title}
                </h3>
                <p className="text-xs text-slate-400 mt-1 line-clamp-2">
                  {photo.description}
                </p>
              </div>

              {/* Quick EXIF Chips */}
              <div className="space-y-1 text-[11px] text-slate-400 font-mono bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                <div className="flex items-center justify-between">
                  <span>🔭 {photo.exif.telescopeOrLens.split(' (')[0]}</span>
                </div>
                <div className="flex items-center justify-between text-slate-500">
                  <span>⏱️ {photo.exif.exposureTotal}</span>
                  <span>📷 {photo.exif.camera.split(' ')[0]}</span>
                </div>
              </div>

              {/* Footer: Author & Likes */}
              <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img
                    src={photo.photographerAvatar}
                    alt={photo.photographerName}
                    className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-700"
                  />
                  <span className="text-xs font-medium text-slate-300">
                    {photo.photographerName}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onLikePhoto(photo.id)}
                    className={`flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      photo.isLiked
                        ? 'bg-pink-500/20 text-pink-300 border-pink-500/40'
                        : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${photo.isLiked ? 'fill-current' : ''}`} />
                    <span>{photo.likes}</span>
                  </button>

                  <button
                    onClick={() => setActivePhoto(photo)}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1 rounded-lg bg-slate-900 border border-slate-800"
                  >
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Photo High-Res Lightbox & EXIF Inspector Modal */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-2xl bg-[#0b1026] border border-slate-700 overflow-hidden shadow-2xl my-auto flex flex-col max-h-[92vh]">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-[#080c1d]">
              <div>
                <h3 className="text-base font-bold text-white font-display">
                  {activePhoto.title}
                </h3>
                <span className="text-xs text-slate-400">
                  By {activePhoto.photographerName} • {activePhoto.date}
                </span>
              </div>
              <button
                onClick={() => setActivePhoto(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
                aria-label="Close Photo Details"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="overflow-y-auto p-4 sm:p-6 space-y-5">
              {/* High-res image display */}
              <div className="relative rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 max-h-[50vh]">
                <img
                  src={activePhoto.imageUrl}
                  alt={activePhoto.title}
                  className="w-full h-auto max-h-[50vh] object-contain"
                />
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                {activePhoto.description}
              </p>

              {/* Full Technical EXIF Breakdown */}
              <div className="space-y-3">
                <h4 className="text-xs uppercase font-bold text-cyan-400 tracking-wider flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5" />
                  Technical Capture & Processing Data
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 text-xs">
                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Telescope / Optics</span>
                    <span className="text-white font-medium">{activePhoto.exif.telescopeOrLens}</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Camera Sensor</span>
                    <span className="text-white font-medium">{activePhoto.exif.camera}</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Tracking Mount</span>
                    <span className="text-white font-medium">{activePhoto.exif.mountOrTracker}</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Integration Time</span>
                    <span className="text-cyan-300 font-mono font-medium">{activePhoto.exif.exposureTotal}</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Gain / ISO</span>
                    <span className="text-white font-mono font-medium">{activePhoto.exif.isoOrGain}</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Sky Darkness</span>
                    <span className="text-amber-300 font-mono font-medium">Bortle Class {activePhoto.exif.bortleScale}</span>
                  </div>

                  {activePhoto.exif.filters && (
                    <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                      <span className="text-slate-400 block text-[10px] uppercase font-mono">Optical Filters</span>
                      <span className="text-white font-medium">{activePhoto.exif.filters}</span>
                    </div>
                  )}

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Processing Software</span>
                    <span className="text-white font-medium">{activePhoto.exif.software}</span>
                  </div>

                  <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 block text-[10px] uppercase font-mono">Location</span>
                    <span className="text-white font-medium flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400 shrink-0" />
                      {activePhoto.exif.location}
                    </span>
                  </div>
                </div>
              </div>

              {/* Comments Section on Photo */}
              <div className="pt-4 border-t border-slate-800 space-y-3">
                <h4 className="text-xs uppercase font-bold text-slate-300 tracking-wider">
                  Community Feedback ({activePhoto.comments.length})
                </h4>

                {activePhoto.comments.map((cm) => (
                  <div key={cm.id} className="flex items-start gap-2.5 text-xs bg-slate-900/50 p-2.5 rounded-lg border border-slate-800">
                    <img src={cm.avatar} alt={cm.author} className="w-6 h-6 rounded-full object-cover shrink-0" />
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">{cm.author}</span>
                        <span className="text-[10px] text-slate-500 font-mono">{cm.time}</span>
                      </div>
                      <p className="text-slate-300 mt-0.5">{cm.text}</p>
                    </div>
                  </div>
                ))}

                {user ? (
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="text"
                      placeholder="Ask the photographer about their settings or workflow..."
                      value={modalCommentText}
                      onChange={(e) => setModalCommentText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSendModalComment();
                      }}
                      className="flex-1 px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
                    />
                    <button
                      onClick={handleSendModalComment}
                      className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white transition-colors cursor-pointer"
                      aria-label="Post Photo Comment"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center text-xs text-slate-400 py-2">
                    <button onClick={onOpenAuth} className="text-cyan-400 font-semibold hover:underline">
                      Log in
                    </button>{' '}
                    to leave feedback on this photo.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Submit / Post Astrophotography Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-xl rounded-2xl bg-[#0b1026] border border-slate-700 p-6 space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h2 className="text-lg font-bold text-white font-display">
                Post Astrophotography Picture
              </h2>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Target Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Heart & Soul Nebula (IC 1805) in SHO"
                  value={uploadTitle}
                  onChange={(e) => setUploadTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Category
                  </label>
                  <select
                    value={uploadCategory}
                    onChange={(e) =>
                      setUploadCategory(e.target.value as AstrophotographyPhoto['category'])
                    }
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  >
                    <option value="nebulae">Emission Nebulae</option>
                    <option value="galaxies">Galaxies</option>
                    <option value="milkyway">Milky Way Landscape</option>
                    <option value="planets">Planets & Solar</option>
                    <option value="lunar">Lunar</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Bortle Scale (1 = Pristine, 9 = City)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="9"
                    value={uploadBortle}
                    onChange={(e) => setUploadBortle(parseInt(e.target.value) || 3)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Image URL
                </label>
                <input
                  type="url"
                  required
                  placeholder="https://..."
                  value={uploadImageUrl}
                  onChange={(e) => setUploadImageUrl(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Tip: Supports any high-resolution image link from Unsplash, AstroBin, or Wikimedia.
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Telescope or Lens
                  </label>
                  <input
                    type="text"
                    value={uploadTelescope}
                    onChange={(e) => setUploadTelescope(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Camera
                  </label>
                  <input
                    type="text"
                    value={uploadCamera}
                    onChange={(e) => setUploadCamera(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Total Exposure
                  </label>
                  <input
                    type="text"
                    value={uploadExposure}
                    onChange={(e) => setUploadExposure(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Location
                  </label>
                  <input
                    type="text"
                    value={uploadLocation}
                    onChange={(e) => setUploadLocation(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Description / Capture Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Share details on your framing, filters, polar alignment or stacking software..."
                  value={uploadDescription}
                  onChange={(e) => setUploadDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-semibold text-xs transition-all shadow-md shadow-cyan-600/30"
                >
                  Publish to Gallery (+25 XP)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
