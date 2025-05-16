'use client';
import { useRouter, useSearchParams } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { Dropdown } from 'primereact/dropdown';
import { useAppContext } from '@/layout/AppWrapper';
import { InputText } from 'primereact/inputtext';
import { get } from 'lodash';

const defaultForm = {
    templateType: null,
    assessorGroup: null,
    reviewType: null,
    questionDescription: '',
    questionTitle: '',
    minRating: '',
    maxRating: '',
    isCompulsary: '',
    ratingComment: '',
    ratio: '',
    segment: ''
};

const TemplateQuestionPage = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const marketingTemplateQuestionId = searchParams.get('marketingTemplateQuestionId');
    const isEditMode = searchParams.get('edit') === 'true';
    const { setAlert, setLoading } = useAppContext();
    const [form, setForm] = useState(defaultForm);

    // Sample data instead of API calls
    const [reviewTypes, setReviewTypes] = useState([
        { reviewTypeName: 'Performance Review', reviewTypeId: 1 },
        { reviewTypeName: 'Quality Review', reviewTypeId: 2 },
        { reviewTypeName: 'Process Review', reviewTypeId: 3 }
    ]);

    const [assessorGroups, setAssessorGroups] = useState([
        { assessorGroupName: 'Management', assessorGroupId: 1 },
        { assessorGroupName: 'Team Leaders', assessorGroupId: 2 },
        { assessorGroupName: 'Peers', assessorGroupId: 3 }
    ]);

    const [templateTypes, setTemplateTypes] = useState([
        { templateTypeName: 'Annual Review', templateTypeId: 1 },
        { templateTypeName: 'Quarterly Review', templateTypeId: 2 },
        { templateTypeName: 'Project Review', templateTypeId: 3 }
    ]);

    const [compulsoryOptions] = useState([{ isCompulsary: 'yes' }, { isCompulsary: 'no' }]);

    useEffect(() => {
        setLoading(false);

        // Load saved template questions from localStorage
        const savedTemplateQuestions = JSON.parse(localStorage.getItem('marketingTemplateQuestions') || '[]');

        // If in edit mode, find the specific question to edit
        if (isEditMode && marketingTemplateQuestionId) {
            const questionToEdit = savedTemplateQuestions.find((question) => question.id === marketingTemplateQuestionId);

            if (questionToEdit) {
                setForm(questionToEdit);
            }
        }
    }, []);

    const handleSubmit = () => {
        setLoading(true);
        try {
            // Get existing questions from localStorage
            const existingQuestions = JSON.parse(localStorage.getItem('marketingTemplateQuestions') || '[]');

            if (isEditMode) {
                // Update existing question
                const updatedQuestions = existingQuestions.map((question) => (question.id === marketingTemplateQuestionId ? { ...form, id: marketingTemplateQuestionId } : question));
                localStorage.setItem('marketingTemplateQuestions', JSON.stringify(updatedQuestions));
            } else {
                // Add new question with a unique ID
                const newId = Date.now().toString();
                const newQuestion = { ...form, id: newId };
                localStorage.setItem('marketingTemplateQuestions', JSON.stringify([...existingQuestions, newQuestion]));
            }

            setAlert('success', `Marketing Templates ${isEditMode ? 'Updated' : 'Added'} Successfully`);
            router.push('/marketing-questions');
        } catch (error) {
            setAlert('error', 'Something went wrong!');
            console.error('Error saving data:', error);
        } finally {
            setLoading(false);
        }
    };

    const onInputChange = (name, val) => {
        setForm((prevForm) => ({
            ...prevForm,
            [name]: val
        }));
    };

    // Adjust title based on edit mode
    const pageTitle = isEditMode ? 'Edit Create Question' : 'Add Create Question';

    const renderStepContent = () => {
        return (
            <div>
                <div className="flex flex-column gap-2 pt-2">
                    <h2 className="text-center font-bold ">{pageTitle}</h2>
                    <div className="p-fluid grid mx-1 pt-2">
                        <div className="field col-3">
                            <label htmlFor="templateType" className="font-semibold">
                                Template Type
                            </label>
                            <Dropdown
                                id="templateType"
                                value={form.templateType}
                                options={templateTypes}
                                optionLabel="templateTypeName"
                                onChange={(e) => {
                                    // Store the whole object instead of just the ID
                                    onInputChange('templateType', e.value);
                                }}
                                placeholder="Select Template Type"
                                className="w-full mb-1"
                            />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="assessorGroup" className="font-semibold">
                                User Groups
                            </label>
                            <Dropdown
                                id="assessorGroup"
                                value={form.assessorGroup}
                                options={assessorGroups}
                                optionLabel="assessorGroupName"
                                onChange={(e) => {
                                    // Store the whole object instead of just the ID
                                    onInputChange('assessorGroup', e.value);
                                }}
                                placeholder="Select Assessor Groups"
                                className="w-full mb-1"
                            />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="reviewType" className="font-semibold">
                                Review Type
                            </label>
                            <Dropdown
                                id="reviewType"
                                value={form.reviewType}
                                options={reviewTypes}
                                optionLabel="reviewTypeName"
                                onChange={(e) => {
                                    // Store the whole object instead of just the ID
                                    onInputChange('reviewType', e.value);
                                }}
                                placeholder="Select Review Type"
                                className="w-full mb-1"
                            />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="questionTitle" className="font-semibold">
                                Question Title
                            </label>
                            <InputText id="questionTitle" type="text" value={form.questionTitle} onChange={(e) => onInputChange('questionTitle', e.target.value)} className="p-inputtext w-full mb-1" placeholder="Enter Question Title" required />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="questionDescription" className="font-semibold">
                                Question Description
                            </label>
                            <InputText
                                id="questionDescription"
                                type="text"
                                value={form.questionDescription}
                                onChange={(e) => onInputChange('questionDescription', e.target.value)}
                                className="p-inputtext w-full mb-1"
                                placeholder="Enter Question Description"
                            />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="minRating" className="font-semibold">
                                Min. Rating
                            </label>
                            <InputText id="minRating" value={form.minRating} type="text" onChange={(e) => onInputChange('minRating', e.target.value)} placeholder="Enter Min. Rating" className="p-inputtext w-full mb-1" />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="maxRating" className="font-semibold">
                                Max. Rating
                            </label>
                            <InputText id="maxRating" value={form.maxRating} type="text" onChange={(e) => onInputChange('maxRating', e.target.value)} placeholder="Enter Max. Rating" className="p-inputtext w-full mb-1" />
                        </div>

                        <div className="field col-3">
                            <label htmlFor="isCompulsary" className="font-semibold">
                                Compulsory
                            </label>
                            <Dropdown
                                id="isCompulsary"
                                value={form.isCompulsary}
                                options={compulsoryOptions}
                                optionLabel="isCompulsary"
                                onChange={(e) => onInputChange('isCompulsary', e.value)}
                                placeholder="Select Compulsory"
                                className="w-full mb-1"
                            />
                        </div>

                        <div className="field col-3">
                            <label htmlFor="ratingComment" className="font-semibold">
                                Comment if rating {'(>=)'}
                            </label>
                            <InputText
                                id="ratingComment"
                                type="text"
                                value={form.ratingComment}
                                onChange={(e) => onInputChange('ratingComment', e.target.value)}
                                className="p-inputtext w-full mb-1"
                                placeholder="Enter Comment if rating (Less than or Equal to)"
                            />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="segment" className="font-semibold">
                                Segment
                            </label>
                            <InputText id="segment" type="text" value={form.segment} onChange={(e) => onInputChange('segment', e.target.value)} className="p-inputtext w-full mb-1" placeholder="Enter Segment" />
                        </div>
                        <div className="field col-3">
                            <label htmlFor="ratio" className="font-semibold">
                                Ratio (%)
                            </label>
                            <InputText id="ratio" type="text" value={form.ratio} onChange={(e) => onInputChange('ratio', e.target.value)} className="p-inputtext w-full mb-1" placeholder="Enter Ratio (%)" />
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="">
            <div className="p-card">
                <div className="p-card-body">{renderStepContent()}</div>
                <hr />
                <div className="p-card-footer flex justify-content-end px-4 gap-3 py-0 bg-slate-300 shadow-slate-400">
                    <Button label={isEditMode ? 'Update' : 'Submit'} icon="pi pi-check" className="bg-primary-main border-primary-main hover:text-white mb-3" onClick={handleSubmit} />
                </div>
            </div>
        </div>
    );
};

export default TemplateQuestionPage;
