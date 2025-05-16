// 'use client';
// import React, { useState, useRef, useEffect } from 'react';
// import { Dropdown } from 'primereact/dropdown';
// import { MultiSelect } from 'primereact/multiselect';
// import { Button } from 'primereact/button';
// import { DataTable } from 'primereact/datatable';
// import { Column } from 'primereact/column';
// import { Toast } from 'primereact/toast';
// import { Dialog } from 'primereact/dialog';

// const EvaluationPage = () => {
//     const monthOptions = ['H1', 'H2'].map((m, index) => ({ label: m, value: m }));

//     const [yearOptions, setYearOptions] = useState<{ label: string; value: string }[]>([]);
//     const [timeframeOptions, setTimeframeOptions] = useState<{ label: string; value: string }[]>([]);
//     const [reviewTypes, setReviewTypes] = useState<{ label: string; value: string }[]>([]);
//     const [countries, setCountries] = useState<{ label: string; value: string }[]>([]);

//     const [selectedYear, setSelectedYear] = useState<string[]>([]);
//     const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
//     const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
//     const [selectedReviewTypes, setSelectedReviewTypes] = useState<string[]>([]);
//     const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
//     const [combinations, setCombinations] = useState<string[]>([]);
//     const toast = useRef<Toast>(null);
//     const [showDialog, setShowDialog] = useState(false);
//     const [savedData, setSavedData] = useState<string[]>([]);

//     useEffect(() => {
//         const getStoredValues = (key: string) => {
//             const data = localStorage.getItem(key);
//             if (!data) return [];
//             try {
//                 return JSON.parse(data).map((item: any) => ({ label: item, value: item }));
//             } catch {
//                 return [];
//             }
//         };

//         setYearOptions(getStoredValues('Year'));
//         setTimeframeOptions(getStoredValues('Evaluation TimeFrame'));
//         setReviewTypes(getStoredValues('Review Type'));
//         setCountries(getStoredValues('Country'));
//     }, []);

//     // Update timeframe options based on selected months
//     useEffect(() => {
//         // Reset selected timeframes when the months change
//         setSelectedTimeframes([]);

//         if (selectedMonths.includes(1)) {
//             // H1 is selected
//             setTimeframeOptions([
//                 { label: 'January', value: 'January' },
//                 { label: 'February', value: 'February' },
//                 { label: 'March', value: 'March' },
//                 { label: 'April', value: 'April' },
//                 { label: 'May', value: 'May' },
//                 { label: 'June', value: 'June' }
//             ]);
//         } else if (selectedMonths.includes(2)) {
//             // H2 is selected
//             setTimeframeOptions([
//                 { label: 'July', value: 'July' },
//                 { label: 'August', value: 'August' },
//                 { label: 'September', value: 'September' },
//                 { label: 'October', value: 'October' },
//                 { label: 'November', value: 'November' },
//                 { label: 'December', value: 'December' }
//             ]);
//         } else {
//             // If neither H1 nor H2 is selected, use the stored timeframes from localStorage
//             const getStoredValues = (key: string) => {
//                 const data = localStorage.getItem(key);
//                 if (!data) return [];
//                 try {
//                     return JSON.parse(data).map((item: any) => ({ label: item, value: item }));
//                 } catch {
//                     return [];
//                 }
//             };
//             setTimeframeOptions(getStoredValues('Evaluation TimeFrame'));
//         }
//     }, [selectedMonths]);

//     const handleSubmit = () => {
//         setCombinations([]);
//         if (!selectedYear.length || !selectedMonths.length || !selectedTimeframes.length || !selectedReviewTypes.length || !selectedCountries.length) {
//             toast.current?.show({
//                 severity: 'warn',
//                 summary: 'Hold up!',
//                 detail: 'Please select all the fields ',
//                 life: 3000
//             });
//             return;
//         }

//         const newCombos: string[] = [];

//         selectedYear.forEach((year) => {
//             selectedMonths.forEach((monthNumber) => {
//                 selectedTimeframes.forEach((timeframe) => {
//                     selectedReviewTypes.forEach((review) => {
//                         selectedCountries.forEach((country) => {
//                             newCombos.push(`${year}-${monthNumber} ${timeframe} ${review},${country}`);
//                         });
//                     });
//                 });
//             });
//         });
//         setCombinations((prev) => [...prev, ...newCombos]);
//     };

//     const handleSave = () => {
//         localStorage.setItem('evaluationData', JSON.stringify(combinations));
//         toast.current?.show({
//             severity: 'success',
//             summary: 'Success',
//             detail: 'Saved successfully ✅',
//             life: 3000
//         });
//     };

//     const handleViewSaved = () => {
//         const data = JSON.parse(localStorage.getItem('evaluationData') || '[]');
//         setSavedData(data);
//         setShowDialog(true);
//     };

//     return (
//         <div className="p-4 card">
//             <Toast ref={toast} />

//             <Dialog header="Saved Evaluations" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
//                 {savedData.length > 0 ? (
//                     <DataTable value={savedData.map((val, i) => ({ id: i + 1, name: val }))}>
//                         <Column field="id" header="#" style={{ width: '50px' }} />
//                         <Column field="name" header="Evaluation Name" />
//                     </DataTable>
//                 ) : (
//                     <p>No saved evaluations found.</p>
//                 )}
//             </Dialog>

//             <div className="flex justify-content-between mb-3">
//                 <h2 className="text-xl font-semibold">Evaluation Name</h2>
//                 <Button label="View Saved Evaluations" icon="pi pi-eye" onClick={handleViewSaved} />
//             </div>

//             <div className="grid formgrid gap-3 mb-4">
//                 <div className="flex row col-12">
//                     <div className="md:col-4">
//                         <label>Year</label>
//                         <MultiSelect value={selectedYear} options={yearOptions} onChange={(e) => setSelectedYear(e.value)} className="w-full mt-2 " placeholder="Select Year" />
//                     </div>
//                     <div className="md:col-4">
//                         <label>Evaluation Period</label>
//                         <MultiSelect value={selectedMonths} options={monthOptions} onChange={(e) => setSelectedMonths(e.value)} className="w-full mt-2" placeholder="Select Period" />
//                     </div>
//                     <div className="md:col-4">
//                         <label>Evaluation Timeframes</label>
//                         <MultiSelect value={selectedTimeframes} options={timeframeOptions} onChange={(e) => setSelectedTimeframes(e.value)} className="w-full mt-2" placeholder="Select Timeframes" />
//                     </div>
//                 </div>

//                 <div className="flex row col-12">
//                     <div className="md:col-4">
//                         <label>Review Types</label>
//                         <MultiSelect value={selectedReviewTypes} options={reviewTypes} onChange={(e) => setSelectedReviewTypes(e.value)} className="w-full mt-2" placeholder="Select Review Types" />
//                     </div>
//                     <div className="md:col-4">
//                         <label>Countries</label>
//                         <MultiSelect value={selectedCountries} options={countries} onChange={(e) => setSelectedCountries(e.value)} className="w-full mt-2" placeholder="Select Countries" />
//                     </div>
//                 </div>

//                 <div className="col-12 flex justify-content-end">
//                     <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} />
//                 </div>
//             </div>

//             {combinations.length > 0 && (
//                 <>
//                     <h3 className="text-lg font-medium mt-5 mb-3">Generated Evaluations</h3>
//                     <DataTable value={combinations.map((c, i) => ({ id: i + 1, name: c }))} className="mb-4">
//                         <Column field="id" header="#" style={{ width: '50px' }} />
//                         <Column field="name" header="Evaluation Name" />
//                     </DataTable>
//                     <div className="flex justify-content-end">
//                         <Button label="Save" icon="pi pi-save" onClick={handleSave} className="p-button-success" />
//                     </div>
//                 </>
//             )}
//         </div>
//     );
// };

// export default EvaluationPage;

'use client';
import React, { useState, useRef } from 'react';
import { Dropdown } from 'primereact/dropdown';
import { MultiSelect } from 'primereact/multiselect';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
const EvaluationPage = () => {
    const currentYear = new Date().getFullYear();

    const yearOptions = Array.from({ length: 11 }, (_, i) => ({
        label: `${currentYear + i}`,
        value: `${currentYear + i}`
    }));

    const monthOptions = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'].map((m, index) => ({ label: m, value: index + 1 }));

    const timeframeOptions = ['H1', 'H2'].map((t) => ({ label: t, value: t }));

    const reviewTypes = [
        'Creative',
        'Brand Experience',
        'Content/Energy Studio',
        'Media',
        'Digital',
        'Strategy',
        'Medical Marketing (UK only)',
        'USA Procurement (shopper data)',
        'In-house Digital media',
        'IT&D',
        'Briefing & Strategy (Global)',
        'USA Procurement (local Nielsen)'
    ].map((r) => ({ label: r, value: r }));

    const countries = ['Global', 'UK', 'Germany', 'USA', 'India'].map((c) => ({ label: c, value: c }));

    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedMonths, setSelectedMonths] = useState<string[]>([]);
    const [selectedTimeframes, setSelectedTimeframes] = useState<string[]>([]);
    const [selectedReviewTypes, setSelectedReviewTypes] = useState<string[]>([]);
    const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
    const [combinations, setCombinations] = useState<string[]>([]);
    const toast = useRef<Toast>(null);
    const [showDialog, setShowDialog] = useState(false);
    const [savedData, setSavedData] = useState<string[]>([]);

    const handleSubmit = () => {
        if (!selectedYear || !selectedMonths.length || !selectedTimeframes.length || !selectedReviewTypes.length || !selectedCountries.length) {
            toast.current?.show({
                severity: 'warn',
                summary: 'Hold up!',
                detail: 'Please select all the fields ',
                life: 3000
            });
            return;
        }

        const newCombos: string[] = [];

        selectedMonths.forEach((month) => {
            selectedTimeframes.forEach((timeframe) => {
                selectedReviewTypes.forEach((review) => {
                    selectedCountries.forEach((country) => {
                        newCombos.push(`${selectedYear}-${month}-${timeframe}-${review}-${country}`);
                    });
                });
            });
        });

        setCombinations((prev) => [...prev, ...newCombos]);
    };

    const handleSave = () => {
        localStorage.setItem('evaluationData', JSON.stringify(combinations));
        toast.current?.show({
            severity: 'success',
            summary: 'Success',
            detail: 'Saved successfully ✅',
            life: 3000
        });
    };

    const handleViewSaved = () => {
        const data = JSON.parse(localStorage.getItem('evaluationData') || '[]');
        setSavedData(data);
        setShowDialog(true);
    };

    return (
        <div className="p-4 card">
            <Toast ref={toast} />

            <Dialog header="Saved Evaluations" visible={showDialog} style={{ width: '50vw' }} onHide={() => setShowDialog(false)}>
                {savedData.length > 0 ? (
                    <DataTable value={savedData.map((val, i) => ({ id: i + 1, name: val }))}>
                        <Column field="id" header="#" style={{ width: '50px' }} />
                        <Column field="name" header="Evaluation Name" />
                    </DataTable>
                ) : (
                    <p>No saved evaluations found.</p>
                )}
            </Dialog>

            <div className="flex justify-content-between mb-3">
                <h2 className="text-xl font-semibold">Evaluation Name</h2>
                <Button label="View Saved Evaluations" icon="pi pi-eye" onClick={handleViewSaved} />
            </div>

            <div className="grid formgrid gap-3 mb-4">
                <div className="flex row col-12">
                    <div className="md:col-4">
                        <label>Year</label>
                        <Dropdown value={selectedYear} options={yearOptions} onChange={(e) => setSelectedYear(e.value)} className="w-full mt-2 p-1 text-lg" placeholder="Select Year" />
                    </div>
                    <div className="md:col-4">
                        <label>Months</label>
                        <MultiSelect value={selectedMonths} options={monthOptions} onChange={(e) => setSelectedMonths(e.value)} className="w-full mt-2 h-12" placeholder="Select Months" />
                    </div>
                    <div className="md:col-4">
                        <label>Timeframes</label>
                        <MultiSelect value={selectedTimeframes} options={timeframeOptions} onChange={(e) => setSelectedTimeframes(e.value)} className="w-full mt-2" placeholder="Select Timeframes" />
                    </div>
                </div>

                <div className="flex row col-12">
                    <div className="md:col-4">
                        <label>Review Types</label>
                        <MultiSelect value={selectedReviewTypes} options={reviewTypes} onChange={(e) => setSelectedReviewTypes(e.value)} className="w-full mt-2" placeholder="Select Review Types" />
                    </div>
                    <div className="md:col-4">
                        <label>Countries</label>
                        <MultiSelect value={selectedCountries} options={countries} onChange={(e) => setSelectedCountries(e.value)} className="w-full mt-2" placeholder="Select Countries" />
                    </div>
                </div>

                <div className="col-12 flex justify-content-end">
                    <Button label="Submit" icon="pi pi-check" onClick={handleSubmit} />
                </div>
            </div>

            {combinations.length > 0 && (
                <>
                    <h3 className="text-lg font-medium mt-5 mb-3">Generated Evaluations</h3>
                    <DataTable value={combinations.map((c, i) => ({ id: i + 1, name: c }))} className="mb-4">
                        <Column field="id" header="#" style={{ width: '50px' }} />
                        <Column field="name" header="Evaluation Name" />
                    </DataTable>
                    <div className="flex justify-content-end">
                        <Button label="Save" icon="pi pi-save" onClick={handleSave} className="p-button-success" />
                    </div>
                </>
            )}
        </div>
    );
};

export default EvaluationPage;
