import React, { useState, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Trash2, Image as ImageIcon } from 'lucide-react';
import { toast } from 'sonner';

import { Typography, NeoCard, NeoButton, Badge, Progress, NeoSelect } from '../../../shared/components/ui';
import { portfolioService } from '../../portfolio/services/portfolioService';
import { PortfolioItem } from '../../../shared/types/types';
import { cn } from '../../../shared/lib/utils';
import { ActionBottomSheet } from '../../../shared/components/ui/BottomSheet';

// Reuse categories from Portfolio.tsx (or move to constants later)
type PortfolioCategory = 'makeup' | 'hairstyle' | 'bride' | 'nails' | 'skin';

const PORTFOLIO_CATEGORIES: { value: PortfolioCategory; label: string; color: string }[] = [
    { value: 'makeup', label: 'Maquiagem', color: 'bg-pink-100 text-pink-600' },
    { value: 'hairstyle', label: 'Cabelos', color: 'bg-blue-100 text-blue-600' },
    { value: 'bride', label: 'Noivas', color: 'bg-amber-100 text-amber-600' },
    { value: 'nails', label: 'Unhas', color: 'bg-purple-100 text-purple-600' },
    { value: 'skin', label: 'Pele', color: 'bg-green-100 text-green-600' },
];

// --- Subcomponents ---

const ImageUploader: React.FC<{
    onUpload: (file: File, title: string, category: PortfolioCategory) => void;
    uploading: boolean;
}> = ({ onUpload, uploading }) => {
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
            // Cleanup happens after success or manually
        }
    };

    // Reset form helper
    const resetForm = () => {
        setSelectedFile(null);
        setPreview(null);
        setTitle('');
        setCategory('makeup');
    };

    // Expose reset via useEffect if uploading changes to false? 
    // Or just let parent handle it? 
    // For simplicity, we assume parent closes modal on success, and we reset state on mount or manually.

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
                    <Typography variant="body" className="font-medium mb-1">
                        {uploading ? 'Enviando...' : 'Selecionar foto'}
                    </Typography>
                    <Typography variant="caption" className="text-neo-text-secondary">
                        PNG, JPG até 10MB
                    </Typography>
                </div>
            ) : (
                <div className="space-y-4">
                    {/* Preview */}
                    <div className="relative aspect-square rounded-neo overflow-hidden shadow-neo-out">
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        {!uploading && (
                            <button
                                onClick={resetForm}
                                className="absolute top-2 right-2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center text-neo-danger"
                            >
                                <X size={16} />
                            </button>
                        )}
                    </div>

                    {/* Title Input */}
                    <div>
                        <label className="block text-sm font-medium text-neo-text-secondary mb-2">
                            Título
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Ex: Make Noiva"
                            disabled={uploading}
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
                                    disabled={uploading}
                                    className={cn(
                                        'py-2 px-1 rounded-neo text-xs font-medium transition-all truncate',
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
                    <NeoButton
                        onClick={handleSubmit}
                        disabled={!selectedFile || uploading}
                        className="w-full"
                        variant="gradient"
                    >
                        {uploading ? 'Enviando...' : 'Salvar Foto'}
                    </NeoButton>
                </div>
            )}

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
            />
        </div>
    );
};

// --- Main Page ---

export const AdminPortfolioPage: React.FC = () => {
    const queryClient = useQueryClient();
    const [showUpload, setShowUpload] = useState(false);

    // Queries
    const { data: items, isLoading } = useQuery({
        queryKey: ['portfolio'],
        queryFn: portfolioService.getPortfolioItems
    });

    // Mutations
    const uploadMutation = useMutation({
        mutationFn: (data: { file: File, title: string, category: string }) =>
            portfolioService.addPortfolioItem(data.file, data.title, data.category),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['portfolio'] });
            toast.success('Foto adicionada com sucesso!');
            setShowUpload(false);
        },
        onError: (error) => {
            console.error(error);
            toast.error('Erro ao adicionar foto.');
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (data: { id: string, imageUrl: string }) =>
            portfolioService.deletePortfolioItem(data.id, data.imageUrl),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['portfolio'] });
            toast.success('Foto removida com sucesso!');
        },
        onError: (error) => {
            console.error(error);
            toast.error('Erro ao remover foto.');
        }
    });

    return (
        <div className="flex flex-col gap-6">
            <header className="flex items-center justify-between">
                <div>
                    <Typography variant="h2" className="text-neo-text font-display font-bold">
                        Gerenciar Portfolio
                    </Typography>
                    <Typography variant="body" className="text-neo-text-secondary">
                        Adicione ou remova fotos da galeria.
                    </Typography>
                </div>
                <NeoButton
                    variant="gradient"
                    onClick={() => setShowUpload(true)}
                    icon={<Upload size={18} />}
                >
                    Adicionar Foto
                </NeoButton>
            </header>

            {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {[1, 2, 3, 4].map(i => (
                        <div key={i} className="aspect-square bg-neo-bg shadow-neo-out rounded-neo animate-pulse" />
                    ))}
                </div>
            ) : !items || items.length === 0 ? (
                <NeoCard className="p-12 flex flex-col items-center justify-center text-center opacity-70">
                    <ImageIcon size={48} className="text-neo-text-secondary mb-4" />
                    <Typography variant="h4">Galeria Vazia</Typography>
                    <Typography variant="body">
                        Comece adicionando fotos dos seus trabalhos.
                    </Typography>
                </NeoCard>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    <AnimatePresence>
                        {items.map((item) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="group relative aspect-square rounded-neo overflow-hidden shadow-neo-out hover:shadow-neo-pressed transition-all"
                            >
                                <img
                                    src={item.imageUrl}
                                    alt={item.title}
                                    className="w-full h-full object-cover"
                                />

                                {/* Overlay with actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-3">
                                    <div className="self-end">
                                        <button
                                            onClick={() => deleteMutation.mutate({ id: item.id, imageUrl: item.imageUrl })}
                                            className="w-8 h-8 bg-red-500/80 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <div>
                                        <Badge variant="info" className="mb-1 text-xs">
                                            {PORTFOLIO_CATEGORIES.find(c => c.value === item.category)?.label || item.category}
                                        </Badge>
                                        <Typography variant="caption" className="text-white font-medium block truncate">
                                            {item.title}
                                        </Typography>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* Upload Modal */}
            <ActionBottomSheet
                isOpen={showUpload}
                onClose={() => setShowUpload(false)}
                title="Adicionar Foto"
                actions={[]}
            >
                <ImageUploader
                    onUpload={(file, title, cat) => uploadMutation.mutate({ file, title, category: cat })}
                    uploading={uploadMutation.isPending}
                />
            </ActionBottomSheet>
        </div>
    );
};

export default AdminPortfolioPage;
