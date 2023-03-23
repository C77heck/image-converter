import { UploaderMulti } from '@/components/file-upload/file-uploader';
import { Input } from '@/components/form/input';
import { CONSTANTS } from '@/components/form/libs/constants';
import { useForm } from '@/libs/hooks/form.hook';
import { useState } from 'react';

export const MultiFileUploader = () => {
    const [attachments, setAttachments] = useState([]);
    const { inputHandler, inputState: { inputs }, isFormValid } = useForm({
        inputs: {
            quality: {
                value: '',
                valid: false
            },
            types: {
                value: '',
                valid: false
            },
            saveLocation: {
                value: CONSTANTS.SAVE_LOCATION,
                valid: false
            },
        }
    });
    const uploadSuccessful = (attachments: any[]) => {
        setAttachments(attachments);
    };

    return <div className={'uploader-wrapper row'}>
        <div className={'row col-50'}>
            <Input
                onChange={inputHandler}
                value={inputs.quality.value}
                name={'quality'}
                label={'Quality'}
                options={CONSTANTS.OPTIONS.QUALITY}
                validators={[]}
                className={'col-100 mt-11'}
                labelClass={'fs-15 fw--700 mb-2'}
                element={CONSTANTS.INPUTS.SEARCHABLE_DROPDOWN}
            />
            <Input
                onChange={inputHandler}
                value={inputs.types.value}
                name={'types'}
                label={'Types to use'}
                options={CONSTANTS.OPTIONS.TYPES}
                validators={[]}
                className={'col-100 mt-11'}
                labelClass={'fs-15 fw--700 mb-2'}
                element={CONSTANTS.INPUTS.MULTI_SEARCHABLE_DROPDOWN}
            />
            <Input
                name={'saveLocation'}
                label={'Save location'}
                className={'col-100 mt-11'}
                labelClass={'fs-15 fw--700 mb-2'}
                onChange={inputHandler}
                value={inputs.saveLocation.value}
                validators={[]}
            />
        </div>
        <div className={'row col-50'}>
            <div className={'col-100 position-center'}>
                <UploaderMulti onUploadSuccess={uploadSuccessful}/>
            </div>
            <div className={'col-100 position-center'}>
                {attachments?.map((attachment, index) => <div key={index} className={'image-display'}>
                    <span>{attachment.name}</span>
                    <img src={`data:image/${attachment.type};base64,${attachment.base64}`}/>
                </div>)}
            </div>
        </div>
    </div>;
};
