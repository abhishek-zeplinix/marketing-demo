// export default TemplateQuestionPage;
'use client';
import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import Router from 'next/router';
import { useRouter } from 'next/navigation';

const STORAGE_KEYS = {
    MARKETING_TEMPLATE_QUESTIONS: 'marketingTemplateQuestions'
};

const MarketingQuestionsTable = () => {
    const [questions, setQuestions] = useState<any[]>([]);
    const router = useRouter();
    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEYS.MARKETING_TEMPLATE_QUESTIONS);
        if (saved) {
            setQuestions(JSON.parse(saved));
        }
    }, []);
    const handleCreateNavigation = () => {
        router.push(`/marketing-questions/add-questions`);
    };
    return (
        <div className="card">
            <div className="flex justify-content-between">
                <h3>Marketing Template Questions</h3>
                <Button label="Add Questions" className="bg-primary-main border-primary-main hover:text-white mb-3" onClick={handleCreateNavigation} />
            </div>
            <DataTable value={questions} paginator rows={10} emptyMessage="No questions found">
                <Column field="questionTitle" header="Question Title" />
                <Column field="questionDescription" header="Description" />
                <Column field="templateType.templateTypeName" header="Template Type ID" />
                <Column field="assessorGroup.assessorGroupName" header="Assessor Group ID" />
                <Column field="reviewType.reviewTypeName" header="Review Type ID" />
                <Column field="minRating" header="Min Rating" />
                <Column field="maxRating" header="Max Rating" />
                <Column field="isCompulsary.isCompulsary" header="Is Compulsory" />
                <Column field="ratingComment" header="Rating Comment" />
                <Column field="ratio" header="Ratio" />
                <Column field="segment" header="Segment" />
            </DataTable>
        </div>
    );
};

export default MarketingQuestionsTable;
