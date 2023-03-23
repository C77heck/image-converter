import { UploaderMulti } from '@/components/file-upload/file-uploader';
import { Input } from '@/components/form/input';
import { OptionProps } from '@/components/form/libs/abstract.dropdown';
import { useForm } from '@/libs/hooks/form.hook';

export const MultiFileUploader = () => {
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
        }
    });
    const uploadSuccessful = (attachments: any[]) => {
        console.log({ attachments });
    };

    return <div className={'uploader-wrapper row'}>
        <div className={'row col-50'}>
            <div className={'quality'}>
                <Input
                    onChange={inputHandler}
                    value={inputs.quality.value}
                    name={'quality'}
                    label={'Converter quality'}
                    validators={[]}
                    className={'col-100 mt-11'}
                    labelClass={'fs-15 fw--700 mb-2'}
                />
            </div>
            <div className={'types'}>
                <Input
                    onChange={inputHandler}
                    value={inputs.types.value}
                    name={'types'}
                    label={'Types to convert to'}
                    validators={[]}
                    className={'col-100 mt-11'}
                    labelClass={'fs-15 fw--700 mb-2'}
                />
            </div>
            <div className={'path to save as well as uploading files. see option.'}>

            </div>
        </div>
        <div className={'row col-50'}>
            <UploaderMulti
                onUploadSuccess={uploadSuccessful}
                trigger={<div className={'image-upload hover-opacity position-center'}>
                    <span>Upload</span>
                </div>}
            />
        </div>
    </div>;
};
