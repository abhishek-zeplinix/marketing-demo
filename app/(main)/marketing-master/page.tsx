'use client';
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

const Tabs = ['Year', 'Evaluation TimeFrame', 'Evaluation Period', 'Review Type', 'Template Type', 'Region', 'Country', 'Brand', 'BU', 'User Group', 'Assessor Group'];

const toDropdownOptions = (arr: any) => (Array.isArray(arr) ? arr.map((item) => ({ label: item, value: item })) : []);

const MarketingMaster = () => {
    const [activeTab, setActiveTab] = useState('Year');
    const [inputValue, setInputValue] = useState('');
    const [selectedReviewType, setSelectedReviewType] = useState('');
    const [selectedTemplateType, setSelectedTemplateType] = useState('');
    const [selectedUserGroups, setSelectedUserGroups] = useState('');
    const [data, setData] = useState<Record<string, any>>({});
    const [editIndex, setEditIndex] = useState<number | null>(null);

    useEffect(() => {
        const storedData: Record<string, any> = {};
        Tabs.forEach((tab) => {
            const values = localStorage.getItem(tab);
            storedData[tab] = values ? JSON.parse(values) : ['Review Type', 'Template Type', 'User Group'].includes(tab) ? {} : [];
        });
        storedData['Assessor Group'] = localStorage.getItem('Assessor Group') ? JSON.parse(localStorage.getItem('Assessor Group')!) : {};
        setData(storedData);
    }, []);

    const saveToLocal = (key: string, value: any) => {
        localStorage.setItem(key, JSON.stringify(value));
        setData((prev) => ({ ...prev, [key]: value }));
    };

    const handleSave = () => {
        if (!inputValue.trim()) return;

        let updated: any;

        if (activeTab === 'Template Type') {
            if (!selectedReviewType) return alert('Select Review Type');
            updated = { ...data['Template Type'] };
            const list = [...(updated[selectedReviewType] || [])];
            if (editIndex !== null) list[editIndex] = inputValue.trim();
            else list.push(inputValue.trim());
            updated[selectedReviewType] = list;
            saveToLocal('Template Type', updated);
        } else if (activeTab === 'User Group') {
            if (!selectedReviewType || !selectedTemplateType) return alert('Select both types');
            updated = { ...data['User Group'] };
            if (!updated[selectedReviewType]) updated[selectedReviewType] = {};
            const list = [...(updated[selectedReviewType][selectedTemplateType] || [])];
            if (editIndex !== null) list[editIndex] = inputValue.trim();
            else list.push(inputValue.trim());
            updated[selectedReviewType][selectedTemplateType] = list;
            saveToLocal('User Group', updated);
        } else if (activeTab === 'Assessor Group') {
            if (!selectedReviewType || !selectedTemplateType || !selectedUserGroups) return alert('Select all types');
            updated = { ...data['Assessor Group'] };
            if (!updated[selectedReviewType]) updated[selectedReviewType] = {};
            if (!updated[selectedReviewType][selectedTemplateType]) updated[selectedReviewType][selectedTemplateType] = {};
            const list = [...(updated[selectedReviewType][selectedTemplateType][selectedUserGroups] || [])];
            if (editIndex !== null) list[editIndex] = inputValue.trim();
            else list.push(inputValue.trim());
            updated[selectedReviewType][selectedTemplateType][selectedUserGroups] = list;
            saveToLocal('Assessor Group', updated);
        } else {
            const list = Array.isArray(data[activeTab]) ? [...data[activeTab]] : [];
            if (editIndex !== null) list[editIndex] = inputValue.trim();
            else list.push(inputValue.trim());
            saveToLocal(activeTab, list);
        }

        setInputValue('');
        setEditIndex(null);
    };

    const handleEdit = (index: number, item: string) => {
        setInputValue(item);
        setEditIndex(index);
    };

    const handleDelete = (index: number) => {
        let updated;
        if (activeTab === 'Template Type') {
            updated = { ...data['Template Type'] };
            updated[selectedReviewType] = updated[selectedReviewType].filter((_: string, i: number) => i !== index);
            saveToLocal('Template Type', updated);
        } else if (activeTab === 'User Group') {
            updated = { ...data['User Group'] };
            updated[selectedReviewType][selectedTemplateType] = updated[selectedReviewType][selectedTemplateType].filter((_: string, i: number) => i !== index);
            saveToLocal('User Group', updated);
        } else if (activeTab === 'Assessor Group') {
            updated = { ...data['Assessor Group'] };
            updated[selectedReviewType][selectedTemplateType][selectedUserGroups] = updated[selectedReviewType][selectedTemplateType][selectedUserGroups].filter((_: string, i: number) => i !== index);
            saveToLocal('Assessor Group', updated);
        } else {
            const list = [...(data[activeTab] || [])];
            list.splice(index, 1);
            saveToLocal(activeTab, list);
        }

        setInputValue('');
        setEditIndex(null);
    };

    const renderNestedForm = () => (
        <>
            <Dropdown
                value={selectedReviewType}
                options={toDropdownOptions(data['Review Type'])}
                onChange={(e) => {
                    setSelectedReviewType(e.value);
                    setSelectedTemplateType('');
                    setSelectedUserGroups('');
                }}
                placeholder="Select Review Type"
                className="w-1/4 border-round-lg"
            />
            {activeTab !== 'Template Type' && ['Template Type', 'User Group', 'Assessor Group'].includes(activeTab) && (
                <Dropdown
                    value={selectedTemplateType}
                    options={toDropdownOptions(data['Template Type']?.[selectedReviewType] || [])}
                    onChange={(e) => {
                        setSelectedTemplateType(e.value);
                        setSelectedUserGroups('');
                    }}
                    placeholder="Select Template Type"
                    className="w-1/4 ml-2 border-round-lg"
                />
            )}

            {activeTab === 'Assessor Group' && (
                <Dropdown
                    value={selectedUserGroups}
                    options={toDropdownOptions(data['User Group']?.[selectedReviewType]?.[selectedTemplateType] || [])}
                    onChange={(e) => setSelectedUserGroups(e.value)}
                    placeholder="Select User Group"
                    className="w-1/4 ml-2 border-round-lg"
                />
            )}
            <InputText type="text" className="p-2 border rounded w-1/4 ml-2 border-round-lg" placeholder={`Enter ${activeTab}`} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
        </>
    );

    const renderTable = () => {
        const getItems = () => {
            try {
                if (activeTab === 'Assessor Group') {
                    return data['Assessor Group']?.[selectedReviewType]?.[selectedTemplateType]?.[selectedUserGroups] || [];
                }
                if (activeTab === 'User Group') {
                    return data['User Group']?.[selectedReviewType]?.[selectedTemplateType] || [];
                }
                if (activeTab === 'Template Type') {
                    return data['Template Type']?.[selectedReviewType] || [];
                }
                return Array.isArray(data[activeTab]) ? data[activeTab] : [];
            } catch {
                return [];
            }
        };

        const items = getItems();
        if (!items?.length) return null;

        return (
            <table className="w-full border-collapse border border-gray-300 mt-4 border-round-lg">
                <thead>
                    <tr className="bg-gray-100">
                        <th className="border p-2 text-left border-round-lg">S.No</th>
                        <th className="border p-2 text-left border-round-lg">{activeTab}</th>
                        <th className="border p-2 text-left border-round-lg">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((item: string, index: number) => (
                        <tr key={index}>
                            <td className="border p-2 border-round-lg">{index + 1}</td>
                            <td className="border p-2 border-round-lg">{item}</td>
                            <td className="border p-2 space-x-2 border-round-lg">
                                <Button icon="pi pi-pencil" className="p-button-text p-button-sm" onClick={() => handleEdit(index, item)} />
                                <Button icon="pi pi-trash" className="p-button-text p-button-sm p-button-danger" onClick={() => handleDelete(index)} />
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="grid">
            <div className="col-12">
                <h3>Marketing Master</h3>

                <div className="card mb-4">
                    <div className="flex flex-wrap gap-3">
                        {Tabs.map((tab) => (
                            <div
                                key={tab}
                                className={`px-4 py-2 font-bold cursor-pointer border border-1 border-round-lg ${activeTab === tab ? 'text-pink-500 border-pink-500' : 'text-gray-500'}`}
                                onClick={() => {
                                    setActiveTab(tab);
                                    setInputValue('');
                                    setEditIndex(null);
                                    setSelectedReviewType('');
                                    setSelectedTemplateType('');
                                    setSelectedUserGroups('');
                                }}
                            >
                                {tab}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="card px-5 py-4 border-round-lg">
                    <h4 className="mb-2">Add {activeTab}</h4>
                    <div className="flex items-center gap-2 mb-4">
                        {['Template Type', 'User Group', 'Assessor Group'].includes(activeTab) ? (
                            renderNestedForm()
                        ) : (
                            <InputText type="text" className="p-2 border rounded w-1/2 border-round-lg" placeholder={`Enter ${activeTab}`} value={inputValue} onChange={(e) => setInputValue(e.target.value)} />
                        )}
                        <Button label={editIndex !== null ? 'Update' : 'Save'} icon="pi pi-save" onClick={handleSave} />
                    </div>
                    {renderTable()}
                </div>
            </div>
        </div>
    );
};

export default MarketingMaster;
