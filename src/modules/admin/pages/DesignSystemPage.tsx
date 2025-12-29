/**
 * DESIGN SYSTEM DISPLAY PAGE
 * Showcase of all NeoComponents
 */
import React from 'react';
import {
    NeoButton,
    NeoCard,
    Typography,
    Badge,
    NeoInput,
    NeoSelect,
    NeoTextarea,
    Avatar,
    Progress,
    Toggle,
    Divider,
    Spinner,
    Skeleton
} from '../../../shared/components/ui/NeoComponents';
import { Sparkles, Heart, Bell, Settings, User, Check, AlertCircle } from 'lucide-react';
import { cn } from '../../../shared/lib/utils';

export const DesignSystemPage: React.FC = () => {
    return (
        <div className="min-h-screen bg-neo-bg p-8 space-y-12 pb-24">
            <header className="mb-8">
                <Typography variant="h1" className="text-4xl mb-2 text-brand-primary">Design System</Typography>
                <Typography variant="body" className="text-neo-text-secondary">Galeria de componentes do sistema Beauty Salon Neomorphic</Typography>
            </header>

            {/* TYPOGRAPHY */}
            <section className="space-y-4">
                <Typography variant="h2" className="text-2xl font-bold mb-4 border-b border-neo-text-secondary/20 pb-2">Typography</Typography>
                <div className="grid gap-4">
                    <Typography variant="h1">Heading 1 - The quick brown fox</Typography>
                    <Typography variant="h2">Heading 2 - The quick brown fox</Typography>
                    <Typography variant="h3">Heading 3 - The quick brown fox</Typography>
                    <Typography variant="h4">Heading 4 - The quick brown fox</Typography>
                    <Typography variant="h5">Heading 5 - The quick brown fox</Typography>
                    <Typography variant="h6">Heading 6 - The quick brown fox</Typography>
                    <Typography variant="body">Body - The quick brown fox jumps over the lazy dog. Lorem ipsum dolor sit amet.</Typography>
                    <Typography variant="caption">Caption - The quick brown fox</Typography>
                    <Typography variant="label">Label - The quick brown fox</Typography>
                </div>
            </section>

            {/* BUTTONS */}
            <section className="space-y-4">
                <Typography variant="h2" className="text-2xl font-bold mb-4 border-b border-neo-text-secondary/20 pb-2">Buttons</Typography>

                <div className="space-y-6">
                    <div>
                        <Typography variant="h6" className="mb-2 text-neo-text-secondary">Variants</Typography>
                        <div className="flex flex-wrap gap-4 items-center">
                            <NeoButton variant="gradient">Primary (Gradient)</NeoButton>
                            <NeoButton variant="outline">Secondary (Outline)</NeoButton>
                            <NeoButton variant="neu">Neu (Default)</NeoButton>
                            <NeoButton variant="ghost">Ghost</NeoButton>
                            <NeoButton variant="glass">Glass</NeoButton>
                            <NeoButton variant="glow">Glow</NeoButton>
                        </div>
                    </div>

                    <div>
                        <Typography variant="h6" className="mb-2 text-neo-text-secondary">Sizes</Typography>
                        <div className="flex flex-wrap gap-4 items-center">
                            <NeoButton size="sm">Small</NeoButton>
                            <NeoButton size="md">Medium</NeoButton>
                            <NeoButton size="lg">Large</NeoButton>
                            <NeoButton size="icon"><Heart size={18} /></NeoButton>
                        </div>
                    </div>

                    <div>
                        <Typography variant="h6" className="mb-2 text-neo-text-secondary">With Icons</Typography>
                        <div className="flex flex-wrap gap-4 items-center">
                            <NeoButton variant="neu" icon={<Settings size={18} />}>Settings</NeoButton>
                            <NeoButton variant="gradient" icon={<Check size={18} />}>Confirm</NeoButton>
                            <NeoButton variant="gradient" icon={<Sparkles size={18} />}>Magic</NeoButton>
                        </div>
                    </div>

                    <div>
                        <Typography variant="h6" className="mb-2 text-neo-text-secondary">States</Typography>
                        <div className="flex flex-wrap gap-4 items-center">
                            <NeoButton disabled>Disabled</NeoButton>
                            <NeoButton loading>Loading</NeoButton>
                        </div>
                    </div>
                </div>
            </section>

            {/* CARDS */}
            <section className="space-y-4">
                <Typography variant="h2" className="text-2xl font-bold mb-4 border-b border-neo-text-secondary/20 pb-2">Cards</Typography>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <NeoCard variant="flat" padding="md">
                        <Typography variant="h6">Flat Card</Typography>
                        <Typography variant="body" className="text-sm mt-2">Simples background blending with context.</Typography>
                    </NeoCard>
                    <NeoCard variant="raised" padding="md">
                        <Typography variant="h6">Raised Card (Default)</Typography>
                        <Typography variant="body" className="text-sm mt-2">Standard neomorphic extrude effect.</Typography>
                    </NeoCard>
                    <NeoCard variant="inset" padding="md">
                        <Typography variant="h6">Inset Card</Typography>
                        <Typography variant="body" className="text-sm mt-2">Pressed/Recessed effect for content containers.</Typography>
                    </NeoCard>
                </div>
            </section>

            {/* INPUTS */}
            <section className="space-y-4">
                <Typography variant="h2" className="text-2xl font-bold mb-4 border-b border-neo-text-secondary/20 pb-2">Inputs & Forms</Typography>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <NeoInput label="Text Input" placeholder="Digite algo..." />
                    <NeoInput label="With Icon" placeholder="Search..." icon={<Badge variant="neutral">🔍</Badge>} />
                    <NeoInput label="Error State" value="Invalid Value" error="Este campo é obrigatório" onChange={() => { }} />
                    <NeoSelect label="Select" options={[
                        { value: '1', label: 'Opção 1' },
                        { value: '2', label: 'Opção 2' },
                    ]} />
                    <NeoTextarea label="Textarea" placeholder="Escreva uma mensagem..." />
                    <div className="flex items-center gap-4">
                        <Toggle label="Toggle Switch" checked={false} onChange={() => { }} />
                        <Toggle label="Active Toggle" checked onChange={() => { }} />
                    </div>
                </div>
            </section>

            {/* DATA DISPLAY */}
            <section className="space-y-4">
                <Typography variant="h2" className="text-2xl font-bold mb-4 border-b border-neo-text-secondary/20 pb-2">Data Display</Typography>

                <div className="space-y-6">
                    <div>
                        <Typography variant="h6" className="mb-2 text-neo-text-secondary">Badges</Typography>
                        <div className="flex gap-4">
                            <Badge variant="neutral">Neutral</Badge>
                            <Badge variant="brand">Brand</Badge>
                            <Badge variant="success">Success</Badge>
                            <Badge variant="warning">Warning</Badge>
                            <Badge variant="danger">Danger</Badge>
                            <Badge variant="info">Info</Badge>
                        </div>
                    </div>

                    <div>
                        <Typography variant="h6" className="mb-2 text-neo-text-secondary">Avatars</Typography>
                        <div className="flex gap-4 items-center">
                            <Avatar size="sm" name="Small Avatar" />
                            <Avatar size="md" name="Medium Avatar" />
                            <Avatar size="lg" name="Large Avatar" />
                            <Avatar size="xl" name="XLarge" />
                        </div>
                    </div>

                    <div className="max-w-md space-y-2">
                        <Typography variant="h6" className="mb-2 text-neo-text-secondary">Progress</Typography>
                        <Progress value={25} />
                        <Progress value={50} />
                        <Progress value={75} />
                        <Progress value={100} />
                    </div>

                    <div>
                        <Typography variant="h6" className="mb-2 text-neo-text-secondary">Loading & Skeleton</Typography>
                        <div className="flex gap-8 items-center">
                            <Spinner size="sm" />
                            <Spinner size="md" />
                            <Spinner size="lg" />
                            <div className="space-y-2 w-48">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-4 w-3/4" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default DesignSystemPage;
