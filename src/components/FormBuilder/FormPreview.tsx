import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { FormSchema, FormField } from '@/types/form';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Calendar } from '../ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';

interface FormPreviewProps {
  form: FormSchema;
}

const FormPreview = ({ form }: FormPreviewProps) => {
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set());
  const [requiredFields, setRequiredFields] = useState<Set<string>>(new Set());
  const [currentStep, setCurrentStep] = useState(0);
  const { toast } = useToast();

  // Memoize field calculations to prevent unnecessary recalculations
  const allFields = useMemo(() => {
    if (form.isMultiStep && form.steps) {
      return form.steps.flatMap(step => step.fields);
    }
    return form.fields;
  }, [form.isMultiStep, form.steps, form.fields]);

  const currentStepFields = useMemo(() => {
    if (form.isMultiStep && form.steps && form.steps[currentStep]) {
      return form.steps[currentStep].fields;
    }
    return form.fields;
  }, [form.isMultiStep, form.steps, form.fields, currentStep]);

  // Memoize the schema creation function
  const createSchema = useCallback((currentVisibleFields: Set<string>, currentRequiredFields: Set<string>) => {
    const schemaObject: any = {};

    allFields.forEach(field => {
      // Only validate visible fields
      if (!currentVisibleFields.has(field.id)) return;

      let fieldSchema: any;

      switch (field.type) {
        case 'email':
          fieldSchema = z.string().email('Invalid email address');
          break;
        case 'number':
          fieldSchema = z.number({
            invalid_type_error: 'Must be a number'
          });
          if (field.validation?.min !== undefined) fieldSchema = fieldSchema.min(field.validation.min);
          if (field.validation?.max !== undefined) fieldSchema = fieldSchema.max(field.validation.max);
          break;
        case 'url':
          fieldSchema = z.string().url('Invalid URL');
          break;
        case 'checkbox':
          fieldSchema = z.array(z.string());
          break;
        case 'date':
          fieldSchema = z.date({
            invalid_type_error: 'Invalid date'
          });
          break;
        default:
          fieldSchema = z.string();
      }

      // Check if field should be required (either originally required or made required by dependency)
      const shouldBeRequired = field.required || currentRequiredFields.has(field.id);

      if (shouldBeRequired) {
        if (field.type === 'checkbox') {
          fieldSchema = fieldSchema.min(1, `${field.label} is required`);
        } else {
          fieldSchema = fieldSchema.min(1, `${field.label} is required`);
        }
      } else {
        fieldSchema = fieldSchema.optional();
      }

      schemaObject[field.id] = fieldSchema;
    });

    return z.object(schemaObject);
  }, [allFields]);

  // Initialize schema with all fields visible
  const [schema, setSchema] = useState(() => createSchema(new Set(allFields.map(f => f.id)), new Set()));

  const { register, handleSubmit, formState: { errors }, watch, setValue, reset } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange'
  });

  const watchedValues = watch();

  // Handle field dependencies - this effect should run when watched values change
  useEffect(() => {
    const newVisibleFields = new Set<string>();
    const newRequiredFields = new Set<string>();

    // First, determine base visibility and requirements
    allFields.forEach(field => {
      // Fields without dependencies are visible by default
      if (!field.dependencies || field.dependencies.length === 0) {
        newVisibleFields.add(field.id);
      }

      // Track originally required fields
      if (field.required) {
        newRequiredFields.add(field.id);
      }
    });

    // Then apply dependency rules
    allFields.forEach(field => {
      if (!field.dependencies) return;

      let fieldVisible = !field.dependencies.some(dep => dep.action === 'show' || dep.action === 'hide');
      let fieldRequired = field.required;

      field.dependencies.forEach(dep => {
        // Use field ID for dependency matching if field has dependsOn
        const depFieldKey = field.dependsOn ? field.id : dep.field;
        const depValue = watchedValues[depFieldKey];
        let matches = false;

        // Handle different value matching scenarios
        if (Array.isArray(dep.value)) {
          matches = dep.value.includes(depValue);
        } else {
          matches = String(depValue) === String(dep.value);
        }

        if (matches) {
          switch (dep.action) {
            case 'show':
              fieldVisible = true;
              break;
            case 'hide':
              fieldVisible = false;
              break;
            case 'require':
              fieldRequired = true;
              break;
          }
        } else {
          // If condition not met, apply opposite logic for show/hide
          if (dep.action === 'show') {
            fieldVisible = false;
          } else if (dep.action === 'hide') {
            fieldVisible = true;
          }
        }
      });

      if (fieldVisible) {
        newVisibleFields.add(field.id);
      }

      if (fieldRequired) {
        newRequiredFields.add(field.id);
      }
    });

    // Only update state if there are actual changes
    setVisibleFields(prev => {
      const prevArray = Array.from(prev).sort();
      const newArray = Array.from(newVisibleFields).sort();
      if (JSON.stringify(prevArray) !== JSON.stringify(newArray)) {
        return newVisibleFields;
      }
      return prev;
    });

    setRequiredFields(prev => {
      const prevArray = Array.from(prev).sort();
      const newArray = Array.from(newRequiredFields).sort();
      if (JSON.stringify(prevArray) !== JSON.stringify(newArray)) {
        return newRequiredFields;
      }
      return prev;
    });

  }, [watchedValues, allFields]);

  // Update schema when visibility or requirements change
  useEffect(() => {
    const newSchema = createSchema(visibleFields, requiredFields);
    setSchema(newSchema);
  }, [visibleFields, requiredFields, createSchema]);

  const onSubmit = (data: any) => {
    // Filter data to only include visible fields
    const visibleData = Object.keys(data)
      .filter(key => visibleFields.has(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {} as any);

    console.log('Form submitted:', visibleData);
    toast({
      title: "Form Submitted!",
      description: "Check the console for form data.",
    });
  };

  const renderField = (field: FormField) => {
    if (!visibleFields.has(field.id)) return null;

    const isRequired = field.required || requiredFields.has(field.id);
    const commonProps = {
      id: field.id,
      placeholder: field.placeholder
    };

    switch (field.type) {
      case 'text':
      case 'email':
      case 'url':
      case 'phone':
      case 'password':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Input
              {...commonProps}
              type={field.type}
              {...register(field.id)}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'number':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Input
              {...commonProps}
              type="number"
              {...register(field.id, { valueAsNumber: true })}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'textarea':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Textarea
              {...commonProps}
              {...register(field.id)}
              rows={4}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'select':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Select onValueChange={(value) => setValue(field.id, value)}>
              <SelectTrigger>
                <SelectValue placeholder={field.placeholder} />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'radio':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <RadioGroup onValueChange={(value) => setValue(field.id, value)}>
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.value} id={`${field.id}-${option.value}`} />
                  <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </RadioGroup>
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'checkbox':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <div className="space-y-2">
              {field.options?.map((option) => (
                <div key={option.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${field.id}-${option.value}`}
                    onCheckedChange={(checked) => {
                      const currentValues = watchedValues[field.id] || [];
                      if (checked) {
                        setValue(field.id, [...currentValues, option.value]);
                      } else {
                        setValue(field.id, currentValues.filter((v: string) => v !== option.value));
                      }
                    }}
                  />
                  <Label htmlFor={`${field.id}-${option.value}`}>{option.label}</Label>
                </div>
              ))}
            </div>
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'date':
        return (
          <div key={field.id} className="space-y-2">
            <Label>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !watchedValues[field.id] && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watchedValues[field.id] ? format(watchedValues[field.id], "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watchedValues[field.id]}
                  onSelect={(date) => setValue(field.id, date)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      case 'file':
        return (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>
              {field.label}
              {isRequired && <span className="text-red-500 ml-1">*</span>}
            </Label>
            {field.description && (
              <p className="text-sm text-gray-600">{field.description}</p>
            )}
            <Input
              {...commonProps}
              type="file"
              {...register(field.id)}
            />
            {errors[field.id] && (
              <p className="text-red-500 text-sm">{errors[field.id]?.message as string}</p>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  if (allFields.length === 0) {
    return (
      <div className="text-center text-gray-500">
        <p>Add fields to see the preview</p>
      </div>
    );
  }

  const handleNextStep = () => {
    if (form.isMultiStep && form.steps && currentStep < form.steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <h3 className="text-lg font-semibold">{form.name}</h3>
        {form.description && (
          <p className="text-gray-600 mt-1">{form.description}</p>
        )}

        {form.isMultiStep && form.steps && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">
              Step {currentStep + 1} of {form.steps.length}: {form.steps[currentStep]?.name}
            </p>
            {form.steps[currentStep]?.description && (
              <p className="text-sm text-gray-600 mt-1">{form.steps[currentStep].description}</p>
            )}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {currentStepFields.map(renderField)}

        {form.isMultiStep && form.steps ? (
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={currentStep === 0}
            >
              Previous
            </Button>

            {currentStep === form.steps.length - 1 ? (
              <Button type="submit">Submit Form</Button>
            ) : (
              <Button type="button" onClick={handleNextStep}>
                Next
              </Button>
            )}
          </div>
        ) : (
          <Button type="submit" className="w-full mt-6">
            Submit Form
          </Button>
        )}
      </form>

      {/* Debug info - remove in production */}
      <div className="mt-4 p-2 bg-gray-50 rounded text-xs">
        <p><strong>Visible fields:</strong> {Array.from(visibleFields).join(', ')}</p>
        <p><strong>Required fields:</strong> {Array.from(requiredFields).join(', ')}</p>
        <p><strong>Current values:</strong> {JSON.stringify(watchedValues)}</p>
      </div>
    </div>
  );
};

export default FormPreview;