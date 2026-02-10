'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateEndpointFormData, createEndpointSchema } from '@/lib/utils/validation';
import { HTTP_METHODS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useCreateEndpoint } from '@/hooks/useEndpoints';
import { toast } from 'sonner';
import { Plus } from 'lucide-react';

export default function CreateEndpointDialog() {
    const [open, setOpen] = useState(false);
    const createEndpoint = useCreateEndpoint();

    const form = useForm({
        resolver: zodResolver(createEndpointSchema),
        defaultValues: {
            name: '',
            url: '',
            method: 'GET' as const,
            expectedStatus: 200,
            checkInterval: 5,
        },
    });

    const onSubmit = async (data: CreateEndpointFormData) => {
        try {
            const submitData = {
                ...data,
                headers: data.headers ? Object.fromEntries(
                    Object.entries(data.headers).map(([key, value]) => [key, String(value)])
                ) : undefined,
            };
            await createEndpoint.mutateAsync(submitData);
            toast.success('Endpoint created successfully');
            form.reset();
            setOpen(false);
        } catch (error: any) {
            toast.error(error?.response?.data?.message || 'Failed to create endpoint');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="gradient-primary border-0">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Endpoint
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-125 bg-slate-900 border-slate-800">
                <DialogHeader>
                    <DialogTitle className="text-white">Add New Endpoint</DialogTitle>
                    <DialogDescription className="text-slate-400">
                        Create a new API endpoint to monitor
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        {/* Name */}
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="My API Endpoint"
                                            {...field}
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* URL */}
                        <FormField
                            control={form.control}
                            name="url"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">URL</FormLabel>
                                    <FormControl>
                                        <Input
                                            placeholder="https://api.example.com/health"
                                            {...field}
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        {/* Method & Expected Status */}
                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="method"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Method</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className="bg-slate-800 border-slate-700 text-white">
                                                    <SelectValue placeholder="Select method" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="bg-slate-800 border-slate-700">
                                                {HTTP_METHODS.map((method) => (
                                                    <SelectItem key={method} value={method} className="text-white">
                                                        {method}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="expectedStatus"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-slate-300">Expected Status</FormLabel>
                                        <FormControl>
                                            <Input
                                                type="number"
                                                placeholder="200"
                                                {...field}
                                                onChange={(e) => field.onChange(+e.target.value)}
                                                className="bg-slate-800 border-slate-700 text-white"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>

                        {/* Check Interval */}
                        <FormField
                            control={form.control}
                            name="checkInterval"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel className="text-slate-300">Check Interval (minutes)</FormLabel>
                                    <FormControl>
                                        <Input
                                            type="number"
                                            placeholder="5"
                                            {...field}
                                            onChange={(e) => field.onChange(+e.target.value)}
                                            className="bg-slate-800 border-slate-700 text-white"
                                        />
                                    </FormControl>
                                    <FormDescription className="text-slate-500 text-xs">
                                        How often to check this endpoint
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setOpen(false)}
                                className="border-slate-700 text-slate-300"
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={createEndpoint.isPending}
                                className="gradient-primary border-0"
                            >
                                {createEndpoint.isPending ? 'Creating...' : 'Create Endpoint'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}
