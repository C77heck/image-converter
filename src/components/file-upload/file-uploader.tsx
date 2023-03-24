import { Loader } from '@/components/loader/loader';
import { Base64 } from '@/pages/api/convert';
import * as React from 'react';
import { Component } from 'react';

export interface RawAttachment {
    base64: Base64;
    name: string;
    type: string;
    originalWidth: number;
    originalHeight: number;
};

export interface UploaderMultiProps {
    onError: (error: any) => void;
    onUploadSuccess: (attachment: RawAttachment) => void;
}

export class UploaderMulti extends Component<UploaderMultiProps, {}> {
    public imageInputRef$: any;
    public state: any = {
        loading: false,
        error: null
    };

    public componentDidUpdate(prevProps: Readonly<any>, prevState: Readonly<any>, snapshot?: any) {
        if (prevState.error !== this.state.error) {
            this.props.onError(this.state.error);
        }
    }

    public render(): React.ReactNode {
        return <div className={'ProfileImageUploader'}>
            <label htmlFor={'profileImageUpload'}>
                <div className={'image-upload hover-opacity position-center'}>
                    <Loader loading={this.state.loading} children={<span>Upload</span>}/>
                </div>
            </label>
            <input
                onChange={(e) => this.addFiles(e)}
                ref={(ref) => this.imageInputRef$ = ref}
                accept="image/*"
                className={'display-none'}
                type={'file'}
                id={'profileImageUpload'}
                multiple={true}
            />
        </div>;
    }

    public async addFiles(e: any) {
        const files = e.target.files || [];

        for (const file of files) {
            await this.addFile(file);
        }
    }

    public async addFile(file: any) {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);

        reader.onload = async () => {
            try {
                this.setState({ loading: true });
                const image = new Image();
                const base64 = Buffer.from((reader.result as Buffer)).toString('base64');
                const type = file?.type || 'image/png';
                const name = file?.name || '';
                image.src = `data:image/${type};base64,${base64}`;

                image.onload = () => {
                    this.props.onUploadSuccess({
                        base64, name, type,
                        originalWidth: image.naturalWidth,
                        originalHeight: image.naturalHeight
                    });
                };

                this.setState({ error: null, });
            } catch (err) {
                this.setState({ error: err });
            } finally {
                this.setState({ loading: false });
            }
        };
    }
}
