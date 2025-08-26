"use client";
import { useState, useEffect } from 'react';
import { Card } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import FormFieldsPanel from './FormFieldsPanel';
import FormCanvas from './FormCanvas';
import FormPreview from './FormPreview';
import FormTemplates from './FormTemplates';
import FormSettings from './FormSettings';
import StepsManager from './StepsManager';
import { FormSchema, FormField, FormStep } from '@/types/form';
import { Button } from '../ui/button';
import { Save, Download, Upload, Eye, Settings, Palette, LayoutPanelTop } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import { useAddFieldMutation, useDeleteFieldMutation, useGetAllFieldsByIdQuery, useUpdateFieldMutation } from '@/service/Api/formBuilder';

const FormBuilder = () => {
  const [currentForm, setCurrentForm] = useState<FormSchema>({
    id: Date.now().toString(),
    name: 'Untitled Form',
    description: '',
    fields: [],
    steps: [],
    isMultiStep: true,
    createdAt: new Date(),
    updatedAt: new Date()
  });

  const { id: form_id } = useParams();
  const [currentStepId, setCurrentStepId] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState('builder');
  const [showPreview, setShowPreview] = useState(false);
  const { toast } = useToast();

  const [addFieldApi] = useAddFieldMutation();
  const [deleteFieldApi] = useDeleteFieldMutation();
  const [updateFieldApi] = useUpdateFieldMutation();
  const { data: FieldsData } = useGetAllFieldsByIdQuery(form_id);



  // Updated removeField function
  const removeField = async (fieldId: string) => {
    // snapshot for rollback
    const prevFormSnapshot = currentForm;

    // optimistic remove
    setCurrentForm(prev => {
      if (prev.isMultiStep && prev.steps) {
        const updatedSteps = prev.steps.map(step => ({
          ...step,
          fields: step.fields.filter(field => field.id !== fieldId)
        }));
        return { ...prev, steps: updatedSteps, updatedAt: new Date() };
      } else {
        return { ...prev, fields: prev.fields.filter(field => field.id !== fieldId), updatedAt: new Date() };
      }
    });

    try {
      // call API — send whatever the server expects (maybe form_id + fieldId)
      await deleteFieldApi(fieldId).unwrap();

      toast({ title: "Field Deleted", description: "Field has been removed successfully!" });
    } catch (error) {
      console.error("Error deleting field:", error);
      // rollback on error
      setCurrentForm(prevFormSnapshot);

      toast({
        title: "Delete Error",
        description: "Failed to delete field. Please try again.",
        variant: "destructive"
      });
    }
  };


  // Updated addField function - preserve current step
  // >> replace your addField implementation with this
  const addField = async (field: FormField) => {
    // create a temporary id used for optimistic UI
    const tempId = `temp-${Date.now()}`;
    const tempField = { ...field, id: tempId };

    const targetStepId = currentStepId;

    // 1) optimistic update (show instantly)
    setCurrentForm(prev => {
      if (prev.isMultiStep && targetStepId && prev.steps) {
        const updatedSteps = prev.steps.map(step =>
          step.id === targetStepId ? { ...step, fields: [...step.fields, tempField] } : step
        );
        return { ...prev, steps: updatedSteps, updatedAt: new Date() };
      } else {
        return { ...prev, fields: [...prev.fields, tempField], updatedAt: new Date() };
      }
    });

    try {
      // 2) call API WITHOUT sending the temp id as the canonical id
      // send the field data as the server expects; e.g. don't include `id: tempId`
      const payload = {
        // include only server expected props, not temporary id
        label: field.label,
        name: field.name,
        type: field.type,
        placeholder: field.placeholder,
        validation: field.validation,
        options: field.options,
        form_id,
        form_step_id: targetStepId
      };

      const created = await addFieldApi(payload as any).unwrap();
      // assume `created` is the created field returned by server with real id

      // 3) replace the temp id field in local state with server-provided field
      setCurrentForm(prev => {
        if (prev.isMultiStep && targetStepId && prev.steps) {
          const updatedSteps = prev.steps.map(step => ({
            ...step,
            fields: step.fields.map(f => (f.id === tempId ? { ...f, ...created } : f))
          }));
          return { ...prev, steps: updatedSteps, updatedAt: new Date() };
        } else {
          return {
            ...prev,
            fields: prev.fields.map(f => (f.id === tempId ? { ...f, ...created } : f)),
            updatedAt: new Date()
          };
        }
      });

      toast({ title: "Field Added", description: "Field has been added successfully!" });
    } catch (error) {
      console.error("Error adding field:", error);
      // rollback: remove temp field
      setCurrentForm(prev => {
        if (prev.isMultiStep && targetStepId && prev.steps) {
          const updatedSteps = prev.steps.map(step => ({
            ...step,
            fields: step.fields.filter(f => f.id !== tempId)
          }));
          return { ...prev, steps: updatedSteps, updatedAt: new Date() };
        } else {
          return { ...prev, fields: prev.fields.filter(f => f.id !== tempId), updatedAt: new Date() };
        }
      });

      toast({
        title: "Add Field Error",
        description: "Failed to add field. Please try again.",
        variant: "destructive"
      });
    }
  };


  // Updated getFields function - only call when absolutely necessary
  const getFields = () => {
    if (!FieldsData?.data) return;

    const apiData = FieldsData.data;

    const transformedForm: FormSchema = {
      id: form_id || Date.now().toString(),
      name: apiData.title || 'Untitled Form',
      description: apiData.description || '',
      fields: [],
      steps: apiData.steps?.map((step: any) => ({
        id: String(step.id),
        name: step.title,
        description: step.description || '',
        fields: (step.fields || []).map((field: any) => ({
          id: String(field.id),
          label: field.label,
          name: field.name,
          type: field.type,
          placeholder: field.placeholder || '',
          required: field.validation?.required || false,
          validation: field.validation || {},
          dependencies: field.dependsOn && field.dependsOn.field ? [{
            field: String(field.dependsOn.field),
            value: field.dependsOn.value
          }] : [],
          dependsOn: field.dependsOn || {},
          options: field.options || [],
          order: field.order || 0,
          isComeFromApi: !!field.isComeFromApi,
          endpoint: field.endpoint || '',
          body: field.body || ''
        }))
      })) || [],
      isMultiStep: apiData.steps && apiData.steps.length > 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Replace the form state with server data (clear local-to-server conflict)
    setCurrentForm(prev => ({ ...prev, ...transformedForm, updatedAt: new Date() }));

    // preserve previously selected step if it still exists
    if (transformedForm.isMultiStep && transformedForm.steps.length > 0) {
      const stepExists = currentStepId && transformedForm.steps.some(s => s.id === currentStepId);
      setCurrentStepId(stepExists ? currentStepId : transformedForm.steps[0].id);
    } else {
      setCurrentStepId(null);
    }
  };


  // Update the useEffect to only call getFields on initial load
  useEffect(() => {
    if (FieldsData?.data) {
      // always reconcile when new server data comes in (safer than conditional)
      // but you might choose to skip if there's local unsaved work
      getFields();
    }
  }, [FieldsData, form_id]);




  // const getFields = () => {
  //   if (!FieldsData?.data) return;

  //   const apiData = FieldsData.data;

  //   // Transform API data to match your form structure
  //   const transformedForm = {
  //     id: form_id || Date.now().toString(),
  //     name: apiData.title || 'Untitled Form',
  //     description: apiData.description || '',
  //     fields: [], // This will be empty if multi-step
  //     steps: apiData.steps?.map(step => ({
  //       id: step.id.toString(),
  //       name: step.title,
  //       description: step.description || '',
  //       fields: step.fields?.map(field => ({
  //         id: field.id.toString(),
  //         label: field.label,
  //         name: field.name,
  //         type: field.type,
  //         placeholder: field.placeholder || '',
  //         required: field.validation?.required || false,
  //         validation: field.validation || {},
  //         dependencies: field.dependsOn && field.dependsOn.field ? [{
  //           field: field.dependsOn.field,
  //           value: field.dependsOn.value
  //         }] : [],
  //         dependsOn: field.dependsOn || {},
  //         options: field.options || [],
  //         order: field.order || 0,
  //         // Add any other properties you need
  //         isComeFromApi: field.isComeFromApi || false,
  //         endpoint: field.endpoint || '',
  //         body: field.body || ''
  //       })) || []
  //     })) || [],
  //     isMultiStep: apiData.steps && apiData.steps.length > 0,
  //     createdAt: new Date(),
  //     updatedAt: new Date()
  //   };

  //   // Add this useEffect to call getFields when FieldsData changes


  //   // If there are steps but we want single step mode, flatten all fields
  //   if (!transformedForm.isMultiStep && apiData.steps && apiData.steps.length > 0) {
  //     transformedForm.fields = apiData.steps.flatMap(step =>
  //       step.fields?.map(field => ({
  //         id: field.id.toString(),
  //         label: field.label,
  //         name: field.name,
  //         type: field.type,
  //         placeholder: field.placeholder || '',
  //         required: field.validation?.required || false,
  //         validation: field.validation || {},
  //         dependencies: field.dependsOn && field.dependsOn.field ? [{
  //           field: field.dependsOn.field,
  //           value: field.dependsOn.value
  //         }] : [],
  //         dependsOn: field.dependsOn || {},
  //         options: field.options || [],
  //         order: field.order || 0,
  //         isComeFromApi: field.isComeFromApi || false,
  //         endpoint: field.endpoint || '',
  //         body: field.body || ''
  //       })) || []
  //     );
  //   }

  //   setCurrentForm(prev => ({
  //     ...prev,
  //     ...transformedForm,
  //     updatedAt: new Date()
  //   }));

  //   // Set the first step as current if multi-step
  //   if (transformedForm.isMultiStep && transformedForm.steps && transformedForm.steps.length > 0) {
  //     setCurrentStepId(transformedForm.steps[0].id);
  //   }
  // };

  // const addField = async (field: FormField) => {
  //   const newField = { ...field, id: Date.now().toString() };

  //   console.log("ADD Field");

  //   setCurrentForm(prev => {
  //     if (prev.isMultiStep && currentStepId && prev.steps) {
  //       // Add to specific step
  //       const updatedSteps = prev.steps.map(step =>
  //         step.id === currentStepId
  //           ? { ...step, fields: [...step.fields, newField] }
  //           : step
  //       );
  //       return {
  //         ...prev,
  //         steps: updatedSteps,
  //         updatedAt: new Date()
  //       };
  //     } else {
  //       // Add to main fields array
  //       return {
  //         ...prev,
  //         fields: [...prev.fields, newField],
  //         updatedAt: new Date()
  //       };
  //     }
  //   });
  //   await addFieldApi({
  //     ...newField,
  //     form_id,
  //     form_step_id: currentStepId
  //   }).unwrap();
  //   ;
  // };

  const updateField = async (fieldId: string, updates: Partial<FormField>) => {

    console.log(fieldId, updates, "uuu");

    updateFieldApi({
      form_id,
      form_step_id: currentStepId,
      id: fieldId,
      ...updates
    }).unwrap();
    setCurrentForm(prev => {
      if (prev.isMultiStep && prev.steps) {
        const updatedSteps = prev.steps.map(step => ({
          ...step,
          fields: step.fields.map(field =>
            field.id === fieldId ? { ...field, ...updates } : field
          )
        }));
        return {
          ...prev,
          steps: updatedSteps,
          updatedAt: new Date()
        };
      } else {
        return {
          ...prev,
          fields: prev.fields.map(field =>
            field.id === fieldId ? { ...field, ...updates } : field
          ),
          updatedAt: new Date()
        };
      }
    });
  };

  // const removeField = async (fieldId: string) => {

  //   console.log(fieldId, "removed");

  //   setCurrentForm(prev => {
  //     if (prev.isMultiStep && prev.steps) {
  //       const updatedSteps = prev.steps.map(step => ({
  //         ...step,
  //         fields: step.fields.filter(field => field.id !== fieldId)
  //       }));
  //       return {
  //         ...prev,
  //         steps: updatedSteps,
  //         updatedAt: new Date()
  //       };
  //     } else {
  //       return {
  //         ...prev,
  //         fields: prev.fields.filter(field => field.id !== fieldId),
  //         updatedAt: new Date()
  //       };
  //     }
  //   });
  //   await deleteFieldApi(fieldId).unwrap();
  // };

  const reorderFields = (dragIndex: number, hoverIndex: number) => {
    setCurrentForm(prev => {
      if (prev.isMultiStep && currentStepId && prev.steps) {
        const currentStep = prev.steps.find(step => step.id === currentStepId);
        if (!currentStep) return prev;

        const fields = [...currentStep.fields];
        const draggedField = fields[dragIndex];
        fields.splice(dragIndex, 1);
        fields.splice(hoverIndex, 0, draggedField);

        const updatedSteps = prev.steps.map(step =>
          step.id === currentStepId ? { ...step, fields } : step
        );

        return {
          ...prev,
          steps: updatedSteps,
          updatedAt: new Date()
        };
      } else {
        const fields = [...prev.fields];
        const draggedField = fields[dragIndex];
        fields.splice(dragIndex, 1);
        fields.splice(hoverIndex, 0, draggedField);

        return {
          ...prev,
          fields,
          updatedAt: new Date()
        };
      }
    });
  };

  const exportForm = () => {
    // Convert to the new format
    const exportData: any = {
      title: currentForm.name,
      description: currentForm.description || '',
      steps: []
    };

    if (currentForm.isMultiStep && currentForm.steps) {
      // Multi-step form
      exportData.steps = currentForm.steps.map(step => ({
        title: step.name,
        description: step.description || '',
        fields: step.fields.map(field => ({
          label: field.label,
          name: field.name || field.label.toLowerCase().replace(/\s+/g, ''),
          type: field.type,
          placeholder: field.placeholder || '',
          validation: {
            required: field.required,
            ...field.validation
          },
          dependsOn: field.dependsOn || (field.dependencies && field.dependencies[0] ? {
            field: field.dependencies[0].field,
            value: field.dependencies[0].value
          } : {}),
          isComeFromApi: field.isComeFromApi || false,
          endpoint: field.endpoint || '',
          body: field.body || '',
          options: field.options || []
        }))
      }));
    } else {
      // Single step form
      exportData.steps = [{
        title: currentForm.name,
        description: currentForm.description || '',
        fields: currentForm.fields.map(field => ({
          label: field.label,
          name: field.name || field.label.toLowerCase().replace(/\s+/g, ''),
          type: field.type,
          placeholder: field.placeholder || '',
          validation: {
            required: field.required,
            ...field.validation
          },
          dependsOn: field.dependsOn || (field.dependencies && field.dependencies[0] ? {
            field: field.dependencies[0].field,
            value: field.dependencies[0].value
          } : {}),
          isComeFromApi: field.isComeFromApi || false,
          endpoint: field.endpoint || '',
          body: field.body || '',
          options: field.options || []
        }))
      }];
    }

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

    const exportFileDefaultName = `${currentForm.name.replace(/\s+/g, '_')}_form.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Form Exported",
      description: "Your form has been exported successfully!",
    });
  };

  const importForm = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const importedForm = JSON.parse(e.target?.result as string);
        setCurrentForm({
          ...importedForm,
          id: Date.now().toString(),
          createdAt: new Date(importedForm.createdAt),
          updatedAt: new Date()
        });
        toast({
          title: "Form Imported",
          description: "Your form has been imported successfully!",
        });
      } catch (error) {
        toast({
          title: "Import Error",
          description: "Failed to import form. Please check the file format.",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  };

  const updateSteps = (steps: FormStep[]) => {
    setCurrentForm(prev => ({
      ...prev,
      steps,
      updatedAt: new Date()
    }));
  };

  const toggleMultiStep = (isMultiStep: boolean) => {
    setCurrentForm(prev => {
      if (isMultiStep && prev.fields.length > 0) {
        // Convert existing fields to first step
        const firstStep: FormStep = {
          id: Date.now().toString(),
          name: 'Step 1',
          fields: [...prev.fields]
        };
        return {
          ...prev,
          isMultiStep: true,
          steps: [firstStep],
          fields: [],
          updatedAt: new Date()
        };
      } else if (!isMultiStep && prev.steps && prev.steps.length > 0) {
        // Convert all step fields back to main fields array
        const allFields = prev.steps.flatMap(step => step.fields);
        return {
          ...prev,
          isMultiStep: false,
          steps: [],
          fields: allFields,
          updatedAt: new Date()
        };
      }
      return {
        ...prev,
        isMultiStep,
        steps: isMultiStep ? [] : undefined,
        updatedAt: new Date()
      };
    });
    setCurrentStepId(null);
  };

  const saveTemplate = () => {
    const templates = JSON.parse(localStorage.getItem('formTemplates') || '[]');
    const template = {
      id: Date.now().toString(),
      name: currentForm.name,
      description: currentForm.description || 'Custom template',
      category: 'Custom',
      schema: currentForm
    };

    templates.push(template);
    localStorage.setItem('formTemplates', JSON.stringify(templates));

    toast({
      title: "Template Saved",
      description: "Your form has been saved as a template!",
    });
  };

  // Get current form data for canvas
  const getCurrentFormData = () => {
    if (currentForm.isMultiStep && currentStepId && currentForm.steps) {
      const currentStep = currentForm.steps.find(step => step.id === currentStepId);
      return {
        ...currentForm,
        fields: currentStep?.fields || []
      };
    }
    return currentForm;
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex gap-2">
          <Button onClick={saveTemplate} className="bg-green-600 hover:bg-green-700">
            <Save className="w-4 h-4 mr-2" />
            Save as Template
          </Button>
          <Button onClick={exportForm} variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export JSON
          </Button>
          <div className="relative">
            <input
              type="file"
              accept=".json"
              onChange={importForm}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import JSON
            </Button>
          </div>
        </div>

        <Button
          onClick={() => setShowPreview(!showPreview)}
          className={`transition-colors ${showPreview ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-600 hover:bg-gray-700'}`}
        >
          <Eye className="w-4 h-4 mr-2" />
          {showPreview ? 'Hide Preview' : 'Show Preview'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <StepsManager
            steps={currentForm.steps || []}
            isMultiStep={currentForm.isMultiStep || false}
            onUpdateSteps={updateSteps}
            onToggleMultiStep={toggleMultiStep}
            currentStepId={currentStepId}
            onSelectStep={setCurrentStepId}
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="fields" className="text-xs">
                <Palette className="w-4 h-4 mr-1" />
                Fields
              </TabsTrigger>
              <TabsTrigger value="templates" className="text-xs">
                <LayoutPanelTop className="w-4 h-4 mr-1" />
                Templates
              </TabsTrigger>
              {/* <TabsTrigger value="settings" className="text-xs">
                <Settings className="w-4 h-4 mr-1" />
                Settings
              </TabsTrigger> */}
            </TabsList>

            <TabsContent value="fields" className="mt-4">
              <FormFieldsPanel onAddField={addField} stepId={currentStepId} form_id={form_id} />
            </TabsContent>

            <TabsContent value="templates" className="mt-4">
              <FormTemplates
                onSelectTemplate={setCurrentForm}
                preserveMultiStep={currentForm.isMultiStep}
              />
            </TabsContent>

            <TabsContent value="settings" className="mt-4">
              <FormSettings form={currentForm} onUpdateForm={setCurrentForm} />
            </TabsContent>
          </Tabs>
        </div>

        <div className={`${showPreview ? 'lg:col-span-2' : 'lg:col-span-4'}`}>
          <Card className="p-6 min-h-[600px]">
            {currentForm.isMultiStep && (!currentStepId || !currentForm.steps?.find(s => s.id === currentStepId)) ? (
              <div className="flex flex-col items-center justify-center h-96 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Settings className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">Select a Step</h3>
                <p className="text-gray-500 mb-6 max-w-md">
                  Choose a step from the steps panel to start adding fields to it.
                </p>
              </div>
            ) : (
              <FormCanvas
                form={getCurrentFormData()}
                onUpdateField={updateField}
                onRemoveField={removeField}
                onReorderFields={reorderFields}
              />
            )}
          </Card>
        </div>

        {showPreview && (
          <div className="lg:col-span-2">
            <Card className="p-6 min-h-[600px]">
              <h3 className="text-lg font-semibold mb-4">Live Preview</h3>
              <FormPreview form={currentForm} />
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default FormBuilder;
