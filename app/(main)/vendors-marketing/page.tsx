'use client';

import { useEffect, useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { v4 as uuidv4 } from 'uuid';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.min.css';
import 'primeicons/primeicons.css';
import 'primeflex/primeflex.css';

interface Vendor {
    id: string;
    name: string;
    email: string;
    phone: string;
    companyName: string;
    address: string;
}

export default function VendorsPage() {
    const [vendors, setVendors] = useState<Vendor[]>([]);
    const [form, setForm] = useState<Omit<Vendor, 'id'>>({
        name: '',
        email: '',
        phone: '',
        companyName: '',
        address: ''
    });
    const [editId, setEditId] = useState<string | null>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const data = localStorage.getItem('vendors');
        if (data) setVendors(JSON.parse(data));
    }, []);

    const handleChange = (key: keyof typeof form, value: string) => {
        setForm({ ...form, [key]: value });
    };

    const saveToStorage = (data: Vendor[]) => {
        localStorage.setItem('vendors', JSON.stringify(data));
    };

    const handleSubmit = () => {
        if (editId) {
            const updated = vendors.map((v) => (v.id === editId ? { ...v, ...form } : v));
            setVendors(updated);
            saveToStorage(updated);
        } else {
            const newVendor: Vendor = { id: uuidv4(), ...form };
            const updated = [...vendors, newVendor];
            setVendors(updated);
            saveToStorage(updated);
        }
        resetForm();
    };

    const resetForm = () => {
        setForm({ name: '', email: '', phone: '', companyName: '', address: '' });
        setEditId(null);
        setVisible(false);
    };

    const handleEdit = (vendor: Vendor) => {
        setForm({
            name: vendor.name,
            email: vendor.email,
            phone: vendor.phone,
            companyName: vendor.companyName,
            address: vendor.address
        });
        setEditId(vendor.id);
        setVisible(true);
    };

    const handleDelete = (id: string) => {
        const updated = vendors.filter((v) => v.id !== id);
        setVendors(updated);
        saveToStorage(updated);
    };

    const actionBodyTemplate = (vendor: Vendor) => (
        <div className="flex gap-2">
            <Button icon="pi pi-pencil" rounded text severity="info" onClick={() => handleEdit(vendor)} />
            <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => handleDelete(vendor.id)} />
        </div>
    );

    return (
        <div className="p-4 card">
            <div className="">
                <h2 className="text-xl font-semibold mb-4">Vendor Onboarding</h2>
            </div>

            <div className="grid formgrid gap-3 mb-4">
                <div className="col-12 flex">
                    <div className="md:col-4">
                        <label htmlFor="name">Vendor Name</label>
                        <InputText id="name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} className="w-full mt-2" />
                    </div>
                    <div className="md:col-4">
                        <label htmlFor="email">Email</label>
                        <InputText id="email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} className="w-full mt-2" />
                    </div>
                    <div className="md:col-4">
                        <label htmlFor="phone">Phone</label>
                        <InputText id="phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} className="w-full mt-2" />
                    </div>
                </div>
                <div className="col-12 flex">
                    <div className="md:col-4">
                        <label htmlFor="companyName">Company Name</label>
                        <InputText id="companyName" value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} className="w-full mt-2" />
                    </div>
                    <div className="md:col-4">
                        <label htmlFor="address">Address</label>
                        <InputText id="address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} className="w-full mt-2" />
                    </div>
                </div>
            </div>

            <div className="flex justify-content-end">
                <Button label="Add Vendor" icon="pi pi-plus" onClick={handleSubmit} />
            </div>

            <h3 className="text-lg font-medium mt-5 mb-3">Vendor List</h3>
            {vendors.length === 0 ? (
                <p>No vendors added yet</p>
            ) : (
                <DataTable value={vendors} stripedRows responsiveLayout="scroll">
                    <Column field="name" header="Name" />
                    <Column field="email" header="Email" />
                    <Column field="phone" header="Phone" />
                    <Column field="companyName" header="Company" />
                    <Column field="address" header="Address" />
                    <Column body={actionBodyTemplate} header="Actions" style={{ width: '120px' }} />
                </DataTable>
            )}

            <Dialog header={editId ? 'Edit Vendor' : 'Add Vendor'} visible={visible} style={{ width: '30vw' }} onHide={resetForm} modal>
                <div className="flex flex-column gap-3">
                    <InputText placeholder="Vendor Name" value={form.name} onChange={(e) => handleChange('name', e.target.value)} />
                    <InputText placeholder="Email" value={form.email} onChange={(e) => handleChange('email', e.target.value)} />
                    <InputText placeholder="Phone" value={form.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                    <InputText placeholder="Company Name" value={form.companyName} onChange={(e) => handleChange('companyName', e.target.value)} />
                    <InputText placeholder="Address" value={form.address} onChange={(e) => handleChange('address', e.target.value)} />
                    <Button label={editId ? 'Update' : 'Save'} onClick={handleSubmit} />
                </div>
            </Dialog>
        </div>
    );
}
