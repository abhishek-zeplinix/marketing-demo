'use client';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { useState } from 'react';

const TablePage = () => {
    const [selectedRows, setSelectedRows] = useState<any[]>([]);

    const data = [
        {
            agency: 'Dentsu',
            account: 'Digital, France, Health (Digital)',
            openComplete: [false, false, false, false], // lock icons
            clientSubmission: '0 of 3',
            agencySelf: 'N/A',
            agencySubmission: '0 of 3',
            clientSelf: 'N/A'
        },
        {
            agency: 'Dentsu',
            account: 'Digital, France, Hygiene (Digital)',
            openComplete: [false, false, false, false],
            clientSubmission: '0 of 2',
            agencySelf: 'N/A',
            agencySubmission: '0 of 3',
            clientSelf: 'N/A'
        }
    ];

    const lockTemplate = () => (
        <div className="flex gap-3">
            {[1, 2, 3, 4].map((_, i) => (
                <i key={i} className="pi pi-lock text-yellow-600 text-sm" />
            ))}
        </div>
    );

    return (
        <div className="p-4">
            {/* Header Info */}
            <div className="text-sm text-gray-700 mb-3">
                <div className="mb-1">
                    <strong>Evaluation:</strong> 2025-5, H1 Media, Global &nbsp;&nbsp;
                    <strong>Evaluation Type:</strong> Annual &nbsp;&nbsp;
                    <strong>Reporting Year:</strong> 2025 &nbsp;&nbsp;
                    <strong>Reporting Month:</strong> 5
                </div>
            </div>

            {/* Table */}
            <DataTable value={data} selection={selectedRows} onSelectionChange={(e) => setSelectedRows(e.value)} selectionMode="checkbox" dataKey="account" className="text-sm">
                <Column selectionMode="multiple" headerStyle={{ width: '3rem' }}></Column>
                <Column field="agency" header="AGENCY" />
                <Column field="account" header="ACCOUNT" />
                <Column header="OPEN/COMPLETE" body={lockTemplate} />
                <Column field="clientSubmission" header="CLIENT SUBMISSION (1)" />
                <Column field="agencySelf" header="AGENCY SELF (2)" />
                <Column field="agencySubmission" header="AGENCY SUBMISSION (3)" />
                <Column field="clientSelf" header="CLIENT SELF" />
            </DataTable>
        </div>
    );
};

export default TablePage;
