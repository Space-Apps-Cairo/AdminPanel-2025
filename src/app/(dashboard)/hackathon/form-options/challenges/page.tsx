"use client"

import Loading from '@/components/loading/loading';
import DataTable from '@/components/table/data-table';
import { useGetAllChallengesQuery, useDeleteChallengeMutation, useAddChallengeMutation } from '@/service/Api/challenges';
import { Challenge, CreateChallengeRequest } from '@/types/challenges';
import { ActionConfig, SearchConfig, StatusConfig } from '@/types/table';
import React, { useState } from 'react';
import { challengeColumns, getChallengeFields } from './_components/columns';
import CrudForm from '@/components/crud-form';
import { challengeValidationSchema } from '@/validations/challenges';
import { FieldValues } from 'react-hook-form';
import { toast } from 'sonner';

export default function ChallengesPage() {
    const {
        data: challengesData,
        isLoading: isLoadingChallenges,
        error: challengesError,
    } = useGetAllChallengesQuery();


    const [isOpen, setIsOpen] = useState(false);

    const fields = getChallengeFields();

    // Delete mutation for bulk operations
    const [deleteChallenge] = useDeleteChallengeMutation();



    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Filter by title",
        searchKeys: ["title"],
    };

    const statusConfig: StatusConfig = {
        enabled: false,
    };

    const actionConfig: ActionConfig = {
        enabled: true,
        showAdd: true,
        showDelete: true,
        addButtonText: "Add Challenge",
        onAdd: () => {
            setIsOpen(true);
        },
    };

    // ====== add-new-challenge ====== //

    const [addChallenge] = useAddChallengeMutation();

    const handleAddChallengeSubmit = async (data: FieldValues) => {
        try {
            console.log("Submitting challenge data:", data);

            const challengeData: CreateChallengeRequest = {
                title: data.title,
                description: data.description,
                difficulty_level_id: data.difficulty_level_id ? Number(data.difficulty_level_id) : undefined,
            };

            const result = await addChallenge(challengeData).unwrap();

            console.log("Challenge added successfully:", result);
            toast.success(result.message || "Challenge added successfully!");
            setIsOpen(false);

        } catch (error) {
            console.error("Error adding challenge:", error);
            toast.error((error as any).data?.message || "Failed to add challenge. Please try again.");
            throw error;
        }
    };

    // ====== status ====== //

    if (isLoadingChallenges) return <Loading />;

    if (challengesError) {
        return (
            <div className="mx-auto py-6">
                <div className="text-red-500">
                    Error loading challenges
                </div>
            </div>
        );
    }

    return <React.Fragment>

        {isOpen && (
            <CrudForm
                fields={fields}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                operation={"add"}
                asDialog={true}
                validationSchema={challengeValidationSchema}
                onSubmit={handleAddChallengeSubmit}
            />
        )}

        <div className="mx-auto py-6 px-7">
            <h1 className="text-2xl font-bold mb-6">Hackathon Challenges</h1>

            <DataTable<Challenge>
                data={challengesData?.data || []}
                columns={challengeColumns}
                searchConfig={searchConfig}
                statusConfig={statusConfig}
                actionConfig={actionConfig}
                bulkDeleteMutation={deleteChallenge}
            />
        </div>
    </React.Fragment>
}