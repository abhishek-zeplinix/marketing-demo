'use client';
import React, { useEffect, useRef, useState } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';

const MarketingDetails = () => {
    const [buOptions, setBuOptions] = useState<{ label: string; value: string }[]>([]);
    const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);
    const [brands, setBrands] = useState<{ label: string; value: string }[]>([]);
    const [evaluationNames, setEvaluationNames] = useState<{ label: string; value: string }[]>([]);
    const [vendors, setVendors] = useState<{ label: string; value: string }[]>([]);

    const statusOptions = [
        { label: 'Active', value: 'Active' },
        { label: 'Inactive', value: 'Inactive' }
    ];

    const assessorGroups = [
        { label: 'Group A', value: 'Group A' },
        { label: 'Group B', value: 'Group B' }
    ];

    const templateTypes = [
        { label: 'Reckitt To Agency', value: 'Reckitt To Agency' },
        { label: 'Agency To Reckitt', value: 'Agency To Reckitt' }
    ];

    const [selectedEval, setSelectedEval] = useState<string | null>(null);
    const [selectedVendor, setSelectedVendor] = useState<string | null>(null);
    const [administrator, setAdministrator] = useState<string>('');
    const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
    const [selectedBU, setSelectedBU] = useState<string | null>(null);
    const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
    const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
    const [selectedAssessorGroup, setSelectedAssessorGroup] = useState<string | null>(null);
    const [selectedTemplateType, setSelectedTemplateType] = useState<string | null>(null);

    const [comboList, setComboList] = useState<any[]>([]);
    const [savedCombos, setSavedCombos] = useState<any[]>([]);
    const [showDialog, setShowDialog] = useState(false);
    const toast = useRef<Toast>(null);

    useEffect(() => {
        const getStoredValues = (key: string) => {
            const data = localStorage.getItem(key);
            if (!data) return [];
            try {
                return JSON.parse(data).map((item: any) => ({ label: item, value: item }));
            } catch {
                return [];
            }
        };
        setBuOptions(getStoredValues('BU'));
        setCountries(getStoredValues('Country'));
        setBrands(getStoredValues('Brand'));
    }, []);

    useEffect(() => {
        const evals = JSON.parse(localStorage.getItem('evaluationData') || '[]');
        setEvaluationNames(evals.map((e: string) => ({ label: e, value: e })));

        const vendorsData = JSON.parse(localStorage.getItem('vendors') || '[]');
        setVendors(vendorsData.map((v: any) => ({ label: v.name, value: v.name })));
    }, []);

    const handleSubmit = () => {
        if (!selectedEval || !selectedVendor || !administrator || !selectedCountry || !selectedBU || !selectedStatus || !selectedBrand || !selectedAssessorGroup || !selectedTemplateType) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Missing!',
                detail: 'Please fill out all fields',
                life: 3000
            });
            return;
        }

        const trimmedEval = selectedEval?.split(',')[0] || ''; // "2025-1 January Creative"
        const evalWords = trimmedEval.trim().split(' ');
        const extractedEvalWord = evalWords[evalWords.length - 1] || ''; // "Creative"
        const accountName = `${extractedEvalWord}-${selectedCountry}-${selectedBrand}`;

        const newEntry = {
            accountName,
            evaluation: selectedEval,
            vendor: selectedVendor,
            administrator,
            country: selectedCountry,
            bu: selectedBU,
            status: selectedStatus,
            brand: selectedBrand,
            assessorGroup: selectedAssessorGroup,
            templateType: selectedTemplateType
        };

        setComboList((prev) => [...prev, newEntry]);
    };

    const handleSave = () => {
        localStorage.setItem('finalReviewData', JSON.stringify(comboList));
        toast.current?.show({
            severity: 'success',
            summary: 'Saved!',
            detail: 'Combos saved locally',
            life: 3000
        });
    };

    const handleViewSaved = () => {
        const data = JSON.parse(localStorage.getItem('finalReviewData') || '[]');
        setSavedCombos(data);
        setShowDialog(true);
    };

    return (
        <div className="p-4 card">
            <Toast ref={toast} />

            <Dialog header="Saved Final Combos" visible={showDialog} style={{ width: '60vw' }} onHide={() => setShowDialog(false)}>
                {savedCombos.length ? (
                    <DataTable value={savedCombos}>
                        <Column header="#" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '50px' }} />
                        <Column field="accountName" header="Account Name" />
                        <Column field="evaluation" header="Evaluation Name" />
                        <Column field="vendor" header="Vendor" />
                        <Column field="administrator" header="Administrator" />
                        <Column field="country" header="Country" />
                        <Column field="bu" header="BU" />
                        <Column field="status" header="Status" />
                        <Column field="brand" header="Brand" />
                        <Column field="assessorGroup" header="Assessor Group" />
                        <Column field="templateType" header="Template Type" />
                    </DataTable>
                ) : (
                    <p>No saved data found.</p>
                )}
            </Dialog>

            <div className="flex justify-content-between items-center mb-4">
                <h2 className="text-xl font-semibold">Final Review Data</h2>
                <Button label="View Saved Combos" icon="pi pi-eye" onClick={handleViewSaved} />
            </div>

            <div className="grid formgrid gap-3 mb-4">
                <div className="flex row col-12">
                    <div className="col-4">
                        <label>Evaluation Name</label>
                        <Dropdown value={selectedEval} options={evaluationNames} onChange={(e) => setSelectedEval(e.value)} className="w-full mt-2" placeholder="Select Evaluation" />
                    </div>
                    <div className="col-4">
                        <label>Vendor</label>
                        <Dropdown value={selectedVendor} options={vendors} onChange={(e) => setSelectedVendor(e.value)} className="w-full mt-2" placeholder="Select Vendor" />
                    </div>
                    <div className="col-4">
                        <label>Status</label>
                        <Dropdown value={selectedStatus} options={statusOptions} onChange={(e) => setSelectedStatus(e.value)} className="w-full mt-2" placeholder="Select Status" />
                    </div>
                </div>

                <div className="flex row col-12">
                    <div className="col-4">
                        <label>Administrator</label>
                        <InputText value={administrator} onChange={(e) => setAdministrator(e.target.value)} className="w-full mt-2" placeholder="Enter Administrator" />
                    </div>
                    <div className="col-4">
                        <label>Country</label>
                        <Dropdown value={selectedCountry} options={countries} onChange={(e) => setSelectedCountry(e.value)} className="w-full mt-2" placeholder="Select Country" />
                    </div>
                    <div className="col-4">
                        <label>BU</label>
                        <Dropdown value={selectedBU} options={buOptions} onChange={(e) => setSelectedBU(e.value)} className="w-full mt-2" placeholder="Select BU" />
                    </div>
                </div>

                <div className="flex row col-12">
                    <div className="col-4">
                        <label>Brand</label>
                        <Dropdown value={selectedBrand} options={brands} onChange={(e) => setSelectedBrand(e.value)} className="w-full mt-2" placeholder="Select Brand" />
                    </div>
                    <div className="col-4">
                        <label>Assessor Group</label>
                        <Dropdown value={selectedAssessorGroup} options={assessorGroups} onChange={(e) => setSelectedAssessorGroup(e.value)} className="w-full mt-2" placeholder="Select Assessor Group" />
                    </div>
                    <div className="col-4">
                        <label>Template Type</label>
                        <Dropdown value={selectedTemplateType} options={templateTypes} onChange={(e) => setSelectedTemplateType(e.value)} className="w-full mt-2" placeholder="Select Template Type" />
                    </div>
                </div>
            </div>

            <div className="flex justify-content-end gap-2 mb-4">
                <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} />
            </div>

            {comboList.length > 0 && (
                <>
                    <h3 className="text-lg font-medium mb-3">Generated Combos</h3>
                    <DataTable value={comboList} className="mb-4">
                        <Column header="#" body={(_, { rowIndex }) => rowIndex + 1} style={{ width: '50px' }} />
                        <Column field="accountName" header="Account Name" style={{ width: '250px' }} />
                        <Column field="evaluation" header="Evaluation Name" />
                        <Column field="vendor" header="Vendor" />
                        <Column field="administrator" header="Administrator" />
                        <Column field="country" header="Country" />
                        <Column field="bu" header="BU" />
                        <Column field="status" header="Status" />
                        <Column field="brand" header="Brand" />
                        <Column field="assessorGroup" header="Assessor Group" />
                        <Column field="templateType" header="Template Type" />
                    </DataTable>

                    <div className="flex justify-end">
                        <Button label="Save" icon="pi pi-save" className="p-button-success" onClick={handleSave} />
                    </div>
                </>
            )}
        </div>
    );
};

export default MarketingDetails;
