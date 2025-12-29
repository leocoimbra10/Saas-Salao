import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { NeoCard, NeoButton, Typography, Badge, Divider, Skeleton } from '../../../shared/components/ui/NeoComponents';
import { Download, ArrowLeft, CheckCircle } from 'lucide-react';

// Mock function to fetch transaction - replace with actual service call later
const getTransaction = async (id: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    return {
        id,
        date: new Date(),
        amount: 250.00,
        items: [
            { name: 'Maquiagem Completa', price: 160.00 },
            { name: 'Penteado', price: 90.00 }
        ],
        clientName: 'Ana Clara',
        status: 'paid',
        paymentMethod: 'Pix'
    };
};

const ReceiptPDF: React.FC = () => {
    const { transactionId } = useParams<{ transactionId: string }>();
    const navigate = useNavigate();
    const [transaction, setTransaction] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (transactionId) {
            getTransaction(transactionId).then(data => {
                setTransaction(data);
                setLoading(false);
            });
        }
    }, [transactionId]);

    const handlePrint = () => {
        window.print();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neo-bg p-6 flex flex-col items-center justify-center space-y-4">
                <Skeleton className="w-full max-w-md h-96 rounded-neo" />
            </div>
        );
    }

    if (!transaction) {
        return (
            <div className="min-h-screen bg-neo-bg p-6 flex flex-col items-center justify-center text-center">
                <Typography variant="h4" className="mb-4">Transação não encontrada</Typography>
                <NeoButton onClick={() => navigate('/')}>Voltar ao Início</NeoButton>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-neo-bg p-6 flex flex-col items-center py-12">
            <div className="w-full max-w-md print:w-full print:max-w-none">
                {/* Actions - Hidden when printing */}
                <div className="flex justify-between items-center mb-6 print:hidden">
                    <NeoButton variant="ghost" size="sm" onClick={() => navigate(-1)}>
                        <ArrowLeft size={18} />
                        Voltar
                    </NeoButton>
                    <NeoButton variant="gradient" size="sm" onClick={handlePrint}>
                        <Download size={18} />
                        Baixar PDF
                    </NeoButton>
                </div>

                {/* Receipt Card */}
                <NeoCard className="bg-white/80 print:shadow-none print:border-none">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-neo-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} className="text-neo-success" />
                        </div>
                        <Typography variant="h3" className="text-neo-text font-bold mb-1">
                            Pagamento Confirmado
                        </Typography>
                        <Typography variant="caption" className="text-neo-text-secondary">
                            {transaction.date.toLocaleDateString()} às {transaction.date.toLocaleTimeString()}
                        </Typography>
                    </div>

                    <Divider />

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between">
                            <Typography variant="body" className="text-neo-text-secondary">Método</Typography>
                            <Typography variant="body" className="font-semibold">{transaction.paymentMethod}</Typography>
                        </div>
                        <div className="flex justify-between">
                            <Typography variant="body" className="text-neo-text-secondary">Status</Typography>
                            <Badge variant="success">Pago</Badge>
                        </div>
                        <div className="flex justify-between">
                            <Typography variant="body" className="text-neo-text-secondary">Cliente</Typography>
                            <Typography variant="body" className="font-semibold">{transaction.clientName}</Typography>
                        </div>
                    </div>

                    <div className="bg-neo-bg/50 rounded-neo p-4 mb-6">
                        <Typography variant="label" className="mb-3 block text-neo-text-secondary uppercase text-xs tracking-wider">
                            Resumo do Pedido
                        </Typography>
                        <div className="space-y-2">
                            {transaction.items.map((item: any, index: number) => (
                                <div key={index} className="flex justify-between text-sm">
                                    <span className="text-neo-text">{item.name}</span>
                                    <span className="font-medium text-neo-text">
                                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.price)}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <Divider className="my-3" />
                        <div className="flex justify-between items-center">
                            <Typography variant="h6" className="font-bold">Total</Typography>
                            <Typography variant="h5" className="font-bold text-neo-accent">
                                {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(transaction.amount)}
                            </Typography>
                        </div>
                    </div>

                    <div className="text-center text-xs text-neo-text-secondary print:mt-12">
                        <p>ID da Transação: {transaction.id}</p>
                        <p className="mt-1">Obrigado pela preferência!</p>
                    </div>
                </NeoCard>
            </div>
        </div>
    );
};

export default ReceiptPDF;
