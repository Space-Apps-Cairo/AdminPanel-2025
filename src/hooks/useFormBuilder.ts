// hooks/useFormBuilder.ts
import { useState, useEffect, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import {
    useGetCompleteFormQuery,
    useAddStepMutation,
    useUpdateStepMutation,
    useDeleteStepMutation,
    useAddFieldMutation,
    useUpdateFieldMutation,
    useDeleteFieldMutation,
    useReorderFieldsMutation,
    useReorderStepsMutation,
    useInitializeFormMutation
} from '@/service/Api/formBuilder';
import { FormSchema, FormField, FormStep, FormCompleteData } from '@/types/formBuilder';

interface UseFormBuilderProps {
    formId: string;
}

interface UseFormBuilderReturn {
    // State
    currentForm: FormSchema;
    currentStepId: string | null;
    isLoading: boolean;
    error: any;
    isInitialized: boolean;

    // Actions
    setCurrentStepId: (stepId: string | null) => void;
    handleAddField: (field: FormField) => Promise<void>;
    handleUpdateField: (fieldId: string, updates: Partial<FormField>) => Promise<void>;
    handleRemoveField: (fieldId: string) => Promise<void>;
    handleReorderFields: (dragIndex: number, hoverIndex: number) => Promise<void>;
    handleAddStep: () => Promise<void>;
    handleUpdateStep: (stepId: string, updates: Partial<FormStep>) => Promise<void>;
    handleDeleteStep: (stepId: string) => Promise<void>;
    handleReorderSteps: (steps: FormStep[]) => Promise<void>;
    handleToggleMultiStep: (isMultiStep: boolean) => Promise<void>;
    handleInitializeForm: () => Promise<void>;

    // Utilities
    getCurrentStepFields: () => FormField[];
    getCurrentFormData: () => FormSchema;
    refetchForm: () => void;
}

export const useFormBuilder = ({ formId }: UseFormBuilderProps): UseFormBuilderReturn => {
    const { toast } = useToast();

    const [currentForm, setCurrentForm] = useState<FormSchema>({
        id: formId,
        title: 'Untitled Form',
        description: '',
        fields: [],
        steps: [],
        isMultiStep: false,
        createdAt: new Date(),
        updatedAt: new Date()
    });

    const [currentStepId, setCurrentStepId] = useState<string | null>(null);
    const [isInitialized, setIsInitialized] = useState(false);

    // RTK Query hooks
    const {
        data: completeFormData,
        isLoading,
        error,
        refetch
    } = useGetCompleteFormQuery(formId, { skip: !formId });

    const [addStep] = useAddStepMutation();
    const [updateStep] = useUpdateStepMutation();
    const [deleteStep] = useDeleteStepMutation();
    const [addField] = useAddFieldMutation();
    const [updateField] = useUpdateFieldMutation();
    const [deleteField] = useDeleteFieldMutation();
    const [reorderFields] = useReorderFieldsMutation();
    const [reorderSteps] = useReorderStepsMutation();
    const [initializeForm] = useInitializeFormMutation();

    // Convert complete form data to local state
    const convertCompleteDataToFormSchema = useCallback((completeData: FormCompleteData): FormSchema => {
        return {
            id: formId,
            title: completeData.title || 'Untitled Form',
            description: completeData.description || '',
            fields: [],
            steps: completeData.steps || [],
            isMultiStep: (completeData.steps?.length || 0) > 0,
            createdAt: new Date(),
            updatedAt: new Date()
        };
    }, [formId]);

    // Sync form data with API response
    useEffect(() => {
        if (completeFormData?.data) {
            const formSchema = convertCompleteDataToFormSchema(completeFormData.data);
            setCurrentForm(formSchema);
            setIsInitialized(true);

            // Set first step as current if none selected and steps exist
            if (!currentStepId && formSchema.steps && formSchema.steps.length > 0) {
                setCurrentStepId(formSchema.steps[0].id || null);
            }
        } else if (completeFormData && completeFormData.data.steps.length === 0) {
            setIsInitialized(true);
        }
    }, [completeFormData, currentStepId, convertCompleteDataToFormSchema]);

    // Helper functions
    const getCurrentStepFields = useCallback((): FormField[] => {
        if (!currentStepId || !currentForm.steps) return [];
        const currentStep = currentForm.steps.find(step => step.id === currentStepId);
        return currentStep?.fields || [];
    }, [currentStepId, currentForm.steps]);

    const getCurrentFormData = useCallback(() => {
        return {
            ...currentForm,
            fields: getCurrentStepFields()
        };
    }, [currentForm, getCurrentStepFields]);

    // Action handlers
    const handleInitializeForm = async () => {
        try {
            await initializeForm({
                formId,
                title: "Personal Information"
            }).unwrap();

            toast({
                title: "Form Initialized",
                description: "Form has been initialized with the first step!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to initialize form. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleAddField = async (field: FormField) => {
        if (!currentStepId) {
            toast({
                title: "No Step Selected",
                description: "Please select a step before adding fields.",
                variant: "destructive"
            });
            return;
        }

        try {
            const newField = {
                ...field,
                stepId: currentStepId,
                form_id: formId,
                order: getCurrentStepFields().length
            };

            await addField(newField).unwrap();

            toast({
                title: "Field Added",
                description: "Field has been added successfully!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add field. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleUpdateField = async (fieldId: string, updates: Partial<FormField>) => {
        try {
            const currentStep = currentForm.steps?.find(step =>
                step.fields.some(field => field.id === fieldId)
            );
            const currentField = currentStep?.fields.find(field => field.id === fieldId);

            if (!currentField) return;

            const updatedField = {
                ...currentField,
                ...updates,
                form_id: formId
            };

            await updateField(updatedField as FormField).unwrap();

            toast({
                title: "Field Updated",
                description: "Field has been updated successfully!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update field. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleRemoveField = async (fieldId: string) => {
        try {
            await deleteField(fieldId).unwrap();

            toast({
                title: "Field Removed",
                description: "Field has been removed successfully!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove field. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleReorderFields = async (dragIndex: number, hoverIndex: number) => {
        if (!currentStepId) return;

        const currentStepFields = getCurrentStepFields();

        // Optimistic update
        const newFields = [...currentStepFields];
        const draggedField = newFields[dragIndex];
        newFields.splice(dragIndex, 1);
        newFields.splice(hoverIndex, 0, draggedField);

        setCurrentForm(prev => {
            if (prev.steps) {
                const updatedSteps = prev.steps.map(step =>
                    step.id === currentStepId ? { ...step, fields: newFields } : step
                );
                return { ...prev, steps: updatedSteps, updatedAt: new Date() };
            }
            return prev;
        });

        try {
            const fieldIds = newFields.map(field => field.id!);
            await reorderFields({
                stepId: currentStepId,
                fieldIds,
                formId
            }).unwrap();
        } catch (error) {
            refetch();
            toast({
                title: "Error",
                description: "Failed to reorder fields. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleAddStep = async () => {
        try {
            const newStep = {
                title: `Step ${(currentForm.steps?.length || 0) + 1}`,
                description: '',
                form_id: formId,
                order: (currentForm.steps?.length || 0),
                fields: []
            };

            const result = await addStep(newStep).unwrap();

            if (result.data.id) {
                setCurrentStepId(result.data.id);
            }

            toast({
                title: "Step Added",
                description: "New step has been added successfully!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to add step. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleUpdateStep = async (stepId: string, updates: Partial<FormStep>) => {
        try {
            const currentStep = currentForm.steps?.find(step => step.id === stepId);
            if (!currentStep) return;

            const updatedStep = {
                ...currentStep,
                ...updates,
                form_id: formId
            };

            await updateStep(updatedStep as FormStep).unwrap();

            toast({
                title: "Step Updated",
                description: "Step has been updated successfully!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update step. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleDeleteStep = async (stepId: string) => {
        try {
            await deleteStep(stepId).unwrap();

            if (currentStepId === stepId) {
                const remainingSteps = currentForm.steps?.filter(step => step.id !== stepId);
                setCurrentStepId(remainingSteps && remainingSteps.length > 0 ? remainingSteps[0].id || null : null);
            }

            toast({
                title: "Step Deleted",
                description: "Step has been deleted successfully!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete step. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleReorderSteps = async (steps: FormStep[]) => {
        try {
            const stepIds = steps.map(step => step.id!);
            await reorderSteps({
                formId,
                stepIds
            }).unwrap();

            toast({
                title: "Steps Reordered",
                description: "Steps have been reordered successfully!",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to reorder steps. Please try again.",
                variant: "destructive"
            });
        }
    };

    const handleToggleMultiStep = async (isMultiStep: boolean) => {
        if (isMultiStep && (!currentForm.steps || currentForm.steps.length === 0)) {
            await handleAddStep();
        }

        setCurrentForm(prev => ({
            ...prev,
            isMultiStep,
            updatedAt: new Date()
        }));
    };

    return {
        // State
        currentForm,
        currentStepId,
        isLoading,
        error,
        isInitialized,

        // Actions
        setCurrentStepId,
        handleAddField,
        handleUpdateField,
        handleRemoveField,
        handleReorderFields,
        handleAddStep,
        handleUpdateStep,
        handleDeleteStep,
        handleReorderSteps,
        handleToggleMultiStep,
        handleInitializeForm,

        // Utilities
        getCurrentStepFields,
        getCurrentFormData,
        refetchForm: refetch
    };
};