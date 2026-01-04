import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  Image as ImageIcon,
  Heart,
  X
} from 'lucide-react';
import { cn } from '../../../shared/lib/utils';
import { PortfolioItem } from '../../../shared/types/types';
import { NeoButton, Badge, NeoSelect } from '../../../shared/components/ui/NeoComponents';
import { ActionBottomSheet } from '../../../shared/components/ui/BottomSheet';
import { portfolioService } from '../../portfolio/services/portfolioService';

// Reuse categories (ideal to have in shared constants)
type PortfolioCategory = 'makeup' | 'hairstyle' | 'bride' | 'nails' | 'skin';

const PORTFOLIO_CATEGORIES: { value: PortfolioCategory; label: string; color: string }[] = [
  { value: 'makeup', label: 'Maquiagem', color: 'bg-pink-100 text-pink-600' },
  { value: 'hairstyle', label: 'Cabelos', color: 'bg-blue-100 text-blue-600' },
  { value: 'bride', label: 'Noivas', color: 'bg-amber-100 text-amber-600' },
  { value: 'nails', label: 'Unhas', color: 'bg-purple-100 text-purple-600' },
  { value: 'skin', label: 'Pele', color: 'bg-green-100 text-green-600' },
];

// Portfolio Grid Item (Read-Only Version)
const PortfolioItemCard: React.FC<{
  item: PortfolioItem;
  onClick: () => void;
}> = ({ item, onClick }) => {
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
          <Badge variant={item.category === 'bride' ? 'warning' : 'info'} className="mb-2">
            {PORTFOLIO_CATEGORIES.find(c => c.value === item.category)?.label || item.category}
          </Badge>
          <h4 className="text-white font-semibold">{item.title}</h4>
        </div>
      </div>
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
              {PORTFOLIO_CATEGORIES.find(c => c.value === item.category)?.label || item.category}
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
  const [selectedItem, setSelectedItem] = useState<PortfolioItem | null>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [filter, setFilter] = useState<'all' | PortfolioCategory>('all');

  // Fetch from Firestore
  const { data: items, isLoading } = useQuery({
    queryKey: ['portfolio'],
    queryFn: portfolioService.getPortfolioItems
  });

  const filteredItems = filter === 'all'
    ? (items || [])
    : (items || []).filter(item => item.category === filter);

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
            {/* Admin Add Button Removed */}
          </div>

          {/* Filter Dropdown */}
          <div className="mb-6">
            <NeoSelect
              options={[
                { value: 'all', label: 'Todos' },
                ...PORTFOLIO_CATEGORIES
              ]}
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | PortfolioCategory)}
              className="w-full"
            />
          </div>
        </header>

        {/* Content */}
        <main className="px-6">
          {isLoading ? (
            <div className="grid grid-cols-2 gap-3">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-square bg-neo-bg shadow-neo-out rounded-neo animate-pulse" />
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
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
                  />
                </motion.div>
              ))}
            </div>
          )}
        </main>

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
