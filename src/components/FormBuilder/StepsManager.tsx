import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { FormStep, FormField } from '@/types/form';
import { Plus, Trash2, ChevronRight } from 'lucide-react';
import { Switch } from '../ui/switch';
import { useAddStepMutation, useDeleteStepMutation, useGetAllStepsByIdQuery } from '@/service/Api/formBuilder';
import { useParams } from 'next/navigation';

interface StepsManagerProps {
  steps: FormStep[];
  isMultiStep: boolean;
  onUpdateSteps: (steps: FormStep[]) => void;
  onToggleMultiStep: (isMultiStep: boolean) => void;
  currentStepId?: string;
  onSelectStep: (stepId: string) => void;
}

const StepsManager = ({
  steps,
  isMultiStep,
  onUpdateSteps,
  onToggleMultiStep,
  currentStepId,
  onSelectStep
}: StepsManagerProps) => {
  const [newStepName, setNewStepName] = useState('');


  const { id: form_id } = useParams();
  const [addStepApi] = useAddStepMutation();
  const [deleteStepApi] = useDeleteStepMutation();
  console.log(form_id, "99");
  const { data: stepsData } = useGetAllStepsByIdQuery(form_id);


  useEffect(() => {
    if (!form_id || !stepsData?.data) return;

    const stepsArray: FormStep[] = Object.entries(stepsData.data)
      .filter(([key]) => key.startsWith("step"))
      .flatMap(([_, stepList], index) =>
        (stepList as any[]).map((s: any) => ({

          id: s.id,
          title: s.title || `Step ${index + 1}`,
          description: s.description || "",
          fields: [],
          order: index,
          form_id,
        }))
      );

    // Only update if different to avoid infinite loops
    const isEqual =
      steps.length === stepsArray.length &&
      steps.every((s, i) => s.id === stepsArray[i].id);

    if (!isEqual) onUpdateSteps(stepsArray);
  }, [form_id, stepsData]);

  const addStep = async () => {
    if (!newStepName.trim()) return;

    try {
      const response = await addStepApi({
        title: newStepName.trim(),
        description: "",
        form_id,
        fields: [],
      }).unwrap();

      if (response?.data) {
        onUpdateSteps([...steps, response.data]);
        setNewStepName("");
      }
    } catch (error) {
      console.error("Failed to add step:", error);
    }
  };

  const removeStep = async (stepId: string) => {
    try {
      await deleteStepApi(stepId).unwrap();
      onUpdateSteps(steps.filter((step) => step.id !== stepId));
    } catch (error) {
      console.error("Failed to delete step:", error);
    }
  };

  const updateStepName = (stepId: string, title: string) => {
    onUpdateSteps(steps.map(step =>
      step.id === stepId ? { ...step, title } : step
    ));
  };

  const updateStepDescription = (stepId: string, description: string) => {
    onUpdateSteps(steps.map(step =>
      step.id === stepId ? { ...step, description } : step
    ));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Form Steps</CardTitle>
      </CardHeader>
      <CardContent className="">
        {/* <div className="flex items-center space-x-2">
          <Switch
            checked={isMultiStep}
            onCheckedChange={onToggleMultiStep}
          />
          <Label>Enable Multi-Step Form</Label>
        </div> */}

        {isMultiStep && (
          <>
            <div className="space-y-2">
              {steps.map((step, index) => (
                <div
                  key={step.id}
                  className={`flex items-center space-x-2 p-2 rounded border cursor-pointer transition-colors ${currentStepId === step.id ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                    }`}
                  onClick={() => onSelectStep(step.id)}
                >
                  <span className="text-sm font-medium">Step {index + 1}:</span>
                  <div className="flex-1 space-y-2">
                    <Input
                      value={step.title}
                      onChange={(e) => updateStepName(step.id, e.target.value)}
                      className="h-8"
                      placeholder="Step title"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <Textarea
                      value={step.description || ''}
                      onChange={(e) => updateStepDescription(step.id, e.target.value)}
                      className="h-16 text-xs resize-none"
                      placeholder="Step description"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <span className="text-xs text-gray-500">
                    {step?.fields?.length} fields
                  </span>
                  <span className="text-xs text-red-500 bg-red-50 px-1 rounded">
                    ID: {step.id || 'UNDEFINED'}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStep(step.id);
                    }}
                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                </div>
              ))}
            </div>

            <div className="flex space-x-2">
              <Input
                placeholder="Step title..."
                value={newStepName}
                onChange={(e) => setNewStepName(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && addStep()}
                className="flex-1"
              />
              <Button onClick={addStep} size="sm">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            {steps.length === 0 && (
              <p className="text-sm text-gray-500 text-center py-4">
                Add steps to organize your form into multiple pages
              </p>
            )}
          </>
        )}

        {!isMultiStep && (
          <p className="text-sm text-gray-500">
            Single-step form - all fields will be on one page
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default StepsManager;