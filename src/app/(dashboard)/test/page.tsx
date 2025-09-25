"use client";

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ColumnDef } from "@tanstack/react-table";
import DataTable from '@/components/table/data-table';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { DataTableRow } from '@/types/table';
import Loading from '@/components/loading/loading';

// Types for DummyJSON API response
interface DummyUser {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  gender: string;
  email: string;
  phone: string;
  image: string;
  hair: {
    color: string;
    type: string;
  };
  address: {
    city: string;
    state: string;
    country: string;
  };
  company: {
    name: string;
    title: string;
    department: string;
  };
}

interface DummyResponse {
  users: DummyUser[];
  total: number;
  skip: number;
  limit: number;
}

// API Service for DummyJSON
class DummyJsonAPI {
  private baseUrl = 'https://dummyjson.com/users';

  async getUsers(params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    filters?: Record<string, string>;
  }): Promise<DummyResponse> {
    const { page = 1, pageSize = 10, search, sortBy, order, filters } = params;
    
    let url = this.baseUrl;
    const urlParams = new URLSearchParams();
    
    // Calculate skip for pagination
    const skip = (page - 1) * pageSize;
    urlParams.set('skip', skip.toString());
    urlParams.set('limit', pageSize.toString());
    
    // Add search
    if (search) {
      url = `${this.baseUrl}/search`;
      urlParams.set('q', search);
    }
    
    // Add sorting
    if (sortBy) {
      urlParams.set('sortBy', sortBy);
      urlParams.set('order', order || 'asc');
    }
    
    // Add filters (using the filter endpoint)
    if (filters && Object.keys(filters).length > 0) {
      const filterEntries = Object.entries(filters);
      if (filterEntries.length === 1) {
        const [key, value] = filterEntries[0];
        url = `${this.baseUrl}/filter`;
        urlParams.set('key', key);
        urlParams.set('value', value);
      }
    }
    
    const fullUrl = `${url}?${urlParams.toString()}`;
    console.log('API Request:', fullUrl);
    
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // For search endpoint, the response structure is different
    if (search) {
        return {
            users: data.users || [],
            total: data.total || 0,
            skip: data.skip || 0,
            limit: data.limit || pageSize
        };
    }
    
    return data;
  }
}

export default function TestPage() {
  const [data, setData] = useState<DummyUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  // إنشاء API instance مرة واحدة فقط
  const api = useMemo(() => new DummyJsonAPI(), []);

  // Load initial data - محاط بـ useCallback مع api dependency
  const loadData = useCallback(async (params: {
    page?: number;
    pageSize?: number;
    search?: string;
    sortBy?: string;
    order?: 'asc' | 'desc';
    filters?: Record<string, string>;
  } = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await api.getUsers(params);
      setData(response.users);
      setTotalCount(response.total);
    } catch (err) {
      console.error('Error loading data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [api]);

  // Backend pagination handlers - stable references
  const handlePageChange = useCallback((page: number, pageSize: number) => {
    loadData({ page, pageSize });
  }, [loadData]);

  const handleSearchChange = useCallback((searchTerm: string) => {
    if (searchTerm.trim()) {
      loadData({ search: searchTerm.trim() });
    } else {
      loadData();
    }
  }, [loadData]);

  const handleSortChange = useCallback((sorting: { field: string; direction: 'asc' | 'desc' } | null) => {
    if (sorting) {
      loadData({ sortBy: sorting.field, order: sorting.direction });
    } else {
      loadData();
    }
  }, [loadData]);

  const handleFilterChange = useCallback((filters: Record<string, unknown>) => {
    // Convert filters to string format for API
    const stringFilters: Record<string, string> = {};
    Object.entries(filters).forEach(([key, value]) => {
      if (value && typeof value === 'string') {
        stringFilters[key] = value;
      }
    });
    
    loadData({ filters: stringFilters });
  }, [loadData]);

  const backendPagination = useMemo(() => ({
    enabled: true,
    totalCount,
    onPageChange: handlePageChange,
    onSearchChange: handleSearchChange,
    onSortChange: handleSortChange,
    onFilterChange: handleFilterChange,
    loading,
  }), [totalCount, loading, handlePageChange, handleSearchChange, handleSortChange, handleFilterChange]);

  // Initial load - مرة واحدة فقط
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Define columns - useMemo علشان مايتغيرش في كل render
  const columns: ColumnDef<DummyUser>[] = useMemo(() => [
    {
      accessorKey: 'id',
      header: 'ID',
      size: 80,
    },
    {
      accessorKey: 'image',
      header: 'Avatar',
      cell: ({ row }) => (
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.original.image} alt={`${row.original.firstName} ${row.original.lastName}`} />
          <AvatarFallback>
            {row.original.firstName[0]}{row.original.lastName[0]}
          </AvatarFallback>
        </Avatar>
      ),
      size: 80,
    },
    {
      accessorKey: 'firstName',
      header: 'First Name',
      size: 120,
    },
    {
      accessorKey: 'lastName',
      header: 'Last Name',
      size: 120,
    },
    {
      accessorKey: 'age',
      header: 'Age',
      size: 80,
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      cell: ({ row }) => (
        <Badge variant={row.original.gender === 'male' ? 'default' : 'secondary'}>
          {row.original.gender}
        </Badge>
      ),
      size: 100,
    },
    {
      accessorKey: 'email',
      header: 'Email',
      size: 300,
    },
    {
      accessorKey: 'phone',
      header: 'Phone',
      size: 150,
    },
    {
      accessorKey: 'hair.color',
      header: 'Hair Color',
      accessorFn: (row) => row.hair.color,
      cell: ({ row }) => (
        <Badge variant="outline">
          {row.original.hair.color}
        </Badge>
      ),
      size: 120,
    },
    {
      accessorKey: 'address.city',
      header: 'City',
      accessorFn: (row) => row.address.city,
      size: 120,
    },
    {
      accessorKey: 'company.name',
      header: 'Company',
      accessorFn: (row) => row.company.name,
      size: 150,
    },
    {
      accessorKey: 'company.title',
      header: 'Job Title',
      accessorFn: (row) => row.company.title,
      size: 150,
    },
  ], []);

  console.log(data);

  return (
    <div className="mx-auto py-6 px-7">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold mb-2">Backend Pagination Test</h1>
          <p className="text-muted-foreground">
            Testing backend pagination with DummyJSON API
          </p>
        </div>

        {/* Data Table */}
        <DataTable
          data={data as DataTableRow[] | []}
          columns={columns as ColumnDef<DataTableRow>[]}
          searchConfig={{
            enabled: true,
            placeholder: "Search users by name, email, or company...",
            searchKeys: ['firstName', 'lastName', 'email', 'city']
          }}
          statusConfig={{
            enabled: false,
            // columnKey: 'gender',
            // title: 'Gender Filter'
          }}
          actionConfig={{
            enabled: true,
            showDelete: false,
          }}
          columnVisibilityConfig={{
            enableColumnVisibility: false,
          }}
          enableSorting={true}
          enableSelection={true}
          pageSize={10}
          error={error || undefined}
          backendPagination={backendPagination}
        />

      </div>
    </div>
  );
}
