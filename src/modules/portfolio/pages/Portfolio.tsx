/**
 * BEAUTY SALON NEOMORPHIC APP - Portfolio Page
 */
import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Image as ImageIcon,
  Upload,
  X,
  Heart,
  Sparkles,
  Filter,
  Plus
} from 'lucide-react';
import { cn, format } from '../../../shared/lib/utils';
import { PortfolioItem } from '../../../shared/types/types';
import { Card, Button, Badge, Progress } from '../../../shared/components/ui/NeoComponents';
import { ActionBottomSheet } from '../../../shared/components/ui/BottomSheet';

// Mock portfolio data - Beauty Salon themed images
const MOCK_PORTFOLIO: PortfolioItem[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=400&h=400&fit=crop',
    title: 'Maquiagem Noiva',
    category: 'makeup',
    uploadDate: new Date(),
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=400&h=400&fit=crop',
    title: 'Coque Elegante',
    category: 'hairstyle',
    uploadDate: new Date(),
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=400&fit=crop',
    title: 'Make Glamour',
    category: 'makeup',
    uploadDate: new Date(),
  },
  {
    id: '4',
    imageUrl: 'https://images.unsplash.com/photo-1560869713-7d0a29430803?w=400&h=400&fit=crop',
    title: 'Tranças Modernas',
    category: 'hairstyle',
    uploadDate: new Date(),
  },
  {
    id: '5',
    imageUrl: 'https://images.unsplash.com/photo-1503236823255-94609f598e71?w=400&h=400&fit=crop',
    title: 'Maquiagem Natural',
    category: 'makeup',
    uploadDate: new Date(),
  },
  {
    id: '6',
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=400&h=400&fit=crop',
    title: 'Penteado Festa',
    category: 'hairstyle',
    uploadDate: new Date(),
  },
  {
    id: '7',
    imageUrl: 'https://images.unsplash.com/photo-1596704017254-9b121068fb31?w=400&h=400&fit=crop',
    title: 'Olhos Esfumados',
    category: 'makeup',
    uploadDate: new Date(),
  },
  {
    id: '8',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400&h=400&fit=crop',
    title: 'Ondas Naturais',
    category: 'hairstyle',
    uploadDate: new Date(),
  },
  {
    id: '9',
    imageUrl: 'https://images.unsplash.com/photo-1457972729786-0411a3b2b626?w=400&h=400&fit=crop',
    title: 'Maquiagem Artística',
    category: 'makeup',
    uploadDate: new Date(),
  },
];

// Portfolio Categories
type PortfolioCategory = 'makeup' | 'hairstyle' | 'bride' | 'nails' | 'skin';

const PORTFOLIO_CATEGORIES: { value: PortfolioCategory; label: string; color: string }[] = [
  { value: 'makeup', label: 'Maquiagem', color: 'bg-pink-100 text-pink-600' },
  { value: 'hairstyle', label: 'Cabelos', color: 'bg-blue-100 text-blue-600' },
  { value: 'bride', label: 'Noivas', color: 'bg-amber-100 text-amber-600' },
  { value: 'nails', label: 'Unhas', color: 'bg-purple-100 text-purple-600' },
  { value: 'skin', label: 'Pele', color: 'bg-green-100 text-green-600' },
];

// Image Upload Component with Category Selection
const ImageUploader: React.FC<{
  onUpload: (file: File, title: string, category: PortfolioCategory) => void;
  progress: number;
  uploading: boolean;
}> = ({ onUpload, progress, uploading }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PortfolioCategory>('makeup');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      const finalTitle = title.trim() || 'Novo Trabalho';
      onUpload(selectedFile, finalTitle, category);
      setSelectedFile(null);
      setPreview(null);
      setTitle('');
      setCategory('makeup');
    }
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            'border-2 border-dashed rounded-neo-lg p-8 text-center cursor-pointer transition-all',
            'border-neo-text-secondary/30 hover:border-neo-accent/50',
            uploading && 'pointer-events-none opacity-50'
          )}
        >
          <div className="w-16 h-16 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center mx-auto mb-4">
            <Upload size={24} className="text-neo-text-secondary" />
          </div>
          <p className="text-neo-text font-medium mb-1">
            {uploading ? 'Enviando...' : 'Selecionar foto'}
          </p>
          <p className="text-xs text-neo-text-secondary">
            PNG, JPG até 10MB
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Preview */}
          <div className="relative aspect-square rounded-neo overflow-hidden shadow-neo-out">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={() => { setSelectedFile(null); setPreview(null); }}
              className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center"
            >
              <X size={16} />
            </button>
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-neo-text-secondary mb-2">
              Título do trabalho
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Make Noiva Clássica"
              className="w-full neo-input"
            />
          </div>

          {/* Category Selector */}
          <div>
            <label className="block text-sm font-medium text-neo-text-secondary mb-2">
              Categoria
            </label>
            <div className="grid grid-cols-3 gap-2">
              {PORTFOLIO_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategory(cat.value)}
                  className={cn(
                    'py-2 px-3 rounded-neo text-xs font-medium transition-all',
                    category === cat.value
                      ? 'shadow-neo-pressed text-neo-accent'
                      : 'shadow-neo-out text-neo-text-secondary'
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || uploading}
            className="w-full btn-glass-glow disabled:opacity-50"
          >
            {uploading ? 'Enviando...' : 'Adicionar ao Portfolio'}
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />

      {uploading && (
        <div className="space-y-2">
          <Progress value={progress} showLabel />
        </div>
      )}
    </div>
  );
};

// Portfolio Grid Item
const PortfolioItemCard: React.FC<{
  item: PortfolioItem;
  onClick: () => void;
  onDelete: () => void;
}> = ({ item, onClick, onDelete }) => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      onClick={onClick}
      className={cn(
        'relative aspect-square rounded-neo overflow-hidden cursor-pointer shadow-neo-out',
        isPressed && 'shadow-neo-pressed'
      )}
    >
      <img
        src={item.imageUrl}
        alt={item.title}
        className="w-full h-full object-cover"
      />

      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 hover:opacity-100 transition-opacity">
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <Badge variant={item.category === 'bride' ? 'warning' : item.category === 'makeup' ? 'warning' : 'info'} className="mb-2">
            {PORTFOLIO_CATEGORIES.find(c => c.value === item.category)?.label || item.category}
          </Badge>
          <h4 className="text-white font-semibold">{item.title}</h4>
        </div>
      </div>

      {/* Delete Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="absolute top-2 right-2 w-8 h-8 bg-neo-bg/80 rounded-full flex items-center justify-center text-neo-danger opacity-0 hover:opacity-100 transition-opacity"
      >
        <X size={16} />
      </button>
    </motion.div>
  );
};

// Image Detail Modal
const ImageDetail: React.FC<{
  item: PortfolioItem | null;
  isOpen: boolean;
  onClose: () => void;
}> = ({ item, isOpen, onClose }) => {
  if (!item) return null;

  return (
    <ActionBottomSheet
      isOpen={isOpen}
      onClose={onClose}
      title=""
      actions={[]}
    >
      <div className="space-y-4">
        <img
          src={item.imageUrl}
          alt={item.title}
          className="w-full rounded-neo-lg"
        />

        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-neo-text text-lg">{item.title}</h3>
            <Badge variant={item.category === 'makeup' ? 'warning' : 'info'}>
              {item.category === 'makeup' ? 'Maquiagem' : 'Cabelo'}
            </Badge>
          </div>
          <button className="w-12 h-12 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center text-neo-danger active:shadow-neo-pressed transition-all">
            <Heart size={20} />
          </button>
        </div>
      </div>
    </ActionBottomSheet>
  );
};

// Main Portfolio Page
export const Portfolio: React.FC = () => {
  const [items, setItems] = useState<PortfolioItem[]>(MOCK_PORTFOLIO);
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showUpload, setShowUpload] = useState(false);
  const [filter, setFilter] = useState<'all' | PortfolioCategory>('all');
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const filteredItems = filter === 'all'
    ? items
    : items.filter(item => item.category === filter);

  const handleUpload = (file: File, title: string, category: PortfolioCategory) => {
    setUploading(true);
    setUploadProgress(0);

    // Simulate upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          setShowUpload(false);

          // Add new item with provided title and category
          const newItem: PortfolioItem = {
            id: Date.now().toString(),
            imageUrl: URL.createObjectURL(file),
            title: title,
            category: category,
            uploadDate: new Date(),
          };
          setItems(prev => [newItem, ...prev]);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen bg-neo-bg pb-24 overflow-x-hidden">
      <div className="w-full max-w-[480px] mx-auto">
        {/* Header */}
        <header className="p-4">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-display mb-2">Portfolio</h1>
              <p className="text-caption">Veja nossos trabalhos</p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowUpload(true)}
            >
              <Plus size={18} />
              Adicionar
            </Button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2">
            <button
              onClick={() => setFilter('all')}
              className={cn(
                'px-4 py-2 rounded-neo text-sm font-medium transition-all whitespace-nowrap',
                filter === 'all'
                  ? 'shadow-neo-pressed text-neo-accent'
                  : 'shadow-neo-out text-neo-text-secondary'
              )}
            >
              Todos
            </button>
            {PORTFOLIO_CATEGORIES.map(cat => (
              <button
                key={cat.value}
                onClick={() => setFilter(cat.value)}
                className={cn(
                  'px-4 py-2 rounded-neo text-sm font-medium transition-all whitespace-nowrap',
                  filter === cat.value
                    ? 'shadow-neo-pressed text-neo-accent'
                    : 'shadow-neo-out text-neo-text-secondary'
                )}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </header>

        {/* Content */}
        <main className="px-6">
          {filteredItems.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-neo-bg rounded-full shadow-neo-out flex items-center justify-center mx-auto mb-4">
                <ImageIcon size={32} className="text-neo-text-secondary" />
              </div>
              <p className="text-neo-text-secondary">Nenhuma foto encontrada</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {filteredItems.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <PortfolioItemCard
                    item={item}
                    onClick={() => {
                      setSelectedItem(item);
                      setShowDetail(true);
                    }}
                    onDelete={() => handleDelete(item.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </main>

        {/* Upload Bottom Sheet */}
        <ActionBottomSheet
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          title="Adicionar ao Portfolio"
          actions={[]}
        >
          <ImageUploader
            onUpload={handleUpload}
            progress={uploadProgress}
            uploading={uploading}
          />
        </ActionBottomSheet>

        {/* Image Detail Modal */}
        <ImageDetail
          item={selectedItem}
          isOpen={showDetail}
          onClose={() => {
            setShowDetail(false);
            setSelectedItem(null);
          }}
        />
      </div>
    </div>
  );
};

export default Portfolio;
