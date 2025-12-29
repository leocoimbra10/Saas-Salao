/**
 * BEAUTY SALON NEOMORPHIC APP - Salon Settings Page
 * Glassmorphic Control Panel for Salon Identity
 */
import React, { useState, useEffect } from 'react';
import { updateOrganization } from '../../organization/services/organizationService';
import { useBranding } from '../../../shared/context/BrandingContext';
import { NeoCard as NeoCard, NeoButton as NeoButton, NeoInput as NeoInput, Typography } from '../../../shared/components/ui';
import { Save, Upload, Palette, Building, Image as ImageIcon } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../shared/lib/firebase';
import { cn } from '../../../shared/lib/utils';

const SalonSettingsPage: React.FC = () => {
    const { organization } = useBranding();
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState<'logo' | 'bg' | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        logoUrl: '',
        backgroundUrl: '',
        primaryColor: '#E8A0B8',
        goldColor: '#D4AF37'
    });

    const handleFileUpload = async (file: File, type: 'logo' | 'bg') => {
        if (!organization) return;
        setUploading(type);
        try {
            const storageRef = ref(storage, `organizations/${organization.id}/${type}_${Date.now()}`);
            await uploadBytes(storageRef, file);
            const url = await getDownloadURL(storageRef);

            setFormData(prev => ({
                ...prev,
                [type === 'logo' ? 'logoUrl' : 'backgroundUrl']: url
            }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Erro ao enviar imagem.");
        } finally {
            setUploading(null);
        }
    };

    useEffect(() => {
        if (organization) {
            setFormData({
                name: organization.name || '',
                address: organization.settings?.address || '',
                logoUrl: organization.settings?.logo || '',
                backgroundUrl: organization.settings?.backgroundUrl || '',
                primaryColor: organization.settings?.brandColors?.primary || organization.settings?.primaryColor || '#E8A0B8',
                goldColor: organization.settings?.brandColors?.gold || '#D4AF37'
            });
        }
    }, [organization]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Instant preview if it's a color
        if (name === 'primaryColor' && /^#[0-9A-F]{6}$/i.test(value)) {
            document.documentElement.style.setProperty('--color-brand-primary', value);
            document.documentElement.style.setProperty('--neo-accent', value);
        }
        if (name === 'goldColor' && /^#[0-9A-F]{6}$/i.test(value)) {
            document.documentElement.style.setProperty('--color-brand-gold', value);
        }
    };

    const handleSave = async () => {
        if (!organization) return;
        setLoading(true);
        try {
            await updateOrganization(organization.id, {
                name: formData.name,
                settings: {
                    ...organization.settings,
                    address: formData.address,
                    logo: formData.logoUrl,
                    backgroundUrl: formData.backgroundUrl,
                    primaryColor: formData.primaryColor,
                    brandColors: {
                        primary: formData.primaryColor,
                        primaryLight: formData.primaryColor + '30', // Dummy adjustment
                        primaryDark: formData.primaryColor,
                        gold: formData.goldColor,
                        goldLight: formData.goldColor + '30',
                        purple: '#8A2BE2'
                    }
                }
            });
            alert("Configurações salvas com sucesso!");
        } catch (error) {
            console.error("Error updating settings:", error);
            alert("Erro ao salvar configurações.");
        } finally {
            setLoading(false);
        }
    };

    if (!organization) return <div className="p-8 text-center">Carregando configurações...</div>;

    return (
        <div className="min-h-screen bg-neo-bg/50 p-6 pb-24 animate-in fade-in duration-500">
            <header className="mb-8">
                <h1 className="text-2xl font-display font-bold text-neo-text">Configurações do Salão</h1>
                <p className="text-neo-text-secondary">Gerencie a identidade visual e dados do seu negócio.</p>
            </header>

            <div className="max-w-2xl mx-auto space-y-6">

                {/* 1. Identity Section */}
                <NeoCard className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Building className="text-neo-accent" size={20} />
                        <h2 className="text-lg font-bold text-neo-text">Identidade</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neo-text-secondary mb-1">Nome do Salão</label>
                            <NeoInput
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: Studio Glamour"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neo-text-secondary mb-1">Endereço Completo</label>
                            <NeoInput
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Rua das Flores, 123"
                            />
                        </div>
                    </div>
                </NeoCard>

                {/* 2. Visual Branding Section */}
                <NeoCard className="p-6">
                    <div className="flex items-center gap-2 mb-6">
                        <Palette className="text-brand-primary" size={22} />
                        <Typography variant="h3">Visual & Branding</Typography>
                    </div>

                    <div className="space-y-6">
                        {/* Primary Color Picker */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-neo-text-secondary mb-2">Cor Principal (Marca)</label>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-neo shadow-neo-out shrink-0 border-2 border-white/50"
                                        style={{ backgroundColor: formData.primaryColor }}
                                    />
                                    <NeoInput
                                        name="primaryColor"
                                        value={formData.primaryColor}
                                        onChange={handleChange}
                                        className="font-mono uppercase"
                                        maxLength={7}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neo-text-secondary mb-2">Cor Secundária (Ouro/Destaque)</label>
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-12 h-12 rounded-neo shadow-neo-out shrink-0 border-2 border-white/50"
                                        style={{ backgroundColor: formData.goldColor }}
                                    />
                                    <NeoInput
                                        name="goldColor"
                                        value={formData.goldColor}
                                        onChange={handleChange}
                                        className="font-mono uppercase"
                                        maxLength={7}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Background & Logo URLs */}
                        <div className="pt-2">
                            <NeoInput
                                label="Logo do Salão (URL)"
                                name="logoUrl"
                                value={formData.logoUrl}
                                onChange={handleChange}
                                icon={<ImageIcon size={18} />}
                                placeholder="https://..."
                            />
                            <div className="mt-2 flex justify-end">
                                <label className="cursor-pointer">
                                    <span className={cn(
                                        "text-xs font-semibold px-3 py-1.5 rounded-full shadow-neo-out flex items-center gap-2 bg-neo-bg",
                                        uploading === 'logo' ? "opacity-50" : "hover:bg-brand-primary/10"
                                    )}>
                                        <Upload size={14} />
                                        {uploading === 'logo' ? 'Enviando...' : 'Fazer Upload'}
                                    </span>
                                    <NeoInput
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        disabled={uploading !== null}
                                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                                    />
                                </label>
                            </div>
                        </div>

                        <div>
                            <NeoInput
                                label="Foto de Fundo (Global)"
                                name="backgroundUrl"
                                value={formData.backgroundUrl}
                                onChange={handleChange}
                                icon={<ImageIcon size={18} />}
                                placeholder="https://..."
                            />
                            <div className="mt-2 flex justify-end">
                                <label className="cursor-pointer">
                                    <span className={cn(
                                        "text-xs font-semibold px-3 py-1.5 rounded-full shadow-neo-out flex items-center gap-2 bg-neo-bg",
                                        uploading === 'bg' ? "opacity-50" : "hover:bg-brand-primary/10"
                                    )}>
                                        <Upload size={14} />
                                        {uploading === 'bg' ? 'Enviando...' : 'Fazer Upload'}
                                    </span>
                                    <NeoInput
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        disabled={uploading !== null}
                                        onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'bg')}
                                    />
                                </label>
                            </div>
                        </div>
                    </div>
                </NeoCard>

                <div className="flex justify-end pt-4">
                    <NeoButton
                        variant="gradient"
                        size="lg"
                        onClick={handleSave}
                        loading={loading}
                        fullWidth
                        icon={<Save size={20} />}
                    >
                        Salvar Identidade Visual
                    </NeoButton>
                </div>

            </div>
        </div>
    );
};

export default SalonSettingsPage;

