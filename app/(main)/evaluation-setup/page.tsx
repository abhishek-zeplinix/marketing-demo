'use client';

import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import 'primereact/resources/themes/lara-light-blue/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

export default function VendorTable() {
    const vendors = [
        {
            agency: 'Dentsu',
            account: 'Digital, France, Health (Digital) - updated question set',
            setupSteps: [1, 2, 3, 4],
            questionSet: ['Dig (IAegis) FR/BE/NL | 5 Sections', 'Media AG | 4 Sections'],
            clientParticipants: ['0: Owners', '3: Assessors'],
            agencyParticipants: ['0: Owners', '3: Assessors']
        },
        {
            agency: 'Dentsu',
            account: 'Digital, France, Hygiene (Digital) - updated question set',
            setupSteps: [1, 2, 3, 4],
            questionSet: ['Dig (IAegis) FR/BE/NL | 5 Sections', 'Media AG | 4 Sections'],
            clientParticipants: ['0: Owners', '2: Assessors'],
            agencyParticipants: ['0: Owners', '3: Assessors']
        }
    ];

    const setupTemplate = (rowData: any) => (
        <div className="flex flex-wrap gap-4">
            {/* First set */}
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">1</span>
                <i className="pi pi-check text-white bg-green-600 p-2 border-circle text-sm" />
            </div>
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">2</span>
                <i className="pi pi-check text-white bg-green-600 p-2 border-circle text-sm" />
            </div>

            {/* Second set */}
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">3</span>
                <i className="pi pi-check text-white bg-green-600 p-2 border-circle text-sm" />
            </div>
            <div className="flex flex-column align-items-center gap-1">
                <span className="text-xs text-gray-600 font-medium">4</span>
                <i className="pi pi-check text-white bg-green-600 p-2 border-circle text-sm" />
            </div>
        </div>
    );

    const questionSetTemplate = (rowData: any) => (
        <div>
            {rowData.questionSet.map((q: string, i: number) => (
                <div key={i}>{q}</div>
            ))}
        </div>
    );

    const participantsTemplate = (data: string[]) => (
        <div>
            {data.map((entry, i) => (
                <div key={i}>{entry}</div>
            ))}
        </div>
    );

    const actionBodyTemplate = () => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" className="p-button-text p-button-sm" />
            <Button icon="pi pi-trash" className="p-button-text p-button-sm p-button-danger" />
        </div>
    );

    return (
        <div className="p-4">
            {/* Header */}
            <div className="flex justify-content-between align-items-center mb-3 text-sm md:text-base font-semibold">
                <span>
                    Evaluation Name: <span className="font-normal">2025-5, H1 Media, Global</span> &nbsp; Evaluation Type: <span className="font-normal">Annual</span> &nbsp; Reporting Year: <span className="font-normal">2025</span> &nbsp; Reporting
                    Month: <span className="font-normal">5</span>
                </span>
            </div>

            {/* DataTable */}
            <DataTable value={vendors} stripedRows responsiveLayout="scroll" className="text-sm" scrollable>
                <Column field="agency" header="AGENCY" />
                <Column field="account" header="ACCOUNT" />
                <Column body={setupTemplate} header="SET-UP" style={{ width: '200px' }} />
                <Column body={questionSetTemplate} header="QUESTION SET" />
                <Column body={(rowData) => participantsTemplate(rowData.clientParticipants)} header="CLIENT PARTICIPANTS" />
                <Column body={(rowData) => participantsTemplate(rowData.agencyParticipants)} header="AGENCY PARTICIPANTS" />
                <Column body={actionBodyTemplate} header="ACTIONS" style={{ width: '120px' }} />
            </DataTable>
        </div>
    );
}
