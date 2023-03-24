import { Button } from '@/components/buttons/button';
import { RawAttachment, UploaderMulti } from '@/components/file-upload/file-uploader';
import { Input } from '@/components/form/input';
import { CONSTANTS } from '@/components/form/libs/constants';
import { Close } from '@/components/icons/icons';
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

    const uploadSuccessful = (newAttachment: RawAttachment) => {
        setAttachments(prev => ([...prev, newAttachment]));
    };

    const submitConversion = async () => {
        try {
            const body: string = JSON.stringify({
                files: attachments,
                quality: inputs.quality.value?.value,
                types: inputs.types.value.map(type => type?.value),
                saveLocation: inputs.saveLocation.value,
            });

            const response = await fetch('/api/convert', {
                body,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const responseData = await response.json();

            console.log(responseData);
        } catch (e) {
            console.log(e);
        }
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

            </div>
        </div>
        <div className={'col-100 position-center mt-30  mb-10'}>
            <Button
                className={'h-px-35 w-px-180'}
                buttonStyle={'success'}
                onClick={() => submitConversion()}
            >
                <div>
                    <span className={'fs-15 color--light'}>Convert</span>
                </div>
            </Button>
        </div>
        <div className={'col-100 my-30 hr--light'}/>
        <div className={'col-100 row justify-content-start'}>
            {attachments?.map((attachment, index) => <div key={attachment.name} className={'flex-column position-center col-20'}>
                    <span className={'fs-12 w-px-100'}>{attachment.name}</span>
                    <div className={'image-display mt-5 position-relative'}>
                        <Close
                            onClick={() => setAttachments(prev => prev.filter(attach => attach.name !== attachment.name))}
                            width={20}
                            className={'color--light hover-opacity position-center w-px-25 h-px-25 br-4 move-right bg-dark-transparent'}
                        />
                        <img src={`data:image/${attachment.type};base64,${attachment.base64}`}/>
                    </div>
                </div>
            )}
        </div>
    </div>;
};
