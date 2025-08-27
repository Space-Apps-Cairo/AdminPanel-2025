"use client"

import Loading from '@/components/loading/loading';
import DataTable from '@/components/table/data-table';
import { useAddVolunteerMutation, useGetAllVolunteersQuery, useImportVolunteersFileMutation } from '@/service/Api/materials';
import { Volunteer } from '@/types/materials';
import { ActionConfig, SearchConfig, StatusConfig } from '@/types/table';
import React, { useEffect, useState, useRef } from 'react';
import { getVolunteerFields, volunteerColumns } from './_components/columns';
import { FieldValues } from 'react-hook-form';
import CrudForm from '@/components/crud-form';
import { volunteerValidationSchema } from '@/validations/volunteer';
import { Button } from '@/components/ui/button';
import { Upload, FileText, X } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { toast } from 'sonner';

export default function Volunteers() {

    const {
        data: volunteersData,
        isLoading: isLoadingVolunteers,
        error: VolunteersError,
    } = useGetAllVolunteersQuery();

    const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [uploadError, setUploadError] = useState<string>('');
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const [isDragOver, setIsDragOver] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Import Volunteers Mutation
    const [importVolunteers, { 
        isLoading: isImportLoading, 
        error: importError 
    }] = useImportVolunteersFileMutation();

    useEffect(() => {
        if (
            volunteersData &&
            !isLoadingVolunteers &&
            !VolunteersError
        ) {
            setVolunteers(volunteersData.data);
        }
    }, [volunteersData, VolunteersError, isLoadingVolunteers]);

    const searchConfig: SearchConfig = {
        enabled: true,
        placeholder: "Filter by name and email",
        searchKeys: ["full_name", "email"],
    };
    
    const statusConfig: StatusConfig = {
        enabled: false,
    };
    
    const actionConfig: ActionConfig = {
        enabled: true,
        showAdd: true,
        showDelete: true,
        addButtonText: "Add Volunteer",
        onAdd: () => {
            setIsOpen(true);
        },
    };

    // ====== CSV Upload Functions ====== //
    
    const parseCSV = (csvText: string): any[] => {

        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(header => header.trim().replace(/"/g, ''));

        const data = lines.slice(1).map(line => {
            const values = line.split(',').map(value => value.trim().replace(/"/g, ''));
            const row: any = {};
            headers.forEach((header, index) => {
                row[header] = values[index] || '';
            });
            return row;
        });

        return data;

    };

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        processFile(file);
    };

    const processFile = (file: File | undefined) => {

        if (file) {

            if (file.type !== 'text/csv' && !file.name.endsWith('.csv')) {
                setUploadError('Please select a valid CSV file');
                return;
            }

            setSelectedFile(file);
            setUploadError('');

        }

    };

    const handleDragEnter = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
    };

    const handleDragOver = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            processFile(files[0]);
        }
    };

    const handleUpload = async () => {

        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);
        setUploadError('');

        try {

            const reader = new FileReader();
            reader.onload = async (e) => {
                const csvText = e.target?.result as string;
                
                try {

                    const jsonData = parseCSV(csvText);

                    const validatedData = {
                        volunteers: jsonData.map((row) => {
                            return {
                                full_name: row.full_name || row.name || row.Full_Name || '',
                                email: row.email || row.Email || '',
                                phone: row.phone || row.Phone || '',
                                team: row.team || row.Team || '',
                                volunteering_year: parseInt(
                                    row.volunteering_year || row.year || row.Year || new Date().getFullYear().toString()
                                )
                            };
                        })
                    };

                    console.log("Sending data to API:", validatedData);

                    const result = await importVolunteers(validatedData).unwrap();
                    console.log("API Response:", result);

                    setUploadProgress(100);
                    setUploadSuccess(true);
                    toast.success(result.msg || "Volunteers imported successfully!");
                    
                    setTimeout(() => {
                        setIsUploadDialogOpen(false);
                        resetUploadState();
                    }, 2000);

                } catch (parseError) {
                    console.error("Parse Error:", parseError);
                    setUploadError('Error processing CSV data');
                    toast.error((parseError as any).data.msg || 'Error processing CSV data');
                }
            };

            reader.readAsText(selectedFile);

        } catch (error) {
            console.error("Upload Error:", error);
            setUploadError('Error uploading file');
            toast.error((error as any).data.msg || 'Error uploading file');
        } finally {
            setIsUploading(false);
        }
    };

    const resetUploadState = () => {
        setSelectedFile(null);
        setUploadProgress(0);
        setUploadError('');
        setUploadSuccess(false);
        setIsDragOver(false);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleUploadDialogClose = () => {
        if (!isUploading && !isImportLoading) {
            setIsUploadDialogOpen(false);
            resetUploadState();
        }
    };

    const getAPIErrorMessage = (): string => {
        if (!importError) return '';
        
        if ('data' in importError && importError.data) {
            return 'Import failed';
        }
        
        if ('message' in importError) {
            return importError.message || 'Import failed';
        }
        
        return 'Import failed. Please try again.';
    };

    // ====== add-volunteer ====== //

    const [addVolunteer] = useAddVolunteerMutation();

    const handleAddVolunteerSubmit = async (data: FieldValues, formData?: FormData) => {

        try {
            console.log("Submitting volunteer data:", data);
            console.log("Form data:", formData ? [...formData.entries()] : "No form data");

            const volunteerData: Omit<Volunteer, "id" | "created_at" | "schedules"> = {
                full_name: data.full_name,
                email: data.email,
                phone: data.phone,
                team: data.team,
                volunteering_year: data.volunteering_year,
            }

            const result = await addVolunteer(volunteerData as Volunteer).unwrap();
            console.log("Volunteer added successfully:", result);
            toast.success(result.msg || "Volunteer added successfully!");

        } catch (error) {
            console.error("Error adding volunteer:", error);
            toast.error((error as any).data.message || "Failed to add volunteer. Please try again.");
            throw error;
        }

    };

    if(isLoadingVolunteers) return <Loading />

    const isProcessing = isUploading || isImportLoading;
    const finalError = uploadError || getAPIErrorMessage();

    return (
        <React.Fragment>

            {isOpen && (
                <CrudForm
                    fields={getVolunteerFields()}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    operation={"add"}
                    asDialog={true}
                    validationSchema={volunteerValidationSchema}
                    onSubmit={handleAddVolunteerSubmit}
                />
            )}

            <Dialog open={isUploadDialogOpen} onOpenChange={handleUploadDialogClose}>

                <DialogContent className="sm:max-w-md">

                    <DialogHeader>
                        <DialogTitle>Import Volunteers from CSV</DialogTitle>
                        <DialogDescription>
                            Upload a CSV file to import multiple volunteers at once.
                        </DialogDescription>
                    </DialogHeader>
                    
                    <div className="space-y-4">

                        {/* File Input */}
                        <div className="flex items-center justify-center w-full">
                            <label 
                                className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer transition-colors
                                    ${isDragOver 
                                        ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20' 
                                        : 'border-gray-300 bg-gray-50 hover:bg-gray-100 dark:hover:bg-gray-800 dark:bg-gray-700 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
                                    }`}
                                onDragEnter={handleDragEnter}
                                onDragLeave={handleDragLeave}
                                onDragOver={handleDragOver}
                                onDrop={handleDrop}
                            >
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <FileText className={`w-8 h-8 mb-4 ${isDragOver ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'}`} />
                                    <p className={`mb-2 text-sm ${isDragOver ? 'text-blue-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                        {isDragOver ? (
                                            <span className="font-semibold">Drop your CSV file here</span>
                                        ) : (
                                            <>
                                                <span className="font-semibold">Click to upload</span> or drag and drop
                                            </>
                                        )}
                                    </p>
                                    {!isDragOver && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">CSV files only</p>
                                    )}
                                </div>
                                <input 
                                    ref={fileInputRef}
                                    type="file" 
                                    className="hidden" 
                                    accept=".csv"
                                    onChange={handleFileSelect}
                                    disabled={isProcessing}
                                />
                            </label>
                        </div>

                        {/* Selected File Info */}
                        {selectedFile && (
                            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <FileText className="w-4 h-4 text-blue-600" />
                                    <span className="text-sm font-medium">{selectedFile.name}</span>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                        setSelectedFile(null);
                                        setIsDragOver(false);
                                        if (fileInputRef.current) {
                                            fileInputRef.current.value = '';
                                        }
                                    }}
                                    disabled={isProcessing}
                                >
                                    <X className="w-4 h-4" />
                                </Button>
                            </div>
                        )}

                        {/* Upload Progress */}
                        {isProcessing && (
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>
                                        {isUploading ? 'Processing CSV...' : 'Importing volunteers...'}
                                    </span>
                                    <span>
                                        {isUploading ? `${uploadProgress}%` : 'Please wait...'}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div 
                                        className={`bg-blue-600 h-2 rounded-full transition-all duration-300 ${isImportLoading ? 'animate-pulse' : ''}`}
                                        style={{ width: isUploading ? `${uploadProgress}%` : '100%' }}
                                    ></div>
                                </div>
                            </div>
                        )}

                        {/* Error Message */}
                        {finalError && (
                            <div className="flex items-center p-3 text-red-800 border border-red-300 rounded-lg bg-red-50">
                                <X className="w-4 h-4 mr-2" />
                                <span className="text-sm">{finalError}</span>
                            </div>
                        )}

                        {/* Success Message */}
                        {uploadSuccess && (
                            <div className="flex items-center p-3 text-green-800 border border-green-300 rounded-lg bg-green-50">
                                <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                                </svg>
                                <span className="text-sm">Volunteers imported successfully!</span>
                            </div>
                        )}

                    </div>

                    <DialogFooter className="flex justify-between">

                        <Button
                            variant="outline"
                            onClick={handleUploadDialogClose}
                            disabled={isProcessing}
                        >
                            Cancel
                        </Button>

                        <Button
                            onClick={handleUpload}
                            disabled={!selectedFile || isProcessing || uploadSuccess}
                        >
                            {isProcessing ? 'Processing...' : 'Import CSV'}
                        </Button>

                    </DialogFooter>

                </DialogContent>

            </Dialog>

            <div className="container mx-auto py-6">

                <div className='w-full flex item-center justify-between'>

                    <h1 className="text-2xl font-bold mb-6">Volunteers</h1>
                    <Button className='font-semibold' onClick={() => setIsUploadDialogOpen(true)}>
                        <Upload className="w-4 h-4 mr-2" />
                        Import CSV file
                    </Button>
                </div>

                <DataTable<Volunteer>
                    data={volunteers}
                    columns={volunteerColumns}
                    searchConfig={searchConfig}
                    statusConfig={statusConfig}
                    actionConfig={actionConfig}
                    onDataChange={setVolunteers}
                />
            </div>
        </React.Fragment>
    );
}