// fields.tsx - Updated with static category headers
import { Field } from "@/app/interface";
import { useGetAllCriteriaCategoriesQuery } from "@/service/Api/filtretions/criteriaCategories";
import { CriteriaCategoriesRes, CriteriaCategory } from "@/types/filtertion/criteriaCategories";

export const useEvaluationFields = (): { fields: Field[]; steps: number[] } => {
  const { data: criteriaCategoriesData } = useGetAllCriteriaCategoriesQuery();

  const criteriaCategories = (criteriaCategoriesData as CriteriaCategoriesRes)?.data as
    | CriteriaCategory[]
    | undefined;

  if (!criteriaCategories || criteriaCategories.length === 0) {
    return { fields: [], steps: [] };
  }

  const steps = criteriaCategories.map((_, index) => index + 1);
  
  const fields: Field[] = [];

  criteriaCategories.forEach((category, categoryIndex) => {
    // Add category header as a descriptive text (not a form field)
    // We'll use a custom field type that will be handled separately
    fields.push({
      name: `category_header_${category.id}`,
      type: "text", // We'll handle this as static text in the form
      label: `${category.name} - ${category.percentage}%`, // Combined label
      placeholder: category.description,
      disabled: true,
      step: categoryIndex + 1,
      defaultValue: `header` // Just a marker value
    });

    // Add criteria fields for this category
    category.criteria.forEach((criterion) => {
      const fieldName = `criteria_${criterion.id}`;
      
      if (criterion.rating_type === "number") {
        // Create radio options from 0 to max_score
        const options = Array.from({ length: criterion.max_score + 1 }, (_, i) => ({
          value: i.toString(),
          label: i.toString()
        }));

        fields.push({
          name: fieldName,
          type: "radio",
          label: criterion.name,
          placeholder: `Select score (0-${criterion.max_score})`,
          options: options,
          step: categoryIndex + 1,
          defaultValue: "0"
        });
      } else if (criterion.rating_type === "check") {
        // Create Yes/No radio options
        fields.push({
          name: fieldName,
          type: "select",
          label: criterion.name,
          placeholder: "Select Yes or No",
          options: [
            { value: criterion.max_score.toString(), label: `Yes` },
            { value: "0", label: `No` }
          ],
          step: categoryIndex + 1,
          defaultValue: "0"
        });
      }
    });
  });

  return { fields, steps };
};