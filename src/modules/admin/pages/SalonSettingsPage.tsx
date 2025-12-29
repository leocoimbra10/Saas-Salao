/**
 * BEAUTY SALON NEOMORPHIC APP - Salon Settings Page
 * Glassmorphic Control Panel for Salon Identity
 */
import React, { useState, useEffect } from 'react';
import { updateOrganization } from '../../organization/services/organizationService';
import { useBranding } from '../../organization/context/BrandingContext';
import { Card, Button, Input } from '../../../shared/components/ui/NeoComponents';
import { Save, Upload, Palette, Building } from 'lucide-react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Assuming Firebase storage is used
import { storage } from '../../../shared/lib/firebase'; // Assuming Firebase storage instance is imported

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
        primaryColor: 'var(--color-brand-gold)'
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
                address: organization.settings.address || '',
                logoUrl: organization.settings.logo || '',
                backgroundUrl: organization.settings.backgroundUrl || '',
                primaryColor: organization.settings.primaryColor || 'var(--color-brand-gold)'
            });
        }
    }, [organization]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
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
                    primaryColor: formData.primaryColor
                }
            });
            // Toast success here ideally
        } catch (error) {
            console.error("Error updating settings:", error);
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
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Building className="text-neo-accent" size={20} />
                        <h2 className="text-lg font-bold text-neo-text">Identidade</h2>
                    </div>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neo-text-secondary mb-1">Nome do Salão</label>
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                placeholder="Ex: Studio Glamour"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-neo-text-secondary mb-1">Endereço Completo</label>
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Rua das Flores, 123"
                            />
                        </div>
                    </div>
                </Card>

                {/* 2. Visual Branding Section */}
                <Card className="p-6">
                    <div className="flex items-center gap-2 mb-4">
                        <Palette className="text-neo-accent" size={20} />
                        <h2 className="text-lg font-bold text-neo-text">Visual & Branding</h2>
                    </div>

                    <div className="space-y-4">
                        {/* Primary Color Picker */}
                        <div>
                            <label className="block text-sm font-medium text-neo-text-secondary mb-1">Cor de Destaque (Hex)</label>
                            <div className="flex items-center gap-3">
                                <div
                                    className="w-10 h-10 rounded-full border border-white/20 shadow-neo-out"
                                    style={{ backgroundColor: formData.primaryColor }}
                                />
                                <Input
                                    name="primaryColor"
                                    value={formData.primaryColor}
                                    onChange={handleChange}
                                    className="font-mono uppercase"
                                    maxLength={7}
                                />
                            </div>
                        </div>

                        {/* Background & Logo URLs */}
                        <div>
                            <label className="block text-sm font-medium text-neo-text-secondary mb-1">Logo do Salão</label>
                            <div className="flex gap-2">
                                <Input
                                    name="logoUrl"
                                    value={formData.logoUrl}
                                    onChange={handleChange}
                                    icon={<Upload size={16} />}
                                    placeholder="URL ou Upload"
                                />
                                <div className="relative overflow-hidden">
                                    <Button variant="ghost" className="relative">
                                        {uploading === 'logo' ? '...' : <Upload size={18} />}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'logo')}
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-neo-text-secondary mb-1">Foto de Fundo</label>
                            <div className="flex gap-2">
                                <Input
                                    name="backgroundUrl"
                                    value={formData.backgroundUrl}
                                    onChange={handleChange}
                                    icon={<Upload size={16} />}
                                    placeholder="URL ou Upload"
                                />
                                <div className="relative overflow-hidden">
                                    <Button variant="ghost" className="relative">
                                        {uploading === 'bg' ? '...' : <Upload size={18} />}
                                        <input
                                            type="file"
                                            accept="image/*"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 'bg')}
                                        />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>

                <div className="flex justify-end pt-4">
                    <Button
                        size="lg"
                        onClick={handleSave}
                        disabled={loading}
                        className="w-full sm:w-auto"
                    >
                        {loading ? 'Salvando...' : 'Salvar Alterações'}
                        <Save size={18} className="ml-2" />
                    </Button>
                </div>

            </div>
        </div>
    );
};

export default SalonSettingsPage;
